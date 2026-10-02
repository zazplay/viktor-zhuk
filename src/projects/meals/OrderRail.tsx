import type { CSSProperties } from 'react';
import { Card } from '../../components/Card';
import { keyOf, l, useLang, type Text } from '../../i18n';
import { cx } from '../../lib/cx';
import { deliveryStages, history, orderStages, type Stage } from './data';
import styles from './OrderRail.module.css';

function Rail({ title, stages }: { title: Text; stages: Stage[] }) {
  const { t } = useLang();
  return (
    <div className={styles.railBlock}>
      <div className={styles.railTitle}>{t(title)}</div>
      <div className={styles.rail} style={{ '--stages': stages.length } as CSSProperties}>
        {stages.map(({ label, state }) => (
          <div key={keyOf(label)} className={cx(styles.stage, styles[state])}>
            <span className={styles.dot} />
            <span className={styles.label}>{t(label)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The two rails an order runs on, and the trail it leaves behind. */
export function OrderRail() {
  const { t } = useLang();
  return (
    <Card padding="lg" className={styles.card}>
      <Rail title={l('Order', 'Замовлення')} stages={orderStages} />
      <Rail title={l('Delivery', 'Доставка')} stages={deliveryStages} />

      <div className={styles.history}>
        {history.map(({ time, event, who }) => (
          <div key={time} className={styles.entry}>
            <span className={styles.time}>{time}</span>
            <span className={styles.event}>{t(event)}</span>
            <span className={styles.who}>{t(who)}</span>
          </div>
        ))}
      </div>

      <p className={styles.note}>
        {t(
          l(
            "Every move writes the time and the person into the order's history, so a day later it is still clear who sent it to the kitchen and when it left with the courier.",
            'Кожен крок записує час і людину в історію замовлення, тож і через день видно, хто передав його на кухню і коли воно поїхало з курʼєром.',
          ),
        )}
      </p>
    </Card>
  );
}
