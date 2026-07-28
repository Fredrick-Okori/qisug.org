export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#032f36]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#efbf04]" />
    </div>
  )
}
