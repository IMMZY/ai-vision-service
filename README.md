# AI Vision Service - Image Analysis with AI

A production-ready AI-powered SaaS application that analyzes images using OpenAI's GPT-4 Vision API. Built with Next.js, FastAPI, and Clerk authentication, deployed on Vercel.
[![Live](https://img.shields.io/badge/status-live-success?style=flat-square)](https://saas-01-five.vercel.app)

---

## 🎯 Overview

AI Vision Service allows users to upload images and receive detailed AI-generated descriptions. The application features tiered access control with free users getting 1 analysis per session and premium users enjoying unlimited analyses.

### Key Features

**AI-Powered Analysis** - OpenAI Vision API (gpt-4o-mini) for detailed image descriptions  
**User Authentication** - Clerk integration with Email, Google, and GitHub sign-in  
**Tiered Access Control** - Free (1 analysis) vs Premium (unlimited)  
**File Validation** - Supports JPG, PNG, WEBP up to 5MB  
**Real-time Usage Tracking** - Shows remaining analyses  
**Responsive Design** - Works on desktop, tablet, and mobile  
**Error Handling** - Comprehensive validation and user-friendly error messages  
**Production Deployment** - Serverless architecture on Vercel  

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Clerk for authentication
- React Markdown for formatted results

**Backend:**
- FastAPI (Python web framework)
- OpenAI Vision API
- Clerk JWT authentication
- Vercel serverless functions

**Deployment:**
- Vercel (frontend + backend)
- Environment variables for secrets

### Project Structure

```
ai-vision-service/
├── api/
│   └── index.py              # FastAPI backend with 3 endpoints
├── pages/
│   ├── _app.tsx              # Next.js app wrapper with Clerk
│   ├── index.tsx             # Landing page
│   ├── analyze.tsx           # Main analysis page
│   └── sign-in.tsx           # Sign-in page
├── public/                   # Static assets
├── styles/
│   └── globals.css           # Global styles with Tailwind
├── .env.local                # Local environment variables (not committed)
├── .gitignore                # Git ignore rules
├── package.json              # Node.js dependencies
├── requirements.txt          # Python dependencies
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
└── vercel.json               # Vercel deployment configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Git
- Vercel account
- Clerk account
- OpenAI API key

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-vision-service.git
cd ai-vision-service
```

2. **Install Node.js dependencies**

```bash
npm install
```

3. **Install Python dependencies (optional for local testing)**

```bash
pip install -r requirements.txt
```

4. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_JWKS_URL=https://your-domain.clerk.accounts.dev/.well-known/jwks.json

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your_key_here
```

5. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

**Note:** The FastAPI backend won't run locally with `next dev`. You need to deploy to Vercel to test the full functionality.

---

## 🔑 API Keys Setup

### Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application: "AI Vision Service"
3. Enable authentication providers:
   - Email
   - Google
   - GitHub (optional)
4. Get your keys from the dashboard:
   - **Publishable Key**: `pk_test_...` (safe for client-side)
   - **Secret Key**: `sk_test_...` (server-side only)
   - **JWKS URL**: Found in Configure → JWT Templates

### OpenAI API

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (starts with `sk-proj-...`)
6. **Important:** Add billing information and credits ($5 minimum recommended)

---

## 📦 Deployment to Vercel

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Add Environment Variables

```bash
# Add Clerk publishable key
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Paste: pk_test_...
# Select: production, preview, development

# Add Clerk secret key
vercel env add CLERK_SECRET_KEY
# Paste: sk_test_...
# Select: production, preview, development

# Add Clerk JWKS URL
vercel env add CLERK_JWKS_URL
# Paste: https://your-domain.clerk.accounts.dev/.well-known/jwks.json
# Select: production, preview, development

# Add OpenAI API key
vercel env add OPENAI_API_KEY
# Paste: sk-proj-...
# Select: production, preview, development
```

### Step 4: Deploy

**Deploy to preview (for testing):**

```bash
vercel
```

**Deploy to production:**

```bash
vercel --prod
```

### Step 5: Test Your Deployment

Visit the URL provided by Vercel and test:
1. Sign in with your account
2. Navigate to the analyze page
3. Upload an image
4. Click "Analyze"
5. View the AI-generated description

---

## 🔌 API Endpoints

### 1. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if the API is running

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Vision Service"
}
```

**Example:**
```bash
curl https://your-app.vercel.app/api/health
```

---

### 2. Check Usage

**Endpoint:** `GET /api/usage`

**Description:** Get user's current usage statistics and tier

**Authentication:** Required (JWT token)

**Response:**
```json
{
  "user_id": "user_2abc123...",
  "tier": "free",
  "analyses_used": 1,
  "limit": 1
}
```

**Example:**
```bash
curl https://your-app.vercel.app/api/usage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Analyze Image

**Endpoint:** `POST /api/analyze`

**Description:** Upload an image and receive AI-generated description

**Authentication:** Required (JWT token)

**Request:** Multipart form data with `file` field

**Response:**
```json
{
  "user_id": "user_2abc123...",
  "tier": "free",
  "analyses_used": 1,
  "limit": 1,
  "description": "This image shows a beautiful sunset over the ocean..."
}
```

**Example:**
```bash
curl -X POST https://your-app.vercel.app/api/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@path/to/image.jpg"
```

**Error Responses:**

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid file type (must be .jpg, .jpeg, .png, or .webp) |
| 413 | File too large (max 5MB) |
| 429 | Usage limit exceeded (free tier) |
| 500 | Server error or AI analysis failed |

---

## 💡 How It Works

### User Journey

1. **Sign In**
   - User clicks "Sign In" on landing page
   - Clerk modal opens with authentication options
   - User signs in with Email, Google, or GitHub
   - JWT token is issued and stored in browser

2. **Navigate to Analyzer**
   - User clicks "Go to Analyzer"
   - Frontend checks authentication status
   - If authenticated, shows analysis page
   - If not, redirects to sign-in

3. **Upload Image**
   - User clicks upload area or selects file
   - Image is validated (type and size)
   - Preview is shown
   - File stored in component state

4. **Analyze Image**
   - User clicks "Analyze" button
   - Frontend shows loading state
   - JWT token retrieved from Clerk
   - Image sent to `/api/analyze` with token

5. **Backend Processing**
   - Verify JWT token with Clerk
   - Extract user ID and tier
   - Check usage limits
   - Validate file (type, size)
   - Convert image to base64
   - Send to OpenAI Vision API
   - Receive AI description
   - Update usage tracker
   - Return results

6. **Display Results**
   - Frontend receives description
   - Shows AI-generated text
   - Updates usage counter
   - User can analyze another image (if within limits)

---

## 🔐 Security Features

**Environment Variables** - All API keys stored securely, never in code  
**JWT Authentication** - Token-based auth with Clerk  
**Input Validation** - File type, size, and format checks  
**CORS Configuration** - Controlled cross-origin requests  
**Error Handling** - No sensitive data leaked in error messages  
**Rate Limiting** - Usage limits enforced per user  

---

## 📊 Access Control

### Free Tier
- **Cost:** $0/month
- **Analyses:** 1 per session
- **Features:** Basic AI analysis
- **Limitations:** Resets when Vercel function restarts

### Premium Tier
- **Cost:** $5/month (example pricing)
- **Analyses:** Unlimited
- **Features:** Advanced descriptions, priority processing
- **Detection:** Via Clerk user metadata

**Note:** Premium tier detection is configured in Clerk dashboard under user metadata.

---

## ⚠️ Known Limitations

1. **In-Memory Usage Tracking**
   - Usage counts reset when Vercel serverless function restarts
   - Occurs after a few minutes of inactivity
   - Production apps would use a database (Redis, PostgreSQL)

2. **Session-Based Limits**
   - Free tier limit resets on deployment or function restart
   - Not persistent across sessions

3. **File Size Limit**
   - Maximum 5MB per image
   - Enforced by backend validation

4. **Supported Formats**
   - Only JPG, JPEG, PNG, and WEBP
   - Other formats rejected with 400 error

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
-  Sign in with Email
-  Sign in with Google
-  Sign in with GitHub
-  Sign out
-  Redirect to sign-in when not authenticated

**File Upload:**
-  Upload valid JPG image
-  Upload valid PNG image
-  Upload valid WEBP image
-  Try uploading PDF (should fail)
-  Try uploading >5MB file (should fail)

**Analysis:**
-  Analyze first image (free tier)
-  Try analyzing second image (should show limit reached)
-  Check usage counter updates
-  Verify AI description is relevant

**Error Handling:**
-  Test with no file selected
-  Test with invalid file type
-  Test with oversized file
-  Test network errors

### Testing with curl

**Health check:**
```bash
curl https://your-app.vercel.app/api/health
```

**Analyze image:**
```bash
# Get JWT token from browser DevTools (Application → Cookies)
curl -X POST https://your-app.vercel.app/api/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg"
```

---

## 🐛 Troubleshooting

### "404 Not Found" on API endpoints

**Cause:** Vercel routing configuration issue

**Solution:**
1. Check `vercel.json` has correct routes
2. Verify `api/index.py` exists
3. Ensure `handler = app` is at end of `api/index.py`
4. Redeploy: `vercel --prod`

---

### "401 Unauthorized" errors

**Cause:** JWT token not valid or missing

**Solution:**
1. Verify Clerk environment variables are set in Vercel
2. Check JWKS URL is correct
3. Ensure user is signed in
4. Check browser console for auth errors

---

### "405 Method Not Allowed"

**Cause:** Endpoint exists but wrong HTTP method

**Solution:**
1. Ensure using POST for `/api/analyze`
2. Ensure using GET for `/api/usage`
3. Check CORS is enabled in backend

---

### "OpenAI API Error"

**Cause:** Invalid API key or no credits

**Solution:**
1. Verify OPENAI_API_KEY is correct in Vercel
2. Check OpenAI account has credits
3. Ensure key starts with `sk-proj-`
4. Check OpenAI dashboard for usage

---

### "File too large" errors

**Cause:** Image exceeds 5MB limit

**Solution:**
- Compress image before uploading
- Use image optimization tools
- Or increase MAX_BYTES in backend (not recommended)

---

## 📝 Development Notes

### Adding Premium Users

To mark a user as premium in Clerk:

1. Go to Clerk Dashboard
2. Navigate to Users
3. Select the user
4. Go to Metadata tab
5. Add to Public Metadata:
```json
{
  "subscription_tier": "premium"
}
```

### Modifying the AI Prompt

Edit the prompt in `api/index.py`:

```python
PROMPT = "Describe this image in detail, including objects, colors, mood, and any notable features."
```

Change to whatever analysis style you want!

### Changing Usage Limits

Edit in `api/index.py`:

```python
# Free tier limit
if tier != "premium" and used >= 1:  # Change 1 to your desired limit
```

---

## 🎓 Learning Outcomes

This project demonstrates:

**CLO 1 - MLOps Principles:**
- CI/CD with Vercel
- Environment variable management
- Production deployment practices

**CLO 2 - ML System Design:**
- API architecture (REST endpoints)
- Authentication and authorization
- Error handling strategies

**CLO 3 - Containerization & Deployment:**
- Serverless deployment
- Function-as-a-Service (FaaS)
- Cloud infrastructure (Vercel)

**CLO 5 - Model Serving Infrastructure:**
- OpenAI API integration
- Request/response handling
- Real-time inference

---

## 📚 Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | Frontend framework | 14.0.0 |
| React | UI library | 18.2.0 |
| TypeScript | Type safety | 5.0.0 |
| Tailwind CSS | Styling | 3.3.0 |
| FastAPI | Backend framework | Latest |
| Python | Backend language | 3.9+ |
| OpenAI API | AI image analysis | gpt-4o-mini |
| Clerk | Authentication | 6.10.0 |
| Vercel | Deployment platform | Latest |

---

**Resources:**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI Vision API Docs](https://platform.openai.com/docs/guides/vision)
- [Clerk Documentation](https://clerk.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---
