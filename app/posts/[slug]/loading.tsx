// app/posts/[slug]/loading.tsx — Instant skeleton loader for seamless article navigation

export default function Loading() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-8 font-serif animate-pulse">
      {/* Post Header Skeleton */}
      <header className="mb-8 space-y-4 pb-6 border-b border-neutral-200">
        {/* Title skeleton */}
        <div className="h-9 sm:h-11 bg-neutral-200 rounded-md w-3/4 max-w-xl"></div>
        <div className="h-9 sm:h-11 bg-neutral-200 rounded-md w-1/2"></div>

        {/* Meta info skeleton */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-4 bg-neutral-200 rounded w-24"></div>
          <div className="h-4 bg-neutral-200 rounded w-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-28"></div>
          <div className="h-4 bg-neutral-200 rounded w-4"></div>
          <div className="h-4 bg-neutral-200 rounded w-16"></div>
        </div>
      </header>

      {/* Paragraph skeletons */}
      <div className="space-y-4 py-4">
        <div className="h-4 bg-neutral-200 rounded w-full"></div>
        <div className="h-4 bg-neutral-200 rounded w-11/12"></div>
        <div className="h-4 bg-neutral-200 rounded w-full"></div>
        <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
      </div>

      <div className="space-y-4 py-6">
        <div className="h-4 bg-neutral-200 rounded w-full"></div>
        <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
        <div className="h-4 bg-neutral-200 rounded w-full"></div>
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
      </div>

      {/* Citation Box Skeleton */}
      <div className="mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-40"></div>
        <div className="h-12 bg-neutral-100 rounded-lg w-full"></div>
      </div>
    </article>
  );
}
