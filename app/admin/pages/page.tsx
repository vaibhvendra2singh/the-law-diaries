'use client';

// app/admin/pages/page.tsx — Admin page manager for About Us, Contact, and Author/Brand Settings

import { useState, useEffect } from 'react';

export default function AdminPagesManager() {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'settings'>('settings');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState('');

  // Settings form state
  const [authorName, setAuthorName]       = useState('');
  const [authorTagline, setAuthorTagline] = useState('');
  const [siteName, setSiteName]           = useState('The Law Diaries');

  // About form state
  const [aboutTitle, setAboutTitle]       = useState('');
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutContent, setAboutContent]   = useState('');

  // Contact form state
  const [contactTitle, setContactTitle]       = useState('');
  const [contactSubtitle, setContactSubtitle] = useState('');
  const [contactEmail, setContactEmail]       = useState('');
  const [contactPhone, setContactPhone]       = useState('');

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setAuthorName(data.settings.authorName || '');
          setAuthorTagline(data.settings.authorTagline || '');
          setSiteName(data.settings.siteName || 'The Law Diaries');
        }
        if (data.about) {
          setAboutTitle(data.about.title || '');
          setAboutSubtitle(data.about.subtitle || '');
          setAboutContent(data.about.content || '');
        }
        if (data.contact) {
          setContactTitle(data.contact.title || '');
          setContactSubtitle(data.contact.subtitle || '');
          setContactEmail(data.contact.email || '');
          setContactPhone(data.contact.phone || '');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey: 'settings',
          data: {
            authorName,
            authorTagline,
            siteName,
          },
        }),
      });

      if (res.ok) {
        setMessage('Author & Brand settings updated successfully! ✓');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAbout(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey: 'about',
          data: {
            title: aboutTitle,
            subtitle: aboutSubtitle,
            content: aboutContent,
          },
        }),
      });

      if (res.ok) {
        setMessage('About Us page updated successfully! ✓');
      } else {
        setMessage('Failed to save changes.');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey: 'contact',
          data: {
            title: contactTitle,
            subtitle: contactSubtitle,
            email: contactEmail,
            phone: contactPhone,
          },
        }),
      });

      if (res.ok) {
        setMessage('Contact Us page updated successfully! ✓');
      } else {
        setMessage('Failed to save changes.');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center font-serif text-sm text-neutral-500 italic">
        Loading settings manager…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 font-serif">

      {/* Top Center Pill Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-block border border-black text-black px-5 py-1.5 rounded-full font-serif text-sm font-medium tracking-wide">
          Page & Brand Manager
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8 pb-6 border-b border-neutral-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
          Site & Author Manager
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Update author profile names, publication branding, and static page text.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => { setActiveTab('settings'); setMessage(''); }}
          className={`px-5 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'bg-black text-white'
              : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black'
          }`}
        >
          Author & Brand Settings
        </button>

        <button
          onClick={() => { setActiveTab('about'); setMessage(''); }}
          className={`px-5 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
            activeTab === 'about'
              ? 'bg-black text-white'
              : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black'
          }`}
        >
          About Us Page
        </button>

        <button
          onClick={() => { setActiveTab('contact'); setMessage(''); }}
          className={`px-5 py-2 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors ${
            activeTab === 'contact'
              ? 'bg-black text-white'
              : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black'
          }`}
        >
          Contact Page
        </button>
      </div>

      {/* Success/Status Message */}
      {message && (
        <div className="mb-6 p-4 border border-black bg-neutral-50 rounded-xl font-serif text-sm text-black font-semibold text-center shadow-sm">
          {message}
        </div>
      )}

      {/* AUTHOR & BRAND SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 bg-white p-6 border border-neutral-200 rounded-2xl shadow-sm">
          <div>
            <label htmlFor="settings-authorName" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Default Author / Owner Name <span className="text-black">*</span>
            </label>
            <input
              id="settings-authorName"
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-base font-bold text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. Arjun Sharma or Law Firm Name"
            />
            <p className="text-xs text-neutral-500 mt-1">This default author name will be used across new posts and citations.</p>
          </div>

          <div>
            <label htmlFor="settings-authorTagline" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Author Tagline / Academic Title
            </label>
            <input
              id="settings-authorTagline"
              type="text"
              value={authorTagline}
              onChange={(e) => setAuthorTagline(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. Advocate, Supreme Court of India or Senior Partner"
            />
          </div>

          <div>
            <label htmlFor="settings-siteName" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Publication Name
            </label>
            <input
              id="settings-siteName"
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. The Law Diaries"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              {saving ? 'Saving Settings…' : 'Save Author & Brand Settings'}
            </button>
          </div>
        </form>
      )}

      {/* ABOUT US TAB */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="space-y-6 bg-white p-6 border border-neutral-200 rounded-2xl shadow-sm">
          <div>
            <label htmlFor="about-title" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Page Heading
            </label>
            <input
              id="about-title"
              type="text"
              required
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-base font-bold text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. Arjun Sharma"
            />
          </div>

          <div>
            <label htmlFor="about-subtitle" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Subtitle / Tagline
            </label>
            <input
              id="about-subtitle"
              type="text"
              value={aboutSubtitle}
              onChange={(e) => setAboutSubtitle(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. Senior Advocate, Delhi High Court..."
            />
          </div>

          <div>
            <label htmlFor="about-content" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Biography & Description (Markdown Supported)
            </label>
            <textarea
              id="about-content"
              required
              rows={10}
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-base text-[#1A1A1A] leading-relaxed focus:outline-none focus:border-black shadow-sm resize-vertical"
              placeholder="Write author biography..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              {saving ? 'Saving Changes…' : 'Save About Us Page'}
            </button>
          </div>
        </form>
      )}

      {/* CONTACT TAB */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="space-y-6 bg-white p-6 border border-neutral-200 rounded-2xl shadow-sm">
          <div>
            <label htmlFor="contact-title" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Page Heading
            </label>
            <input
              id="contact-title"
              type="text"
              required
              value={contactTitle}
              onChange={(e) => setContactTitle(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-base font-bold text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. Get in Touch"
            />
          </div>

          <div>
            <label htmlFor="contact-subtitle" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Subtitle Text
            </label>
            <input
              id="contact-subtitle"
              type="text"
              value={contactSubtitle}
              onChange={(e) => setContactSubtitle(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. If you have questions or submission inquiries..."
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Contact Email Address (Shown at bottom of contact page)
            </label>
            <input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. contact@yourfirm.com"
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
              Phone Number <span className="text-neutral-400 font-normal lowercase">(optional — leave blank to hide)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-black shadow-sm"
              placeholder="e.g. +91 98765 43210"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              {saving ? 'Saving Changes…' : 'Save Contact Page'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
