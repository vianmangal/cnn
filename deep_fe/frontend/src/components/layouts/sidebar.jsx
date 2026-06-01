export default function Sidebar() {
  const items = [
    "Dashboard",
    "History",
    "Settings",
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-black">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-wider">
          EMOTIONLENS
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          AI Emotion Analytics
        </p>
      </div>

      <nav className="p-4">
        {items.map((item) => (
          <button
            key={item}
            className="w-full text-left px-4 py-3 mb-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-900 transition"
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full bg-white text-black py-3 font-medium">
         Upload Image
        </button>
      </div>
    </aside>
  );
}