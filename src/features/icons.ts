import type { FeatureId } from '../core/types';

/** Hand-drawn paths are decorative registry metadata, never fetched or copied widget assets. */
export const featureIcons: Record<FeatureId, readonly string[]> = {
  fontSize: ['M3 5h12M9 5v14M6 19h6M15 10h6M18 10v9'],
  lineHeight: ['M4 3v18m-2-2 2 2 2-2M2 5l2-2 2 2M10 5h11M10 12h11M10 19h11'],
  letterSpacing: [
    'M3 5h6M6 5v8M15 5h6M18 5v8M2 19h20M5 16l-3 3 3 3M19 16l3 3-3 3',
  ],
  wordSpacing: [
    'M2 5h7M15 5h7M2 11h7M15 11h7M6 19h12M9 16l-3 3 3 3M15 16l3 3-3 3',
  ],
  textAlign: ['M4 5h16M4 10h10M4 15h16M4 20h10'],
  contentScale: [
    'M3 8V3h5M3 3l6 6M16 3h5v5M21 3l-6 6M3 16v5h5M3 21l6-6M21 16v5h-5M21 21l-6-6',
  ],
  readableFont: ['M4 21 11 3h2l7 18M7 14h10'],
  darkMode: ['M20 15a9 9 0 0 1-11-11A9 9 0 1 0 20 15Z'],
  highContrast: [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 3v18M12 4l6 4M12 8l8 5M12 12l7 5M12 16l4 3',
  ],
  monochrome: [
    'M12 2 5 10a9 9 0 0 0-1 5 8 8 0 0 0 16 0 9 9 0 0 0-1-5L12 2ZM12 3v19',
  ],
  lowSaturation: [
    'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0ZM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z',
  ],
  readingGuide: ['M3 5h18M3 12h18M3 19h18M6 12h12'],
  readingMask: ['M3 4h18v4H3ZM3 16h18v4H3ZM3 12h18'],
  highlightLinks: ['M10 7H7a5 5 0 0 0 0 10h3M14 7h3a5 5 0 0 1 0 10h-3M8 12h8'],
  highlightHeadings: ['M4 4v16M14 4v16M4 12h10M18 16h4M20 16v6'],
  bigCursor: ['M5 3v17l5-5 4 7 3-2-4-7h7L5 3Z'],
  stopAnimations: ['M7 4v16M10 4v16M15 4v16M18 4v16'],
  focusHighlight: [
    'M8 3H3v5M16 3h5v5M3 16v5h5M16 21h5v-5M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z',
  ],
};
