import Link from 'next/link';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 mt-24 bg-white py-12">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif text-xs text-neutral-500">
        <p>© {currentYear} TheLawDiaries. All rights reserved.</p>
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
          <Link href="/archive" className="hover:text-black transition-colors font-medium text-black">Archive</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link>
        </nav>
      </div>
    </footer>
  );
}
