import * as THREE from 'three';
import type { PartKey } from './ModelFrame';
import { box, canvasTexture, glowHull, group, put, roundedBoxGeometry, type Axis } from './stage';

/** The payment kiosk, built in metres from named meshes. Parts A–F carry `userData.part`. */
export function buildKiosk() {
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(o);
  const M = {
    shell: std({ name: 'powder_light_grey', color: 0xdedfe4, roughness: 0.78, metalness: 0 }),
    graphite: std({ name: 'graphite', color: 0x3a3c43, roughness: 0.6, metalness: 0.08 }),
    alu: std({ name: 'aluminium', color: 0xd6d9df, roughness: 0.3, metalness: 0.35 }),
    glass: std({ name: 'black_glass', color: 0x0c0d11, roughness: 0.12, metalness: 0.3 }),
    dark: std({ name: 'slot_dark', color: 0x0f1013, roughness: 0.85 }),
    ledG: std({ name: 'led_green', color: 0x86e651, emissive: 0x6cd63a, emissiveIntensity: 1.1 }),
    ledR: std({ name: 'scan_red', color: 0xff5040, emissive: 0xff2a1a, emissiveIntensity: 1.6 }),
    pcb: std({ name: 'pcb', color: 0x2a4c40, roughness: 0.6 }),
    chip: std({ name: 'chip', color: 0x1a1b1f, roughness: 0.45, metalness: 0.15 }),
  };

  const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
  };
  const screenTex = canvasTexture(800, 1000, (g, w, h) => {
    g.fillStyle = '#0f1014';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#6cd63a';
    g.beginPath();
    g.arc(732, 66, 9, 0, 7);
    g.fill();
    g.fillStyle = '#5c5f6a';
    g.font = '500 22px "IBM Plex Mono"';
    g.textAlign = 'right';
    g.fillText('12:40', 706, 74);
    g.textAlign = 'left';
    g.fillStyle = '#8b8e99';
    g.font = '500 30px "IBM Plex Mono"';
    g.letterSpacing = '4px';
    g.fillText('CHOOSE PAYMENT', 70, 200);
    g.letterSpacing = '0px';
    const btn = (y: number, label: string, on: boolean) => {
      rr(g, 70, y, 660, 150, 30);
      g.fillStyle = on ? '#1d3b6e' : '#1c1e25';
      g.fill();
      if (!on) {
        g.strokeStyle = '#2b2e37';
        g.lineWidth = 2;
        g.stroke();
      }
      g.fillStyle = on ? '#ffffff' : '#e4e5ea';
      g.font = '600 46px "IBM Plex Sans"';
      g.fillText(label, 118, y + 92);
      g.strokeStyle = on ? '#ffffff' : '#6d707b';
      g.lineWidth = 5;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(650, y + 60);
      g.lineTo(670, y + 75);
      g.lineTo(650, y + 90);
      g.stroke();
    };
    btn(250, 'Cash', true);
    btn(430, 'Card', false);
    btn(610, 'QR document', false);
    g.fillStyle = '#25272f';
    g.fillRect(70, 850, 660, 2);
    g.fillStyle = '#8b8e99';
    g.font = '500 36px "IBM Plex Sans"';
    g.fillText('Total', 70, 930);
    g.fillStyle = '#ffffff';
    g.font = '700 54px "IBM Plex Sans"';
    g.textAlign = 'right';
    g.fillText('◈ 1 250', 730, 934);
  });
  const paperTex = canvasTexture(300, 440, (g, w, h) => {
    g.fillStyle = '#fbfbf8';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#b9bac0';
    for (const [x, y, l] of [[40, 60, 150], [40, 100, 220], [40, 130, 180], [40, 160, 200], [40, 190, 120]]) g.fillRect(x, y, l, 9);
    g.fillRect(40, 228, 220, 2);
    g.fillStyle = '#55565e';
    g.fillRect(40, 255, 90, 14);
    g.fillRect(190, 255, 70, 14);
    g.fillStyle = '#c9cad0';
    for (const [x, y, l] of [[40, 300, 200], [40, 326, 160]]) g.fillRect(x, y, l, 8);
    g.fillStyle = '#9fa0a7';
    for (let i = 0; i < 14; i++) g.fillRect(40 + i * 15, 362, i % 3 ? 7 : 11, 40);
  });
  const screen = new THREE.MeshBasicMaterial({ name: 'screen_ui', map: screenTex });
  const paper = std({ name: 'receipt_paper', map: paperTex, roughness: 0.9, side: THREE.DoubleSide });

  const rb = (name: string, w: number, h: number, d: number, r: number, mat: THREE.Material, axis: Axis = 'z') => {
    const m = new THREE.Mesh(roundedBoxGeometry(w, h, d, r, axis, 10), mat);
    m.name = name;
    return m;
  };
  const anchor = (parent: THREE.Object3D, x: number, y: number, z: number) => put(parent, new THREE.Object3D(), x, y, z);

  // Tilt pivot at the kiosk centre.
  const root = group('payment_kiosk');
  const kiosk = group('kiosk_body');
  kiosk.position.y = -0.82;
  root.position.y = 0.82;
  root.add(kiosk);
  const Z = 0.15; // front face of the cabinet

  const chassis = put(kiosk, group('chassis'));
  put(chassis, rb('plinth', 0.49, 0.05, 0.27, 0.025, M.graphite, 'y'), 0, 0.025, -0.005);
  put(chassis, rb('cabinet', 0.52, 1.03, 0.3, 0.04, M.shell, 'y'), 0, 0.565, 0);
  for (const s of [-1, 1]) {
    const side = s < 0 ? 'L' : 'R';
    put(chassis, rb('side_panel_' + side, 0.014, 0.97, 0.262, 0.02, M.graphite, 'x'), s * 0.2635, 0.565, -0.004);
    put(chassis, box('trim_front_' + side, 0.005, 0.98, 0.004, M.alu), s * 0.236, 0.565, Z + 0.0005);
  }
  put(chassis, box('trim_top', 0.47, 0.005, 0.004, M.alu), 0, 1.073, Z - 0.004);
  put(chassis, rb('neck', 0.44, 0.03, 0.2, 0.03, M.graphite, 'y'), 0, 1.09, -0.01);
  // service door
  put(chassis, rb('door_gap', 0.43, 0.46, 0.004, 0.018, M.graphite), 0, 0.33, Z + 0.0015);
  put(chassis, rb('service_door', 0.42, 0.45, 0.008, 0.015, M.shell), 0, 0.33, Z + 0.006);
  put(chassis, new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.01, 32), M.alu), 0.165, 0.5, Z + 0.014, Math.PI / 2).name = 'door_lock';
  put(chassis, box('keyhole', 0.0025, 0.012, 0.002, M.dark), 0.165, 0.5, Z + 0.0195);
  for (let i = 0; i < 7; i++) put(chassis, rb('vent_slat_' + i, 0.27, 0.006, 0.004, 0.003, M.graphite), 0, 0.14 + i * 0.013, Z + 0.011);

  // A — screen assembly, tilted back
  const A = put(kiosk, group('screen_assembly'), 0, 1.1, 0.02, -0.16);
  put(A, rb('screen_housing', 0.5, 0.6, 0.1, 0.035, M.graphite), 0, 0.3, 0);
  put(A, rb('screen_bezel_glass', 0.484, 0.584, 0.012, 0.028, M.glass), 0, 0.3, 0.056);
  put(A, new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.5), screen), 0, 0.31, 0.0625).name = 'display';
  put(A, new THREE.Mesh(new THREE.CircleGeometry(0.004, 24), M.chip), 0, 0.575, 0.0625).name = 'camera_dot';
  const aA = anchor(A, -0.13, 0.42, 0.063);

  // B — bank terminal on a bracket
  const B = put(kiosk, group('bank_terminal'));
  put(B, rb('terminal_bracket_arm', 0.15, 0.024, 0.05, 0.012, M.graphite, 'y'), 0.3, 1.12, 0.06);
  put(B, rb('terminal_cradle', 0.11, 0.04, 0.06, 0.016, M.graphite), 0.37, 1.145, 0.075, -0.45, -0.22);
  const T = put(B, group('terminal_unit'), 0.37, 1.235, 0.1, -0.45, -0.22);
  put(T, rb('terminal_body', 0.092, 0.172, 0.032, 0.014, M.chip), 0, 0, 0);
  put(T, rb('terminal_display', 0.068, 0.044, 0.003, 0.004, M.glass), 0, 0.048, 0.0165);
  put(T, box('terminal_display_lit', 0.058, 0.032, 0.001, screen), 0, 0.048, 0.0185);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 3; c++) put(T, rb(`pin_key_${r}${c}`, 0.021, 0.013, 0.005, 0.003, M.shell), (c - 1) * 0.026, 0.004 - r * 0.02, 0.017);
  put(T, box('card_slot', 0.064, 0.003, 0.007, M.dark), 0, 0.0855, 0);
  const aB = anchor(T, 0.03, -0.02, 0.02);

  // C — QR scanner
  const C = put(kiosk, group('qr_scanner'));
  put(C, rb('qr_bezel', 0.22, 0.085, 0.02, 0.014, M.graphite), 0, 0.975, Z + 0.008);
  put(C, rb('qr_window', 0.19, 0.058, 0.006, 0.009, M.glass), 0, 0.975, Z + 0.019);
  put(C, box('qr_scan_line', 0.15, 0.0022, 0.001, M.ledR), 0, 0.975, Z + 0.0225);
  const aC = anchor(C, 0.08, 0.975, Z + 0.023);

  // D — cash module
  const D = put(kiosk, group('cash_module'));
  put(D, rb('bill_acceptor_housing', 0.25, 0.075, 0.03, 0.014, M.graphite), -0.04, 0.855, Z + 0.013);
  for (const [n, w, h, x, y] of [
    ['top', 0.19, 0.004, 0, 0.017],
    ['bottom', 0.19, 0.004, 0, -0.017],
    ['left', 0.004, 0.038, -0.093, 0],
    ['right', 0.004, 0.038, 0.093, 0],
  ] as const)
    put(D, box('bill_led_' + n, w, h, 0.002, M.ledG), -0.04 + x, 0.855 + y, Z + 0.029);
  put(D, box('bill_slot', 0.17, 0.008, 0.003, M.dark), -0.04, 0.855, Z + 0.0285);
  put(D, rb('coin_plate', 0.055, 0.075, 0.016, 0.012, M.graphite), 0.155, 0.855, Z + 0.006);
  put(D, box('coin_slot', 0.004, 0.036, 0.003, M.dark), 0.155, 0.855, Z + 0.0145);
  put(D, rb('change_tray_bezel', 0.19, 0.075, 0.018, 0.014, M.graphite), 0, 0.745, Z + 0.007);
  put(D, rb('change_tray_cavity', 0.16, 0.05, 0.004, 0.01, M.dark), 0, 0.748, Z + 0.0165);
  put(D, rb('change_tray_lip', 0.17, 0.01, 0.034, 0.005, M.alu, 'y'), 0, 0.716, Z + 0.02);
  const aD = anchor(D, -0.12, 0.855, Z + 0.03);

  // E — receipt printer
  const E = put(kiosk, group('receipt_printer'));
  put(E, rb('printer_bezel', 0.16, 0.04, 0.014, 0.01, M.graphite), 0, 0.655, Z + 0.006);
  put(E, box('printer_slot', 0.11, 0.005, 0.003, M.dark), 0, 0.655, Z + 0.0135);
  const receipt = put(E, group('receipt'), 0, 0.653, Z + 0.015, -0.42);
  put(receipt, new THREE.Mesh(new THREE.PlaneGeometry(0.076, 0.11), paper), 0, -0.055, 0).name = 'receipt_paper';
  const aE = anchor(E, 0.06, 0.655, Z + 0.014);

  // F — on-board computer, seen through the left side cut-out
  const F = put(kiosk, group('onboard_computer'));
  const X = -0.2705;
  put(F, rb('cutout_frame', 0.003, 0.22, 0.17, 0.014, M.alu, 'x'), X - 0.0005, 0.42, -0.005);
  put(F, rb('cutout_recess', 0.003, 0.205, 0.155, 0.01, M.dark, 'x'), X - 0.0015, 0.42, -0.005);
  put(F, box('mainboard', 0.002, 0.18, 0.13, M.pcb), X - 0.003, 0.42, -0.005);
  put(F, box('cpu', 0.004, 0.045, 0.045, M.chip), X - 0.0055, 0.45, 0.02);
  for (let i = 0; i < 5; i++) put(F, box('heatsink_fin_' + i, 0.012, 0.042, 0.002, M.alu), X - 0.0115, 0.45, 0.004 + i * 0.008);
  for (let i = 0; i < 2; i++) put(F, box('ram_' + i, 0.012, 0.11, 0.006, M.chip), X - 0.009, 0.42, -0.04 - i * 0.012);
  put(F, box('chip_a', 0.003, 0.022, 0.03, M.chip), X - 0.005, 0.37, 0.03);
  put(F, box('chip_b', 0.003, 0.016, 0.016, M.chip), X - 0.005, 0.37, -0.005);
  put(F, box('board_led', 0.002, 0.006, 0.006, M.ledG), X - 0.0045, 0.5, 0.045);
  const aF = anchor(F, X - 0.012, 0.445, 0.01);

  const anchors: Record<PartKey, THREE.Object3D> = { A: aA, B: aB, C: aC, D: aD, E: aE, F: aF };
  const regions: Record<PartKey, THREE.Object3D> = { A, B, C, D, E, F };

  // Glow hulls and an emissive tint mark the highlighted part.
  const glow = new THREE.MeshBasicMaterial({ name: 'highlight_glow', color: 0x1d3b6e, transparent: true, opacity: 0.18, side: THREE.BackSide, depthWrite: false });
  const tints = new Map<THREE.Material, THREE.Material>();
  const tint = (mat: THREE.Material) => {
    if (!(mat instanceof THREE.MeshStandardMaterial) || mat.map) return mat;
    let t = tints.get(mat);
    if (!t) {
      const c = mat.clone();
      c.name = mat.name + '_hl';
      c.emissive = new THREE.Color(0x1d3b6e);
      c.emissiveIntensity = mat.color.getHSL({ h: 0, s: 0, l: 0 }).l < 0.4 ? 0.05 : 0.1;
      tints.set(mat, (t = c));
    }
    return t;
  };
  const parts = {} as Record<PartKey, { mesh: THREE.Mesh; base: THREE.Material; hull: THREE.Mesh | null }[]>;
  for (const key of Object.keys(regions) as PartKey[]) {
    const list: (typeof parts)[PartKey] = [];
    regions[key].traverse((o) => {
      if (!(o instanceof THREE.Mesh) || o.material === glow) return;
      o.userData.part = key;
      list.push({ mesh: o, base: o.material, hull: null });
    });
    for (const p of list) p.hull = glowHull(p.mesh, glow, 0.006);
    parts[key] = list;
  }

  let shown: PartKey | null = null;
  return {
    root,
    anchors,
    /** Bank terminal floats on a bracket; its shadow would land on the screen. */
    noShadow: B,
    highlight(key: PartKey | null) {
      const show = (k: PartKey, on: boolean) => {
        for (const p of parts[k]) {
          p.mesh.material = on ? tint(p.base) : p.base;
          if (p.hull) p.hull.visible = on;
        }
      };
      if (shown) show(shown, false);
      shown = key;
      if (key) show(key, true);
    },
    dispose() {
      glow.dispose();
      for (const t of tints.values()) t.dispose();
    },
  };
}
