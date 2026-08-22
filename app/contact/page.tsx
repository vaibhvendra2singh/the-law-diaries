import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';
import { getPagesData } from '@/lib/pagesStore';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pages = getPagesData();
  return {
    title: pages.contact.title || 'Contact Us',
    description: pages.contact.subtitle || 'Get in touch with The Law Diaries.',
  };
}

export default function ContactPage() {
  const pages = getPagesData();
  const { title, subtitle, email } = pages.contact;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      
      {/* Top Center Pill Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Contact Us
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-snug">
          {title}
        </h1>
        {subtitle && (
          <p className="font-serif text-base text-neutral-600 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Contact Form */}
      <div className="mb-16">
        <ContactForm />
      </div>

      {/* Direct contact info */}
      <div className="pt-10 border-t border-neutral-200 text-center font-serif text-sm text-neutral-600">
        <p>
          Direct Email:{' '}
          <a
            href={`mailto:${email}`}
            className="text-black font-semibold underline decoration-black/40 underline-offset-4 hover:decoration-black"
          >
            {email}
          </a>
          {' · '}Phone: <span className="text-black font-semibold">+91 9934432143</span>
        </p>
      </div>

    </div>
  );
}
