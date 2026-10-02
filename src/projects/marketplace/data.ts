import {
  Activity,
  Banknote,
  Bell,
  LayoutGrid,
  Monitor,
  Package,
  RefreshCw,
  Server,
  Settings,
  ShieldCheck,
  TriangleAlert,
  Users,
  WifiOff,
} from 'lucide-react';
import { tech } from '../../data/tech';
import { l, type Text } from '../../i18n';
import type { FlowNodeData, Overview, Proof, StackGroup } from '../../types';

export const escrow: { inputs: FlowNodeData[]; caption: Text; outputs: FlowNodeData[] } = {
  inputs: [
    { icon: Users, title: l('Buyer', 'Покупець'), caption: l('tops up · pays', 'поповнює · платить') },
    { icon: Package, title: l('Seller', 'Продавець'), caption: l('ships the item', 'передає товар') },
  ],
  caption: l(
    'Debit and hold happen in one atomic operation — a balance check can never drift from the write. Confirm, expire, dispute, cancel and refund are separate paths, and money is never lost on any of them.',
    'Списання й блокування відбуваються однією атомарною операцією — перевірка балансу ніколи не розійдеться із записом. Підтвердження, спливання строку, спір, скасування й повернення — окремі шляхи, і на жодному з них гроші не губляться.',
  ),
  outputs: [
    { icon: Banknote, title: l('Released', 'Виплачено'), caption: l('seller − fee', 'продавцю − комісія') },
    { icon: TriangleAlert, title: l('Disputed', 'Спір'), caption: l('moderator decides', 'вирішує модератор') },
    { icon: RefreshCw, title: l('Refunded', 'Повернено'), caption: l('back to buyer', 'назад покупцю') },
  ],
};

export const reliability: Proof[] = [
  {
    icon: ShieldCheck,
    title: l('Signed webhooks', 'Підписані вебхуки'),
    text: l(
      'Every provider callback is verified by signature and applied idempotently — a repeat never credits twice.',
      'Кожен колбек провайдера перевіряється за підписом і застосовується ідемпотентно — повтор ніколи не зарахує гроші двічі.',
    ),
  },
  {
    icon: RefreshCw,
    title: l('Reconciliation', 'Звірка'),
    text: l(
      'Every 30 minutes the system hunts for stranded payments and checks them against the provider; nightly sweeps catch hung payouts.',
      'Кожні 30 хвилин система шукає завислі платежі та звіряє їх із провайдером; нічні проходи ловлять завислі виплати.',
    ),
  },
  {
    icon: WifiOff,
    title: l('Circuit breaker', 'Запобіжник'),
    text: l(
      'Five consecutive errors and the provider is cut off automatically, then retried five minutes later.',
      'Пʼять помилок поспіль — і провайдер автоматично відключається, а через пʼять хвилин система пробує знову.',
    ),
  },
  {
    icon: Bell,
    title: l('Balance alerts', 'Сповіщення про баланс'),
    text: l(
      'A low provider balance raises an alert in the panel, by e-mail and in Telegram at once.',
      'Низький баланс у провайдера одразу піднімає тривогу в панелі, на пошті й у Telegram.',
    ),
  },
];

/** Sample of the notification settings: [in-app, mobile, e-mail]. */
export const notificationEvents: { event: Text; channels: [boolean, boolean, boolean] }[] = [
  { event: l('Order paid', 'Замовлення оплачено'), channels: [true, true, true] },
  { event: l('Escrow released', 'Кошти виплачено'), channels: [true, true, true] },
  { event: l('Dispute opened', 'Відкрито спір'), channels: [true, true, true] },
  { event: l('New message', 'Нове повідомлення'), channels: [true, true, false] },
  { event: l('Review received', 'Отримано відгук'), channels: [true, false, false] },
  { event: l('Payout sent', 'Виплату надіслано'), channels: [true, true, true] },
  { event: l('Referral bonus', 'Реферальний бонус'), channels: [true, false, true] },
  { event: l('Listing removed', 'Оголошення знято'), channels: [true, true, false] },
];

