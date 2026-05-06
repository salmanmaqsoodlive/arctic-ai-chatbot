const SERVICES = ["AC Repair", "Heating Repair", "Installation", "Maintenance"];

export default function Footer() {
  return (
    <footer className="bg-[#070f1e] text-slate-400">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-400 text-xl leading-none">❄</span>
            <span className="text-white font-bold text-lg tracking-tight">
              Arctic Air HVAC
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Fast, reliable heating &amp; cooling across Los Angeles County.
            Licensed, insured, and trusted by 10,000+ homeowners.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Services
          </h3>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s}>
                <span className="hover:text-white transition-colors cursor-default">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Contact
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href="mailto:info@arcticairhvac.com"
                className="hover:text-white transition-colors"
              >
                info@arcticairhvac.com
              </a>
            </li>
            <li>Los Angeles, CA</li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-green-400">Available 24/7</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Arctic Air HVAC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
