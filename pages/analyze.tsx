import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useAuth, UserButton } from "@clerk/nextjs";

type Usage = {
  user_id: string;
  tier: "free" | "premium";
  analyses_used: number;
  limit: number | "unlimited";
};

export default function Analyze() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [usage, setUsage] = useState<Usage | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  const tierLabel = useMemo(() => {
    if (!usage) return "";
    return usage.tier === "premium" ? "Premium" : "Free";
  }, [usage]);

  const usageLabel = useMemo(() => {
    if (!usage) return "";
    if (usage.limit === "unlimited") return `${usage.analyses_used} analyses`;
    return `${usage.analyses_used}/${usage.limit}`;
  }, [usage]);

  const limitReached = useMemo(() => {
    if (!usage) return false;
    if (usage.limit === "unlimited") return false;
    return usage.analyses_used >= usage.limit;
  }, [usage]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    (async () => {
      try {
        const jwt = await getToken();
        if (!jwt) return;

        const res = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setUsage(null);
          setError(data?.message || "Failed to fetch usage.");
          return;
        }

        setUsage(data);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch usage.");
      }
    })();
  }, [isLoaded, isSignedIn, getToken, router]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onPickFile = (f: File | null) => {
    setError("");
    setResult("");
    setFile(f);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onPickFile(e.dataTransfer.files[0]);
    }
  };

  const onSwitchPlan = async (action: "upgrade" | "downgrade") => {
    setError("");
    setSwitching(true);
    try {
      const jwt = await getToken();
      if (!jwt) {
        setError("Authentication required.");
        return;
      }

      const res = await fetch(`/api/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to switch plan.");
        return;
      }

      setUsage(data);
    } catch (e) {
      console.error(e);
      setError("Failed to switch plan.");
    } finally {
      setSwitching(false);
    }
  };

  const onAnalyze = async () => {
    setError("");
    setResult("");

    if (!file) {
      setError("Please choose an image file first.");
      return;
    }

    setLoading(true);
    try {
      const jwt = await getToken();
      if (!jwt) {
        setError("Authentication required.");
        return;
      }

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Analysis failed.");
        return;
      }

      setResult(data?.description || "");
      setUsage({
        user_id: data.user_id,
        tier: data.tier,
        analyses_used: data.analyses_used,
        limit: data.limit,
      });
    } catch (e) {
      console.error(e);
      setError("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f1a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">AI Vision Analyzer</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Tier Badge */}
              {usage && (
                <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                  usage.tier === "premium"
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-white/10 text-gray-400 border border-white/10"
                }`}>
                  {usage.tier === "premium" ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {tierLabel}
                </div>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-white/20"
                  }
                }}
              />
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Powered by GPT-4 Vision
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                Analyze Any Image
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                with AI Precision
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload an image and let our AI describe it in detail. Get insights about objects, colors, mood, and context.
            </p>
          </header>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Usage</p>
                <p className="text-white font-semibold">{usageLabel || "..."}</p>
              </div>
            </div>

            {usage?.tier === "free" ? (
              <button
                onClick={() => onSwitchPlan("upgrade")}
                disabled={switching}
                className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-amber-400/70 uppercase tracking-wider">Upgrade to</p>
                  <p className="text-amber-400 font-semibold">{switching ? "Switching..." : "Premium"}</p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onSwitchPlan("downgrade")}
                disabled={switching}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Switch to</p>
                  <p className="text-gray-400 font-semibold">{switching ? "Switching..." : "Free Plan"}</p>
                </div>
              </button>
            )}
          </div>

          {/* Limit Warning */}
          {limitReached && (
            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-medium">Free tier limit reached</p>
                <p className="text-gray-400 text-sm">Upgrade to Premium for unlimited analyses</p>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
            {/* Upload Area */}
            <div className="p-8 border-b border-white/10">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? "border-violet-500 bg-violet-500/10"
                    : previewUrl
                    ? "border-white/20 bg-white/5"
                    : "border-white/20 hover:border-white/40 hover:bg-white/5"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-[400px] object-contain rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                        Click to change image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 px-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium text-lg mb-2">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-gray-500 text-sm">
                      Supports JPG, PNG, WebP up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Analyze Button */}
            <div className="p-8 border-b border-white/10">
              <button
                onClick={onAnalyze}
                disabled={loading || !file || limitReached}
                className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading || !file || limitReached
                    ? "bg-white/10 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Image
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mx-8 mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Results Area */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 min-h-[200px]">
                {!result && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      Upload an image and click analyze to see the AI-generated description here.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center py-8">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
                      <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    </div>
                    <p className="text-gray-400 animate-pulse">Analyzing your image...</p>
                  </div>
                )}

                {result && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="text-gray-300 space-y-2 list-disc list-inside">{children}</ul>,
                        ol: ({ children }) => <ol className="text-gray-300 space-y-2 list-decimal list-inside">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-300">{children}</li>,
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Built with GPT-4 Vision API
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
