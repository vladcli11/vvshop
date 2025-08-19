import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const LABELS = {
  "": "Acasă",
  apple: "Apple",
  samsung: "Samsung",
  huawei: "Huawei",
  models: "Modele",
};

const ucWords = (slug = "") =>
  slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

const truncate = (str, max) =>
  str.length > max ? str.slice(0, max - 1) + "…" : str;

export default function Breadcrumbs({ className = "" }) {
  const { pathname } = useLocation(); // ex: /samsung/samsung-galaxy-s25-ultra
  const parts = pathname.split("/").filter(Boolean);

  // construim crumb-urile incremental
  const crumbs = [{ to: "/", label: LABELS[""] }];
  let acc = "";
  parts.forEach((seg) => {
    acc += `/${seg}`;
    const label = LABELS[seg] || ucWords(seg);
    crumbs.push({ to: acc, label });
  });

  return (
    <nav
      aria-label="breadcrumb"
      className={`w-full border-b border-gray-100/60 bg-gray-100 backdrop-blur-sm ${className}`}
    >
      <ol
        className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 text-[13px] sm:text-sm text-gray-500
                   overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.to} className="flex items-center">
              {isLast ? (
                <span
                  aria-current="page"
                  title={c.label}
                  className="text-gray-900 font-semibold bg-white/70 backdrop-blur px-2 py-0.5 rounded-md ring-1 ring-gray-200/70"
                >
                  {truncate(c.label, 42)}
                </span>
              ) : (
                <Link
                  to={c.to}
                  title={c.label}
                  className="hover:text-gray-800 hover:underline underline-offset-4 transition-colors"
                >
                  {truncate(c.label, 28)}
                </Link>
              )}
              {!isLast && (
                <ChevronRight
                  className="w-4 h-4 mx-1 text-gray-300"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
