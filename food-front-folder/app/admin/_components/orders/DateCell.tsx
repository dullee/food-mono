"use client";

import { useEffect, useState } from "react";

export function DateCell({ dateStr }: { dateStr?: string }) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (dateStr) {
      const date = new Date(dateStr);
      const formatted = new Intl.DateTimeFormat("en-ZA", {
        // YYYY/MM/DD
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);

      setFormattedDate(formatted);
    }
  }, [dateStr]);

  if (!dateStr) return <span className="text-gray-400">N/A</span>;

  return (
    <span className="text-[14px] text-[#71717A] font-medium">
      {formattedDate || dateStr.split("T")[0]}
    </span>
  );
}
