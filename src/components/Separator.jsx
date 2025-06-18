export default function Separator({ text = "", icon = null }) {
  return (
    <div className="flex items-center justify-center my-4 px-2 sm:px-0 w-full">
      <div className="flex-grow h-[3px] bg-gradient-to-r from-green-400 via-green-300 to-blue-400" />
      <span className="relative flex items-center mx-2 px-4 py-2 rounded-2xl shadow-md bg-white/80 backdrop-blur-md border border-green-100/60">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="text-base sm:text-lg font-semibold tracking-wider text-gray-700 uppercase whitespace-nowrap drop-shadow">
          {text}
        </span>
      </span>
      <div className="flex-grow h-[3px] bg-gradient-to-l from-blue-400 via-green-300 to-green-400" />
    </div>
  );
}
