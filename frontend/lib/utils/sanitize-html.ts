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

  return result.trim();
}
