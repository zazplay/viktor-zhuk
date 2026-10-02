import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'uk';

export const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'uk', label: 'UA', name: 'Українська' },
];

/**
 * A piece of copy. Names, numbers and technologies read the same in both languages and stay
 * plain strings; everything else carries both versions side by side, so a translation sits
 * right next to the text it translates.
 */
export type Text = string | { en: string; uk: string };

export const l = (en: string, uk: string): Text => ({ en, uk });

/** Stable React key for a piece of copy, whatever language is showing. */
export const keyOf = (text: Text): string => (typeof text === 'string' ? text : text.en);

const isLang = (value: unknown): value is Lang => value === 'en' || value === 'uk';

/** A shared link wins, then the visitor's last choice, then the browser's language. */
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem('lang');
    if (isLang(saved)) return saved;
  } catch {
    // storage blocked: fall through to the browser language
  }
  return navigator.language.toLowerCase().startsWith('uk') ? 'uk' : 'en';
}

const TITLES: Record<Lang, string> = {
  en: 'Viktor Zhuk — Full-stack engineer',
  uk: 'Віктор Жук — Full-stack розробник',
};

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void } | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // not remembered, still works
    }
    try {
      const url = new URL(window.location.href);
      if (lang === 'en') url.searchParams.delete('lang');
      else url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url);
    } catch {
      // some contexts (a page opened as a local file) refuse URL rewrites; the language still applies
    }
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used inside LangProvider');
  const { lang, setLang } = context;
  const t = useCallback((text: Text) => (typeof text === 'string' ? text : text[lang]), [lang]);
  return { lang, setLang, t };
}
