// HTML Email Signature Generator Engine
// Compatible with Gmail, Outlook (Word engine), Apple Mail, and Thunderbird
// 100% table-based, inline-styled markup with no flex/grid, no external CSS classes, and no Base64 images.

export const FONT_OPTIONS = [
  { id: 'Arial', label: 'Arial', stack: 'Arial, Helvetica, sans-serif' },
  { id: 'Helvetica', label: 'Helvetica', stack: 'Helvetica, Arial, sans-serif' },
  { id: 'Georgia', label: 'Georgia', stack: "Georgia, 'Times New Roman', serif" },
  { id: 'Verdana', label: 'Verdana', stack: 'Verdana, Geneva, sans-serif' },
  { id: 'Tahoma', label: 'Tahoma', stack: 'Tahoma, Geneva, sans-serif' },
];

export const FONT_STACKS = FONT_OPTIONS.reduce((acc, option) => {
  acc[option.id] = option.stack;
  return acc;
}, {});

export const TEMPLATE_IDS = ['classic', 'minimal', 'corporate'];

export const DEFAULT_SIGNATURE = {
  fullName: 'Alexandre Silva',
  jobTitle: 'Senior Software Engineer',
  company: 'Acme Corp',
  department: 'Engenharia de Produto',
  email: 'alexandre.silva@acmecorp.com',
  phone: '+55 11 4002-8922',
  mobile: '+55 11 99876-5432',
  website: 'https://www.acmecorp.com',
  address: 'Av. Paulista, 1000',
  city: 'São Paulo',
  state: 'SP',
  photoUrl: 'https://i.pravatar.cc/160?img=12',
  social: {
    linkedin: 'https://linkedin.com/in/alexandresilva',
    github: 'https://github.com/alexandresilva',
    twitter: 'https://x.com/alexandresilva',
    instagram: 'https://instagram.com/alexandresilva',
  },
  primaryColor: '#1d4ed8',
  secondaryColor: '#334155',
  fontFamily: 'Arial',
  template: 'classic',
};

export const DEFAULT_CONTACT_LABELS = {
  email: 'E-mail',
  phone: 'Tel',
  mobile: 'Mobile',
  website: 'Site',
  address: 'Address',
};

