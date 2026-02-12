export default function Loading() {
  return (
    <div className="grid gap-8 pt-4 md:grid-cols-2 lg:gap-12">
      {/* Image skeleton */}
      <div className="space-y-4">
        <div className="aspect-square animate-pulse rounded-2xl bg-neutral-200" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-neutral-200" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="h-10 w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-12 w-32 animate-pulse rounded bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-lg bg-neutral-200" />
          <div className="h-32 animate-pulse rounded-lg bg-neutral-200" />
        </div>
        <div className="h-14 w-full animate-pulse rounded-lg bg-neutral-200" />
      </div>
    </div>
  );
}

