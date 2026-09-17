import { createLucideIcon, type IconNode } from 'lucide-react';

// lucide-react 1.x dropped its brand icons, including `Instagram`. This is the
// exact icon node from lucide-react 0.562.0 rendered through lucide's own
// `createLucideIcon`, so it draws identically to the former `<Instagram />`
// and accepts the same props (size, className, strokeWidth, ...).
const iconNode: IconNode = [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: '2e1cvw' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: '9exkf1' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'r4j83e' }],
];

export const InstagramIcon = createLucideIcon('instagram', iconNode);
