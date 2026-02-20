import Link from "next/link";
import DitherBackground from "./_components/DitherBackground";
import SmoothScroll from "./_components/SmoothScroll";
import AnimatedFeatureCards from "./_components/AnimatedFeatureCards";
import ScrollNav from "./_components/ScrollNav";

/* ─────────────────────────────────────────────────────────────
   Shared: Logo
───────────────────────────────────────────────────────────── */
function OrlanceLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="text-teal-400">
        <path d="M6 10 L16 4 L26 10 L26 22 L16 28 L6 22Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M6 16 L16 10 L26 16" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <span className="text-xl font-bold text-white tracking-tight">orlance</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 1a: Landing Navbar
───────────────────────────────────────────────────────────── */
function LandingNav() {
  return (
    <ScrollNav>
    <nav className="flex items-center justify-between px-8 py-5 bg-black/30 backdrop-blur-xl border-b border-white/5">
      <OrlanceLogo />
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium transition-all hover:shadow-md hover:shadow-teal-500/30"
        >
          Launch App →
        </Link>
      </div>
    </nav>
    </ScrollNav>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 1b: Hero
───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Dither animated background */}
      <div className="absolute inset-0">
        <DitherBackground />
      </div>

      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 bg-black/72" />

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-4xl px-6 mx-auto">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Built on Arbitrum · Trustless · Non-custodial
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight leading-none mb-6">
          Fixed Income<br />
          <span className="text-teal-400">for DeFi.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
          Strip yield-bearing assets into Principal and Yield Tokens.
          Earn fixed returns or take leveraged yield exposure — trustlessly, on Arbitrum.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-medium text-base transition-all hover:shadow-lg hover:shadow-teal-500/25"
          >
            Launch App →
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 rounded-full border border-white/20 text-white font-medium text-base hover:bg-white/5 transition-colors"
          >
            How it works
          </a>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-12 mt-16 flex-wrap">
          {[
            { label: "Total Value Locked", value: "Live on Testnet" },
            { label: "Active Pools", value: "3" },
            { label: "Network", value: "Arbitrum" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-500"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 2: How It Works
───────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="pt-12 pb-4 px-6 bg-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="px-5 py-2 border-2 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_60px_rgba(20,184,166,0.3),inset_0_0_20px_rgba(20,184,166,0.1)]">
            <h2 className="text-base md:text-lg font-bold text-teal-400 text-center">
              How It Works?
            </h2>
          </div>
        </div>

        {/* Bento grid layout */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {/* Step 1 */}
          <div className="relative p-8 border border-white/[0.08] bg-white/[0.02] flex flex-col justify-end hover:border-teal-500/20 transition-colors">
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400" />
            <img src="/icon/logo1section2.png" alt="Deposit Assets" className="w-full h-56 object-contain rounded-xl mb-5" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Deposit Assets</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Deposit yield-bearing tokens like stETH into Orlance pools.
              Your position is secured on-chain on Arbitrum.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-8 border border-white/[0.08] bg-white/[0.02] flex flex-col justify-end hover:border-teal-500/20 transition-colors">
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Receive PT & YT</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your deposit is split into Principal Tokens (PT) for fixed yield
              and Yield Tokens (YT) for leveraged yield exposure.
            </p>
            <img src="/icon/logo3section2.png" alt="Receive PT & YT" className="w-full h-auto rounded-xl" />
          </div>

          {/* Step 3 */}
          <div className="relative p-8 border border-white/[0.08] bg-white/[0.02] flex flex-col justify-end hover:border-teal-500/20 transition-colors">
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400" />
            <img src="/icon/logo2section2.png" alt="Earn Your Way" className="w-full h-56 object-contain rounded-xl mb-5" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Earn Your Way</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hold PT for guaranteed fixed returns at maturity, or hold YT
              to maximize yield exposure. Provide liquidity to earn trading fees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 3: Why Orlance (Feature Highlights)
───────────────────────────────────────────────────────────── */
function WhyOrlanceSection() {
  const features = [
    {
      title: "Swap & Trade",
      description:
        "Trade Principal Tokens and stETH directly through the built-in AMM. Get instant price quotes and swap with minimal slippage.",
    },
    {
      title: "Provide Liquidity",
      description:
        "Supply TPS and stETH to AMM pools and earn trading fees from every swap. Withdraw your liquidity anytime.",
    },
    {
      title: "Real-time Dashboard",
      description:
        "Track your positions, pending yield, transaction history, and token prices — all updated in real time.",
    },
    {
      title: "Multi-maturity Pools",
      description:
        "Choose from 1, 2, or 3-month maturity pools to match your investment horizon and risk preference.",
    },
  ];

  return (
    <section className="pt-4 pb-4 px-6 bg-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        {/* Container with corner accents */}
        <div className="relative border border-white/[0.08] p-8 md:p-12">
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400" />

          <div className="flex justify-center mb-10">
            <div className="px-5 py-2 border-2 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_60px_rgba(20,184,166,0.3),inset_0_0_20px_rgba(20,184,166,0.1)]">
              <h2 className="text-base md:text-lg font-bold text-teal-400 text-center">
                Why Orlance?
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Left — Dither background card */}
            <div className="border border-white/[0.08] overflow-hidden relative min-h-[480px]">
              <div className="absolute inset-0">
                <DitherBackground />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
                <div className="w-16 h-16 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-teal-400">
                    <path d="M6 10 L16 4 L26 10 L26 22 L16 28 L6 22Z" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M6 16 L16 10 L26 16" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Dashboard</span>
              </div>
            </div>

            {/* Right — 4 feature cards stacked with sweep animation */}
            <AnimatedFeatureCards features={features} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 4: Products
───────────────────────────────────────────────────────────── */
function ProductsSection() {
  return (
    <section id="products" className="pt-4 pb-32 px-6 bg-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-teal-400 uppercase tracking-tight" style={{ transform: "scaleY(2.5)", transformOrigin: "top", fontFamily: "var(--font-orbitron)", fontWeight: 900 }}>
            OUR PRODUCTS
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {/* ── Pools ── */}
          <div className="flex flex-col items-center text-center">
            <img src="/icon/pools.png" alt="Pools" className="w-full h-64 object-contain mb-8" />
            <h3 className="text-3xl font-bold text-white uppercase tracking-wide mb-3">Pools</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Split yield-bearing assets into fixed and variable yield tokens.
            </p>
            <Link href="/dashboard" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium transition-colors">
              Open Pools
            </Link>
          </div>

          {/* ── Vault ── */}
          <div className="flex flex-col items-center text-center">
            <img src="/icon/Vault.png" alt="Vault" className="w-full h-64 object-contain mb-8" />
            <h3 className="text-3xl font-bold text-white uppercase tracking-wide mb-3">Vault</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Auto-compound and auto-roll your yield — set it and forget it.
            </p>
            <Link href="/dashboard/vault" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium transition-colors">
              Open Vault
            </Link>
          </div>

          {/* ── Lottery ── */}
          <div className="flex flex-col items-center text-center">
            <img src="/icon/lottery.png" alt="Lottery" className="w-full h-64 object-contain mb-8" />
            <h3 className="text-3xl font-bold text-white uppercase tracking-wide mb-3">Lottery</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              No-loss prize pool — your principal stays safe, yield funds the prize.
            </p>
            <Link href="/dashboard/lottery" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium transition-colors">
              Try Lottery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 6: Footer
───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-black px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <OrlanceLogo />
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Fixed income protocol for DeFi. Built on Arbitrum.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-3">
              {[
                { label: "Pools", href: "/dashboard" },
                { label: "Vault", href: "/dashboard/vault" },
                { label: "Lottery", href: "/dashboard/lottery" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Documentation", href: "#" },
                { label: "Smart Contracts", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Community</h4>
            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:border-teal-500/30 transition-colors"
                aria-label="Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Discord */}
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:border-teal-500/30 transition-colors"
                aria-label="Discord"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:border-teal-500/30 transition-colors"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Orlance. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">
            Built on Arbitrum
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   Root page
───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="bg-black">
      <SmoothScroll />
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <WhyOrlanceSection />
      <ProductsSection />
      <Footer />
    </div>
  );
}
