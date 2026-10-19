import QRCodeLib from 'qrcode';

// Preset Logo SVGs (Data URIs)
export const PIX_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="44" fill="%2332BCAD"/><path fill="%23FFFFFF" d="M148.7 60.3l-27.8-27.8c-11.7-11.7-30.7-11.7-42.5 0L50.6 60.3c-11.7 11.7-11.7 30.7 0 42.5l27.8 27.8c11.7 11.7 30.7 11.7 42.5 0l27.8-27.8c11.7-11.7 11.7-30.7 0-42.5zm-49 53c-6.4 0-11.5-5.1-11.5-11.5s5.1-11.5 11.5-11.5 11.5 5.1 11.5 11.5-5.1 11.5-11.5 11.5z"/><text x="100" y="166" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-weight="900" font-size="34" fill="%23FFFFFF" text-anchor="middle" letter-spacing="1">pix</text></svg>`;

export const WHATSAPP_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="44" fill="%2325D366"/><path fill="%23FFFFFF" d="M100 36c-35.3 0-64 28.7-64 64 0 11.3 3 22.3 8.6 32L36 164l33.1-8.7c9.3 5.1 19.8 7.7 30.9 7.7 35.3 0 64-28.7 64-64s-28.7-64-64-64zm32.6 90.5c-1.4 3.7-7.8 7.1-10.8 7.6-2.9.5-6.6.7-10.8-.7-8.1-2.5-18.6-9.1-26.7-17.2-8.1-8.1-14.7-18.6-17.2-26.7-1.4-4.2-1.2-7.9-.7-10.8.5-3 3.9-9.4 7.6-10.8 1.7-.7 3.6-.7 5.2 0 1.4.7 7 13.9 7.5 15.4.5 1.4.5 2.9-.5 4.2-1 1.5-2 2.4-3.1 3.6-1 1.2-2.2 2.5-1 4.6 2 3.6 5.9 9.3 10.5 13.4 5.9 5.3 10.8 7.1 14.4 8.6 2 .8 3.4-.2 4.6-1.4 1.4-1.5 3.1-3.9 4.6-5.8 1.2-1.5 2.7-1.5 4.2-.9 1.5.7 14.7 7 15.4 7.5.7.5 1.2 1.7.5 3.6z"/></svg>`;

export const GLOBE_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="44" fill="%2306B6D4"/><circle cx="100" cy="100" r="54" fill="none" stroke="%23FFFFFF" stroke-width="10"/><ellipse cx="100" cy="100" rx="28" ry="54" fill="none" stroke="%23FFFFFF" stroke-width="8"/><line x1="46" y1="100" x2="154" y2="100" stroke="%23FFFFFF" stroke-width="8"/><line x1="56" y1="72" x2="144" y2="72" stroke="%23FFFFFF" stroke-width="6"/><line x1="56" y1="128" x2="144" y2="128" stroke="%23FFFFFF" stroke-width="6"/></svg>`;

export const STAR_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="44" fill="%236366F1"/><path fill="%23FFFFFF" d="M100 38 L114 78 L156 84 L124 114 L132 156 L100 134 L68 156 L76 114 L44 84 L86 78 Z"/></svg>`;

export const PRESET_LOGOS = [
  { id: 'none', label: 'Nenhum', svg: null, icon: 'Ban' },
  { id: 'pix', label: 'PIX', svg: PIX_LOGO_SVG, color: '#32BCAD' },
  { id: 'whatsapp', label: 'WhatsApp', svg: WHATSAPP_LOGO_SVG, color: '#25D366' },
  { id: 'globe', label: 'Web / Link', svg: GLOBE_LOGO_SVG, color: '#06B6D4' },
  { id: 'star', label: 'Estrela', svg: STAR_LOGO_SVG, color: '#6366F1' },
];

/**
 * Draw rounded rectangle path on canvas context
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

/**
 * Draw QR Code on canvas with optional center logo / image
 */