/** Escapes text that will be interpolated into HTML markup. */
export function escapeHtml(value) {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes text that will be interpolated into an HTML attribute value. */
export function escapeAttribute(value) {
  return escapeHtml(value);
}

/**
 * Ensures a website/profile URL is absolute (`https://`), as required by
 * email clients that strip or ignore relative/base64 resources.
 * Strictly rejects dangerous schemes like javascript: or data:
 */
export function toAbsoluteUrl(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^mailto:|^tel:/i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

/**
 * Sanitizes image URL to only allow valid http/https URLs.
 */
export function sanitizeImageUrl(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '';
  }
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

/** Strips a URL down to a short, human-readable label (no protocol/trailing slash). */
export function toDisplayUrl(value) {
  return toAbsoluteUrl(value)
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '');
}

/** Normalizes a phone number into a `tel:` href (keeps a leading `+`, strips the rest). */
export function toTelHref(value) {
  const digits = (value || '').trim().replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

export function toMailHref(value) {
  const clean = (value || '').trim().replace(/[\r\n]/g, '');
  return `mailto:${clean}`;
}

export function fontStack(data) {
  return FONT_STACKS[data.fontFamily] || FONT_STACKS.Arial;
}

/** Renders an inline-styled hyperlink whose color is inherited from its wrapping span. */
export function link(options) {
  const { href, label, color, fontSize, bold } = options;
  const sizeStyle = fontSize ? `font-size:${fontSize}px;` : '';
  const weightStyle = bold ? 'font-weight:bold;' : '';
  return (
    `<span style="color:${color};${sizeStyle}${weightStyle}">` +
    `<a href="${escapeAttribute(href)}" style="color:inherit;text-decoration:none;" target="_blank" rel="noreferrer">` +
    `${escapeHtml(label)}</a></span>`
  );
}

/** Builds the list of contact lines (email/phone/mobile/website/address) present in the form. */
export function buildContactLines(data, labels = DEFAULT_CONTACT_LABELS) {
  const lines = [];
  if (data.email) {
    lines.push({ label: labels.email, value: data.email, href: toMailHref(data.email) });
  }
  if (data.phone) {
    lines.push({ label: labels.phone, value: data.phone, href: toTelHref(data.phone) });
  }
  if (data.mobile) {
    lines.push({ label: labels.mobile, value: data.mobile, href: toTelHref(data.mobile) });
  }
  if (data.website) {
    lines.push({
      label: labels.website,
      value: toDisplayUrl(data.website),
      href: toAbsoluteUrl(data.website),
    });
  }
  const addressParts = [data.address, data.city, data.state].filter(Boolean);
  if (addressParts.length > 0) {
    lines.push({ label: labels.address, value: addressParts.join(', '), href: '' });
  }
  return lines;
}

/** Returns only the social profiles the user actually filled in. */
export function buildSocialEntries(data) {
  const social = data.social || {};
  const entries = [
    { key: 'linkedin', abbreviation: 'in', label: 'LinkedIn', url: social.linkedin || '' },
    { key: 'github', abbreviation: 'GH', label: 'GitHub', url: social.github || '' },
    { key: 'twitter', abbreviation: 'X', label: 'X (Twitter)', url: social.twitter || '' },
    { key: 'instagram', abbreviation: 'IG', label: 'Instagram', url: social.instagram || '' },
  ];
  return entries.filter((entry) => entry.url.trim().length > 0);
}

/**
 * Renders social profiles as inline table badges (colored circles with a short abbreviation).
 * Degrades gracefully to solid squares in Outlook desktop, which ignores border-radius,
 * but keeps full table-based, inline-styled markup.
 */
export function buildBadgesRow(entries, data) {
  if (entries.length === 0) return '';
  const cells = entries
    .map(
      (entry) => `
          <td style="padding:0 6px 0 0;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
              <tr>
                <td align="center" valign="middle" bgcolor="${data.secondaryColor}" width="28" height="28" style="width:28px;height:28px;background-color:${data.secondaryColor};border-radius:50%;font-family:${fontStack(data)};font-size:11px;font-weight:bold;color:#ffffff;line-height:28px;">
                  <a href="${escapeAttribute(toAbsoluteUrl(entry.url))}" style="color:#ffffff;text-decoration:none;display:block;" target="_blank" rel="noreferrer">${escapeHtml(entry.abbreviation)}</a>
                </td>
              </tr>
            </table>
          </td>`,
    )
    .join('');
  return `
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
        <tr>${cells}
        </tr>
      </table>`;
}

export function buildPlainTextSignature(data, labels = DEFAULT_CONTACT_LABELS) {
  const lines = [];
  lines.push(data.fullName);
  const roleLine = [data.jobTitle, data.company].filter(Boolean).join(' | ');
  if (roleLine) lines.push(roleLine);
  if (data.department) lines.push(data.department);

  const contact = buildContactLines(data, labels)
    .map((item) => `${item.label}: ${item.value}`)
    .join(' | ');
  if (contact) lines.push(contact);

  const socials = buildSocialEntries(data)
    .map((item) => `${item.label}: ${toAbsoluteUrl(item.url)}`)
    .join(' | ');
  if (socials) lines.push(socials);

  return lines.join('\n');
}

/**
 * Template 1 — Clássico Horizontal
 * Photo on the left with a vertical divider, contact details on the right.
 */
export function generateClassicHorizontal(data, labels = DEFAULT_CONTACT_LABELS) {
  const font = fontStack(data);
  const contactLines = buildContactLines(data, labels);
  const socialEntries = buildSocialEntries(data);
  const cleanPhoto = sanitizeImageUrl(data.photoUrl);
  const hasPhoto = Boolean(cleanPhoto);

  const contactRows = contactLines
    .map(
      (item) => `
            <tr>
              <td style="padding:0 0 3px;font-size:12px;">
                <span style="color:#8a8f98;">${escapeHtml(item.label)}:</span>
                ${
                  item.href
                    ? link({ href: item.href, label: item.value, color: data.secondaryColor, fontSize: 12 })
                    : `<span style="color:#333333;">${escapeHtml(item.value)}</span>`
                }
              </td>
            </tr>`,
    )
    .join('');

  const socialRow =
    socialEntries.length > 0
      ? `
            <tr>
              <td style="padding:6px 0 0;font-size:12px;">
                ${socialEntries
                  .map((entry) =>
                    link({ href: entry.url, label: entry.label, color: data.secondaryColor, fontSize: 12 }),
                  )
                  .join('<span style="color:#c4c7cc;padding:0 6px;">&bull;</span>')}
              </td>
            </tr>`
      : '';

  const photoCell = hasPhoto
    ? `
        <td style="padding:0 16px 0 0;" valign="top">
          <img src="${escapeAttribute(cleanPhoto)}" width="80" height="80" alt="${escapeAttribute(data.fullName)}" style="display:block;width:80px;height:80px;border-radius:50%;max-width:80px;" />
        </td>
        <td style="padding:0 16px 0 0;border-left:2px solid ${data.primaryColor};font-size:1px;line-height:1px;">&nbsp;</td>`
    : '';

  const html = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:${font};font-size:13px;line-height:1.4;color:#333333;">
  <tr>${photoCell}
    <td valign="top">
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
        <tr>
          <td style="padding:0 0 2px;font-size:16px;font-weight:bold;color:${data.primaryColor};">${escapeHtml(data.fullName)}</td>
        </tr>
        <tr>
          <td style="padding:0 0 8px;font-size:13px;color:#555555;">${escapeHtml([data.jobTitle, data.company].filter(Boolean).join(' · '))}${
            data.department ? `<br />${escapeHtml(data.department)}` : ''
          }</td>
        </tr>${contactRows}${socialRow}
      </table>
    </td>
  </tr>
</table>`;

  return { html, text: buildPlainTextSignature(data, labels) };
}

/**
 * Template 2 — Minimalista Vertical
 * No photo; compact lines joined by bullet separators.
 */
export function generateMinimalVertical(data, labels = DEFAULT_CONTACT_LABELS) {
  const font = fontStack(data);
  const contactLines = buildContactLines(data, labels);
  const socialEntries = buildSocialEntries(data);
  const SEPARATOR = '<span style="color:#c4c7cc;padding:0 6px;">&bull;</span>';

  const roleParts = [data.jobTitle, data.company, data.department].filter(Boolean);

  const contactRow =
    contactLines.length > 0
      ? `
        <tr>
          <td style="padding:4px 0 0;font-size:12px;color:#555555;">
            ${contactLines
              .map((item) =>
                item.href
                  ? link({ href: item.href, label: item.value, color: data.secondaryColor, fontSize: 12 })
                  : `<span>${escapeHtml(item.value)}</span>`,
              )
              .join(SEPARATOR)}
          </td>
        </tr>`
      : '';

  const socialRow =
    socialEntries.length > 0
      ? `
        <tr>
          <td style="padding:4px 0 0;font-size:12px;">
            ${socialEntries
              .map((entry) =>
                link({ href: entry.url, label: entry.label, color: data.secondaryColor, fontSize: 12 }),
              )
              .join(SEPARATOR)}
          </td>
        </tr>`
      : '';

  const html = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:${font};font-size:13px;line-height:1.4;color:#333333;">
  <tr>
    <td>
      <span style="font-size:14px;font-weight:bold;color:${data.primaryColor};">${escapeHtml(data.fullName)}</span>${
        roleParts.length > 0
          ? `<span style="color:#8a8f98;"> &nbsp;—&nbsp; </span><span style="font-size:13px;color:#555555;">${escapeHtml(roleParts.join(', '))}</span>`
          : ''
      }
    </td>
  </tr>${contactRow}${socialRow}
</table>`;

  return { html, text: buildPlainTextSignature(data, labels) };
}

/**
 * Template 3 — Corporativo Elegante
 * Photo/logo centered on top, prominent name, divider, social badges, contact line.
 */
export function generateCorporateElegant(data, labels = DEFAULT_CONTACT_LABELS) {
  const font = fontStack(data);
  const contactLines = buildContactLines(data, labels);
  const socialEntries = buildSocialEntries(data);
  const roleParts = [data.jobTitle, data.company, data.department].filter(Boolean);
  const SEPARATOR = '<span style="color:#c4c7cc;padding:0 6px;">&bull;</span>';
  const cleanPhoto = sanitizeImageUrl(data.photoUrl);

  const photoRow = cleanPhoto
    ? `
        <tr>
          <td align="center" style="padding:0 0 10px;">
            <img src="${escapeAttribute(cleanPhoto)}" width="88" height="88" alt="${escapeAttribute(data.fullName)}" style="display:block;width:88px;height:88px;border-radius:50%;max-width:88px;" />
          </td>
        </tr>`
    : '';

  const dividerRow = `
        <tr>
          <td align="center" style="padding:10px 0;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
              <tr>
                <td width="60" height="2" bgcolor="${data.primaryColor}" style="width:60px;height:2px;font-size:1px;line-height:1px;background-color:${data.primaryColor};">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>`;

  const badgesHtml = buildBadgesRow(socialEntries, data);
  const badgesRow = badgesHtml
    ? `
        <tr>
          <td align="center" style="padding:0 0 10px;">${badgesHtml}</td>
        </tr>`
    : '';

  const contactRow =
    contactLines.length > 0
      ? `
        <tr>
          <td align="center" style="padding:0;font-size:12px;color:#555555;">
            ${contactLines
              .map((item) =>
                item.href
                  ? link({ href: item.href, label: item.value, color: data.secondaryColor, fontSize: 12 })
                  : `<span>${escapeHtml(item.value)}</span>`,
              )
              .join(SEPARATOR)}
          </td>
        </tr>`
      : '';

  const html = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="320" style="border-collapse:collapse;width:320px;font-family:${font};font-size:13px;line-height:1.4;color:#333333;">${photoRow}
        <tr>
          <td align="center" style="padding:0;font-size:18px;font-weight:bold;color:${data.primaryColor};">${escapeHtml(data.fullName)}</td>
        </tr>
        <tr>
          <td align="center" style="padding:2px 0 0;font-size:13px;color:#555555;">${escapeHtml(roleParts.join(' · '))}</td>
        </tr>${dividerRow}${badgesRow}${contactRow}
</table>`;

  return { html, text: buildPlainTextSignature(data, labels) };
}

/** Master generator router */
export function generateSignature(data, labels = DEFAULT_CONTACT_LABELS) {
  switch (data.template) {
    case 'minimal':
      return generateMinimalVertical(data, labels);
    case 'corporate':
      return generateCorporateElegant(data, labels);
    case 'classic':
    default:
      return generateClassicHorizontal(data, labels);
  }
}

/** Wraps signature fragment into a standalone HTML document */
export function wrapAsHtmlDocument(fragment, title = 'Email Signature') {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:20px;padding:0;background:#ffffff;">
    ${fragment}
  </body>
</html>`;
}

/**
 * Copies a rendered signature to the clipboard so it can be pasted (Ctrl/Cmd+V)
 * directly into Gmail/Outlook/Apple Mail/Thunderbird signature settings.
 */
export async function copyFormattedSignature(htmlString, plainText) {
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof window.ClipboardItem !== 'undefined'
  ) {
    try {
      const htmlBlob = new Blob([htmlString], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });
      await navigator.clipboard.write([item]);
      return { success: true, method: 'clipboard-item' };
    } catch (err) {
      return copyFormattedSignatureWithExecCommand(htmlString, err);
    }
  }
  return copyFormattedSignatureWithExecCommand(htmlString);
}

function copyFormattedSignatureWithExecCommand(htmlString, previousError) {
  if (typeof document === 'undefined') {
    return { success: false, error: previousError ?? new Error('document is not available') };
  }
  const container = document.createElement('div');
  container.setAttribute('contenteditable', 'true');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.opacity = '0';
  container.innerHTML = htmlString;
  document.body.appendChild(container);

  try {
    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    const succeeded = document.execCommand('copy');
    selection?.removeAllRanges();
    if (succeeded) {
      return { success: true, method: 'exec-command' };
    }
    return copyPlainTextFallback(htmlString, previousError);
  } catch (err) {
    return copyPlainTextFallback(htmlString, err ?? previousError);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

function copyPlainTextFallback(text, previousError) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand('copy');
    document.body.removeChild(textarea);
    return succeeded ? { success: true, method: 'text-fallback' } : { success: false, error: previousError };
  } catch (err) {
    return { success: false, error: err ?? previousError };
  }
}

export async function copyPlainText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'clipboard-item' };
    } catch (err) {
      return copyPlainTextFallback(text, err);
    }
  }
  return copyPlainTextFallback(text);
}

export function downloadTextFile(filename, content, mimeType = 'text/html') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
