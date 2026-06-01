const sampleData = [];

export default function AnalyticsTable() {
  return (
    <div className="border border-zinc-800 bg-black">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 text-zinc-400">
            <th className="text-left p-4">DATE</th>
            <th className="text-left p-4">FILE</th>
            <th className="text-left p-4">EMOTION</th>
            <th className="text-left p-4">CONFIDENCE</th>
          </tr>
        </thead>

        <tbody>
          {sampleData.map((row, i) => (
            <tr
              key={i}
              className="border-b border-zinc-900 hover:bg-zinc-950"
            >
              <td className="p-4">{row.date}</td>
              <td className="p-4">{row.file}</td>
              <td className="p-4">{row.emotion}</td>
              <td className="p-4">{row.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}