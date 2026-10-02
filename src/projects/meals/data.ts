import { Calculator, Clock, Languages, LayoutGrid, Monitor, RefreshCw, Server, Users } from 'lucide-react';
import { tag, tech } from '../../data/tech';
import { l, type Text } from '../../i18n';
import type { Overview, Proof, StackGroup } from '../../types';

export const overview: Overview = {
  period: l('2026 · 7 months', '2026 · 7 місяців'),
  title: l('Meal subscription service', 'Сервіс харчування за підпискою'),
  badge: l('Two engineers · subscriptions and billing mine', 'Двоє розробників · підписки й оплата — мої'),
  summary: l(
    'A client picks a plan, delivery days and a term, pays by card — and food arrives on schedule every week, with an optional weekend set riding along. Orders walk from review through the kitchen to a courier at the door, while the client pauses the subscription, swaps the plan or changes address and card from their account.',
    'Клієнт обирає план, дні доставки й строк, платить карткою — і щотижня отримує їжу за розкладом, за бажанням ще й набір на вихідні. Замовлення проходить шлях від перевірки через кухню до курʼєра біля дверей, а клієнт тим часом ставить підписку на паузу, змінює план, адресу чи картку в особистому кабінеті.',
  ),
  stats: [
    { value: '3', label: l('applications', 'застосунки') },
    { value: '~62k', label: l('lines of TypeScript', 'рядків TypeScript') },
    { value: '118', label: l('API endpoints', 'API-ендпоінтів') },
    { value: '69%', label: l('of 350 commits', 'з 350 комітів') },
  ],
  work: [
    {
      icon: Server,
      title: l('Backend — subscriptions, money, schedule', 'Бекенд — підписки, гроші, розклад'),
      text: l(
        'Subscriptions with deferred changes, one price formula for day, week and month, renewals charged to a saved card every cycle, login by one-time SMS code, order and delivery stages with a full history, and five scheduled jobs that unstick whatever hangs.',
        'Підписки з відкладеними змінами, одна формула ціни для дня, тижня й місяця, продовження зі збереженої картки щоциклу, вхід за одноразовим SMS-кодом, етапи замовлення й доставки з повною історією та пʼять задач за розкладом, які розблоковують усе, що зависло.',
      ),
      tags: [tag('nestjs', 'NestJS 11'), tag('mongodb'), tag('socketio'), l('Card payments', 'Оплата карткою'), tag('swagger'), 'Cron'],
      meta: l(
        '151 files · ~18k lines · 20 modules · 118 endpoints · 22 collections',
        '151 файл · ~18k рядків · 20 модулів · 118 ендпоінтів · 22 колекції',
      ),
    },
    {
      icon: Monitor,
      title: l('Storefront — plan, checkout, account', 'Вітрина — план, оплата, кабінет'),
      text: l(
        '23 screens: a plan builder that prices itself as you pick days and term, checkout with a saved card, and an account where the client pauses, swaps the plan, edits address and card, and reads the delivery calendar — in four languages, one of them right-to-left.',
        '23 екрани: конструктор плану, що рахує ціну, поки обираєш дні й строк, оформлення зі збереженою карткою і кабінет, де клієнт ставить паузу, змінює план, редагує адресу й картку та дивиться календар доставок — чотирма мовами, одна з яких пишеться справа наліво.',
      ),
      tags: [tag('react', 'React 19'), tag('vite'), tag('tailwind', 'Tailwind 4'), tag('framer'), tag('socketio')],
      meta: l('129 files · ~31k lines · 23 screens', '129 файлів · ~31k рядків · 23 екрани'),
    },
    {
      icon: LayoutGrid,
      title: l('Admin panel — orders, plans, content', 'Адмін-панель — замовлення, плани, контент'),
      text: l(
        'Dashboard with charts, orders moving through kitchen and delivery stages, plans and weekly menus, users and staff, transactions, reviews, news and videos — of the 18 sections these are the ones I built.',
        'Дашборд із графіками, замовлення на етапах кухні й доставки, плани й тижневі меню, користувачі й персонал, транзакції, відгуки, новини й відео — з 18 розділів саме ці зробив я.',
      ),
      tags: [tag('react', 'React 19'), tag('antdesign'), 'Zustand', tag('socketio')],
      meta: l('49 files · ~13k lines · 18 sections', '49 файлів · ~13k рядків · 18 розділів'),
    },
    {
      icon: Users,
      title: l("Support, roles and promo codes — colleague's work", 'Підтримка, ролі й промокоди — робота колеги'),
      text: l(
        'Tickets with a live queue, roles and permissions, promo codes, partnership and contact forms were written by the other engineer on the project, across all three applications.',
        'Тікети з живою чергою, ролі й права, промокоди, форми партнерства й контактів написав другий розробник проєкту — в усіх трьох застосунках.',
      ),
      external: true,
    },
  ],
  footnote: l('Figures cover the whole codebase; 241 of the 350 commits are mine.', 'Цифри охоплюють увесь код; 241 із 350 комітів — мої.'),
};

