export default function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "plasata":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-700",
          border: "border-indigo-200",
          dot: "bg-indigo-500",
        };
      case "asteptare_plata":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
          dot: "bg-yellow-500",
        };
      case "platita":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };
      case "livrata":
        return {
          bg: "bg-sky-100",
          text: "text-sky-700",
          border: "border-sky-200",
          dot: "bg-sky-500",
        };
      case "anulata":
        return {
          bg: "bg-rose-100",
          text: "text-rose-700",
          border: "border-rose-200",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-slate-100",
          text: "text-slate-700",
          border: "border-slate-200",
          dot: "bg-slate-500",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`
        inline-flex items-center justify-center gap-2 
        px-5 py-2.5 min-w-[140px]
        ${config.bg} ${config.text} ${config.border}
        border-2 rounded-full 
        font-semibold text-sm
        shadow-sm transition-all duration-200
      `}
    >
      <div className={`w-2 h-2 ${config.dot} rounded-full animate-pulse`} />
      <span className="capitalize whitespace-nowrap">
        {status?.replace("_", " ") || "Necunoscut"}
      </span>
    </div>
  );
}
