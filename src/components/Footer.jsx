import anpcLogo from "../assets/anpc.webp";

export default function Footer() {
  return (
    <footer className="bg-[#ffffff] text-[#1F2937]  mt-6 pb-4 pt-2 px-3 text-center text-sm">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Info firmă */}
        <div className="space-y-1 text-center leading-tight">
          <p className="text-gray-800 font-semibold text-base">
            VV Shop SRL &copy; {new Date().getFullYear()}
          </p>
          <p className="text-[13px] text-gray-500">
            Cod fiscal:{" "}
            <span className="bg-gray-50 text-gray-700 px-1.5 py-0.5 rounded font-medium">
              RO-51906573
            </span>{" "}
            · Reg. com:{" "}
            <span className="text-gray-700 font-medium"> J2025039665002 </span>
          </p>

          <p className="text-[13px] text-gray-500">
            Sediu:{" "}
            <span className="text-gray-700 font-medium">
              Constanța, România
            </span>
          </p>
        </div>

        {/* Contact */}
        <div className="text-[13px] space-y-1 sm:space-y-0 sm:flex sm:justify-center sm:gap-6">
          <p>
            📧{" "}
            <a
              href="mailto:scvvshopsrl@gmail.com"
              className="underline hover:text-green-600"
            >
              scvvshopsrl@gmail.com
            </a>
          </p>
        </div>

        {/* Linkuri legale */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-[13px]">
          <a
            href="/termeni"
            className="underline underline-offset-4 hover:text-green-700"
          >
            Termeni
          </a>
          <a
            href="/confidentialitate"
            className="underline underline-offset-4 hover:text-green-700"
          >
            Confidențialitate
          </a>
          <a
            href="/livrare-retur"
            className="underline underline-offset-4 hover:text-green-700"
          >
            Livrare & Retur
          </a>
        </div>
        {/* Logo ANPC */}
        <div className="flex justify-center pt-2">
          <a
            href="https://anpc.ro"
            target="_blank"
            rel="noopener noreferrer"
            title="Autoritatea Națională pentru Protecția Consumatorilor"
          >
            <img
              src={anpcLogo}
              alt="ANPC"
              className="h-12 w-auto hover:opacity-80 transition"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