export const proofs: Proof[] = [
  {
    icon: RefreshCw,
    title: l('Money that repeats', 'Гроші, що повторюються'),
    text: l(
      'Saved cards, a charge every cycle, refunds — and a job that rescues any subscription the payment provider left hanging.',
      'Збережені картки, списання щоциклу, повернення — і задача, яка рятує будь-яку підписку, що її платіжний провайдер залишив у підвішеному стані.',
    ),
  },
  {
    icon: Calculator,
    title: l('One price, one formula', 'Одна ціна, одна формула'),
    text: l(
      'Day, week and month prices, plan discounts and add-on rules live on the server; the screen only shows what the server has just recalculated.',
      'Ціни за день, тиждень і місяць, знижки планів і правила доповнень живуть на сервері; екран лише показує те, що сервер щойно перерахував.',
    ),
  },
  {
    icon: Clock,
    title: l('Changes that wait their turn', 'Зміни, що чекають своєї черги'),
    text: l(
      'Pause, plan swap, address and card changes take effect from the next cycle, so a week the client already paid for never changes under them.',
      'Пауза, зміна плану, адреси чи картки набувають чинності з наступного циклу, тож уже оплачений тиждень ніколи не змінюється в клієнта під ногами.',
    ),
  },
  {
    icon: Languages,
    title: l('Four languages, one mirrored', 'Чотири мови, одна дзеркальна'),
    text: l(
      'Hebrew flips the whole layout — direction, order, arrows and spacing — not just the strings.',
      'Іврит перевертає весь інтерфейс — напрям, порядок, стрілки й відступи, — а не лише рядки тексту.',
    ),
  },
];

/** The delivery week a client assembles: three delivery days plus the weekend set. */
export const week: { day: Text; kind: 'delivery' | 'rest' | 'addon' }[] = [
  { day: l('Mon', 'Пн'), kind: 'delivery' },
  { day: l('Tue', 'Вт'), kind: 'delivery' },
  { day: l('Wed', 'Ср'), kind: 'rest' },
  { day: l('Thu', 'Чт'), kind: 'delivery' },
  { day: l('Fri', 'Пт'), kind: 'rest' },
  { day: l('Sat', 'Сб'), kind: 'addon' },
  { day: l('Sun', 'Нд'), kind: 'rest' },
];

export const bill = [
  { label: l('Plan · 3 days × 4 weeks', 'План · 3 дні × 4 тижні'), value: '◈ 1 120' },
  { label: l('Weekend set', 'Набір на вихідні'), value: '◈ 160' },
  { label: l('Promo · −10%', 'Промокод · −10%'), value: '−◈ 128', accent: true },
];

export const billTotal = { label: l('Total', 'Разом'), value: '◈ 1 152' };

export type Stage = { label: Text; state: 'done' | 'current' | 'pending' };

export const orderStages: Stage[] = [
  { label: l('review', 'перевірка'), state: 'done' },
  { label: l('in work', 'в роботі'), state: 'done' },
  { label: l('kitchen', 'кухня'), state: 'done' },
  { label: l('confirmed', 'підтверджено'), state: 'done' },
  { label: l('closed', 'закрито'), state: 'done' },
];

export const deliveryStages: Stage[] = [
  { label: l('packed', 'зібрано'), state: 'done' },
  { label: l('courier', 'курʼєр'), state: 'current' },
  { label: l('delivered', 'доставлено'), state: 'pending' },
];

export const history = [
  { time: '09:40', event: l('taken into work', 'взято в роботу'), who: l('operator', 'оператор') },
  { time: '11:05', event: l('sent to the kitchen', 'передано на кухню'), who: l('operator', 'оператор') },
  { time: '12:30', event: l('kitchen confirmed', 'кухня підтвердила'), who: l('kitchen', 'кухня') },
  { time: '17:40', event: l('handed to the courier', 'передано курʼєру'), who: l('courier', 'курʼєр') },
];

export const jobs = [
  { every: l('1 min', '1 хв'), does: l('moves expired subscriptions to the status they belong in', 'переводить прострочені підписки в потрібний статус') },
  { every: l('5 min', '5 хв'), does: l('cancels orders that were never paid', 'скасовує замовлення, які так і не оплатили') },
  { every: l('10 min', '10 хв'), does: l('revives subscriptions stuck half-way through a renewal', 'відновлює підписки, що застрягли посеред продовження') },
  { every: l('30 min', '30 хв'), does: l('charges saved cards for the next cycle', 'списує зі збережених карток за наступний цикл') },
  {
    every: l('daily', 'щодня'),
    does: l(
      "sends the morning reminders: delivery tomorrow, add-on cut-off, upcoming charge, next week's menu",
      'надсилає ранкові нагадування: доставка завтра, дедлайн доповнення, найближче списання, меню на наступний тиждень',
    ),
  },
];

export const stack: StackGroup[] = [
  {
    title: l('Frontend', 'Фронтенд'),
    items: [
      tech('typescript'),
      tech('react', 'React 19'),
      tech('vite'),
      tech('tailwind', 'Tailwind 4'),
      tech('framer'),
      tech('antdesign'),
      'Zustand',
    ],
  },
  {
    title: l('Backend & data', 'Бекенд і дані'),
    items: [tech('nestjs', 'NestJS 11'), tech('mongodb'), tech('swagger'), l('Scheduled jobs', 'Задачі за розкладом')],
  },
  {
    title: l('Payments & realtime', 'Платежі й реальний час'),
    items: [tech('socketio'), l('Card payments', 'Оплата карткою'), l('Saved cards', 'Збережені картки'), l('Signed webhooks', 'Підписані вебхуки'), l('SMS one-time codes', 'Одноразові SMS-коди')],
  },
  {
    title: l('Delivery & reach', 'Доставка й охоплення'),
    items: [l('E-mail reminders', 'Нагадування поштою'), l('Object storage', 'Обʼєктне сховище'), l('Four languages', 'Чотири мови'), l('RTL layout', 'RTL-макет')],
  },
];
