import {
  Activity,
  Ban,
  Cpu,
  KeyRound,
  LayoutGrid,
  Mail,
  Monitor,
  Package,
  Server,
  Smartphone,
  TriangleAlert,
  Truck,
  Users,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import { tech } from '../../data/tech';
import { l, type Text } from '../../i18n';
import type { FlowNodeData, Overview, Proof, StackGroup } from '../../types';

export type CellState = 'empty' | 'full' | 'issued' | 'open' | 'damaged' | 'retired';

export const CELL_STYLE: Record<CellState, { icon: LucideIcon; color: string; border: string; background: string }> = {
  empty: { icon: Package, color: '#2F6FE0', border: '#CFE0FF', background: '#F2F6FF' },
  full: { icon: Package, color: '#1F8B57', border: '#C6EAD6', background: '#F0FAF4' },
  issued: { icon: Truck, color: '#B4700F', border: '#F6DCB4', background: '#FFF7EC' },
  open: { icon: KeyRound, color: '#B4700F', border: '#EBC98F', background: 'linear-gradient(180deg, #FFF6E6, #FFFFFF)' },
  damaged: { icon: TriangleAlert, color: '#C4373C', border: '#F6CACA', background: '#FEF1F1' },
  retired: { icon: Ban, color: '#70707E', border: '#E2E2E8', background: '#F4F4F6' },
};

const STATE_CODE: Record<string, CellState> = {
  E: 'empty',
  F: 'full',
  I: 'issued',
  O: 'open',
  D: 'damaged',
  R: 'retired',
};

/** Four shelves of ten cells, one letter per cell (see STATE_CODE). */
const WALL = ['EFIFEIFEIE', 'FIOFEIFEIF', 'EFIEDFEIFE', 'IFEREIFIEF'];

/** Cell number counts across shelves; the hardware id is shelf + position, e.g. 203. */
export const cells = WALL.flatMap((shelf, row) =>
  [...shelf].map((code, col) => ({
    number: row * shelf.length + col + 1,
    hardwareId: `${row + 1}${String(col + 1).padStart(2, '0')}`,
    state: STATE_CODE[code],
  })),
);

export const cellTotals = [
  { value: '96', label: l('cells total', 'усього комірок'), color: '#4B3BE4', total: true },
  { value: '38', label: l('empty', 'порожні'), color: '#2F6FE0' },
  { value: '22', label: l('full', 'заповнені'), color: '#1F8B57' },
  { value: '31', label: l('issued', 'видані'), color: '#B4700F' },
  { value: '3', label: l('damaged content', 'пошкоджений вміст'), color: '#C4373C' },
  { value: '2', label: l('faulty / retired', 'несправні / виведені'), color: '#70707E' },
];

export const cellFilters = [
  { label: l('Empty', 'Порожні'), color: '#2F6FE0' },
  { label: l('Full', 'Заповнені'), color: '#1F8B57' },
  { label: l('Issued', 'Видані'), color: '#B4700F' },
  { label: l('Damaged content', 'Пошкоджений вміст'), color: '#C4373C' },
  { label: l('Retired', 'Виведені'), color: '#70707E' },
];

export const cellLegend = [
  { label: l('Empty', 'Порожні'), color: '#2F6FE0' },
  { label: l('Full', 'Заповнені'), color: '#1F8B57' },
  { label: l('Issued', 'Видані'), color: '#B4700F' },
  { label: l('Damaged content', 'Пошкоджений вміст'), color: '#C4373C' },
  { label: l('Cell faulty', 'Несправна комірка'), color: '#B32B45' },
  { label: l('Retired', 'Виведені'), color: '#70707E' },
];

export const channels: { inputs: FlowNodeData[]; hub: FlowNodeData; caption: Text; outputs: FlowNodeData[] } = {
  inputs: [
    { icon: Monitor, title: l('Kiosk', 'Кіоск'), caption: l('phone · code · QR scan', 'телефон · код · QR-скан') },
    { icon: Smartphone, title: l("Driver's phone", 'Телефон водія'), caption: l('SMS code · 2 min', 'SMS-код · 2 хв') },
  ],
  hub: { icon: Server, title: l('Backend decides', 'Рішення за бекендом'), caption: l('rotation · approvals · audit', 'ротація · погодження · аудит') },
  caption: l(
    'The kiosk never opens a cell itself — it asks the backend, and the backend decides which cell opens and tells the controller.',
    'Кіоск ніколи не відчиняє комірку сам — він питає бекенд, а бекенд вирішує, яку комірку відчинити, і дає команду контролеру.',
  ),
  outputs: [
    { icon: Cpu, title: l('Lock controller', 'Контролер замків'), caption: l('partner · HTTP + WS', 'партнер · HTTP + WS') },
    { icon: LayoutGrid, title: l('Dispatcher panel', 'Панель диспетчера'), caption: l('live grid · approvals', 'жива сітка · погодження') },
    { icon: Mail, title: l('E-mail & SMS', 'Пошта й SMS'), caption: l('alerts · 08:00 report', 'сповіщення · звіт о 08:00') },
  ],
};

export const overview: Overview = {
  period: l('2026 · 8 months', '2026 · 8 місяців'),
  title: l('Smart equipment locker', 'Розумна шафа для обладнання'),
  badge: l('3 of 4 apps mine · backend, kiosk, dispatcher', 'Мої 3 з 4 застосунків · бекенд, кіоск, диспетчер'),
  summary: l(
    'A metal cabinet hands out work kits — payment terminal, phone, car keys. In the morning a worker types a phone number on the kiosk, gets an SMS code and a cell opens; in the evening they scan every item back in. A dispatcher watches the whole wall in the browser and steps in when a human decision is needed.',
    'Металева шафа видає робочі комплекти — платіжний термінал, телефон, ключі від авто. Вранці працівник вводить номер телефону на кіоску, отримує SMS-код, і комірка відчиняється; ввечері він сканує кожну річ назад. Диспетчер бачить усю стіну в браузері й втручається, коли потрібне рішення людини.',
  ),
  stats: [
    { value: '3', label: l('applications written by me', 'застосунки написав я') },
    { value: '~28k', label: l('lines of my TypeScript', 'рядків мого TypeScript') },
    { value: '100', label: l('API endpoints', 'API-ендпоінтів') },
    { value: '91%', label: l('of 250+ commits', 'з 250+ комітів') },
  ],
  work: [
    {
      icon: Server,
      title: l('Backend — the brain', 'Бекенд — мозок системи'),
      text: l(
        'Phone + SMS login with shift windows, fair cell rotation, dispatcher approvals that survive a restart, verify-then-open returns, dual SMS channel, Excel shift import, inventory history, scheduled hardware sync and an 08:00 daily report.',
        'Вхід за телефоном і SMS у межах змін, справедлива ротація комірок, погодження диспетчера, що переживають перезапуск, повернення за схемою «перевір — відчини», два канали SMS, імпорт змін з Excel, історія інвентарю, синхронізація з обладнанням за розкладом і щоденний звіт о 08:00.',
      ),
      tags: ['NestJS 10', 'PostgreSQL', 'TypeORM', 'Socket.IO', 'JWT', 'Swagger'],
      meta: l('127 files · ~12.6k lines · 15 modules · 100 endpoints', '127 файлів · ~12.6k рядків · 15 модулів · 100 ендпоінтів'),
    },
    {
      icon: Monitor,
      title: l('Kiosk — the touchscreen', 'Кіоск — сенсорний екран'),
      text: l(
        '18 flow screens on a portrait 900×1440 panel: on-screen keypad, press-on-touch like a payment terminal, session generations so a stale reply cannot open a cell for the next person, triple confirmation (button, door-closed event, timeout) where only the first one counts.',
        '18 екранів на вертикальній панелі 900×1440: екранна клавіатура, натискання при дотику, як у платіжному терміналі, покоління сесій, щоб застаріла відповідь не відчинила комірку наступній людині, потрійне підтвердження (кнопка, подія зачинених дверцят, таймаут), де враховується лише перше.',
      ),
      tags: ['React 18', 'Vite', 'Tailwind', 'Socket.IO'],
      meta: l('29 files · ~3.8k lines', '29 файлів · ~3.8k рядків'),
    },
    {
      icon: LayoutGrid,
      title: l('Dispatcher panel — the workplace', 'Панель диспетчера — робоче місце'),
      text: l(
        'Live grid of every cell with real-time door indicators, scripted state changes, an un-dismissable approval dialog with sound and polling fallback, Excel shift import with row-level editing, inventory, notifications, PDF and Excel reports, roles and settings.',
        'Жива сітка всіх комірок з індикаторами дверцят у реальному часі, скриптові зміни станів, діалог погодження, який не можна закрити, зі звуком і резервним опитуванням, імпорт змін з Excel з редагуванням рядків, інвентар, сповіщення, звіти в PDF і Excel, ролі та налаштування.',
      ),
      tags: ['React 18', 'TanStack Query', 'shadcn/ui', 'zod'],
      meta: l('68 files · ~11.7k lines', '68 файлів · ~11.7k рядків'),
    },
    {
      icon: Cpu,
      title: l("Lock controller — partner's work", 'Контролер замків — робота партнера'),
      text: l(
        'A Python service on a Raspberry Pi drives the locks, the QR scanner and the GSM modem. Written by my project partner; my part is the HTTP and WebSocket integration.',
        'Сервіс на Python на Raspberry Pi керує замками, QR-сканером і GSM-модемом. Його написав мій партнер по проєкту; моя частина — інтеграція через HTTP і WebSocket.',
      ),
      external: true,
    },
  ],
};

export const proofs: Proof[] = [
  {
    icon: Activity,
    title: l('Algorithms, not just forms', 'Алгоритми, а не лише форми'),
    text: l(
      'Cells are picked from the full and closed ones by least usage, then at random — lock wear spreads evenly and a stuck cell never blocks the queue.',
      'Комірка обирається серед заповнених і зачинених за найменшим використанням, а далі випадково — знос замків розподіляється рівномірно, а заїла комірка ніколи не блокує чергу.',
    ),
  },
  {
    icon: Users,
    title: l('Human in the loop', 'Людина в контурі'),
    text: l(
      'A second issue of the day waits for a dispatcher: the request lives in the database, survives a restart, first click wins, five minutes and it expires.',
      'Друга видача за день чекає на диспетчера: запит зберігається в базі, переживає перезапуск, виграє перший клік, а через пʼять хвилин він спливає.',
    ),
  },
  {
    icon: KeyRound,
    title: l('Physical safety rules', 'Фізичні правила безпеки'),
    text: l(
      'The door opens only after every QR code matches; the return completes on the door-closed event, and a retry after a lost reply is safe.',
      'Дверцята відчиняються лише тоді, коли збіглися всі QR-коди; повернення завершується за подією зачинення дверцят, а повтор після втраченої відповіді безпечний.',
    ),
  },
  {
    icon: WifiOff,
    title: l('No single point of failure', 'Без єдиної точки відмови'),
    text: l(
      'SMS goes out through the cabinet modem or a cloud gateway; one event fans out to the panel, e-mail and SMS at once.',
      'SMS іде через модем шафи або хмарний шлюз; одна подія одразу розходиться в панель, на пошту й у SMS.',
    ),
  },
];

export const stack: StackGroup[] = [
  {
    title: l('Frontend', 'Фронтенд'),
    items: [
      tech('typescript'),
      tech('react', 'React 18'),
      tech('tanstackQuery'),
      tech('tailwind'),
      tech('shadcn'),
      tech('zod'),
      tech('vite'),
    ],
  },
  {
    title: l('Backend & data', 'Бекенд і дані'),
    items: [tech('nestjs', 'NestJS 10'), tech('postgresql'), tech('typeorm'), tech('jwt'), tech('swagger')],
  },
  {
    title: l('Realtime & hardware', 'Реальний час і обладнання'),
    items: [
      tech('socketio'),
      tech('raspberrypi'),
      l('GSM modem + cloud SMS', 'GSM-модем + хмарні SMS'),
      l('QR scanning', 'QR-сканування'),
      l('Door events', 'Події дверцят'),
    ],
  },
  {
    title: l('Output & delivery', 'Звіти й розгортання'),
    items: [
      l('PDF reports', 'PDF-звіти'),
      l('Excel import / export', 'Імпорт / експорт Excel'),
      l('E-mail notifications', 'Сповіщення поштою'),
      l('Daily 08:00 digest', 'Щоденний дайджест о 08:00'),
    ],
  },
];
