export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 bg-slate-800 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-800 rounded w-64"></div>
          </div>
          <div className="h-10 bg-slate-800 rounded w-32"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4">
              <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
              <div className="h-6 bg-slate-700 rounded w-12"></div>
            </div>
          ))}
        </div>

        {/* Goals card skeleton */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
          <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts skeleton */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="h-6 bg-slate-700 rounded w-40 mb-4"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        </div>

        {/* Books list skeleton */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-700/50 rounded-lg p-4">
                <div className="h-5 bg-slate-600 rounded w-48 mb-2"></div>
                <div className="h-4 bg-slate-600 rounded w-32 mb-2"></div>
                <div className="h-2 bg-slate-600 rounded mb-2"></div>
                <div className="h-4 bg-slate-600 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
