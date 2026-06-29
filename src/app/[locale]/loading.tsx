export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#00D4AA] border-t-transparent" />
        <p className="text-sm text-[#848E9C]">Loading...</p>
      </div>
    </div>
  );
}
