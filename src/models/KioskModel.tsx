import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { l } from '../i18n';
import { buildKiosk } from './kioskScene';
import { ModelFrame, PART_KEYS, placeDot, prefersReducedMotion, useNarrow, type CalloutRefs, type Part, type PartKey } from './ModelFrame';
import { loadFonts, Stage, trackPointer } from './stage';

const PARTS: Record<PartKey, Part> = {
  A: {
    side: 'l',
    icon: '<rect x="4" y="1.5" width="8" height="13" rx="1.5"/><line x1="7" y1="12.2" x2="9" y2="12.2"/>',
    title: l('Screen assembly', 'Екранний модуль'),
    text: l('Kiosk UI: ten flow screens, transitions, live status', 'Інтерфейс кіоску: десять екранів сценарію, переходи, живий статус'),
  },
  B: {
    side: 'r',
    icon: '<rect x="3.5" y="1.5" width="9" height="13" rx="1.5"/><rect x="5.5" y="3.5" width="5" height="3" rx=".5"/><line x1="6" y1="9" x2="6" y2="9"/><line x1="8" y1="9" x2="8" y2="9"/><line x1="10" y1="9" x2="10" y2="9"/><line x1="6" y1="11.5" x2="6" y2="11.5"/><line x1="8" y1="11.5" x2="8" y2="11.5"/><line x1="10" y1="11.5" x2="10" y2="11.5"/>',
    title: l('Bank terminal', 'Банківський термінал'),
    text: l('Own binary protocol over TCP: sale, refund, shift close', 'Власний бінарний протокол поверх TCP: продаж, повернення, закриття зміни'),
  },
  C: {
    side: 'r',
    icon: '<path d="M2 5.5V2h3.5M10.5 2H14v3.5M14 10.5V14h-3.5M5.5 14H2v-3.5"/><line x1="4" y1="8" x2="12" y2="8"/>',
    title: l('QR scanner', 'QR-сканер'),
    text: l('Document scan → invoice lookup in the external gateway', 'Сканування документа → пошук рахунку в зовнішньому шлюзі'),
  },
  D: {
    side: 'l',
    icon: '<rect x="1.5" y="4" width="13" height="8" rx="1.2"/><circle cx="8" cy="8" r="1.8"/>',
    title: l('Cash module', 'Модуль готівки'),
    text: l('Intake and change, cassettes, denominations, min/max limits', 'Прийом і видача решти, касети, номінали, ліміти min/max'),
  },
  E: {
    side: 'r',
    icon: '<path d="M4 1.5h8v13l-1.6-1-1.2 1-1.2-1-1.2 1-1.2-1-1.6 1z"/><line x1="6" y1="5" x2="10" y2="5"/><line x1="6" y1="7.5" x2="10" y2="7.5"/>',
    title: l('Receipt printer', 'Принтер чеків'),
    text: l('PDF by two engines, HTML preview, plain-text version', 'PDF двома рушіями, HTML-прев’ю, текстова версія'),
  },
  F: {
    side: 'l',
    icon: '<rect x="4" y="4" width="8" height="8" rx="1"/><rect x="6.5" y="6.5" width="3" height="3"/><path d="M6 2v2M10 2v2M6 12v2M10 12v2M2 6h2M2 10h2M12 6h2M12 10h2"/>',
    title: l('On-board computer', 'Бортовий комп’ютер'),
    text: l('Hardware server, operational core, local database', 'Апаратний сервер, операційне ядро, локальна база даних'),
  },
};

const LABEL_W = 236;
const LABEL_INSET = 30;

