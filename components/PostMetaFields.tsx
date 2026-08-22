'use client';
// components/PostMetaFields.tsx
// Metadata input fields matching exact home page serif typography and rounded design

interface Meta {
  title:       string;
  slug:        string;
  excerpt:     string;
  authorName?: string;
  authorBio?:  string;
  tags:        string;
  status:      string;
  date:        string;
}

interface Props {
  meta: Meta;
  onChange: (updated: Partial<Meta>) => void;
}

const inputClass = `w-full border border-neutral-300 rounded-lg px-4 py-2.5 font-serif text-sm
                    text-[#1A1A1A] bg-white focus:outline-none focus:border-black shadow-sm`;

const labelClass = 'block font-serif text-xs font-bold uppercase tracking-widest text-black mb-1.5';

export default function PostMetaFields({ meta, onChange }: Props) {
  function handleTitleChange(title: string) {
    const updates: Partial<Meta> = { title };
    if (!meta.slug || meta.slug === slugify(meta.title)) {
      updates.slug = slugify(title);
    }
    onChange(updates);
  }

  return (
    <div className="grid grid-cols-1 gap-5 font-serif">
      {/* Title */}
      <div>
        <label htmlFor="meta-title" className={labelClass}>
          ARTICLE TITLE <span className="text-black">*</span>
        </label>
        <input
          id="meta-title"
          type="text"
          value={meta.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className={`${inputClass} text-lg font-bold`}
          placeholder="Enter headline..."
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="meta-slug" className={labelClass}>
          URL SLUG <span className="text-black">*</span>
          <span className="text-neutral-400 font-normal lowercase ml-2">— /posts/<strong>{meta.slug || 'your-slug'}</strong></span>
        </label>
        <input
          id="meta-slug"
          type="text"
          value={meta.slug}
          onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
          required
          className={inputClass}
          placeholder="url-friendly-slug"
        />
      </div>

      {/* Author Name + Author Bio (For Guest Contributors & Co-Authors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="meta-authorName" className={labelClass}>
            AUTHOR NAME <span className="text-neutral-400 font-normal text-[10px] lowercase">(default: Author Name)</span>
          </label>
          <input
            id="meta-authorName"
            type="text"
            value={meta.authorName || ''}
            onChange={(e) => onChange({ authorName: e.target.value })}
            className={inputClass}
            placeholder="e.g. Arjun Sharma or Guest Author"
          />
        </div>

        <div>
          <label htmlFor="meta-authorBio" className={labelClass}>
            AUTHOR AFFILIATION / BYLINE <span className="text-neutral-400 font-normal text-[10px] lowercase">(optional top note)</span>
          </label>
          <input
            id="meta-authorBio"
            type="text"
            value={meta.authorBio || ''}
            onChange={(e) => onChange({ authorBio: e.target.value })}
            className={inputClass}
            placeholder="e.g. Research Fellow at NUS Law"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="meta-excerpt" className={labelClass}>
          EXCERPT / SUBTITLE <span className="text-neutral-400 font-normal text-[10px] lowercase">(one line summary for homepage stream)</span>
        </label>
        <input
          id="meta-excerpt"
          type="text"
          value={meta.excerpt}
          onChange={(e) => onChange({ excerpt: e.target.value })}
          maxLength={200}
          className={inputClass}
          placeholder="One line summary for the article listing..."
        />
      </div>

      {/* Tags + Status + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="meta-tags" className={labelClass}>
            CATEGORIES / TAGS <span className="text-neutral-400 font-normal text-[10px] lowercase">(comma separated)</span>
          </label>
          <input
            id="meta-tags"
            type="text"
            value={meta.tags}
            onChange={(e) => onChange({ tags: e.target.value })}
            className={inputClass}
            placeholder="ESSAYS, COMMENTARY, COURTS"
          />
        </div>

        <div>
          <label htmlFor="meta-status" className={labelClass}>STATUS</label>
          <select
            id="meta-status"
            value={meta.status}
            onChange={(e) => onChange({ status: e.target.value })}
            className={inputClass}
          >
            <option value="draft">DRAFT</option>
            <option value="published">PUBLISHED</option>
          </select>
        </div>

        <div>
          <label htmlFor="meta-date" className={labelClass}>PUBLICATION DATE</label>
          <input
            id="meta-date"
            type="date"
            value={meta.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
