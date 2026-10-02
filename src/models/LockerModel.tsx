import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { l } from '../i18n';
import { CellOverview } from './CellOverview';
import { matchesFilter, type Filter } from './lockerCells';
import { buildLocker } from './lockerScene';
import { ModelFrame, PART_KEYS, placeDot, prefersReducedMotion, useNarrow, type CalloutRefs, type Part, type PartKey } from './ModelFrame';
import { loadFonts, Stage, trackPointer } from './stage';

const PARTS: Record<PartKey, Part> = {
  A: {
    side: 'l',
    icon: '<rect x="4" y="1.5" width="8" height="13" rx="1.5"/><line x1="7" y1="12.2" x2="9" y2="12.2"/>',
    title: l('Kiosk on the cabinet', 'Кіоск на шафі'),
    text: l('Portrait 900×1440 touchscreen: phone number, SMS code, keypad', 'Портретний сенсорний екран 900×1440: номер телефону, SMS-код, клавіатура'),
  },
  B: {
    side: 'r',
    icon: '<path d="M2 5.5V2h3.5M10.5 2H14v3.5M14 10.5V14h-3.5M5.5 14H2v-3.5"/><line x1="4" y1="8" x2="12" y2="8"/>',
    title: l('QR scanner', 'QR-сканер'),
    text: l('Every item is scanned back in; the door opens only when all codes match', 'Кожен предмет сканується при поверненні; дверцята відчиняються, лише коли всі коди збігаються'),
  },
  C: {
    side: 'l',
    icon: '<rect x="1.5" y="2.5" width="13" height="11" rx="1"/><path d="M5.8 2.5v11M10.2 2.5v11M1.5 8h13"/>',
    title: l('Cell doors', 'Дверцята комірок'),
    text: l('Every cell has its own state and hardware id; an open door lights up instantly', 'Кожна комірка має свій стан і апаратний id; відчинені дверцята світяться миттєво'),
  },
  D: {
    side: 'r',
    icon: '<path d="M3 2.5h7v11H3z"/><path d="M10 2.5l3.5 1.5v8.5L10 13.5"/><line x1="5" y1="8" x2="5" y2="8.6"/>',
    title: l('Open cell 13', 'Відчинена комірка 13'),
    text: l('Rotation picked the least-used full cell, so lock wear spreads evenly', 'Ротація обрала найменш використану заповнену комірку — знос замків розподіляється рівномірно'),
  },
  E: {
    side: 'l',
    icon: '<rect x="4" y="4" width="8" height="8" rx="1"/><rect x="6.5" y="6.5" width="3" height="3"/><path d="M6 2v2M10 2v2M6 12v2M10 12v2M2 6h2M2 10h2M12 6h2M12 10h2"/>',
    title: l('Lock controller', 'Контролер замків'),
    text: l('Raspberry Pi drives the locks, QR scanner and GSM modem (partner’s part)', 'Raspberry Pi керує замками, QR-сканером і GSM-модемом (частина партнера)'),
  },
  F: {
    side: 'r',
    icon: '<path d="M8 14V6"/><circle cx="8" cy="5" r="1"/><path d="M5.2 2.6a4 4 0 0 0 0 4.8M10.8 2.6a4 4 0 0 1 0 4.8M3.2 1a6.5 6.5 0 0 0 0 8M12.8 1a6.5 6.5 0 0 1 0 8"/>',
    title: l('GSM modem', 'GSM-модем'),
    text: l('SMS codes go out through the cabinet modem or a cloud gateway', 'SMS-коди надсилаються через модем шафи або хмарний шлюз'),
  },
};

const LABEL_W = 236;
const PAD = 22;
const GAP = 18;

