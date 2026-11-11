export default function ErrorState({
  title,
  message,
  buttonText,
  onRetry,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white/70 px-6 py-12 text-center shadow-sm backdrop-blur-xl">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-gray-800">
        {title || "Terjadi Kesalahan"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {message || "Maaf, terjadi kesalahan. Silakan coba lagi."}
      </p>

      {buttonText && onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}