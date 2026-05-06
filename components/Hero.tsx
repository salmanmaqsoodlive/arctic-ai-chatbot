"use client";

const TRUST_ITEMS = [
  {
    label: "24/7 Service",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    label: "Licensed & Insured",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
  },
  {
    label: "Free Estimates",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
        />
      </svg>
    ),
  },
];

interface Props {
  onOpenChat: () => void;
}

export default function Hero({ onOpenChat }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col bg-[#0b1a33] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/[0.08] blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-blue-800/[0.12] blur-3xl" />
      </div>

      <header className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pt-6 flex items-center">
        <div className="flex items-center gap-2">
          <span
            className="text-blue-400 text-xl leading-none"
            aria-hidden="true"
          >
            ❄
          </span>
          <span className="text-white font-bold tracking-tight text-base sm:text-lg">
            Arctic Air HVAC
          </span>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-5 sm:px-8 py-14 sm:py-20">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-7 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
            <span className="text-orange-300 text-sm font-medium">
              Available 24/7 &middot; Los Angeles, CA
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-5">
            Fast, Reliable
            <br />
            <span className="text-blue-400">Heating &amp; Cooling</span>
            <br />
            in Los Angeles
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-9 leading-relaxed">
            Same-day HVAC service. Licensed technicians, transparent pricing,
            guaranteed work.
          </p>

          <button
            onClick={onOpenChat}
            className="cursor-pointer w-full sm:w-auto bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
          >
            Get a Free Quote
          </button>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 sm:divide-x sm:divide-slate-700">
            {TRUST_ITEMS.map(({ label, icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-slate-300 text-sm font-medium sm:px-7"
              >
                <span className="text-blue-400 flex-shrink-0">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
