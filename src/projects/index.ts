import { CreditCard, KeyRound, Package, Utensils } from 'lucide-react';
import { l } from '../i18n';
import { LockerProject } from './locker/LockerProject';
import { MarketplaceProject } from './marketplace/MarketplaceProject';
import { MealsProject } from './meals/MealsProject';
import { PaymentProject } from './payment/PaymentProject';
import { LockerPreview, MarketplacePreview, MealsPreview, PaymentPreview } from './previews';

export const projects = [
  {
    id: 'pay',
    label: l('Self-service payment platform', 'Платіжна платформа самообслуговування'),
    caption: l('kiosk · cash · cards · QR', 'кіоск · готівка · картки · QR'),
    icon: CreditCard,
    Preview: PaymentPreview,
    Content: PaymentProject,
  },
  {
    id: 'lock',
    label: l('Smart equipment locker', 'Розумна шафа для обладнання'),
    caption: l('cabinet · SMS · dispatcher', 'шафа · SMS · диспетчер'),
    icon: Package,
    Preview: LockerPreview,
    Content: LockerProject,
  },
  {
    id: 'market',
    label: l('Game-asset marketplace', 'Маркетплейс ігрових активів'),
    caption: l('escrow · wallet · disputes', 'ескроу · гаманець · спори'),
    icon: KeyRound,
    Preview: MarketplacePreview,
    Content: MarketplaceProject,
  },
  {
    id: 'meals',
    label: l('Meal subscription service', 'Харчування за підпискою'),
    caption: l('plans · renewals · kitchen', 'плани · продовження · кухня'),
    icon: Utensils,
    Preview: MealsPreview,
    Content: MealsProject,
  },
] as const;

export type ProjectId = (typeof projects)[number]['id'];
