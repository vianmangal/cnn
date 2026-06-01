export default function StatsCard({ title, value }) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-xs text-zinc-500 tracking-wider mb-2">
        {title}
      </p>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>
    </div>
  );
}