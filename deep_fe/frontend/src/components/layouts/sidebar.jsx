export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 border-r border-zinc-900 bg-black flex flex-col h-screen select-none font-mono">
      {/* Top Section / Category Title */}
      <div className="p-6 border-b border-zinc-900">
        <div className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
          WORKSPACE
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="p-4 space-y-2 flex-1">
        <button
          onClick={() => setActiveTab("upload")}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            activeTab === "upload"
              ? "bg-white border-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-950"
          }`}
        >
          <span>↑ Upload Image</span>
        </button>

        <button
          onClick={() => setActiveTab("webcam")}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            activeTab === "webcam"
              ? "bg-white border-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-950"
          }`}
        >
          <span>◉ Live Webcam</span>
        </button>
      </nav>
       <div className="mt-5 pt-4 border-t border-zinc-900 flex flex-col gap-1 text-[9px] text-zinc-600">
          <div>HOST: vian1.tech</div>
          <div>STACK: S3 + CloudFront + ALB</div>
        </div>
    </aside>
  );
}

