import { l } from '../i18n';
import { brand } from './brands';

export const links = {
  telegram: 'https://t.me/zazplay',
  github: 'https://github.com/zazplay',
  linkedin: 'https://www.linkedin.com/in/viktor-zhuk-fullstack/',
};

export const profile = {
  name: l('Viktor Zhuk', 'Віктор Жук'),
  role: l('Full-stack engineer · TypeScript · React + NestJS', 'Full-stack розробник · TypeScript · React + NestJS'),
  location: l(
    'Spain · EU work permit · open to remote',
    'Іспанія · дозвіл на роботу в ЄС · відкритий до віддаленої роботи',
  ),
  email: 'zazplay3881@gmail.com',
  /**
   * Served from public/; clear this to hide the download buttons. Relative to the site's base,
   * since GitHub Pages serves it from /viktor-zhuk/ rather than the domain root.
   */
  cv: `${import.meta.env.BASE_URL}Viktor_Zhuk_CV.pdf`,
  /** Name the browser saves the CV under, also when it is embedded in the single-file build. */
  cvName: 'Viktor_Zhuk_CV.pdf',
  intro: l(
    'Full-stack engineer, TypeScript end to end. Four production systems in the last three years: a self-service payment platform, a smart equipment locker, an escrow marketplace and a meal subscription service — each from an empty repository to real users and real money. Kiosk UIs, hardware integration, payment providers, recurring billing, cloud services and the consoles that operate them. Open to full-stack and architecture roles.',
    'Full-stack розробник, TypeScript на всіх рівнях. Чотири продакшн-системи за останні три роки: платіжна платформа самообслуговування, розумна шафа для видачі обладнання, маркетплейс з ескроу та сервіс харчування за підпискою — кожна від порожнього репозиторію до реальних користувачів і реальних грошей. Інтерфейси кіосків, інтеграція з обладнанням, платіжні провайдери, рекурентні платежі, хмарні сервіси та консолі для керування ними. Розглядаю full-stack та архітектурні ролі.',
  ),
};

/** The single-file build links the CV on the live site; open that in a new tab instead of leaving the page. */
export const cvLinkAttrs = /^https?:/.test(profile.cv) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

export const socials = [
  { id: 'telegram', label: 'Telegram', href: links.telegram, brand: brand.telegram },
  { id: 'github', label: 'GitHub', href: links.github, brand: brand.github },
  { id: 'linkedin', label: 'LinkedIn', href: links.linkedin, brand: brand.linkedin },
] as const;
