import * as THREE from 'three';

/**
 * A three.js scene that fills its host element: renderer, neutral studio lighting with a soft
 * ground shadow, and a camera the model positions itself. Rendering pauses while the host is
 * off screen, so two models on one page cost nothing until they are scrolled to.
 */
export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(45, 1, 0.01, 500);
  readonly key: THREE.DirectionalLight;
  readonly ground: THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>;
  /** Called before every rendered frame. */
  onFrame: (() => void) | null = null;

  private readonly resize: ResizeObserver;
  private readonly visibility: IntersectionObserver;
  private object: THREE.Object3D | null = null;

  constructor(private readonly host: HTMLElement) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);
    this.renderer = renderer;

    // Soft sky/ground wash, a shadow-casting key light, and a dim fill from behind so
    // silhouettes never go black.
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0002;
    key.shadow.radius = 6;
    this.scene.add(key);
    this.key = key;
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.5);
    fill.position.set(-5, 3, -4);
    this.scene.add(fill);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.12 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.ground = ground;

    this.fit();
    this.resize = new ResizeObserver(() => this.fit());
    this.resize.observe(host);
    this.visibility = new IntersectionObserver(([entry]) => {
      renderer.setAnimationLoop(entry?.isIntersecting ? this.loop : null);
    });
    this.visibility.observe(host);
  }

  private readonly loop = () => {
    this.onFrame?.();
    this.renderer.render(this.scene, this.camera);
  };

  private fit() {
    const w = this.host.clientWidth || 1;
    const h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Shows the object: every mesh casts and receives shadows, and the ground sits under it. */
  setObject(object: THREE.Object3D) {
    if (this.object) this.scene.remove(this.object);
    this.object = object;
    object.traverse((o) => {
      if (o instanceof THREE.Mesh && !o.userData.glow) o.castShadow = o.receiveShadow = true;
    });
    const box = new THREE.Box3().setFromObject(object);
    if (!box.isEmpty()) {
      this.ground.position.y = box.min.y;
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const dist = (sphere.radius / Math.tan((this.camera.fov * Math.PI) / 360)) * 1.35;
      this.camera.near = Math.max(dist / 100, 0.01);
      this.camera.far = dist * 100;
      this.camera.updateProjectionMatrix();
      const span = sphere.radius * 3;
      const shadow = this.key.shadow.camera;
      shadow.left = shadow.bottom = -span;
      shadow.right = shadow.top = span;
      shadow.updateProjectionMatrix();
    }
    this.scene.add(object);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.resize.disconnect();
    this.visibility.disconnect();
    this.scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.geometry.dispose();
      for (const m of [o.material].flat() as THREE.Material[]) {
        if ('map' in m && m.map instanceof THREE.Texture) m.map.dispose();
        m.dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

/** Shared geometry helpers for the hand-built models. */
export function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  r = Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export type Axis = 'x' | 'y' | 'z';

/** A box with corners rounded in the plane perpendicular to `axis` and softly bevelled edges. */
export function roundedBoxGeometry(w: number, h: number, d: number, r: number, axis: Axis, curveSegments: number) {
  const [a, c, e] = axis === 'z' ? [w, h, d] : axis === 'y' ? [w, d, h] : [d, h, w];
  const b = Math.min(0.004, e / 4, a / 6, c / 6);
  const g = new THREE.ExtrudeGeometry(roundedRect(a - 2 * b, c - 2 * b, Math.max(r - b, 2e-4)), {
    depth: Math.max(e - 2 * b, 1e-4),
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 3,
    curveSegments,
  });
  g.center();
  if (axis === 'y') g.rotateX(Math.PI / 2);
  if (axis === 'x') g.rotateY(Math.PI / 2);
  return g;
}

export const box = (name: string, w: number, h: number, d: number, mat: THREE.Material) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.name = name;
  return m;
};

export function put<T extends THREE.Object3D>(parent: THREE.Object3D, obj: T, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0): T {
  obj.position.set(x, y, z);
  obj.rotation.set(rx, ry, rz);
  parent.add(obj);
  return obj;
}

export const group = (name: string) => {
  const g = new THREE.Group();
  g.name = name;
  return g;
};

export function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d')!, w, h);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** A slightly larger back-face copy of a mesh, shown around a highlighted part. */
export function glowHull(mesh: THREE.Mesh, mat: THREE.Material, pad: number, minSize = 0) {
  mesh.geometry.computeBoundingBox();
  const s = mesh.geometry.boundingBox!.getSize(new THREE.Vector3());
  if (Math.max(s.x, s.y, s.z) < minSize) return null;
  const h = new THREE.Mesh(mesh.geometry, mat);
  h.name = 'glow_' + mesh.name;
  h.scale.set(s.x ? (s.x + pad) / s.x : 1, s.y ? (s.y + pad) / s.y : 1, s.z ? (s.z + pad) / s.z : 1);
  h.visible = false;
  h.userData.glow = true;
  h.raycast = () => {};
  mesh.add(h);
  return h;
}

/** Cursor-driven tilt that eases toward the pointer, shared by both models. */
export function trackPointer(card: HTMLElement, reduce: boolean) {
  const state = { tx: 0, ty: 0, rx: 0, ry: 0 };
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  const onMove = (e: PointerEvent) => {
    if (reduce) return;
    const r = card.getBoundingClientRect();
    state.tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
    state.ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  document.addEventListener('pointermove', onMove, { passive: true });
  const DEG = Math.PI / 180;
  return {
    step(root: THREE.Object3D) {
      state.rx += (state.ty * 6 * DEG * 0.6 - state.rx) * 0.08;
      state.ry += (state.tx * 6 * DEG - state.ry) * 0.08;
      root.rotation.set(state.rx, state.ry, 0);
      root.updateMatrixWorld(true);
    },
    stop: () => document.removeEventListener('pointermove', onMove),
  };
}

/** Waits for the faces the canvas textures draw with; carries on without them if they fail. */
export const loadFonts = (faces: string[]) => Promise.all(faces.map((f) => document.fonts.load(f))).catch(() => {});
