import { Cloud } from 'lucide-react';
import { Card } from '../../components/Card';
import { FlowLine, FlowMerge } from '../../components/Flow';
import { StatGrid } from '../../components/StatGrid';
import { WindowChrome } from '../../components/WindowChrome';
import { l, useLang } from '../../i18n';
import { cx } from '../../lib/cx';
import { fleet, fleetStats } from './data';
import styles from './FleetDiagram.module.css';

const CHART = [40, 62, 34, 78, 55, 70];
const CHART_PEAK = 3;
const CONSOLE_ROWS = ['online', 'offline', 'online'] as const;

const STATUS = { online: l('online', 'онлайн'), offline: l('offline', 'офлайн') };

function ConsoleMock() {
  return (
    <div className={styles.console} aria-hidden="true">
      <WindowChrome label={l('Operator console', 'Консоль оператора')} size="sm" />
      <div className={styles.consoleBody}>
        <div className={styles.sidebar}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cx(styles.navItem, i === 0 && styles.navActive)} />
          ))}
        </div>
        <div className={styles.main}>
          <div className={styles.chart}>
            {CHART.map((height, i) => (
              <span key={i} className={cx(styles.bar, i === CHART_PEAK && styles.barPeak)} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className={styles.rows}>
            {CONSOLE_ROWS.map((status, i) => (
              <div key={i} className={styles.row}>
                <span className={cx(styles.rowDot, styles[status])} />
                <span className={styles.rowLine} />
                <span className={styles.rowValue} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Kiosks sync into the cloud core, which feeds a single operator console. */
export function FleetDiagram() {
  const { t } = useLang();
  return (
    <Card className={styles.card}>
      <div className={styles.diagram}>
        <div className={styles.kiosks}>
          {fleet.map(({ id, status }) => (
            <div key={id} className={styles.kiosk}>
              <div className={cx(styles.device, status === 'offline' && styles.deviceOffline)} aria-hidden="true">
                <div className={styles.deviceScreen} />
                <div className={styles.deviceSlot} />
                <div className={styles.deviceTray} />
              </div>
              <div className={styles.kioskId}>{id}</div>
              <div className={cx(styles.status, status === 'offline' && styles.statusOffline)}>
                <span className={styles.statusDot} />
                {t(STATUS[status])}
              </div>
            </div>
          ))}
        </div>

        <FlowMerge
          columns={fleet.length}
          gap="var(--kiosk-gap)"
          branch={26}
          trunk={44}
          durations={[2.6, 3.1, 2.2]}
          trunkDuration={2.8}
          className={styles.merge}
        />

        <div className={styles.cloud}>
          <div className={styles.cloudTitle}>
            <Cloud size={15} className={styles.cloudIcon} aria-hidden />
            {t(l('Cloud core', 'Хмарне ядро'))}
          </div>
          <div className={styles.cloudCaption}>
            {t(l('scheduled sync · retries · journal', 'синхронізація за розкладом · повтори · журнал'))}
          </div>
        </div>
        <p className={styles.caption}>
          {t(
            l(
              'An offline kiosk keeps taking payments and queues records locally — they fly up as soon as the link is back.',
              'Кіоск без звʼязку й далі приймає платежі та складає записи в локальну чергу — вони відлітають у хмару, щойно звʼязок повертається.',
            ),
          )}
        </p>

        <FlowLine height={28} duration={2.6} />
        <ConsoleMock />
      </div>

      <StatGrid stats={fleetStats} size="sm" />
    </Card>
  );
}
