import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">AI Vision Analyzer</span>
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 border border-white/10 hover:border-white/20">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/analyze"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium transition-all duration-300 shadow-lg shadow-violet-500/25"
                >
                  Go to Analyzer
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-white/20"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Powered by GPT-4 Vision
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                Understand Images
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload any image and get instant AI-powered analysis. Discover objects, colors, emotions, and hidden details with unprecedented accuracy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 flex items-center gap-2">
                    Start Analyzing Free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze">
                  <button className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 flex items-center gap-2">
                    Go to Analyzer
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
              </SignedIn>

              <a href="#features" className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-lg transition-all duration-300 border border-white/10 hover:border-white/20">
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">99%</p>
                <p className="text-gray-500 text-sm mt-1">Accuracy Rate</p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">&lt;3s</p>
                <p className="text-gray-500 text-sm mt-1">Analysis Time</p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">10K+</p>
                <p className="text-gray-500 text-sm mt-1">Images Analyzed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand your images with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:bg-white/[0.07]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get rich, detailed descriptions powered by GPT-4 Vision. Identify objects, colors, emotions, and context with remarkable accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:bg-white/[0.07]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your images are processed securely and never stored. Enterprise-grade encryption with Clerk authentication keeps your data safe.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:bg-white/[0.07]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get results in seconds, not minutes. Our optimized pipeline delivers instant analysis without compromising on quality.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three simple steps to unlock the power of AI image analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-8xl font-bold text-white/5 absolute -top-4 -left-2">1</div>
              <div className="relative pt-8">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Image</h3>
                <p className="text-gray-400">Drag and drop or click to upload any image. We support JPG, PNG, and WebP formats.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-8xl font-bold text-white/5 absolute -top-4 -left-2">2</div>
              <div className="relative pt-8">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Processes</h3>
                <p className="text-gray-400">Our GPT-4 Vision model analyzes every detail of your image in real-time.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-8xl font-bold text-white/5 absolute -top-4 -left-2">3</div>
              <div className="relative pt-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Get Results</h3>
                <p className="text-gray-400">Receive a comprehensive description with objects, colors, mood, and more.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple Pricing
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Free</h3>
                  <p className="text-gray-500 text-sm">Perfect to get started</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1 image analysis
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full AI-powered analysis
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure authentication
                </li>
              </ul>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300 border border-white/10">
                    Get Started Free
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze" className="block">
                  <button className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300 border border-white/10">
                    Use Free Tier
                  </button>
                </Link>
              </SignedIn>
            </div>

            {/* Premium Tier */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/30 hover:border-violet-500/50 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Premium</h3>
                  <p className="text-gray-400 text-sm">For power users</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">$5</span>
                <span className="text-gray-400">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium text-white">Unlimited</span> analyses
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority processing
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium support
                </li>
              </ul>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
                    Start Premium
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze" className="block">
                  <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
                    Go to Analyzer
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-cyan-600/20" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to See What AI Sees?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of users who trust AI Vision Analyzer to understand their images. Start your free analysis today.
              </p>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105">
                    Get Started for Free
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze">
                  <button className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105">
                    Go to Analyzer
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-12">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">AI Vision Analyzer</span>
              </div>

              <p className="text-gray-500 text-sm">
                Built with GPT-4 Vision API
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
