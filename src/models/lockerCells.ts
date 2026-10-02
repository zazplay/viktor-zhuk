import { l, type Text } from '../i18n';

export type CellState = 'empty' | 'full' | 'issued' | 'damaged' | 'faulty' | 'retired';

export const STATES: Record<CellState, { color: string; label: Text }> = {
  empty: { color: '#4f7cc0', label: l('Empty', 'Порожня') },
  full: { color: '#2f7d5b', label: l('Full', 'Заповнена') },
  issued: { color: '#b07a1f', label: l('Issued', 'Видана') },
  damaged: { color: '#b5413b', label: l('Damaged content', 'Пошкоджений вміст') },
  faulty: { color: '#8e2c48', label: l('Faulty', 'Несправна') },
  retired: { color: '#8a8f98', label: l('Retired', 'Виведена з роботи') },
};

export type Cell = { n: number; r: number; c: number; id: number; st: CellState };

/** The cell whose door stands open in the model. */
export const OPEN_CELL = 13;

const PATTERN: CellState[] = ['full', 'empty', 'issued', 'empty', 'full', 'issued', 'empty', 'full', 'issued', 'empty'];
const SPECIAL: Record<number, CellState> = { 13: 'issued', 25: 'damaged', 34: 'retired', 8: 'faulty' };

/** Four rows of ten cells, the same in the model and the overview grid. */
export const CELLS: Cell[] = Array.from({ length: 40 }, (_, i) => {
  const r = Math.floor(i / 10);
  const c = i % 10;
  const n = i + 1;
  return { n, r, c, id: (r + 1) * 100 + c + 1, st: SPECIAL[n] ?? PATTERN[(c + r * 3) % 10] };
});

export type Filter = 'all' | 'empty' | 'full' | 'issued' | 'damaged' | 'retired';

export const FILTERS: { id: Filter; label: Text; states: CellState[] | null }[] = [
  { id: 'all', label: l('All', 'Усі'), states: null },
  { id: 'empty', label: l('Empty', 'Порожні'), states: ['empty'] },
  { id: 'full', label: l('Full', 'Заповнені'), states: ['full'] },
  { id: 'issued', label: l('Issued', 'Видані'), states: ['issued'] },
  { id: 'damaged', label: l('Damaged content', 'Пошкоджений вміст'), states: ['damaged'] },
  { id: 'retired', label: l('Retired', 'Виведені'), states: ['faulty', 'retired'] },
];

export const matchesFilter = (filter: Filter, st: CellState) => {
  const states = FILTERS.find((f) => f.id === filter)?.states;
  return !states || states.includes(st);
};