/** Interactive anatomy of the payment kiosk: hover a part or a label to light it up. */
export default function KioskModel() {
  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const callouts = useRef<CalloutRefs>({});
  const [active, setActive] = useState<PartKey | null>(null);
  const narrow = useNarrow(cardRef);
  const narrowRef = useRef(narrow);
  narrowRef.current = narrow;
  const sceneRef = useRef<ReturnType<typeof buildKiosk>>(null);

  useEffect(() => sceneRef.current?.highlight(active), [active]);

  useEffect(() => {
    const card = cardRef.current!;
    const host = stageRef.current!;
    let disposed = false;
    let cleanup = () => {};

    loadFonts(['600 40px "IBM Plex Sans"', '700 40px "IBM Plex Sans"', '500 30px "IBM Plex Mono"']).then(() => {
      if (disposed) return;
      const stage = new Stage(host);
      const kiosk = buildKiosk();
      sceneRef.current = kiosk;
      stage.setObject(kiosk.root);
      kiosk.noShadow.traverse((o) => (o.castShadow = false));

      // Three-quarter front-left, slightly above; key light from the top left.
      const cam = stage.camera;
      cam.fov = 30;
      const target = new THREE.Vector3(0.05, 0.84, 0);
      const dir = new THREE.Vector3(-0.52, 0.3, 1).normalize();
      stage.key.position.set(-1.6, 9, 2.6);
      const frame = () => {
        const free = card.clientWidth - 2 * (LABEL_INSET + LABEL_W + 40);
        const dist = card.clientWidth < 720 ? 4.6 : 3.7 * Math.max(1, 300 / Math.max(free, 120));
        cam.position.copy(target).addScaledVector(dir, dist);
        cam.lookAt(target);
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
        const hit = ray.intersectObject(kiosk.root, true)[0];
        setActive((hit?.object.userData.part as PartKey | undefined) ?? null);
      };
      const onLeave = () => setActive(null);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);

      const tilt = trackPointer(card, prefersReducedMotion());
      const v = new THREE.Vector3();
      stage.onFrame = () => {
        tilt.step(kiosk.root);
        const W = card.clientWidth;
        const H = card.clientHeight;
        labelsRef.current?.setAttribute('data-placed', '');
        const pts = {} as Record<PartKey, [number, number]>;
        for (const k of PART_KEYS) {
          kiosk.anchors[k].getWorldPosition(v).project(cam);
          pts[k] = [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H];
        }
        const els = callouts.current;
        if (narrowRef.current) {
          for (const k of PART_KEYS) {
            const [x, y] = pts[k];
            const u = els[k] ?? {};
            const left = PARTS[k].side === 'l';
            const bx = x + (left ? -40 : 40);
            if (u.badge) u.badge.style.transform = `translate(${bx}px,${y}px)`;
            u.path?.setAttribute('d', `M${x},${y}H${bx + (left ? 12 : -12)}`);
            placeDot(u, x, y);
          }
          return;
        }
        for (const side of ['l', 'r'] as const) {
          const ks = PART_KEYS.filter((k) => PARTS[k].side === side).sort((a, b) => pts[a][1] - pts[b][1]);
          const ys = ks.map((k) => pts[k][1]);
          const hs = ks.map((k) => els[k]?.label?.offsetHeight ?? 0);
          // Push labels apart top-down, then pull them back up from the bottom edge.
          for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + hs[i - 1] - 2);
          for (let i = ys.length - 1; i >= 0; i--) {
            const max = i === ys.length - 1 ? H - hs[i] + 4 : ys[i + 1] - hs[i] + 2;
            ys[i] = Math.min(ys[i], max);
          }
          ks.forEach((k, i) => {
            const u = els[k] ?? {};
            const [x, y] = pts[k];
            const ly = Math.max(24, ys[i]);
            if (u.label) u.label.style.transform = `translateY(${ly - 10}px)`;
            const edge = side === 'l' ? LABEL_INSET + LABEL_W + 14 : W - LABEL_INSET - LABEL_W - 14;
            const jog = side === 'l' ? edge + 14 : edge - 14;
            placeDot(u, x, y);
            if (side === 'r' ? x > edge - 4 : x < edge + 4) u.path?.setAttribute('d', '');
            else u.path?.setAttribute('d', Math.abs(ly - y) < 0.5 ? `M${x},${y}H${edge}` : `M${x},${y}H${jog}L${edge},${ly}`);
          });
        }
      };

      cleanup = () => {
        ro.disconnect();
        tilt.stop();
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        kiosk.dispose();
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
      title={l('Anatomy of the kiosk', 'Анатомія кіоску')}
      hint={l('Hover a part or a label', 'Наведіть на деталь або підпис')}
      parts={PARTS}
      layout="columns"
      height={720}
      narrowHeight={460}
      narrow={narrow}
      active={active}
      onActive={setActive}
      cardRef={cardRef}
      stageRef={stageRef}
      labelsRef={labelsRef}
      callouts={callouts}
    />
  );
}
