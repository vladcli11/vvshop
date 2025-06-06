export default function StatusBadge({ status }) {
  const styles = {
    plasata: "bg-yellow-100 text-yellow-800",
    asteptare_plata: "bg-blue-100 text-blue-800",
    platita: "bg-green-100 text-green-800",
    livrata: "bg-green-200 text-green-900 font-bold",
    anulata: "bg-red-100 text-red-800",
    necunoscut: "bg-gray-100 text-gray-600",
  };

  const label = status || "necunoscut";
  const classes = styles[label] || styles["necunoscut"];

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${classes}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}
