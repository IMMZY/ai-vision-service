import os
import base64
import logging
from typing import Dict, Any, Union

from fastapi import FastAPI, Depends, UploadFile, File, HTTPException  # type: ignore
from fastapi.responses import JSONResponse, Response  # type: ignore
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials  # type: ignore
from openai import OpenAI  # type: ignore

app = FastAPI()
logging.basicConfig(level=logging.INFO)

clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

USAGE: Dict[str, int] = {}
TIER_OVERRIDES: Dict[str, str] = {}  # Stores user tier overrides (for demo switching)

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
MAX_BYTES = 5 * 1024 * 1024  # 5MB

PROMPT = "Describe this image in detail, including objects, colors, mood, and any notable features."

def json_error(status_code: int, message: str):
    return JSONResponse(status_code=status_code, content={"message": message})

def get_tier(user_id: str, decoded: Dict[str, Any]) -> str:
    # Check for tier override first (allows demo switching)
    if user_id in TIER_OVERRIDES:
        return TIER_OVERRIDES[user_id]

    public_metadata = decoded.get("public_metadata", {}) or {}
    tier = (public_metadata.get("subscription_tier") or "").lower()
    if "premium" in tier:
        return "premium"

    subscription = decoded.get("subscription", {}) or {}
    plan = (subscription.get("plan") or "").lower()
    if "premium" in plan:
        return "premium"

    return "free"

def usage_payload(user_id: str, tier: str) -> Dict[str, Union[str, int]]:
    used = USAGE.get(user_id, 0)
    limit: Union[int, str] = "unlimited" if tier == "premium" else 1
    return {"user_id": user_id, "tier": tier, "analyses_used": used, "limit": limit}


# ✅ FIX: prevent 405 from OPTIONS (some setups hit OPTIONS and fail without this)
@app.options("/{path:path}")
def options_handler(path: str):
    return Response(status_code=204)


def _check_usage(creds: HTTPAuthorizationCredentials):
    decoded = creds.decoded
    user_id = decoded["sub"]
    tier = get_tier(user_id, decoded)
    return usage_payload(user_id, tier)

# ✅ FIX: support BOTH path styles
@app.get("/usage")
def usage_root(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    return _check_usage(creds)

@app.get("/api/usage")
def usage_api(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    return _check_usage(creds)


def _set_tier(creds: HTTPAuthorizationCredentials, new_tier: str):
    decoded = creds.decoded
    user_id = decoded["sub"]
    TIER_OVERRIDES[user_id] = new_tier
    return usage_payload(user_id, new_tier)

@app.post("/upgrade")
def upgrade_root(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    return _set_tier(creds, "premium")

@app.post("/api/upgrade")
def upgrade_api(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    return _set_tier(creds, "premium")

@app.post("/downgrade")
def downgrade_root(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    return _set_tier(creds, "free")

@app.post("/api/downgrade")
def downgrade_api(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    return _set_tier(creds, "free")


async def _analyze(file: UploadFile, creds: HTTPAuthorizationCredentials):
    decoded = creds.decoded
    user_id = decoded["sub"]
    tier = get_tier(user_id, decoded)

    used = USAGE.get(user_id, 0)
    if tier != "premium" and used >= 1:
        raise HTTPException(
            status_code=429,
            detail="Free tier limit reached. Upgrade to Premium for unlimited analyses.",
        )

    filename = (file.filename or "").lower()
    ext = os.path.splitext(filename)[1]
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: .jpg, .jpeg, .png, .webp")

    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_MIME:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: jpg, jpeg, png, webp")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Max size is 5MB")

    b64 = base64.b64encode(data).decode("utf-8")
    data_url = f"data:{content_type};base64,{b64}"

    try:
        client = OpenAI()
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": PROMPT},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                }
            ],
        )

        description = (resp.choices[0].message.content or "").strip()
        USAGE[user_id] = used + 1

        payload = usage_payload(user_id, tier)
        payload["description"] = description
        return payload

    except Exception as e:
        logging.exception("OpenAI API error: %s", e)
        raise HTTPException(status_code=500, detail="AI analysis failed. Please try again.")

# ✅ FIX: support BOTH path styles
@app.post("/analyze")
async def analyze_root(
    file: UploadFile = File(...),
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard),
):
    return await _analyze(file, creds)

@app.post("/api/analyze")
async def analyze_api(
    file: UploadFile = File(...),
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard),
):
    return await _analyze(file, creds)


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "Request failed."
    return json_error(exc.status_code, message)

@app.exception_handler(Exception)
async def unhandled_exception_handler(_, exc: Exception):
    logging.exception("Unhandled server error: %s", exc)
    return json_error(500, "Server error. Please try again.")
