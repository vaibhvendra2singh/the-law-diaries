'use client';

// components/LegalDisclaimer.tsx — Collapsible Legal Disclaimer for Essay Pages

import { useState } from 'react';

export default function LegalDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-8 border border-neutral-200 rounded-2xl bg-white text-neutral-600 font-serif text-xs overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors font-serif font-bold text-black uppercase tracking-widest"
      >
        <span>Legal & Editorial Disclaimer</span>
        <span className="text-sm">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-neutral-100 leading-relaxed space-y-3 bg-neutral-50/50">
          <p>
            The opinions expressed herein are those of the contributors (which shall, for these purposes, include guests) in their personal capacity and do not, in any way or manner, reflect the views of Bennett University, court chambers, law firms, or organizations with which the contributors are presently associated or previously employed.
          </p>
          <p>
            Postings on <em>The Law Diaries</em> are for informational, academic, and research purposes only. Nothing herein shall be deemed or construed to constitute legal, statutory, or investment advice. Discussions on or arising out of this publication between contributors and readers shall not create an attorney-client relationship.
          </p>
          <p>
            Links on this blog take you to external sites operated by third parties. The contributors have not reviewed all third-party information for accuracy or reliability and do not endorse third-party opinions. Links are offered solely for scholarly discussion and research.
          </p>
        </div>
      )}
    </div>
  );
}
