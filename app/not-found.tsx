import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center font-serif">
      {/* Pill Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          404 · Not Found
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
        Article Not Found
      </h1>

      <p className="text-base text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
        The article you are looking for may have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="bg-black text-white px-6 py-2.5 rounded-full font-serif text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
        >
          ← Return to Home
        </Link>
        <Link
          href="/archive"
          className="border border-black text-black px-6 py-2.5 rounded-full font-serif text-sm font-medium hover:bg-neutral-100 transition-colors"
        >
          Browse Archive
        </Link>
      </div>
    </div>
  );
}
