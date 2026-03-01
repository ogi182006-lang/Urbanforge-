// ============================================================
// app/loading.tsx — Global loading skeleton
// ============================================================
export default function Loading() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero skeleton */}
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="skeleton h-4 w-40 rounded-full" />
        <div className="skeleton h-24 w-[min(600px,90vw)] rounded-2xl" />
        <div className="skeleton h-6 w-64 rounded-full" />
        <div className="flex gap-4">
          <div className="skeleton h-14 w-36 rounded-2xl" />
          <div className="skeleton h-14 w-36 rounded-2xl" />
        </div>
      </div>

      {/* Bento skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pb-16">
        <div className="skeleton h-12 w-48 rounded-xl mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <div className="skeleton aspect-square" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-8 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
