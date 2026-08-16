/**
 * Strips full HTML document wrappers from blog content.
 *
 * Content from rich-text editors (e.g. Genspark) is sometimes saved as a
 * complete HTML document. Injecting that into a page via dangerouslySetInnerHTML
 * or SSR breaks the browser DOM — the inner </body> terminates the outer body,
 * causing post-article sections to render at the TOP of the page.
 *
 * Uses indexOf/slice instead of regex for reliability on large strings (24KB+).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let result = html;

  // Step 0: Strip <!DOCTYPE ...>
  result = result.replace(/<!DOCTYPE[^>]*>/gi, '');

  // Step 1: Extract <body>…</body> inner content if present
  // /<body[\s>]/i catches <body>, <body class="">, <body\n>, etc.
  const bodyOpenIdx = result.search(/<body[\s>]/i);
  if (bodyOpenIdx !== -1) {
    const bodyTagEnd = result.indexOf('>', bodyOpenIdx) + 1;
    const bodyCloseIdx = result.toLowerCase().lastIndexOf('</body');
    result = (bodyCloseIdx !== -1 && bodyCloseIdx > bodyTagEnd)
      ? result.slice(bodyTagEnd, bodyCloseIdx)
      : result.slice(bodyTagEnd);
  } else {
    // No opening <body> — strip any trailing closing document tags
    const bc = result.toLowerCase().lastIndexOf('</body');
    if (bc !== -1) result = result.slice(0, bc);
    const hc = result.toLowerCase().lastIndexOf('</html');
    if (hc !== -1) result = result.slice(0, hc);
  }

  // Step 2: Remove <head>…</head>
  const headOpen = result.toLowerCase().indexOf('<head');
  if (headOpen !== -1) {
    const headClose = result.toLowerCase().indexOf('</head>');
    if (headClose !== -1) result = result.slice(0, headOpen) + result.slice(headClose + 7);
  }

  // Step 3: Remove <html …> / </html>
  result = result.replace(/<\s*html[^>]*>/gi, '').replace(/<\s*\/\s*html[^>]*>/gi, '');

  // Step 4: Remove <style>…</style> blocks (prevent global style leakage)
  while (result.toLowerCase().includes('<style')) {
    const so = result.toLowerCase().indexOf('<style');
    const sc = result.toLowerCase().indexOf('</style>', so);
    if (sc === -1) break;
    result = result.slice(0, so) + result.slice(sc + 8);
  }

  // Step 5: Remove <script>…</script> blocks (security)
  while (result.toLowerCase().includes('<script')) {
    const so = result.toLowerCase().indexOf('<script');
    const sc = result.toLowerCase().indexOf('</script>', so);
    if (sc === -1) break;
    result = result.slice(0, so) + result.slice(sc + 9);
  }

  // Step 6: Nuclear final strip — catches ALL whitespace variants.
  // <\s*\/\s*body handles </body>, < /body>, </ body>, </body >, </body\n>, etc.
  result = result
    .replace(/<\s*body[^>]*>/gi, '')       // opening <body ...>
    .replace(/<\s*\/\s*body[^>]*>/gi, '')  // closing </body> ALL variants
    .replace(/<\s*\/\s*html[^>]*>/gi, '')  // closing </html> ALL variants
    .replace(/<\s*html[^>]*>/gi, '')       // opening <html ...>
    .replace(/<!DOCTYPE[^>]*>/gi, '');     // any remaining DOCTYPE

  // Step 7: Remove trailing unbalanced </div> tags.
  // AI-generated content often wraps everything in a <div class="container"> inside
  // <body>. After the body wrapper is stripped, its closing </div> is left behind.
  // An extra </div> in dangerouslySetInnerHTML consumes the prose wrapper's closing
  // tag, causing the Tags / CTA sections to be injected inside the prose div in the
  // browser DOM — triggering a React hydration mismatch on SSR.
  const openDivs  = (result.match(/<div[\s>]/gi) || []).length;
  const closeDivs = (result.match(/<\/div\s*>/gi) || []).length;
  let excess = closeDivs - openDivs;
  while (excess > 0) {
    const last = result.lastIndexOf('</div');
    if (last === -1) break;
    const end = result.indexOf('>', last) + 1;
    result = result.slice(0, last) + result.slice(end);
    excess--;
  }

  result = labelUnlabeledSelects(result.trim());
  return result;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function selectHasAccessibleName(attrs: string, html: string, selectIndex: number): boolean {
  if (/\b(aria-label|aria-labelledby|title)\s*=/i.test(attrs)) return true;

  const idMatch = attrs.match(/\bid\s*=\s*(["'])([^"']+)\1/i);
  if (idMatch) {
    const id = idMatch[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const labelFor = new RegExp(`<label\\b[^>]*\\sfor\\s*=\\s*(["'])${id}\\1`, 'i');
    if (labelFor.test(html)) return true;
  }

  return false;
}

/** Infer a short label from CMS markup immediately before a <select>. */
function inferSelectLabel(html: string, selectIndex: number): string | null {
  const before = html.slice(Math.max(0, selectIndex - 800), selectIndex);

  const rowStart = Math.max(
    before.lastIndexOf('eoi-row'),
    before.lastIndexOf('form-row'),
    before.lastIndexOf('form-group'),
  );
  const context = rowStart > 0 ? before.slice(rowStart) : before;

  const labeled = context.match(/<label\b[^>]*>([\s\S]*?)<\/label>\s*$/i);
  if (labeled) {
    const text = stripTags(labeled[1]);
    if (text.length >= 2 && text.length <= 120) return text;
  }

  const inlineTags = [...context.matchAll(/<(span|strong|b|p|div|label|h[1-6])\b[^>]*>([^<]{2,120})<\/\1>/gi)];
  if (inlineTags.length > 0) {
    const text = inlineTags[inlineTags.length - 1][2].trim();
    if (text.length >= 2) return text;
  }

  const after = html.slice(selectIndex, selectIndex + 600);
  const firstOption = after.match(/<option\b[^>]*>([^<]{2,80})<\/option>/i);
  if (firstOption) {
    const text = firstOption[1].trim();
    if (!/^(select|choose|--|\d)/i.test(text)) return text;
  }

  return null;
}

/**
 * Adds aria-label to <select> elements in CMS HTML that lack an accessible name.
 * Fixes Lighthouse agent-accessibility-tree / select-name failures on project pages.
 */
function labelUnlabeledSelects(html: string): string {
  const selectRe = /<select\b([^>]*)>/gi;
  const replacements: { start: number; end: number; replacement: string }[] = [];

  let match: RegExpExecArray | null;
  while ((match = selectRe.exec(html)) !== null) {
    const [fullMatch, attrs] = match;
    const start = match.index;

    if (selectHasAccessibleName(attrs, html, start)) continue;

    const label = inferSelectLabel(html, start);
    if (!label) continue;

    const trimmedAttrs = attrs.trim();
    const attrPart = trimmedAttrs.length > 0 ? ` ${trimmedAttrs}` : '';
    replacements.push({
      start,
      end: start + fullMatch.length,
      replacement: `<select${attrPart} aria-label="${escapeAttr(label)}">`,
    });
  }

  if (replacements.length === 0) return html;

  let result = html;
  for (let i = replacements.length - 1; i >= 0; i--) {
    const { start, end, replacement } = replacements[i];
    result = result.slice(0, start) + replacement + result.slice(end);
  }

  return result;
}
