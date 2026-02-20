import Link from "next/link";
import DitherBackground from "./_components/DitherBackground";

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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[#0B1120]/80 backdrop-blur-md border-b border-white/5">
      <OrlanceLogo />
      <div className="flex items-center gap-6">
        <a
          href="#how-it-works"
          className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
        >
          How it works
        </a>
        <a
          href="#products"
          className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
        >
          Products
        </a>
        <Link
          href="/dashboard"
          className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium transition-all hover:shadow-md hover:shadow-teal-500/30"
        >
          Launch App →
        </Link>
      </div>
    </nav>
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
      <div className="absolute inset-0 bg-[#0B1120]/72" />

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
            { label: "Total Value Locked", value: "$—" },
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
    <section id="how-it-works" className="py-32 px-6 bg-[#0B1120]">
      <div className="max-w-6xl mx-auto">
        <p className="text-teal-400 text-sm font-medium uppercase tracking-widest text-center mb-3">
          How it works
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-5">
          Yield stripping,{" "}
          <span className="text-gray-400 font-normal">simplified.</span>
        </h2>
        <p className="text-gray-400 text-lg text-center max-w-xl mx-auto mb-20">
          Three steps to unlock fixed income or leveraged yield on your DeFi assets.
        </p>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[3.25rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-teal-500/20 via-teal-500/50 to-teal-500/20" />

          {/* Step 1 */}
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col items-center text-center hover:border-teal-500/20 transition-colors">
            <span className="text-xs font-mono text-teal-500/50 mb-5 tracking-widest">01</span>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 relative z-10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Deposit Assets</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Deposit yield-bearing tokens like stETH into Orlance pools.
              Your position is secured on-chain on Arbitrum.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col items-center text-center hover:border-teal-500/20 transition-colors">
            <span className="text-xs font-mono text-teal-500/50 mb-5 tracking-widest">02</span>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 relative z-10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Receive PT & YT</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your deposit is split into Principal Tokens (PT) for fixed yield
              and Yield Tokens (YT) for leveraged yield exposure.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col items-center text-center hover:border-teal-500/20 transition-colors">
            <span className="text-xs font-mono text-teal-500/50 mb-5 tracking-widest">03</span>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 relative z-10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Earn Your Way</h3>
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
   Section 3: Products
───────────────────────────────────────────────────────────── */
function ProductsSection() {
  return (
    <section id="products" className="py-32 px-6 bg-[#080E1A]">
      <div className="max-w-6xl mx-auto">
        <p className="text-teal-400 text-sm font-medium uppercase tracking-widest text-center mb-3">
          Products
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-5">
          One protocol,{" "}
          <span className="text-gray-400 font-normal">three ways to earn.</span>
        </h2>
        <p className="text-gray-400 text-lg text-center max-w-xl mx-auto mb-20">
          Whether you want fixed income, passive yield, or a shot at a prize —
          Orlance has a product for you.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* ── Pools card ── */}
          <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 p-8 flex flex-col hover:border-teal-500/40 transition-colors">
            <span className="text-xs font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full self-start mb-6">
              Yield Stripping
            </span>
            <div className="text-teal-400 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pools</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Deposit yield-bearing assets and split them into Principal Tokens
              (fixed yield) and Yield Tokens (variable/leveraged). Choose
              maturities from 1 to 3 months.
            </p>
            <ul className="space-y-2 mb-8">
              {["Fixed APY via PT", "Leveraged yield via YT", "Multiple maturities", "AMM liquidity"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-teal-400 group"
            >
              Open Pools{" "}
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>

          {/* ── Vault card ── */}
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8 flex flex-col hover:border-indigo-500/40 transition-colors">
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full self-start mb-6">
              Auto-Roller
            </span>
            <div className="text-indigo-400 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.5 2v6h-6" />
                <path d="M21.34 15.57a10 10 0 1 1-.57-8.38" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Vault</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Deposit once and let Orlance handle the rest. The auto-roller vault
              automatically compounds and rolls your position at maturity —
              set it and forget it.
            </p>
            <ul className="space-y-2 mb-8">
              {["Auto-compound yield", "Auto-roll at maturity", "Passive income", "No manual rebalancing"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/vault"
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 group"
            >
              Open Vault{" "}
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>

          {/* ── Lottery card ── */}
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-8 flex flex-col hover:border-amber-500/40 transition-colors">
            <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full self-start mb-6">
              No-Loss
            </span>
            <div className="text-amber-400 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Lottery</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Deposit into the no-loss lottery pool. Your principal is always safe —
              the yield generated by the pool funds the prize pot, giving you a
              chance to win big, risk-free.
            </p>
            <ul className="space-y-2 mb-8">
              {["Principal always safe", "Yield funds the prize", "Weekly prize draws", "Zero-risk to enter"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/lottery"
              className="flex items-center gap-1.5 text-sm font-medium text-amber-400 group"
            >
              Try Lottery{" "}
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Root page
───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="bg-[#0B1120]">
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <ProductsSection />
    </div>
  );
}
