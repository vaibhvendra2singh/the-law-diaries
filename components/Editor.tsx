'use client';
// components/Editor.tsx
// Split-pane markdown editor: left = write, right = live preview.
// Uses @uiw/react-md-editor for the editor UI.
// Supports GFM footnote syntax: [^1] renders as numbered references.

import dynamic from 'next/dynamic';
import type { FC } from 'react';

// ── Inline prop types so the component is typed before the package installs ──
interface MDEditorProps {
  value?: string;
  onChange?: (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
  height?: number;
  preview?: 'edit' | 'live' | 'preview';
  visibleDragbar?: boolean;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  style?: React.CSSProperties;
}

// Dynamically imported to avoid SSR issues (editor is browser-only)
const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then((mod) => mod.default as FC<MDEditorProps>),
  { ssr: false }
);

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: Props) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        height={580}
        preview="live"
        visibleDragbar={false}
        textareaProps={{
          placeholder:
            'Write your article in Markdown…\n\n## Section heading\n\nParagraph text.\n\n> Block quote\n\nFootnote reference[^1]\n\n[^1]: Footnote text appears at the bottom of the article.',
        }}
        style={{
          fontFamily: 'var(--font-source-serif), Georgia, serif',
          fontSize: '1rem',
        }}
      />
    </div>
  );
}