export function drawQrWithLogo({
  canvas,
  text,
  size = 260,
  darkColor = '#000000',
  lightColor = '#ffffff',
  errorLevel = 'H',
  logoUrl = null,
  logoSizePercent = 22,
  logoShape = 'rounded', // 'rounded' | 'circle'
  logoBgColor = null,
  onComplete
}) {
  if (!canvas) return;

  // Render base QR code
  QRCodeLib.toCanvas(
    canvas,
    text || ' ',
    {
      width: size,
      margin: 2,
      errorCorrectionLevel: logoUrl ? 'H' : errorLevel,
      color: {
        dark: darkColor,
        light: lightColor
      }
    },
    (err) => {
      if (err) {
        console.error('Error generating QR Code canvas:', err);
        if (onComplete) onComplete(err, canvas);
        return;
      }

      // If no logo requested, we're done
      if (!logoUrl) {
        if (onComplete) onComplete(null, canvas);
        return;
      }

      // Load logo image and overlay in center
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const ctx = canvas.getContext('2d');
          const logoSize = Math.max(24, Math.floor(size * (logoSizePercent / 100)));
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;
          const padding = Math.max(3, Math.floor(logoSize * 0.12));
          const badgeSize = logoSize + padding * 2;
          const badgeX = (size - badgeSize) / 2;
          const badgeY = (size - badgeSize) / 2;
          const bg = logoBgColor || lightColor || '#ffffff';

          ctx.save();

          if (logoShape === 'circle') {
            // Draw background badge circle
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, badgeSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = bg;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = darkColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.12)';
            ctx.stroke();

            // Clip & draw image
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, x, y, logoSize, logoSize);
          } else {
            // Draw background badge rounded rectangle
            const radius = Math.floor(badgeSize * 0.22);
            drawRoundedRect(ctx, badgeX, badgeY, badgeSize, badgeSize, radius);
            ctx.fillStyle = bg;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = darkColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.12)';
            ctx.stroke();

            // Clip & draw image
            const innerRadius = Math.max(2, radius - 2);
            drawRoundedRect(ctx, x, y, logoSize, logoSize, innerRadius);
            ctx.clip();
            ctx.drawImage(img, x, y, logoSize, logoSize);
          }

          ctx.restore();
          if (onComplete) onComplete(null, canvas);
        } catch (e) {
          console.error('Error drawing logo onto QR canvas:', e);
          if (onComplete) onComplete(e, canvas);
        }
      };

      img.onerror = (e) => {
        console.warn('Failed to load QR code center logo image, rendering QR without logo.', e);
        if (onComplete) onComplete(null, canvas);
      };

      img.src = logoUrl;
    }
  );
}

/**
 * Embed logo image and background card into SVG string
 */
export function getSvgWithLogo({
  svgString,
  size = 260,
  logoUrl = null,
  logoSizePercent = 22,
  logoShape = 'rounded',
  lightColor = '#ffffff'
}) {
  if (!logoUrl || !svgString) return svgString;

  const logoSize = Math.max(24, Math.floor(size * (logoSizePercent / 100)));
  const x = (size - logoSize) / 2;
  const y = (size - logoSize) / 2;
  const padding = Math.max(3, Math.floor(logoSize * 0.12));
  const badgeSize = logoSize + padding * 2;
  const badgeX = (size - badgeSize) / 2;
  const badgeY = (size - badgeSize) / 2;
  const bg = lightColor || '#ffffff';

  let logoElements = '';
  if (logoShape === 'circle') {
    const cx = size / 2;
    const cy = size / 2;
    const rBadge = badgeSize / 2;
    const rLogo = logoSize / 2;
    logoElements = `
      <circle cx="${cx}" cy="${cy}" r="${rBadge}" fill="${bg}" stroke="rgba(0,0,0,0.12)" stroke-width="2" />
      <clipPath id="qr-logo-clip"><circle cx="${cx}" cy="${cy}" r="${rLogo}" /></clipPath>
      <image href="${logoUrl}" x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" clip-path="url(#qr-logo-clip)" preserveAspectRatio="xMidYMid meet" />
    `;
  } else {
    const radius = Math.floor(badgeSize * 0.22);
    const innerRadius = Math.max(2, radius - 2);
    logoElements = `
      <rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="${radius}" fill="${bg}" stroke="rgba(0,0,0,0.12)" stroke-width="2" />
      <clipPath id="qr-logo-clip"><rect x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" rx="${innerRadius}" /></clipPath>
      <image href="${logoUrl}" x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" clip-path="url(#qr-logo-clip)" preserveAspectRatio="xMidYMid meet" />
    `;
  }

  return svgString.replace('</svg>', `${logoElements}</svg>`);
}