/** The smart locker in 3D next to its cell overview; hovering either side lights up the other. */
export default function LockerModel() {
  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const callouts = useRef<CalloutRefs>({});
  const [active, setActive] = useState<PartKey | null>(null);
  const [hoverCell, setHoverCell] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const narrow = useNarrow(cardRef);
  const narrowRef = useRef(narrow);
  narrowRef.current = narrow;
  const sceneRef = useRef<ReturnType<typeof buildLocker>>(null);
  const view = { active, hoverCell, matches: (st: Parameters<typeof matchesFilter>[1]) => matchesFilter(filter, st) };
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => sceneRef.current?.update(viewRef.current), [active, hoverCell, filter]);

  useEffect(() => {
    const card = cardRef.current!;
    const host = stageRef.current!;
    let disposed = false;
    let cleanup = () => {};

    loadFonts(['600 60px "IBM Plex Sans"', '500 30px "IBM Plex Mono"', '400 30px "IBM Plex Mono"']).then(() => {
      if (disposed) return;
      const reduce = prefersReducedMotion();
      const stage = new Stage(host);
      const locker = buildLocker(reduce);
      sceneRef.current = locker;
      stage.setObject(locker.root);
      locker.noShadow.traverse((o) => (o.castShadow = false));
      locker.update(viewRef.current);

      const cam = stage.camera;
      cam.fov = 24;
      const target = new THREE.Vector3(0, locker.centreY + 0.2, 0);
      const dir = new THREE.Vector3(-0.46, 0.3, 1).normalize();
      stage.key.position.set(-3, 9, 3.5);
      const frame = () => {
        const W = card.clientWidth;
        const H = card.clientHeight;
        const isNarrow = W < 720;
        const avail = isNarrow ? W * 0.86 : W * 0.74;
        const d = (3.75 * H) / (avail * 2 * Math.tan(((cam.fov / 2) * Math.PI) / 180));
        cam.position.copy(target).addScaledVector(dir, d);
        cam.lookAt(target);
        cam.near = 0.1;
        cam.far = 100;
        if (isNarrow) cam.clearViewOffset();
        cam.updateProjectionMatrix();
      };
      frame();
      const ro = new ResizeObserver(frame);
      ro.observe(card);

      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const onMove = (e: PointerEvent) => {
        if ((e.target as Element).closest('[data-callout]')) return;
        const r = card.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
        ray.setFromCamera(ndc, cam);
        const u = ray.intersectObject(locker.root, true)[0]?.object.userData ?? {};
        if (u.cell) {
          setActive(null);
          setHoverCell(u.cell as number);
        } else {
          setHoverCell(null);
          setActive((u.part as PartKey | undefined) ?? null);
        }
      };
      const onLeave = () => {
        setActive(null);
        setHoverCell(null);
      };
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);

      const tilt = trackPointer(card, reduce);
      const v = new THREE.Vector3();
      const bounds = new THREE.Box3().setFromObject(locker.root);
      const corner = new THREE.Vector3();
      stage.onFrame = () => {
        tilt.step(locker.root);
        const W = card.clientWidth;
        const H = card.clientHeight;
        labelsRef.current?.setAttribute('data-placed', '');
        const pts = {} as Record<PartKey, [number, number]>;
        for (const k of PART_KEYS) {
          locker.anchors[k].getWorldPosition(v).project(cam);
          pts[k] = [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H];
        }
        const els = callouts.current;

        if (narrowRef.current) {
          // Badges beside their parts, nudged down when two would overlap.
          const placed: [number, number][] = [];
          for (const k of [...PART_KEYS].sort((a, b) => pts[a][1] - pts[b][1])) {
            const [x, y] = pts[k];
            const u = els[k] ?? {};
            let s = PARTS[k].side === 'l' ? -1 : 1;
            if (x + s * 34 < 16 || x + s * 34 > W - 16) s = -s;
            const bx = Math.min(W - 16, Math.max(16, x + s * 34));
            let by = y;
            for (const p of placed) if (Math.abs(p[0] - bx) < 28 && Math.abs(p[1] - by) < 28) by = p[1] + 28;
            placed.push([bx, by]);
            if (u.badge) u.badge.style.transform = `translate(${bx}px,${by}px)`;
            u.path?.setAttribute('d', by === y ? `M${x},${y}H${bx - s * 12}` : `M${x},${y}L${bx - s * 12},${by}`);
            placeDot(u, x, y);
          }
          return;
        }

        // Centre the model vertically between the top and bottom label rows.
        const heights = PART_KEYS.map((k) => els[k]?.label?.offsetHeight ?? 0);
        const rowH = Math.max(...heights);
        let top = Infinity;
        let bottom = -Infinity;
        for (let i = 0; i < 8; i++) {
          corner.set(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z).project(cam);
          const sy = ((1 - corner.y) / 2) * H;
          top = Math.min(top, sy);
          bottom = Math.max(bottom, sy);
        }
        const want = (26 + rowH + (H - rowH - 22)) / 2;
        const cur = (top + bottom) / 2;
        if (Math.abs(cur - want) > 0.5) {
          const off = (cam.view?.enabled ? cam.view.offsetY : 0) + (cur - want) * 0.25;
          cam.setViewOffset(W, H, 0, off, W, H);
          cam.updateProjectionMatrix();
        }

        // Upper three parts get labels along the top, lower three along the bottom.
        const byY = [...PART_KEYS].sort((p, q) => pts[p][1] - pts[q][1]);
        for (const [side, row] of [['t', byY.slice(0, 3)], ['b', byY.slice(3)]] as const) {
          const ks = row.sort((p, q) => pts[p][0] - pts[q][0]);
          const xs = ks.map((k) => Math.min(W - PAD - LABEL_W, Math.max(PAD, pts[k][0] - LABEL_W / 2)));
          for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i], xs[i - 1] + LABEL_W + GAP);
          for (let i = xs.length - 1; i >= 0; i--) {
            const max = i === xs.length - 1 ? W - PAD - LABEL_W : xs[i + 1] - LABEL_W - GAP;
            xs[i] = Math.min(xs[i], max);
          }
          const rh = Math.max(...ks.map((k) => els[k]?.label?.offsetHeight ?? 0));
          ks.forEach((k, i) => {
            const u = els[k] ?? {};
            const [x, y] = pts[k];
            const h = u.label?.offsetHeight ?? 0;
            const ly = side === 't' ? 26 : H - rh - 22;
            if (u.label) u.label.style.transform = `translate(${xs[i]}px,${ly}px)`;
            const ex = Math.min(xs[i] + LABEL_W - 16, Math.max(xs[i] + 8, x));
            const ey = side === 't' ? ly + h + 4 : ly - 10;
            u.path?.setAttribute('d', Math.abs(ex - x) < 0.5 ? `M${x},${y}V${ey}` : `M${x},${y}V${(y + ey) / 2}H${ex}V${ey}`);
            placeDot(u, x, y);
          });
        }
      };

      cleanup = () => {
        ro.disconnect();
        tilt.stop();
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        locker.dispose();
        stage.dispose();
        sceneRef.current = null;
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <ModelFrame
      eyebrow={l('Hardware', 'Обладнання')}
      title={l('Smart equipment locker', 'Розумна шафа для обладнання')}
      parts={PARTS}
      layout="rows"
      height={660}
      narrowHeight={400}
      narrow={narrow}
      active={active}
      onActive={setActive}
      cardRef={cardRef}
      stageRef={stageRef}
      labelsRef={labelsRef}
      callouts={callouts}
    >
      <CellOverview narrow={narrow} filter={filter} onFilter={setFilter} hoverCell={hoverCell} onHoverCell={setHoverCell} />
    </ModelFrame>
  );
}
