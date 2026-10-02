import * as THREE from 'three';
import { CELLS, OPEN_CELL, STATES, type CellState } from './lockerCells';
import type { PartKey } from './ModelFrame';
import { box, canvasTexture, glowHull, group, put, roundedBoxGeometry, type Axis } from './stage';

/** What is lit and what is filtered out; the scene re-tints itself from this. */
export type LockerView = { active: PartKey | null; hoverCell: number | null; matches: (st: CellState) => boolean };

/**
 * The equipment locker: 40 cells around a kiosk column, cell 13 open with a kit inside.
 * Parts carry `userData.part`, door meshes carry `userData.cell`.
 */
export function buildLocker(reduce: boolean) {
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(o);
  const M = {
    body: std({ name: 'body_warm_grey', color: 0xd8d5ce, roughness: 0.82 }),
    door: std({ name: 'door_warm_light', color: 0xe7e4dd, roughness: 0.78 }),
    doorDim: std({ name: 'door_dimmed', color: 0xf3f2ee, roughness: 0.85 }),
    interior: std({ name: 'interior', color: 0xb4b0a8, roughness: 0.9 }),
    navy: std({ name: 'navy_trim', color: 0x13254a, roughness: 0.62, metalness: 0.05 }),
    alu: std({ name: 'aluminium', color: 0xcfd2d8, roughness: 0.32, metalness: 0.4 }),
    glass: std({ name: 'black_glass', color: 0x0c0e14, roughness: 0.12, metalness: 0.3 }),
    dark: std({ name: 'slot_dark', color: 0x111318, roughness: 0.85 }),
    chip: std({ name: 'chip_black', color: 0x1a1b1f, roughness: 0.45, metalness: 0.15 }),
    pcb: std({ name: 'pcb_green', color: 0x2d5a46, roughness: 0.6 }),
    ledR: std({ name: 'led_scan_red', color: 0xff5040, emissive: 0xff2a1a, emissiveIntensity: 1.6 }),
    ledDim: std({ name: 'led_dimmed', color: 0xd3d5da, roughness: 0.6 }),
    amber: std({ name: 'amber_glow', color: 0xe0a040, emissive: 0xd08a20, emissiveIntensity: 1.4 }),
    amberBack: std({ name: 'amber_back', color: 0xd9c39b, emissive: 0xb07a1f, emissiveIntensity: 0.35, roughness: 0.9 }),
    ledBlue: std({ name: 'led_modem', color: 0x7fa6e0, emissive: 0x4f7cc0, emissiveIntensity: 1.2 }),
  };
  const led = Object.fromEntries(
    Object.entries(STATES).map(([k, s]) => [k, std({ name: 'led_' + k, color: s.color, emissive: s.color, emissiveIntensity: 0.9 })]),
  ) as Record<CellState, THREE.MeshStandardMaterial>;

  const rrp = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
  };
  const drawScreen = (g: CanvasRenderingContext2D, w: number, h: number, cursor: boolean) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#5b6475';
    g.font = '400 26px "IBM Plex Mono"';
    g.textAlign = 'right';
    g.fillText('12:40', 840, 70);
    g.textAlign = 'left';
    g.font = '500 34px "IBM Plex Mono"';
    g.letterSpacing = '5px';
    g.fillText('ENTER PHONE NUMBER', 60, 230);
    g.letterSpacing = '0px';
    rrp(g, 60, 270, 780, 150, 22);
    g.fillStyle = '#f6f6f3';
    g.fill();
    g.strokeStyle = '#1d3b6e';
    g.lineWidth = 3;
    g.stroke();
    g.fillStyle = '#13254a';
    g.font = '600 70px "IBM Plex Sans"';
    const txt = '+•• ••• 42';
    g.fillText(txt, 100, 370);
    if (cursor) {
      g.fillStyle = '#1d3b6e';
      g.fillRect(110 + g.measureText(txt).width, 305, 5, 80);
    }
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
    g.textAlign = 'center';
    keys.forEach((k, i) => {
      if (!k) return;
      const x = 60 + (i % 3) * 270;
      const y = 480 + Math.floor(i / 3) * 175;
      rrp(g, x, y, 240, 150, 20);
      g.fillStyle = '#eef0f4';
      g.fill();
      g.fillStyle = '#13254a';
      g.font = '500 62px "IBM Plex Sans"';
      g.fillText(k, x + 120, y + 98);
    });
    rrp(g, 60, 1220, 780, 140, 22);
    g.fillStyle = '#13254a';
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = '600 52px "IBM Plex Sans"';
    g.fillText('Send code', 450, 1308);
  };
  const screenTex = canvasTexture(900, 1440, (g, w, h) => drawScreen(g, w, h, true));
  let cursorOn = true;
  const blink = reduce
    ? 0
    : window.setInterval(() => {
        cursorOn = !cursorOn;
        drawScreen((screenTex.image as HTMLCanvasElement).getContext('2d')!, 900, 1440, cursorOn);
        screenTex.needsUpdate = true;
      }, 530);
  const screen = new THREE.MeshBasicMaterial({ name: 'kiosk_screen_ui', map: screenTex });
  const termScreen = new THREE.MeshBasicMaterial({ name: 'terminal_screen', color: 0x6f8fbf });

  const geoCache = new Map<string, THREE.BufferGeometry>();
  const rb = (name: string, w: number, h: number, d: number, r: number, mat: THREE.Material, axis: Axis = 'z') => {
    const key = [w, h, d, r, axis].join('|');
    let g = geoCache.get(key);
    if (!g) geoCache.set(key, (g = roundedBoxGeometry(w, h, d, r, axis, 8)));
    const m = new THREE.Mesh(g, mat);
    m.name = name;
    return m;
  };
  const cyl = (name: string, r: number, h: number, mat: THREE.Material) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), mat);
    m.name = name;
    return m;
  };
  const anchor = (x: number, y: number, z: number) => put(L, new THREE.Object3D(), x, y, z);

  // Cell width and height, kiosk column width, bottom of the cells, front face.
  const CW = 0.3, CH = 0.34, KW = 0.56, Y0 = 0.1, FZ = 0.275;
  const X0 = -(10 * CW + KW) / 2;
  const colX = (c: number) => X0 + CW / 2 + c * CW + (c >= 5 ? KW : 0);
  const rowY = (r: number) => Y0 + (3.5 - r) * CH;
  const YC = Y0 + 2 * CH;

  const root = group('equipment_locker');
  const L = put(root, group('locker_body'), 0, -YC, 0);
  root.position.y = YC;
  const shell = put(L, group('carcass'));
  put(shell, box('back_block', 3.56, 4 * CH, FZ, M.interior), 0, YC, -FZ / 2);
  put(shell, rb('top_slab', 3.56, 0.06, 0.55, 0.01, M.body), 0, Y0 + 4 * CH + 0.03, 0);
  put(shell, box('bottom_slab', 3.56, 0.02, 0.55, M.body), 0, Y0 - 0.01, 0);
  put(shell, rb('plinth', 3.62, 0.08, 0.5, 0.012, M.navy), 0, 0.045, -0.01);
  for (const s of [-1, 1]) put(shell, rb('end_panel_' + (s < 0 ? 'L' : 'R'), 0.04, 1.52, 0.57, 0.02, M.navy, 'x'), s * 1.8, 0.78, 0);
  for (let k = 1; k < 4; k++) put(shell, box('shelf_' + k, 3.56, 0.012, FZ, M.body), 0, Y0 + k * CH, FZ / 2);
  const dividers: number[] = [];
  for (let c = 1; c <= 9; c++) dividers.push(X0 + c * CW + (c >= 5 ? KW : 0));
  dividers.push(X0 + 5 * CW);
  dividers.forEach((x, i) => put(shell, box('divider_' + i, 0.012, 4 * CH, FZ, M.body), x, YC, FZ / 2));

  // A — kiosk column
  const A = put(L, group('kiosk'));
  put(A, box('kiosk_block', KW, 4 * CH, FZ, M.body), 0, YC, FZ / 2);
  put(A, rb('kiosk_front', KW - 0.008, 4 * CH - 0.008, 0.016, 0.012, M.door), 0, YC, FZ + 0.008);
  const sY = Y0 + 4 * CH - 0.42;
  put(A, rb('screen_frame', 0.47, 0.74, 0.024, 0.026, M.navy), 0, sY, FZ + 0.02);
  put(A, new THREE.Mesh(new THREE.PlaneGeometry(0.405, 0.648), screen), 0, sY, FZ + 0.0325).name = 'kiosk_display';
  const aA = anchor(-0.12, sY + 0.17, FZ + 0.033);

  // B — QR scanner
  const B = put(L, group('qr_scanner'));
  const qY = Y0 + 0.78;
  put(B, rb('qr_bezel', 0.3, 0.11, 0.022, 0.016, M.navy), 0, qY, FZ + 0.02);
  put(B, rb('qr_window', 0.26, 0.07, 0.006, 0.01, M.glass), 0, qY, FZ + 0.032);
  put(B, box('qr_scan_line', 0.2, 0.0025, 0.001, M.ledR), 0, qY, FZ + 0.0355);
  const aB = anchor(0.1, qY, FZ + 0.036);

  // C — doors
  const C = put(L, group('cell_doors'));
  const D = put(L, group('open_cell_13'));
  const numTex = (n: number) =>
    canvasTexture(128, 64, (g) => {
      g.fillStyle = '#e7e4dd';
      g.fillRect(0, 0, 128, 64);
      g.fillStyle = '#5b6475';
      g.font = '500 40px "IBM Plex Mono"';
      g.textBaseline = 'middle';
      g.fillText(String(n).padStart(2, '0'), 6, 34);
    });
  const doors: Record<number, { panel: THREE.Mesh; led: THREE.Mesh; others: THREE.Mesh[] }> = {};
  const dw = CW - 0.008, dh = CH - 0.008;
  for (const cl of CELLS) {
    const g = put(C, group('door_' + cl.n), colX(cl.c) + CW / 2 - 0.004, rowY(cl.r), FZ + 0.009);
    if (cl.n === OPEN_CELL) g.rotation.y = (70 * Math.PI) / 180;
    const panel = put(g, rb('door_panel_' + cl.n, dw, dh, 0.016, 0.01, M.door), -dw / 2, 0, 0);
    if (cl.n === OPEN_CELL) put(g, box('door13_inner_edge', 0.004, dh - 0.01, 0.017, M.amber), -dw + 0.002, 0, 0);
    const handle = put(g, rb('handle_' + cl.n, 0.014, 0.09, 0.014, 0.006, M.alu), -dw + 0.035, -0.03, 0.014);
    const lock = put(g, cyl('lock_' + cl.n, 0.008, 0.008, M.alu), -dw + 0.035, 0.05, 0.011, Math.PI / 2);
    const ledBar = put(g, box('led_' + cl.n, 0.1, 0.007, 0.002, led[cl.st]), -dw / 2 + 0.03, dh / 2 - 0.03, 0.009);
    const num = put(g, new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.025), std({ name: 'door_number', map: numTex(cl.n), roughness: 0.8 })), -dw + 0.045, dh / 2 - 0.03, 0.0085);
    num.name = 'number_' + cl.n;
    doors[cl.n] = { panel, led: ledBar, others: [handle, lock, num] };
  }
  // D — open cell interior
  {
    const x = colX(2), y = rowY(1);
    put(D, box('cell13_back_glow', CW - 0.014, CH - 0.014, 0.002, M.amberBack), x, y, 0.002);
    put(D, box('cell13_edge_top', CW - 0.012, 0.004, 0.006, M.amber), x, y + CH / 2 - 0.008, FZ - 0.003);
    put(D, box('cell13_edge_bottom', CW - 0.012, 0.004, 0.006, M.amber), x, y - CH / 2 + 0.008, FZ - 0.003);
    put(D, box('cell13_edge_left', 0.004, CH - 0.012, 0.006, M.amber), x - CW / 2 + 0.008, y, FZ - 0.003);
    put(D, box('cell13_edge_right', 0.004, CH - 0.012, 0.006, M.amber), x + CW / 2 - 0.008, y, FZ - 0.003);
    const sy = y - CH / 2 + 0.006;
    put(D, rb('kit_stand', 0.24, 0.024, 0.18, 0.008, M.alu, 'y'), x, sy + 0.012, 0.15);
    const top = sy + 0.024;
    put(D, rb('kit_terminal', 0.062, 0.02, 0.11, 0.01, M.chip, 'y'), x - 0.07, top + 0.01, 0.15, 0, 0.12);
    put(D, new THREE.Mesh(new THREE.PlaneGeometry(0.044, 0.03), termScreen), x - 0.072, top + 0.0205, 0.13, -Math.PI / 2, 0, 0.12).name = 'kit_terminal_screen';
    put(D, rb('kit_phone', 0.046, 0.008, 0.094, 0.008, M.glass, 'y'), x + 0.005, top + 0.004, 0.155, 0, -0.08);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.013, 0.0025, 10, 28), M.alu);
    ring.name = 'kit_key_ring';
    put(D, ring, x + 0.07, top + 0.003, 0.19, Math.PI / 2);
    put(D, rb('kit_key_fob', 0.026, 0.012, 0.042, 0.008, M.chip, 'y'), x + 0.075, top + 0.006, 0.155, 0, 0.2);
    put(D, box('kit_key_blade', 0.008, 0.003, 0.04, M.alu), x + 0.09, top + 0.0015, 0.12, 0, 0.35);
  }
  const aC = anchor(colX(8), rowY(3) - 0.06, FZ + 0.018);
  const aD = anchor(colX(2), rowY(1) - 0.03, 0.16);

  // E — lock controller through the side cut-out
  const E = put(L, group('lock_controller'));
  {
    const X = -1.82, y = 0.66, z = 0.0;
    put(E, box('cutout_recess', 0.002, 0.24, 0.3, M.dark), X - 0.001, y, z);
    for (const [n, h, d, dy, dz] of [
      ['top', 0.012, 0.31, 0.126, 0],
      ['bottom', 0.012, 0.31, -0.126, 0],
      ['front', 0.264, 0.012, 0, 0.155],
      ['back', 0.264, 0.012, 0, -0.155],
    ] as const)
      put(E, box('cutout_frame_' + n, 0.01, h, d, M.alu), X - 0.005, y + dy, z + dz);
    put(E, box('pi_board', 0.002, 0.11, 0.17, M.pcb), X - 0.003, y, z);
    put(E, box('pi_soc', 0.003, 0.03, 0.03, M.chip), X - 0.0055, y + 0.005, z + 0.02);
    put(E, box('pi_ram', 0.003, 0.024, 0.03, M.chip), X - 0.0055, y + 0.005, z - 0.02);
    put(E, box('pi_gpio', 0.008, 0.01, 0.11, M.chip), X - 0.008, y + 0.043, z + 0.01);
    for (let i = 0; i < 3; i++) put(E, box('pi_port_' + i, 0.014, 0.03, 0.026, M.alu), X - 0.01, y - 0.03, z - 0.06 + i * 0.034);
    put(E, box('pi_led', 0.002, 0.005, 0.005, M.ledBlue), X - 0.0045, y - 0.045, z + 0.07);
    for (let i = 0; i < 4; i++) put(E, box('lock_bus_wire_' + i, 0.003, 0.004, 0.11, [M.navy, M.ledDim, M.chip, M.alu][i]), X - 0.004, y - 0.09 + i * 0.007, z + 0.03);
  }
  const aE = anchor(-1.832, 0.68, 0.02);

  // F — GSM modem on the roof
  const F = put(L, group('gsm_modem'));
  {
    const x = 1.52, top = Y0 + 4 * CH + 0.06;
    put(F, rb('modem_body', 0.15, 0.045, 0.1, 0.012, M.navy, 'y'), x, top + 0.0225, -0.05);
    put(F, box('modem_led', 0.02, 0.004, 0.002, M.ledBlue), x - 0.03, top + 0.03, 0.0005);
    put(F, cyl('antenna_base', 0.014, 0.02, M.chip), x + 0.045, top + 0.055, -0.05);
    put(F, cyl('antenna_whip', 0.0065, 0.2, M.chip), x + 0.045, top + 0.165, -0.05);
    put(F, new THREE.Mesh(new THREE.SphereGeometry(0.009, 16, 12), M.chip), x + 0.045, top + 0.266, -0.05).name = 'antenna_tip';
  }
  const aF = anchor(1.52 + 0.06, Y0 + 4 * CH + 0.09, 0.0);

  // Highlighting: tinted materials plus glow hulls, recomputed from the view on every change.
  const glow = new THREE.MeshBasicMaterial({ name: 'highlight_glow', color: 0x1d3b6e, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false });
  const tints = new Map<THREE.Material, THREE.Material>();
  const tint = (mat: THREE.Material) => {
    if (!(mat instanceof THREE.MeshStandardMaterial) || mat.map || mat.emissive.getHex() !== 0) return mat;
    let t = tints.get(mat);
    if (!t) {
      const c = mat.clone();
      c.name = mat.name + '_hl';
      c.emissive = new THREE.Color(0x1d3b6e);
      c.emissiveIntensity = mat.color.getHSL({ h: 0, s: 0, l: 0 }).l < 0.4 ? 0.08 : 0.14;
      tints.set(mat, (t = c));
    }
    return t;
  };
  type Entry = { mesh: THREE.Mesh; base: THREE.Material | ((v: LockerView) => THREE.Material); hull: THREE.Mesh | null; parts: PartKey[]; cell?: number };
  const entries: Entry[] = [];
  for (const [k, g] of Object.entries({ A, B, D, E, F }) as [PartKey, THREE.Object3D][]) {
    const meshes: THREE.Mesh[] = [];
    g.traverse((o) => {
      if (o instanceof THREE.Mesh) meshes.push(o);
    });
    for (const o of meshes) {
      o.userData.part = k;
      entries.push({ mesh: o, base: o.material as THREE.Material, hull: glowHull(o, glow, 0.006, 0.015), parts: [k] });
    }
  }
  for (const cl of CELLS) {
    const door = doors[cl.n];
    const parts: PartKey[] = cl.n === OPEN_CELL ? ['C', 'D'] : ['C'];
    const dim = (v: LockerView) => !v.matches(cl.st);
    for (const m of [door.panel, door.led, ...door.others]) m.userData.cell = cl.n;
    entries.push({ mesh: door.panel, base: (v) => (dim(v) ? M.doorDim : M.door), hull: glowHull(door.panel, glow, 0.008, 0.015), parts, cell: cl.n });
    entries.push({ mesh: door.led, base: (v) => (dim(v) ? M.ledDim : led[cl.st]), hull: null, parts, cell: cl.n });
    for (const o of door.others) entries.push({ mesh: o, base: o.material as THREE.Material, hull: null, parts, cell: cl.n });
  }

  return {
    root,
    anchors: { A: aA, B: aB, C: aC, D: aD, E: aE, F: aF } as Record<PartKey, THREE.Object3D>,
    /** The open door swings out over its neighbours; its shadow would read as a smudge. */
    noShadow: C.getObjectByName('door_' + OPEN_CELL)!,
    /** Centre of the locker, which the camera looks at. */
    centreY: YC,
    update(view: LockerView) {
      for (const e of entries) {
        const lit = (view.active !== null && e.parts.includes(view.active)) || (view.hoverCell !== null && e.cell === view.hoverCell);
        const m = typeof e.base === 'function' ? e.base(view) : e.base;
        e.mesh.material = lit ? tint(m) : m;
        if (e.hull) e.hull.visible = lit;
      }
    },
    dispose() {
      window.clearInterval(blink);
      glow.dispose();
      for (const t of tints.values()) t.dispose();
      // Materials swapped out of the scene at dispose time are not reached by the stage.
      for (const m of [M.door, M.doorDim, M.ledDim, ...Object.values(led)]) m.dispose();
    },
  };
}
