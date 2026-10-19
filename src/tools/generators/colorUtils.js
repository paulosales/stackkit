// Color Math and Naming Utilities for Coolors-style Palette Generator

// Master Named Colors Dictionary (140+ popular colors for matching)
export const COLOR_NAMES = [
  { name: 'Black', hex: '#000000' },
  { name: 'Night', hex: '#0C0F12' },
  { name: 'Charcoal', hex: '#264653' },
  { name: 'Space Cadet', hex: '#1D2D44' },
  { name: 'Prussian Blue', hex: '#0B2545' },
  { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Dark Slate Gray', hex: '#2F4F4F' },
  { name: 'Gunmetal', hex: '#2A3439' },
  { name: 'Eerie Black', hex: '#1B1B1B' },
  { name: 'Jet', hex: '#343434' },
  { name: 'Onyx', hex: '#353839' },
  { name: 'Dim Gray', hex: '#696969' },
  { name: 'Slate Gray', hex: '#708090' },
  { name: 'Cool Gray', hex: '#8D99AE' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Platinum', hex: '#E5E5E5' },
  { name: 'Cultured White', hex: '#F8F9FA' },
  { name: 'Ghost White', hex: '#F8F8FF' },
  { name: 'Snow White', hex: '#FFFAFA' },
  { name: 'White', hex: '#FFFFFF' },

  // Reds & Pinks
  { name: 'Imperial Red', hex: '#E63946' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Fire Engine Red', hex: '#CE2029' },
  { name: 'Cardinal Red', hex: '#C41E3A' },
  { name: 'Carmine', hex: '#960018' },
  { name: 'Ruby', hex: '#E0115F' },
  { name: 'Rose Red', hex: '#C2185B' },
  { name: 'Amaranth', hex: '#E52B50' },
  { name: 'Bright Pink', hex: '#FF007F' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Deep Pink', hex: '#FF1493' },
  { name: 'Blush Pink', hex: '#DE5D83' },
  { name: 'Pastel Pink', hex: '#FFD1DC' },
  { name: 'Millennial Pink', hex: '#F3CFC6' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Coral Pink', hex: '#F88379' },
  { name: 'Salmon', hex: '#FA8072' },
  { name: 'Light Coral', hex: '#F08080' },

  // Oranges & Browns
  { name: 'Burnt Sienna', hex: '#E76F51' },
  { name: 'Sandy Brown', hex: '#F4A261' },
  { name: 'Tangerine', hex: '#F28500' },
  { name: 'Dark Orange', hex: '#FF8C00' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Safety Orange', hex: '#FF5A00' },
  { name: 'Persimmon', hex: '#EC5800' },
  { name: 'Rust', hex: '#B7410E' },
  { name: 'Chocolate', hex: '#7B3F00' },
  { name: 'Saddle Brown', hex: '#8B4513' },
  { name: 'Coffee', hex: '#6F4E37' },
  { name: 'Caramel', hex: '#FFD59A' },
  { name: 'Almond', hex: '#EFDECD' },
  { name: 'Wheat', hex: '#F5DEB3' },
  { name: 'Khaki', hex: '#C3B091' },
  { name: 'Ochre', hex: '#CC7722' },

  // Yellows & Golds
  { name: 'Saffron', hex: '#E9C46A' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Sunglow', hex: '#FFCA3A' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Mustard Yellow', hex: '#FFDB58' },
  { name: 'Lemon Chiffon', hex: '#FFFACD' },
  { name: 'Banana Yellow', hex: '#FFE135' },
  { name: 'Canary Yellow', hex: '#FFEF00' },
  { name: 'Cornsilk', hex: '#FFF8DC' },
  { name: 'Goldenrod', hex: '#DAA520' },

  // Greens
  { name: 'Persian Green', hex: '#2A9D8F' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Jade Green', hex: '#00A86B' },
  { name: 'Mint Green', hex: '#98FB98' },
  { name: 'Seafoam Green', hex: '#9FE2BF' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Pine Green', hex: '#01796F' },
  { name: 'Hunter Green', hex: '#355E3B' },
  { name: 'Sage Green', hex: '#87A96B' },
  { name: 'Olive Green', hex: '#808000' },
  { name: 'Olive Drab', hex: '#6B8E23' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Neon Green', hex: '#39FF14' },
  { name: 'Spring Green', hex: '#00FF7F' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Celadon', hex: '#ACE1AF' },
  { name: 'Pistachio', hex: '#93C572' },

  // Cyans & Teals
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Dark Cyan', hex: '#008B8B' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Deep Teal', hex: '#034748' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Medium Turquoise', hex: '#48D1CC' },
  { name: 'Robin Egg Blue', hex: '#96DED1' },
  { name: 'Tiffany Blue', hex: '#0ABAB5' },
  { name: 'Pacific Cyan', hex: '#1AC8ED' },

  // Blues
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Deep Sky Blue', hex: '#00BFFF' },
  { name: 'Electric Blue', hex: '#7DF9FF' },
  { name: 'Dodger Blue', hex: '#1E90FF' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Cobalt Blue', hex: '#0047AB' },
  { name: 'Cornflower Blue', hex: '#6495ED' },
  { name: 'Steel Blue', hex: '#4682B4' },
  { name: 'Denim', hex: '#1560BD' },
  { name: 'Azure', hex: '#007FFF' },
  { name: 'Cerulean', hex: '#007BA7' },
  { name: 'Baby Blue', hex: '#89CFF0' },
  { name: 'Ice Blue', hex: '#AFEEEE' },
  { name: 'Indigo Dye', hex: '#094074' },

  // Purples & Violets
  { name: 'Electric Indigo', hex: '#4B0082' },
  { name: 'Iris', hex: '#5D3FD3' },
  { name: 'Amethyst', hex: '#9966CC' },
  { name: 'Violet', hex: '#8A2BE2' },
  { name: 'Dark Violet', hex: '#9400D3' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Mauve', hex: '#E0B0FF' },
  { name: 'Purple Heart', hex: '#6930C3' },
  { name: 'Medium Purple', hex: '#9370DB' },
  { name: 'Orchid', hex: '#DA70D6' },
  { name: 'Plum', hex: '#DDA0DD' },
  { name: 'Thistle', hex: '#D8BFD8' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Dark Magenta', hex: '#8B008B' },
  { name: 'Fuchsia', hex: '#FF00FF' },
  { name: 'Mulberry', hex: '#C54B8C' }
];

// Conversions
export function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return { r: 0, g: 0, b: 0 };
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

export function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Luminance and Contrast
export function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastColor(hex) {
  const rgb = hexToRgb(hex);
  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  // Returns white if dark, dark slate if bright
  return lum > 0.45 ? '#0f172a' : '#ffffff';
}

export function getWcagContrast(hex) {
  const rgb = hexToRgb(hex);
  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWhite = ((1.05) / (lum + 0.05)).toFixed(1);
  const contrastBlack = ((lum + 0.05) / (0.05)).toFixed(1);
  return {
    ratioWhite: parseFloat(contrastWhite),
    ratioBlack: parseFloat(contrastBlack),
    isWhiteAaa: contrastWhite >= 7.0,
    isWhiteAa: contrastWhite >= 4.5,
    isBlackAaa: contrastBlack >= 7.0,
    isBlackAa: contrastBlack >= 4.5
  };
}

// Shades and Tints (Coolors levels popup: 10 steps from very light to very dark)
export function generateShades(hex, count = 10) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades = [];

  for (let i = 0; i < count; i++) {
    // Lightness range from 95% down to 10%
    const l = Math.round(95 - (i * (85 / (count - 1))));
    const shadeHex = hslToHex(hsl.h, hsl.s, l);
    shades.push({
      hex: shadeHex,
      lightness: l,
      name: getColorName(shadeHex)
    });
  }
  return shades;
}

// Find nearest color name by Euclidean distance in RGB
export function getColorName(hex) {
  const target = hexToRgb(hex);
  let closestName = 'Custom';
  let minDistance = Infinity;

  for (const item of COLOR_NAMES) {
    const itemRgb = hexToRgb(item.hex);
    // Weighted Euclidean distance for human perception (red: 0.3, green: 0.59, blue: 0.11)
    const dist = Math.sqrt(
      0.30 * Math.pow(target.r - itemRgb.r, 2) +
      0.59 * Math.pow(target.g - itemRgb.g, 2) +
      0.11 * Math.pow(target.b - itemRgb.b, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestName = item.name;
    }
  }
  return closestName;
}

// Daltonization / Color Blindness simulation
export function simulateColorBlindness(hex, mode = 'normal') {
  if (mode === 'normal') return hex;
  const rgb = hexToRgb(hex);
  let r = rgb.r, g = rgb.g, b = rgb.b;

  if (mode === 'protanopia') {
    // Red-blind
    r = 0.56667 * rgb.r + 0.43333 * rgb.g + 0.0 * rgb.b;
    g = 0.55833 * rgb.r + 0.44167 * rgb.g + 0.0 * rgb.b;
    b = 0.0 * rgb.r + 0.24167 * rgb.g + 0.75833 * rgb.b;
  } else if (mode === 'deuteranopia') {
    // Green-blind
    r = 0.625 * rgb.r + 0.375 * rgb.g + 0.0 * rgb.b;
    g = 0.7 * rgb.r + 0.3 * rgb.g + 0.0 * rgb.b;
    b = 0.0 * rgb.r + 0.3 * rgb.g + 0.7 * rgb.b;
  } else if (mode === 'tritanopia') {
    // Blue-blind
    r = 0.95 * rgb.r + 0.05 * rgb.g + 0.0 * rgb.b;
    g = 0.0 * rgb.r + 0.43333 * rgb.g + 0.56667 * rgb.b;
    b = 0.0 * rgb.r + 0.475 * rgb.g + 0.525 * rgb.b;
  } else if (mode === 'achromatopsia') {
    // Monochromacy / Grayscale
    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    r = gray; g = gray; b = gray;
  }

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

// Generate New Harmonious Palette
export function generateHarmoniousPalette(harmonyMode = 'random', currentColors = []) {
  const total = currentColors.length || 5;

  // Find a base hue: if any locked color exists, use its hue, else pick random
  const lockedItem = currentColors.find(c => c.locked);
  let baseHue;
  if (lockedItem) {
    const rgb = hexToRgb(lockedItem.hex);
    baseHue = rgbToHsl(rgb.r, rgb.g, rgb.b).h;
  } else {
    baseHue = Math.floor(Math.random() * 360);
  }

  return currentColors.map((item, index) => {
    if (item.locked) {
      return item;
    }

    let h = baseHue;
    let s = 65;
    let l = 50;

    switch (harmonyMode) {
      case 'analogous':
        // Steps of ~25 degrees
        h = (baseHue + (index - 2) * 28 + 360) % 360;
        s = Math.floor(55 + Math.random() * 30);
        l = Math.floor(40 + Math.random() * 30);
        break;

      case 'monochromatic':
        // Same hue, distributed lightness and saturation
        h = baseHue;
        s = Math.floor(40 + Math.random() * 45);
        l = Math.round(18 + (index * (65 / (total - 1))));
        break;

      case 'triadic':
        // 120 degree spreads
        const triStep = index % 3;
        h = (baseHue + triStep * 120 + Math.floor((Math.random() - 0.5) * 20) + 360) % 360;
        s = Math.floor(60 + Math.random() * 25);
        l = Math.floor(35 + Math.random() * 35);
        break;

      case 'complementary':
        // Alternating base and complement (180 deg)
        const isComp = index % 2 === 1;
        h = isComp ? (baseHue + 180 + Math.floor((Math.random() - 0.5) * 15) + 360) % 360 : baseHue;
        s = Math.floor(55 + Math.random() * 35);
        l = Math.floor(35 + (index * 10));
        break;

      case 'split-complementary':
        // Base, base+150, base+210
        const splitOffsets = [0, 150, 210, 30, 180];
        const offset = splitOffsets[index % splitOffsets.length];
        h = (baseHue + offset + Math.floor((Math.random() - 0.5) * 12) + 360) % 360;
        s = Math.floor(50 + Math.random() * 35);
        l = Math.floor(35 + Math.random() * 35);
        break;

      case 'pastel':
        // Soft pastels: high lightness (75-88%), moderate saturation (40-60%)
        h = Math.floor(Math.random() * 360);
        s = Math.floor(45 + Math.random() * 25);
        l = Math.floor(75 + Math.random() * 15);
        break;

      case 'neon':
        // Vivid cyberpunk neons: high saturation (85-100%), mid lightness (48-62%)
        h = Math.floor(Math.random() * 360);
        s = Math.floor(88 + Math.random() * 12);
        l = Math.floor(48 + Math.random() * 14);
        break;

      case 'vintage':
        // Warm retro muted tones: warm hues (0-60 or 20-50), low saturation, medium-dark
        const retroHues = [15, 30, 45, 170, 195, 215, 340];
        h = retroHues[Math.floor(Math.random() * retroHues.length)];
        s = Math.floor(35 + Math.random() * 30);
        l = Math.floor(40 + Math.random() * 30);
        break;

      case 'random':
      default:
        // Diverse vibrant distribution
        h = (baseHue + index * (360 / total) + Math.floor((Math.random() - 0.5) * 35) + 360) % 360;
        s = Math.floor(55 + Math.random() * 35);
        l = Math.floor(32 + Math.random() * 42);
        break;
    }

    const hex = hslToHex(h, s, l);
    return {
      ...item,
      hex,
      name: getColorName(hex)
    };
  });
}

// Curated Trending Palettes
export const TRENDING_PALETTES = [
  {
    name: 'Coolors Classic',
    tags: 'Popular, Balanced',
    colors: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51']
  },
  {
    name: 'Cyberpunk Neon',
    tags: 'Dark, Futuristic',
    colors: ['#0D0221', '#0F084B', '#26408B', '#A6CFD5', '#C2E7D9']
  },
  {
    name: 'Sunset Boulevard',
    tags: 'Warm, Radiant',
    colors: ['#3D348B', '#7678ED', '#F7B801', '#F18701', '#F35B04']
  },
  {
    name: 'Nordic Clean',
    tags: 'Minimal, Muted',
    colors: ['#2B2D42', '#8D99AE', '#EDF2F4', '#EF233C', '#D90429']
  },
  {
    name: 'Matcha Forest',
    tags: 'Organic, Nature',
    colors: ['#386641', '#6A994E', '#A7C957', '#F2E8CF', '#BC4749']
  },
  {
    name: 'Retro Synthwave',
    tags: '80s, Electric',
    colors: ['#2B0938', '#5F144B', '#AA1D64', '#E83F6F', '#FF8552']
  },
  {
    name: 'Pastel Dream',
    tags: 'Soft, Gentle',
    colors: ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#F9DCC4', '#FEC89A']
  },
  {
    name: 'Deep Ocean Trench',
    tags: 'Cold, Aquatic',
    colors: ['#03045E', '#023E8A', '#0077B6', '#0096C7', '#00B4D8']
  }
];