export const overview: Overview = {
  period: l('2025—2026 · 5 months', '2025—2026 · 5 місяців'),
  title: l('Marketplace for game assets', 'Маркетплейс ігрових активів'),
  badge: l('3 apps · 95% of commits', '3 застосунки · 95% комітів'),
  summary: l(
    "Players buy and sell accounts, items, in-game currency and services. The platform keeps the buyer's money in escrow until delivery is confirmed, so neither side can cheat the other — with a wallet, provider top-ups and payouts, buyer–seller chat, reviews, seller verification, referrals, disputes and a 16-section admin panel behind it.",
    'Гравці купують і продають акаунти, предмети, ігрову валюту та послуги. Платформа тримає гроші покупця на ескроу, доки доставку не підтверджено, тож жодна сторона не може обдурити іншу. За цим стоять гаманець, поповнення й виплати через провайдерів, чат покупця з продавцем, відгуки, верифікація продавців, рефералка, спори та адмін-панель на 16 розділів.',
  ),
  stats: [
    { value: '3', label: l('applications', 'застосунки') },
    { value: '~95k', label: l('lines of TypeScript', 'рядків TypeScript') },
    { value: '230+', label: l('API endpoints', 'API-ендпоінтів') },
    { value: '95%', label: l('of 310+ commits', 'з 310+ комітів') },
  ],
  work: [
    {
      icon: Server,
      title: l('Backend — deals, money, chat', 'Бекенд — угоди, гроші, чат'),
      text: l(
        'Atomic debit-and-hold escrow with confirm, expiry, dispute, cancel and refund paths; wallet top-ups and payouts through crypto and card providers; signed idempotent webhooks with reconciliation and a circuit breaker; real-time chat with read receipts; 22 notification events across three channels; a product-type builder that lets admins define listing fields without a developer.',
        'Атомарне ескроу «списати й заблокувати» зі шляхами підтвердження, спливання, спору, скасування й повернення; поповнення гаманця й виплати через криптовалютних і карткових провайдерів; підписані ідемпотентні вебхуки зі звіркою та запобіжником; чат у реальному часі з позначками прочитання; 22 події сповіщень у трьох каналах; конструктор типів товарів, у якому адміни задають поля оголошень без розробника.',
      ),
      tags: ['NestJS 11', 'MongoDB', 'Socket.IO', 'JWT + Google', 'Swagger', 'Cron'],
      meta: l(
        '260 files · ~30k lines · 35 modules · 238 endpoints · 27 collections',
        '260 файлів · ~30k рядків · 35 модулів · 238 ендпоінтів · 27 колекцій',
      ),
    },
    {
      icon: Monitor,
      title: l('Storefront — the player-facing site', 'Вітрина — сайт для гравців'),
      text: l(
        'Catalog, game and listing pages, search across items, games and sellers, listing forms that rebuild themselves per product type, checkout and deal pages with auto-release timers, wallet with charts, live chats, public seller profiles with reviews and verification, referrals — plus readable URLs, 705 permanent redirects, a sitemap built from live data and two interface languages.',
        'Каталог, сторінки ігор і оголошень, пошук за товарами, іграми та продавцями, форми оголошень, що перебудовуються під тип товару, оформлення й сторінки угод з таймерами автовиплати, гаманець із графіками, живі чати, публічні профілі продавців з відгуками й верифікацією, рефералка — а також зрозумілі URL, 705 постійних редиректів, sitemap із живих даних і дві мови інтерфейсу.',
      ),
      tags: ['React 18', 'Vite', 'styled-components', 'Zustand', 'i18next', 'Framer Motion'],
      meta: l('207 files · ~48k lines · ~25 screens', '207 файлів · ~48k рядків · ~25 екранів'),
    },
    {
      icon: LayoutGrid,
      title: l('Admin panel — running the platform', 'Адмін-панель — керування платформою'),
      text: l(
        'Sixteen sections: users and finance with manual adjustments, products and the product-type field editor, drag-ordered games, categories and recommendations, deals and payments with provider health, webhook logs, manual status checks and a "needs attention" queue, complaints, reviews, seller verification, support chat and inbound e-mail answered straight from the panel.',
        'Шістнадцять розділів: користувачі й фінанси з ручними коригуваннями, товари та редактор полів типів товарів, ігри, категорії й рекомендації з сортуванням перетягуванням, угоди й платежі зі станом провайдерів, логи вебхуків, ручні перевірки статусу й черга «потребує уваги», скарги, відгуки, верифікація продавців, чат підтримки та вхідна пошта з відповідями прямо з панелі.',
      ),
      tags: ['React 19', 'MUI DataGrid', 'dnd-kit', 'Quill'],
      meta: l('78 files · ~17k lines · 16 sections', '78 файлів · ~17k рядків · 16 розділів'),
    },
  ],
  footnote: l(
    'All figures counted on my version of the code — later work by another developer is not included.',
    'Усі цифри пораховано на моїй версії коду — пізніша робота іншого розробника не врахована.',
  ),
};

