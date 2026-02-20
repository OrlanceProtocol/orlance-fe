import Link from "next/link";
import DitherBackground from "./_components/DitherBackground";
import SmoothScroll from "./_components/SmoothScroll";
import AnimatedFeatureCards from "./_components/AnimatedFeatureCards";
import ScrollNav from "./_components/ScrollNav";
import ThreadsBackground from "./_components/ThreadsBackground";

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
    <section className="pt-4 pb-4 px-6 bg-black relative overflow-hidden" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Container with corner accents */}
        <div className="relative border border-white/[0.08] bg-white/[0.02] p-8 md:p-12">
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
    <section id="products" className="pt-4 pb-8 px-6 bg-black relative overflow-hidden" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      {/* Threads background — shifted down */}
      <div className="absolute inset-0 top-[30%] z-0">
        <ThreadsBackground />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
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
    <footer className="bg-black px-6 pt-16 pb-0 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Top row: Logo left, links right */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Logo */}
          <div>
            <OrlanceLogo />
          </div>

          {/* Links columns */}
          <div className="flex gap-20">
            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Resources</h4>
              <ul className="space-y-4">
                {[
                  { label: "Documentation", href: "#" },
                  { label: "Audits", href: "#" },
                  { label: "Terms and Conditions", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Disclaimers", href: "#" },
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
              <h4 className="text-sm font-bold text-white mb-5">Community</h4>
              <ul className="space-y-4">
                {[
                  { label: "Twitter", href: "#" },
                  { label: "Discord", href: "#" },
                  { label: "Instagram", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Giant faded ORLANCE text */}
      <div className="relative w-full flex items-center justify-center" style={{ height: "clamp(120px, 18vw, 260px)" }}>
        <h2
          className="font-black uppercase leading-none select-none text-center"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(120px, 18vw, 300px)",
            color: "rgba(255, 255, 255, 0.08)",
            letterSpacing: "0.05em",
          }}
        >
          ORLANCE
        </h2>
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
