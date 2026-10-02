import {
  Banknote,
  Cpu,
  CreditCard,
  Database,
  LayoutGrid,
  Monitor,
  Package,
  Printer,
  QrCode,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { tag, tech } from '../../data/tech';
import { l, type Text } from '../../i18n';
import type { Overview, Proof, StackGroup, Stat } from '../../types';

export const overview: Overview = {
  period: '2025 — 2026',
  title: l('Self-service payment platform', 'Платіжна платформа самообслуговування'),
  badge: l('Sole engineer · architecture to delivery', 'Єдиний розробник · від архітектури до запуску'),
  summary: l(
    'A floor-standing kiosk takes cash, bank cards and QR-coded documents; operators run the whole fleet from a web console. I designed the architecture and wrote four applications — kiosk UI, on-board hardware server, cloud core and the operator console — 91% of 840+ commits over nine months.',
    'Підлоговий кіоск приймає готівку, банківські картки й документи з QR-кодом; оператори керують усім парком через вебконсоль. Я спроєктував архітектуру й написав чотири застосунки — інтерфейс кіоску, бортовий сервер обладнання, хмарне ядро та консоль оператора, — 91% із 840+ комітів за девʼять місяців.',
  ),
  stats: [
    { value: '4', label: l('applications', 'застосунки') },
    { value: '~79k', label: l('lines of TS', 'рядків TS') },
    { value: '300+', label: l('API endpoints', 'API-ендпоінтів') },
    { value: '91%', label: l('of 840+ commits', 'з 840+ комітів') },
  ],
  work: [
    {
      icon: Monitor,
      title: l('Kiosk interface', 'Інтерфейс кіоску'),
      text: l(
        'Ten screens of the payment flow, animated transitions, live status. Only the payment methods whose hardware is currently available.',
        'Десять екранів платіжного сценарію, анімовані переходи, живий статус. Показуються лише ті способи оплати, обладнання для яких зараз доступне.',
      ),
      tags: [tag('react', 'React 19'), tag('vite'), tag('framer'), tag('socketio')],
      meta: l('42 files · ~4.9k lines', '42 файли · ~4.9k рядків'),
    },
    {
      icon: Cpu,
      title: l('On-board hardware server', 'Бортовий сервер обладнання'),
      text: l(
        'Payment flow as a state machine; own binary TCP protocol for the bank terminal — sale, refund, shift close, recovery after a dropped link. Cash intake, change, collection, cassette reset, safe.',
        'Платіжний сценарій як скінченний автомат; власний бінарний TCP-протокол для банківського термінала — продаж, повернення, закриття зміни, відновлення після обриву звʼязку. Прийом готівки, решта, інкасація, обнулення касет, сейф.',
      ),
      tags: [tag('nestjs'), tag('socketio'), 'TCP', tag('swagger')],
      meta: l('55 files · ~9.6k lines · 68 endpoints', '55 файлів · ~9.6k рядків · 68 ендпоінтів'),
    },
    {
      icon: Database,
      title: l('Operational core — one codebase, two modes', 'Операційне ядро — один код, два режими'),
      text: l(
        'On the kiosk it runs offline against a local database; in the cloud it collects from the whole fleet. Scheduled full and incremental sync with time zones, retries and a journal; alerts, receipts, auto shift close, audit of every action.',
        'На кіоску працює офлайн із локальною базою; у хмарі збирає дані з усього парку. Повна й інкрементальна синхронізація за розкладом з урахуванням часових поясів, повторами та журналом; сповіщення, чеки, автоматичне закриття зміни, аудит кожної дії.',
      ),
      tags: [tag('nestjs', 'NestJS 11'), tag('mongodb'), tag('jwt'), 'Cron', tag('vercel')],
      meta: l(
        '216 files · ~40k lines · 23 modules · 240 endpoints · 17 collections',
        '216 файлів · ~40k рядків · 23 модулі · 240 ендпоінтів · 17 колекцій',
      ),
    },
    {
      icon: LayoutGrid,
      title: l('Operator console', 'Консоль оператора'),
      text: l(
        'Terminal list with live status, cash balances by cassette and denomination, service operations, logs, receipts, 13 Excel exports, role-based access per terminal, PIN login with an on-screen keyboard, three languages.',
        'Список терміналів із живим статусом, залишки готівки за касетами й номіналами, сервісні операції, логи, чеки, 13 вивантажень в Excel, рольовий доступ до кожного термінала, вхід за PIN з екранною клавіатурою, три мови.',
      ),
      tags: [tag('react', 'React 19'), tag('tanstackRouter'), tag('redux'), tag('i18next')],
      meta: l('203 files · ~24k lines', '203 файли · ~24k рядків'),
    },
  ],
};

export const proofs: Proof[] = [
  {
    icon: Package,
    title: l('Ownership', 'Повна відповідальність'),
    text: l(
      'Four applications, one architecture, no hand-off gaps — from the sensor to the database.',
      'Чотири застосунки, одна архітектура, жодних розривів між командами — від датчика до бази даних.',
    ),
  },
  {
    icon: ShieldCheck,
    title: l('Reliability', 'Надійність'),
    text: l(
      'Offline-first kiosks, retrying sync, audit trail — money handling that cannot silently lose a record.',
      'Кіоски, що працюють офлайн, синхронізація з повторами, журнал аудиту — облік грошей, який не може непомітно втратити запис.',
    ),
  },
  {
    icon: Cpu,
    title: l('Low-level work', 'Низькорівнева робота'),
    text: l(
      'A binary TCP protocol written from the spec, plus cash and scanner hardware driven from Node.',
      'Бінарний TCP-протокол, написаний за специфікацією, а також купюроприймач і сканер, керовані з Node.',
    ),
  },
  {
    icon: Users,
    title: l('Product sense', 'Продуктове мислення'),
    text: l(
      'Touch UI for first-time users and a dense operator console for daily work, in three languages.',
      'Сенсорний інтерфейс для тих, хто бачить кіоск уперше, і насичена консоль оператора для щоденної роботи — трьома мовами.',
    ),
  },
];

export type PartLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const kioskParts: { letter: PartLetter; icon: LucideIcon; title: Text; text: Text }[] = [
  {
    letter: 'A',
    icon: Monitor,
    title: l('Screen assembly', 'Екранний блок'),
    text: l('Kiosk UI: ten flow screens, transitions, live status', 'Інтерфейс кіоску: десять екранів, переходи, живий статус'),
  },
  {
    letter: 'B',
    icon: CreditCard,
    title: l('Bank terminal', 'Банківський термінал'),
    text: l('Own binary protocol over TCP: sale, refund, shift close', 'Власний бінарний протокол поверх TCP: продаж, повернення, закриття зміни'),
  },
  {
    letter: 'C',
    icon: QrCode,
    title: l('QR scanner', 'QR-сканер'),
    text: l('Document scan → invoice lookup in the external gateway', 'Скан документа → пошук рахунку в зовнішньому шлюзі'),
  },
  {
    letter: 'D',
    icon: Banknote,
    title: l('Cash module', 'Модуль готівки'),
    text: l('Intake and change, cassettes, denominations, min/max limits', 'Прийом готівки й решта, касети, номінали, ліміти'),
  },
  {
    letter: 'E',
    icon: Printer,
    title: l('Receipt printer', 'Принтер чеків'),
    text: l('PDF by two engines, HTML preview, plain-text version', 'PDF двома рушіями, HTML-превʼю, текстова версія'),
  },
  {
    letter: 'F',
    icon: Cpu,
    title: l('On-board computer', 'Бортовий компʼютер'),
    text: l('Hardware server, operational core, local database', 'Сервер обладнання, операційне ядро, локальна база'),
  },
];

export const paymentMethods: { icon: LucideIcon; label: Text; active?: boolean }[] = [
  { icon: Banknote, label: l('Cash', 'Готівка'), active: true },
  { icon: CreditCard, label: l('Card', 'Картка') },
  { icon: QrCode, label: l('QR document', 'QR-документ') },
];

export const fleet: { id: string; status: 'online' | 'offline' }[] = [
  { id: 'KSK-014', status: 'online' },
  { id: 'KSK-007', status: 'offline' },
  { id: 'KSK-021', status: 'online' },
];

export const fleetStats: Stat[] = [
  { value: '24', label: l('terminals in the fleet', 'термінали в парку') },
  { value: '1 418', label: l('payments today', 'платежів сьогодні') },
  { value: '◈ 2.1M', label: l('volume this week', 'обіг за тиждень') },
  { value: l('4 min', '4 хв'), label: l('since last sync', 'від останньої синхронізації'), accent: true },
];

export type TerminalStatus = 'online' | 'low' | 'offline';

export const terminals: { name: Text; notes: string; coins: string; status: TerminalStatus }[] = [
  { name: l('KSK-014 · Hall A', 'KSK-014 · Зал A'), notes: '◈ 82 400', coins: '◈ 3 120', status: 'online' },
  { name: l('KSK-021 · Hall C', 'KSK-021 · Зал C'), notes: '◈ 9 050', coins: '◈ 240', status: 'low' },
  { name: l('KSK-007 · Lobby', 'KSK-007 · Вестибюль'), notes: '◈ 41 700', coins: '◈ 1 880', status: 'offline' },
  { name: l('KSK-033 · Gate 2', 'KSK-033 · Вихід 2'), notes: '◈ 67 300', coins: '◈ 2 410', status: 'online' },
];

export const stack: StackGroup[] = [
  {
    title: l('Frontend', 'Фронтенд'),
    items: [
      tech('typescript'),
      tech('react', 'React 19'),
      tech('tanstackRouter'),
      tech('redux'),
      tech('framer'),
      tech('i18next'),
      tech('vite'),
    ],
  },
  {
    title: l('Backend & data', 'Бекенд і дані'),
    items: [tech('nestjs', 'NestJS 11'), tech('mongodb'), tech('mongoose'), tech('jwt'), tech('node'), tech('swagger')],
  },
  {
    title: l('Realtime & hardware', 'Реальний час і обладнання'),
    items: [
      tech('socketio'),
      l('WebSocket · 10 events', 'WebSocket · 10 подій'),
      l('TCP binary protocol', 'Бінарний протокол TCP'),
      l('State machines', 'Скінченні автомати'),
      l('Offline-first sync', 'Офлайн-синхронізація'),
    ],
  },
  {
    title: l('Output & delivery', 'Звіти й розгортання'),
    items: [tech('pdfkit'), tech('playwright'), tech('exceljs'), tech('vercel'), tech('git', l('Git · 840+ commits', 'Git · 840+ комітів'))],
  },
];
