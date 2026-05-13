"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-12">
      {/* Hero Panel */}
      <section className="glass-card rounded-2xl p-8 md:p-12 relative border border-white/10 overflow-hidden">
        <div className="glint"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm border border-primary/20 uppercase tracking-tighter">System Nominal</span>
              <span className="text-on-surface-variant text-body-md opacity-60">ID: PR-992-ALPHA</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">Startup Health Overview</h3>
            <p className="text-body-lg text-on-surface-variant max-w-xl">
              Analyzing multi-dimensional growth vectors. The underlying neural network has detected high-velocity scaling patterns in current market trajectory.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/dashboard/submit">
                <button className="bg-gradient-to-r from-primary to-inverse-primary text-on-primary px-8 py-3 rounded-lg font-bold tracking-tight shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                  Full Evaluation
                </button>
              </Link>
              <Link href="/dashboard/insights">
                <button className="border border-primary text-primary px-8 py-3 rounded-lg font-bold tracking-tight bg-white/5 hover:bg-white/10 transition-colors">
                  AI Insights
                </button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-6 border border-white/5">
              <span className="text-label-sm text-on-surface-variant uppercase">Health Score</span>
              <div className="text-display-lg font-display-lg text-primary mt-2">88</div>
              <div className="h-1 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary w-[88%]"></div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 border border-white/5">
              <span className="text-label-sm text-on-surface-variant uppercase">Growth Prob.</span>
              <div className="text-display-lg font-display-lg text-secondary mt-2">92%</div>
              <div className="h-1 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-secondary w-[92%]"></div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 border border-white/5 col-span-2">
              <span className="text-label-sm text-on-surface-variant uppercase">Valuation Forecast</span>
              <div className="text-headline-lg font-headline-lg text-on-surface mt-2">$15,000,000</div>
              <p className="text-label-sm text-tertiary mt-2">Estimated Series A Potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Centerpiece (Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Centerpiece: Future Growth Intelligence */}
        <div className="md:col-span-8 glass-card rounded-2xl p-8 border border-white/10 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">Future Growth Intelligence</h4>
              <p className="text-body-md text-on-surface-variant">Startup DNA &amp; Scalability Mapping</p>
            </div>
            <div className="text-right">
              <div className="text-label-sm text-on-surface-variant uppercase mb-1">AI Confidence</div>
              <div className="text-headline-md font-headline-md text-primary">98%</div>
            </div>
          </div>
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative flex justify-center">
              {/* Circular Growth Chart Mock */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-white/5"></div>
                <div className="absolute inset-0 rounded-full border-8 border-primary/40 border-t-transparent border-r-transparent transform -rotate-45"></div>
                <div className="text-center">
                  <div className="text-label-sm text-on-surface-variant uppercase">Scalability</div>
                  <div className="text-display-lg font-display-lg text-primary leading-none">A+</div>
                  <div className="text-label-sm text-tertiary mt-2">Top 2% Tier</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-label-sm text-on-surface-variant uppercase">
                  <span>Market Fit</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full"><div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_8px_rgba(195,245,255,0.5)]"></div></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-label-sm text-on-surface-variant uppercase">
                  <span>Product Velocity</span>
                  <span className="text-secondary">94%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full"><div className="h-full bg-secondary w-[94%] rounded-full shadow-[0_0_8px_rgba(236,178,255,0.5)]"></div></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-label-sm text-on-surface-variant uppercase">
                  <span>Team Strength</span>
                  <span className="text-tertiary">78%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full"><div className="h-full bg-tertiary w-[78%] rounded-full shadow-[0_0_8px_rgba(168,255,210,0.5)]"></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex-grow">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary" data-icon="smart_toy">smart_toy</span>
              <h5 className="font-headline-md text-headline-md text-on-surface text-lg">AI Optimization</h5>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border-l-2 border-primary space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm" data-icon="warning">warning</span>
                  <span className="text-label-sm text-on-surface font-bold uppercase">Pricing Insight</span>
                </div>
                <p className="text-body-md text-on-surface-variant leading-relaxed">Pricing model may reduce adoption in early stages. Consider a tiered freemium approach.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border-l-2 border-secondary space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm" data-icon="lightbulb">lightbulb</span>
                  <span className="text-label-sm text-on-surface font-bold uppercase">Strategy Pivot</span>
                </div>
                <p className="text-body-md text-on-surface-variant leading-relaxed">Focus on B2B niche to increase LTV. Early data shows higher conversion in enterprise sector.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Forecast & Investors */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Growth Forecast Timeline */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">Growth Forecast</h4>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Probability of Unicorn Status</p>
            </div>
            <div className="flex gap-4">
              <span className="text-label-sm text-primary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span> Target
              </span>
              <span className="text-label-sm text-secondary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Realistic
              </span>
            </div>
          </div>
          {/* Chart Placeholder */}
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible">
              {/* Background Grid */}
              <line stroke="white" strokeOpacity="0.05" x1="0" x2="100%" y1="25%" y2="25%"></line>
              <line stroke="white" strokeOpacity="0.05" x1="0" x2="100%" y1="50%" y2="50%"></line>
              <line stroke="white" strokeOpacity="0.05" x1="0" x2="100%" y1="75%" y2="75%"></line>
              {/* Graph Lines */}
              <path className="drop-shadow-[0_0_8px_rgba(195,245,255,0.5)]" d="M0,240 Q150,220 300,160 T600,120 T900,40" fill="none" stroke="#c3f5ff" strokeWidth="3"></path>
              <path d="M0,240 Q150,230 300,200 T600,180 T900,140" fill="none" stroke="#ecb2ff" strokeDasharray="4" strokeWidth="2"></path>
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-label-sm text-on-surface-variant pt-4">
              <span>Q1 2024</span>
              <span>Q3 2024</span>
              <span>Q1 2025</span>
              <span>Q3 2025</span>
              <span>Q1 2026</span>
            </div>
          </div>
        </div>

        {/* Investor Personas */}
        <div className="lg:col-span-5 space-y-gutter">
          <h4 className="font-headline-md text-headline-md text-on-surface px-2">Investor Alignment</h4>
          {/* Aggressive VC Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 group hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30">
                <img alt="Investor" className="w-full h-full object-cover" data-alt="A portrait of a sharp, modern venture capitalist in a high-tech obsidian office setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB77IPIpNXgMrrbOe990kpI3zXmke7f637c2i7LGqhKur-tdxBkBS7vi_uBBFzNuSR-HbgTnN9x5zb-yC0b4QueK8HN2DFm1FbyWu0yS5gfUZtjCJCxZ5zoerAihZupxBOsG7MXb-HUZ4hBTB7bKpNzcvNcXkmc-UD3ooxXN_iAkOdUswCft8rS_Qin1decft0uT0I6gDjmWSwX3GYBwGbQhs9aSh42Rq7OufokIBkqOtvNNi08iVu_TQabjedyCrsMR30t_cGQJgp9" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h6 className="font-bold text-on-surface">Aggressive VC</h6>
                  <span className="text-primary text-label-sm font-bold uppercase">94 Interest</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-tertiary text-[16px]" data-icon="trending_up">trending_up</span>
                  <span className="text-label-sm text-on-surface-variant uppercase">Sentiment: Bullish</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-body-md text-on-surface-variant">
              &quot;Looking for high-burn, high-velocity scaling opportunities in the AI sector.&quot;
            </div>
          </div>

          {/* AI Investor Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 group hover:border-secondary/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary/30">
                <img alt="Investor" className="w-full h-full object-cover" data-alt="A professional portrait of a tech-focused female investor." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAiIDsrjPvZQSvv_JL4ER7ZmPC8Lg5tXuZmcj1NO7r30OoJKVhYyj9iOO2XsjlmeMt73MCP1TGwiOe2q6H4_m1c7tLpHMS1N-VQ9otCZoFKKyiqktX-8-5TX2G-oOyPPtoS9pLialifH-HUvBzSGYMZI1Ah24Kdn0RaiUEaMl_FK3r8Yxc_FLfF_fP46Un0R4CuNMs7dvMMwjZxakd0n2MjO0sLAzsP9d5Bcbi_SzIuue5W1xCDtLx9-l_S4sspjapNYq75w2ntRwy" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h6 className="font-bold text-on-surface">AI Specialized Fund</h6>
                  <span className="text-secondary text-label-sm font-bold uppercase">82 Interest</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-primary text-[16px]" data-icon="monitoring">monitoring</span>
                  <span className="text-label-sm text-on-surface-variant uppercase">Sentiment: Analytical</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-body-md text-on-surface-variant">
              &quot;Deep focus on algorithmic defensibility and proprietary data moats.&quot;
            </div>
          </div>
        </div>
      </section>

      {/* Command Input */}
      <section className="max-w-3xl mx-auto pt-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-25 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-4 border-b border-white/20 focus-within:border-primary px-4 py-4 transition-all">
            <span className="material-symbols-outlined text-primary" data-icon="terminal">terminal</span>
            <input className="bg-transparent border-none focus:ring-0 text-headline-md w-full placeholder:text-white/20 font-headline-md tracking-tight outline-none" placeholder="Run AI simulation on Series B trajectory..." type="text" />
            <div className="terminal-cursor animate-pulse"></div>
          </div>
        </div>
        <p className="text-label-sm text-center mt-6 text-on-surface-variant uppercase tracking-widest opacity-40">Ready for command input_</p>
      </section>
    </div>
  );
}

