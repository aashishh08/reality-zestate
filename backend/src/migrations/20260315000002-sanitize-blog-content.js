'use strict';

function stripHtmlDocumentWrapper(content) {
  if (!content || typeof content !== 'string') return content;
  let result = content;

  // Extract body content if full document
  const bodyMatch = result.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();

  // No <body> but has document wrapper tags — strip them
  result = result.replace(/<!DOCTYPE[^>]*>/gi, '');
  result = result.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '');
  const headOpen = result.toLowerCase().indexOf('<head');
  if (headOpen !== -1) {
    const headClose = result.toLowerCase().indexOf('</head>');
    if (headClose !== -1) result = result.slice(0, headOpen) + result.slice(headClose + 7);
  }
  return result.trim();
}

export const up = async (queryInterface) => {
  const [blogs] = await queryInterface.sequelize.query(
    `SELECT id, content FROM blogs WHERE content ILIKE '%<body%' OR content ILIKE '%</html>%'`
  );

  for (const blog of blogs) {
    const cleaned = stripHtmlDocumentWrapper(blog.content);
    if (cleaned !== blog.content) {
      await queryInterface.sequelize.query(
        `UPDATE blogs SET content = :content, "updatedAt" = NOW() WHERE id = :id`,
        { replacements: { content: cleaned, id: blog.id } }
      );
    }
  }
};

export const down = async () => {
  // Not reversible — original content not preserved
};
