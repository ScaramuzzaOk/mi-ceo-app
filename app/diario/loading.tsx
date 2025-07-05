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

        {/* Filters skeleton */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 h-10 bg-slate-700 rounded"></div>
            <div className="w-48 h-10 bg-slate-700 rounded"></div>
            <div className="w-48 h-10 bg-slate-700 rounded"></div>
          </div>
        </div>

        {/* Entries skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-slate-700 rounded w-64 mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-32 mb-3"></div>
                  <div className="space-y-2 mb-3">
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-700 rounded w-16"></div>
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-700 rounded w-16"></div>
                  <div className="h-8 bg-slate-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
