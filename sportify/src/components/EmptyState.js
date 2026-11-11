export default function EmptyState({
  title,
  description,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/70 px-6 py-12 text-center shadow-sm backdrop-blur-xl">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h8M8 14h4m5 5l2 2 4-4"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-gray-800">
        {title || "Belum Ada Data"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {description || "Data yang kamu cari belum tersedia."}
      </p>

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}