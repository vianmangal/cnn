import { useEffect, useState } from "react";

import client from "../api/client.js";
import PredictionCard from "../components/PredictionCard.jsx";

export default function History() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await client.get("/history", {
          params: { page, page_size: pageSize },
        });
        if (active) {
          setItems(response.data.items);
          setTotal(response.data.total);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchHistory();
    return () => {
      active = false;
    };
  }, [page, pageSize]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-display text-2xl font-semibold text-white">
          Prediction history
        </h2>
        <p className="text-sm text-slate-400">
          Review your recent emotion detections.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
          Loading history...
        </div>
      ) : null}

      <div className="grid gap-4">
        {items.length === 0 && !loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            No predictions yet.
          </div>
        ) : null}
        {items.map((item) => (
          <PredictionCard key={item.id} item={item} />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="rounded-full border border-slate-700 px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <div>
          Page {page} of {totalPages}
        </div>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
          className="rounded-full border border-slate-700 px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
