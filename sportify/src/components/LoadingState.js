export default function LoadingState({ message }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-green-600"></div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {message || "Memuat data..."}
      </p>
    </div>
  );
}