export const proofs: Proof[] = [
  {
    icon: Banknote,
    title: l('Money logic', 'Логіка грошей'),
    text: l(
      'Escrow, commissions, refunds and manual adjustments — written so that no path can lose or double-count a balance.',
      'Ескроу, комісії, повернення й ручні коригування — написані так, що жоден шлях не може втратити чи двічі врахувати баланс.',
    ),
  },
  {
    icon: Activity,
    title: l('Fintech-grade integrations', 'Інтеграції фінтех-рівня'),
    text: l(
      'Signatures, idempotency, scheduled reconciliation and automatic provider cut-off around third-party payment APIs.',
      'Підписи, ідемпотентність, звірка за розкладом і автоматичне відключення провайдера навколо сторонніх платіжних API.',
    ),
  },
  {
    icon: Settings,
    title: l('Configurable product', 'Продукт, що налаштовується'),
    text: l(
      'A product-type builder and referral rules that admins change in the panel instead of filing a ticket.',
      'Конструктор типів товарів і реферальні правила, які адміни змінюють у панелі, а не через тікет розробникам.',
    ),
  },
  {
    icon: Users,
    title: l('Product thinking', 'Продуктове мислення'),
    text: l(
      'Readable URLs, 705 redirects without losing rankings, a live sitemap, analytics on the events that matter.',
      'Зрозумілі URL, 705 редиректів без втрати позицій, живий sitemap, аналітика подій, які мають значення.',
    ),
  },
];

export const stack: StackGroup[] = [
  {
    title: l('Frontend', 'Фронтенд'),
    items: [
      tech('typescript'),
      tech('react', 'React 18 / 19'),
      tech('vite'),
      'styled-components',
      'Zustand',
      'MUI DataGrid',
      tech('framer'),
      tech('i18next'),
    ],
  },
  {
    title: l('Backend & data', 'Бекенд і дані'),
    items: [
      tech('nestjs', 'NestJS 11'),
      tech('mongodb'),
      tech('mongoose'),
      tech('jwt', 'JWT + Google auth'),
      tech('swagger'),
      l('Scheduled jobs', 'Задачі за розкладом'),
    ],
  },
  {
    title: l('Realtime & payments', 'Реальний час і платежі'),
    items: [tech('socketio'), l('Signed webhooks', 'Підписані вебхуки'), l('Idempotent ledger', 'Ідемпотентний реєстр'), l('Circuit breaker', 'Запобіжник'), l('Reconciliation jobs', 'Задачі звірки')],
  },
  {
    title: l('Delivery & growth', 'Доставка й зростання'),
    items: [tech('telegramBot'), l('Transactional e-mail', 'Транзакційна пошта'), l('S3 storage + CDN', 'Сховище S3 + CDN'), l('705 SEO redirects', '705 SEO-редиректів'), l('Live sitemap', 'Живий sitemap')],
  },
];
