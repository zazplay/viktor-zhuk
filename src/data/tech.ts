import type { Text } from '../i18n';
import type { Brand, StackItem, TechTag } from '../types';
import { brand } from './brands';
import { links } from './profile';

type Tech = { name: string; href: string; brand?: Brand };

const TECH = {
  typescript: { name: 'TypeScript', href: 'https://www.typescriptlang.org/', brand: brand.typescript },
  react: { name: 'React', href: 'https://react.dev/', brand: brand.react },
  tanstackRouter: { name: 'TanStack Router', href: 'https://tanstack.com/router', brand: brand.reactrouter },
  tanstackQuery: { name: 'TanStack Query', href: 'https://tanstack.com/query', brand: brand.reactquery },
  redux: { name: 'Redux Toolkit', href: 'https://redux-toolkit.js.org/', brand: brand.redux },
  framer: { name: 'Framer Motion', href: 'https://motion.dev/', brand: brand.framer },
  i18next: { name: 'i18next', href: 'https://www.i18next.com/', brand: brand.i18next },
  vite: { name: 'Vite', href: 'https://vitejs.dev/', brand: brand.vite },
  antdesign: { name: 'Ant Design', href: 'https://ant.design/', brand: brand.antdesign },
  tailwind: { name: 'Tailwind', href: 'https://tailwindcss.com/', brand: brand.tailwind },
  shadcn: { name: 'shadcn/ui', href: 'https://ui.shadcn.com/', brand: brand.shadcn },
  zod: { name: 'zod', href: 'https://zod.dev/', brand: brand.zod },
  nestjs: { name: 'NestJS', href: 'https://nestjs.com/', brand: brand.nestjs },
  mongodb: { name: 'MongoDB', href: 'https://www.mongodb.com/', brand: brand.mongodb },
  mongoose: { name: 'Mongoose', href: 'https://mongoosejs.com/', brand: brand.mongoose },
  postgresql: { name: 'PostgreSQL', href: 'https://www.postgresql.org/', brand: brand.postgresql },
  typeorm: { name: 'TypeORM', href: 'https://typeorm.io/', brand: brand.typeorm },
  jwt: { name: 'JWT', href: 'https://jwt.io/', brand: brand.jwt },
  node: { name: 'Node.js', href: 'https://nodejs.org/', brand: brand.node },
  swagger: { name: 'Swagger', href: 'https://swagger.io/', brand: brand.swagger },
  socketio: { name: 'Socket.IO', href: 'https://socket.io/', brand: brand.socketio },
  raspberrypi: { name: 'Raspberry Pi', href: 'https://www.raspberrypi.com/', brand: brand.raspberrypi },
  pdfkit: { name: 'PDFKit', href: 'https://pdfkit.org/' },
  playwright: { name: 'Playwright', href: 'https://playwright.dev/', brand: brand.playwright },
  exceljs: { name: 'ExcelJS', href: 'https://github.com/exceljs/exceljs' },
  vercel: { name: 'Vercel', href: 'https://vercel.com/', brand: brand.vercel },
  git: { name: 'Git', href: links.github, brand: brand.git },
  telegramBot: { name: 'Telegram bot', href: 'https://core.telegram.org/bots', brand: brand.telegram },
} satisfies Record<string, Tech>;

type TechKey = keyof typeof TECH;

/** Linked stack chip; `label` overrides the default name, e.g. "React 19". */
export function tech(key: TechKey, label?: Text): StackItem {
  const { name, href, brand }: Tech = TECH[key];
  return { label: label ?? name, href, brand };
}

/** Work-item tag with the tech's brand icon. */
export function tag(key: TechKey, label?: Text): TechTag {
  const { name, brand }: Tech = TECH[key];
  return { label: label ?? name, brand };
}
