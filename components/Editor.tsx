'use client';
// components/Editor.tsx
// Split-pane markdown editor: left = write, right = live preview.

import dynamic from 'next/dynamic';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

// Dynamically imported to avoid SSR issues (editor is browser-only)
const MDEditor = dynamic<any>(
  () => import('@uiw/react-md-editor').then((mod) => mod.default as any),
  { ssr: false }
);

export default function Editor({ value, onChange }: Props) {
  function insertFootnote() {
    const matches = (value || '').match(/\[\^(\d+)\]/g);
    let nextNum = 1;
    if (matches) {
      const nums = matches
        .map((m) => parseInt(m.replace(/[^\d]/g, ''), 10))
        .filter((n) => !isNaN(n));
      if (nums.length > 0) {
        nextNum = Math.max(...nums) + 1;
      }
    }
    const footnoteRef = `[^${nextNum}]`;
    const footnoteDef = `\n\n[^${nextNum}]: Citation or Reference here (e.g. Case law, book, statute, or URL)`;
    onChange(value ? `${value}${footnoteRef}${footnoteDef}` : `${footnoteRef}${footnoteDef}`);
  }

  return (
    <div data-color-mode="light" className="relative">
      {/* Footnotes & Citation Quick-Action Bar */}
      <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs font-serif">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black uppercase tracking-wider text-[11px]">Academic Reference:</span>
          <button
            type="button"
            onClick={insertFootnote}
            className="px-3 py-1 bg-black text-white rounded-full font-serif text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Insert Footnote</span>
            <code className="bg-neutral-800 px-1 py-0.2 rounded text-[10px] text-neutral-300 font-mono">[^n]</code>
          </button>
        </div>
        <div className="text-neutral-500 text-[11px]">
          Use <code className="bg-neutral-200 text-neutral-800 px-1 py-0.5 rounded font-mono text-[10px]">[^1]</code> inside paragraph and <code className="bg-neutral-200 text-neutral-800 px-1 py-0.5 rounded font-mono text-[10px]">[^1]: Reference text</code> at the bottom.
        </div>
      </div>

      <MDEditor
        value={value}
        onChange={(v: any) => onChange(v ?? '')}
        height={580}
        preview="live"
        visibleDragbar={false}
        textareaProps={{
          placeholder:
            'Write your article in Markdown…\n\n## Section Heading\n\nIn this constitutional analysis[^1], we examine fundamental rights.\n\n> Block quote here\n\n[^1]: Reference: Kesavananda Bharati v. State of Kerala (1973) 4 SCC 225.',
        }}
        style={{
          fontFamily: 'var(--font-source-serif), Georgia, serif',
          fontSize: '1rem',
        }}
      />
    </div>
  );
}
