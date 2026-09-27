const stats = [
  { value: "5", label: "Pro-grade courts" },
  { value: "50+", label: "Games every month" },
  { value: "1K+", label: "Players in the run" },
  { value: "24/7", label: "Online booking" },
];

export default function StatsBand() {
  return (
    <section className="border-y border-white/10 bg-black py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-court">
              {stat.value}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
