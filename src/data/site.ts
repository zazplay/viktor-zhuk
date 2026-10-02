import data from './site.json';
import marketCatalog from '../assets/market-1-catalog.jpg';
import marketGame from '../assets/market-2-game.jpg';
import marketListing from '../assets/market-3-listing.jpg';
import marketWallet from '../assets/market-4-wallet.jpg';
import mealHome from '../assets/meal-1-home.jpg';
import mealPlan from '../assets/meal-2-plan.jpg';
import mealSummary from '../assets/meal-3-summary.jpg';
import payAdmin from '../assets/pay-admin.jpg';
import { l, type Text } from '../i18n';

/** A simple-icons mark: one path on a 24×24 viewBox, plus its brand colour. */
export type BrandIcon = { path: string; hex: string };

export type ProjectId = 'pay' | 'locker' | 'market' | 'meal';

export type Project = {
  id: ProjectId;
  period: Text;
  title: Text;
  badge: Text;
  summary: Text;
  footnote?: Text | null;
  stats: { value: string; label: Text }[];
  work: { title: Text; text: Text }[];
  proofs: { title: Text; text: Text }[];
  stack: { title: Text; items: { label: Text; icon?: string | null }[] }[];
};

type Site = {
  profile: {
    name: Text;
    role: Text;
    location: Text;
    intro: Text;
    email: string;
    cvName: string;
    telegram: string;
    github: string;
    linkedin: string;
  };
  cta: { title: Text; subtitle: Text; email: Text; cv: Text };
  nda: Text;
  jobs: { role: Text; company: Text; period: Text; summary: Text; points: Text[] }[];
  edu: { title: Text; place: Text; period: Text }[];
  skills: { title: Text; items: Text }[];
  projects: Project[];
  icons: Record<string, BrandIcon>;
};

const site = data as Site;

export const { cta, nda, jobs, edu, skills, projects, icons } = site;

export const profile = {
  ...site.profile,
  /**
   * Served from public/; clear this to hide the download buttons. Relative to the site's base,
   * since GitHub Pages serves it from /viktor-zhuk/ rather than the domain root.
   */
  cv: `${import.meta.env.BASE_URL}Viktor_Zhuk_CV.pdf`,
};

/** The single-file build links the CV on the live site; open that in a new tab instead of leaving the page. */
export const cvLinkAttrs = /^https?:/.test(profile.cv) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

export const socials = [
  { label: 'Telegram', href: profile.telegram, icon: icons.telegram },
  { label: 'GitHub', href: profile.github, icon: icons.github },
  { label: 'LinkedIn', href: profile.linkedin, icon: icons.linkedin },
];

export const totals = [
  { value: '10+', label: l('projects in three years', 'проєктів за три роки') },
  { value: '~264k', label: l('lines of TypeScript', 'рядків TypeScript') },
  { value: '740+', label: l('API endpoints', 'API-ендпоінтів') },
  { value: '3', label: l('years, end to end', 'роки, від і до') },
];

export type Screenshot = { src: string; caption: Text; ratio?: string };

/** Screenshots under a project, after its 3D model if it has one. */
export const screenshots: Partial<Record<ProjectId, Screenshot[]>> = {
  pay: [
    {
      src: payAdmin,
      caption: l('Admin panel — cash by denomination and box, live alerts, logs and transactions', 'Адмін-панель — готівка за номіналами й боксами, живі сповіщення, логи й транзакції'),
      ratio: '1584 / 992',
    },
  ],
  market: [
    { src: marketCatalog, caption: l('Storefront — catalog of games and services', 'Вітрина — каталог ігор і послуг') },
    { src: marketGame, caption: l('Game page — listings, filters and search', 'Сторінка гри — оголошення, фільтри й пошук') },
    { src: marketListing, caption: l('Listing page — price and purchase', 'Сторінка товару — ціна й купівля') },
    { src: marketWallet, caption: l('Wallet — balance, cash flow, top-ups and payouts', 'Гаманець — баланс, грошовий потік, поповнення й виведення') },
  ],
  meal: [
    { src: mealHome, caption: l('Landing page', 'Головна сторінка') },
    { src: mealPlan, caption: l('Plan builder — price updates as you pick', 'Конструктор плану — ціна рахується під час вибору') },
    { src: mealSummary, caption: l('Order summary before checkout', 'Зведення замовлення перед оплатою') },
  ],
};
