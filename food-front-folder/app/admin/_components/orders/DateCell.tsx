"use client";

import { useEffect, useState } from "react";

export function DateCell({ dateStr }: { dateStr?: string }) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (dateStr) {
      setFormattedDate(new Date(dateStr).toLocaleDateString());
    }
  }, [dateStr]);

  if (!dateStr) return <span className="text-gray-400">N/A</span>;

  return (
    <span className="text-xs text-gray-600">
      {formattedDate || dateStr.split("T")[0]}
    </span>
  );
}
