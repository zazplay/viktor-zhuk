import { l, type Text } from '../i18n';

/**
 * Career facts shared by every tab, taken from the CV.
 * Clients, brands and hardware vendors stay unnamed here, as the footer promises.
 */

export type Job = {
  role: Text;
  company: Text;
  period: Text;
  summary: Text;
  points: Text[];
};

export const jobs: Job[] = [
  {
    role: l('Backend & IoT developer', 'Backend та IoT-розробник'),
    company: l('Payment4U, Czechia · remote', 'Payment4U, Чехія · віддалено'),
    period: l('Aug 2025 — now', 'серп. 2025 — дотепер'),
    summary: l(
      'Software for self-service terminals and payment systems.',
      'ПЗ для терміналів самообслуговування та платіжних систем.',
    ),
    points: [
      l(
        'Raspberry Pi terminals in production: payment kiosks, POS systems and lockers for parcels and left luggage.',
        'Термінали на Raspberry Pi у продакшені: платіжні кіоски, POS-системи та шафи для посилок і камер схову.',
      ),
      l(
        'Payment and peripheral hardware over binary protocols — card terminals, banknote recyclers, fiscal registers, printers and scanners.',
        'Платіжне й периферійне обладнання через бінарні протоколи — карткові термінали, рециркулятори купюр, фіскальні реєстратори, принтери та сканери.',
      ),
      l(
        'Money-critical flows: idempotent transactions, device-to-backend reconciliation, recovery from a failure mid-transaction or a provider timeout.',
        'Критичні для грошей сценарії: ідемпотентні транзакції, звірка пристрою з бекендом, відновлення після збою посеред транзакції чи таймауту провайдера.',
      ),
      l(
        'Backend services in Node.js / NestJS and Python for fleet management and transaction processing, on PostgreSQL and MongoDB.',
        'Бекенд-сервіси на Node.js / NestJS і Python для керування парком пристроїв і обробки транзакцій, на PostgreSQL і MongoDB.',
      ),
      l(
        'React admin panels — monitoring, operator alerts, order and locker management — and Linux devices in the field: deployment, remote updates, remote diagnostics.',
        'Адмін-панелі на React — моніторинг, сповіщення операторам, керування замовленнями й шафами — та Linux-пристрої в полі: розгортання, віддалені оновлення, віддалена діагностика.',
      ),
      l(
        'Anthropic and OpenAI APIs in production features; AI tooling daily, with every generated line reviewed.',
        'API Anthropic і OpenAI у продакшн-функціях; AI-інструменти щодня, з перевіркою кожного згенерованого рядка.',
      ),
    ],
  },
  {
    role: l('Full-stack developer', 'Full-stack розробник'),
    company: l('Freelance · remote', 'Фриланс · віддалено'),
    period: l('Mar 2024 — Aug 2025', 'бер. 2024 — серп. 2025'),
    summary: l(
      'Custom web and mobile work for private clients and small businesses, delivered end to end.',
      'Веб- і мобільна розробка на замовлення для приватних клієнтів і малого бізнесу — від задачі до запуску.',
    ),
    points: [
      l(
        'An AI data parser in Python and Node.js: crawls sites past anti-bot protection, hands the HTML to an LLM for structured extraction and serves the result to a product catalog over an API.',
        'AI-парсер даних на Python і Node.js: обходить сайти попри антибот-захист, передає HTML у LLM для структурованого витягування й віддає результат у каталог товарів через API.',
      ),
      l(
        'A cross-platform yoga app on React Native and NestJS: video courses, comments, reviews, chat and payments.',
        'Кросплатформний застосунок для йоги на React Native і NestJS: відеокурси, коментарі, відгуки, чат і платежі.',
      ),
      l(
        'CRM systems, online stores, food delivery platforms and a social network with subscriptions and user content.',
        'CRM-системи, інтернет-магазини, платформи доставки їжі та соцмережа з підписками й контентом користувачів.',
      ),
      l(
        'REST APIs with JWT auth, role-based access and validation; React, Next.js and Vue.js frontends; deployment, hosting and the client conversation.',
        'REST API з JWT-автентифікацією, рольовим доступом і валідацією; фронтенди на React, Next.js і Vue.js; розгортання, хостинг і спілкування з клієнтом.',
      ),
    ],
  },
];

export const education: { title: Text; place: Text; period: string }[] = [
  {
    title: l("Master's and Bachelor's, International Management", 'Магістр і бакалавр, міжнародний менеджмент'),
    place: l('Dnipro National University', 'Дніпровський національний університет'),
    period: '2020 — 2025',
  },
  {
    title: l('Full-stack web development', 'Full-stack веброзробка'),
    place: l('IT STEP Computer Academy', 'Компʼютерна академія IT STEP'),
    period: '2022 — 2025',
  },
];

export const skills: { title: Text; items: Text }[] = [
  {
    title: l('Backend', 'Бекенд'),
    items: l(
      'Node.js, NestJS, Express, Fastify, TypeScript, JavaScript, Python, PHP, Laravel, REST, Swagger / OpenAPI, WebSocket, Socket.IO, JWT, microservices, cron jobs',
      'Node.js, NestJS, Express, Fastify, TypeScript, JavaScript, Python, PHP, Laravel, REST, Swagger / OpenAPI, WebSocket, Socket.IO, JWT, мікросервіси, cron-задачі',
    ),
  },
  {
    title: l('Frontend', 'Фронтенд'),
    items:
      'React, React Native, Next.js, Vue.js, Nuxt, Redux, Zustand, TanStack Query, React Hook Form, Zod, Tailwind, MUI, HTML5, CSS3',
  },
  {
    title: l('Data', 'Дані'),
    items: 'PostgreSQL, MySQL, SQLite, MongoDB, Redis, Firebase, Supabase, TypeORM, Mongoose',
  },
  {
    title: l('Infrastructure', 'Інфраструктура'),
    items: 'Docker, Linux, AWS, Google Cloud, Git / GitHub, GitHub Actions, CI/CD, Raspberry Pi',
  },
  {
    title: l('Testing & tools', 'Тести й інструменти'),
    items: l(
      'Jest, Playwright, Cypress, Postman, Jira, Trello, Figma, clean architecture, SOLID',
      'Jest, Playwright, Cypress, Postman, Jira, Trello, Figma, чиста архітектура, SOLID',
    ),
  },
  {
    title: l('Integrations', 'Інтеграції'),
    items: l(
      'Card payments and payouts, signed webhooks, Telegram Bot API, MQTT, Modbus',
      'Карткові платежі й виплати, підписані вебхуки, Telegram Bot API, MQTT, Modbus',
    ),
  },
  {
    title: l('Hardware', 'Обладнання'),
    items: l(
      'Card terminals, banknote recyclers, fiscal registers, receipt printers, barcode scanners, serial protocols',
      'Карткові термінали, рециркулятори купюр, фіскальні реєстратори, принтери чеків, сканери штрихкодів, послідовні протоколи',
    ),
  },
  {
    title: 'AI',
    items: l(
      'Claude API, OpenAI API, production LLM integrations, structured extraction, function calling',
      'Claude API, OpenAI API, LLM-інтеграції в продакшені, структуроване витягування даних, function calling',
    ),
  },
  {
    title: l('Languages', 'Мови'),
    items: l(
      'Ukrainian — native, Russian — native, English — B1 technical, Spanish — A2',
      'Українська — рідна, російська — рідна, англійська — B1 (технічна), іспанська — A2',
    ),
  },
];
