import { Check } from "lucide-react";

export function SquareToggleButton({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`h-5 w-5 rounded border transition-colors flex items-center justify-center ${
        checked
          ? "bg-black text-white border-black"
          : "border-gray-300 hover:border-gray-400 bg-white"
      }`}
      aria-label="Toggle row"
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-3" />}
    </button>
  );
}
