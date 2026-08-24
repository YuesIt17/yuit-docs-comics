export interface ParsedResumeFrontmatter {
  name?: string;
  target?: string;
  location?: string;
  language?: string;
  version?: string;
}

export interface ParsedResumeMarkdown {
  frontmatter: ParsedResumeFrontmatter;
  body: string;
  summary: string;
}

export function parseResumeMarkdown(raw: string): ParsedResumeMarkdown {
  const trimmed = raw.replace(/^\uFEFF/, "");
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  const frontmatter: ParsedResumeFrontmatter = {};
  let body = trimmed;

  if (match) {
    const [, fmBlock, rest] = match;
    body = rest.trim();
    for (const line of fmBlock.split(/\r?\n/)) {
      const idx = line.indexOf(":");
      if (idx <= 0) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key === "name") frontmatter.name = value;
      if (key === "target") frontmatter.target = value;
      if (key === "location") frontmatter.location = value;
      if (key === "language") frontmatter.language = value;
      if (key === "version") frontmatter.version = value;
    }
  }

  const summary = extractProfessionalSummary(body);
  return { frontmatter, body, summary };
}

function extractProfessionalSummary(body: string): string {
  const section = body.match(
    /##\s+PROFESSIONAL SUMMARY\s*\r?\n([\s\S]*?)(?=\r?\n##\s|$)/i
  );
  if (!section) return "";
  return section[1]
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
}
