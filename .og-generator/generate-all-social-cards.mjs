// generate-all-social-cards.mjs
import { readdir, readFile, mkdir, stat } from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// base directory where this script lives
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CLI args: [node, script, blog_dir, output_dir, base_url, ...flags]
const [,, blogDirArg, outputDirArg, baseUrlArg, ...flags] = process.argv;

const BLOG_DIR   = blogDirArg   ? path.resolve(blogDirArg)   : path.resolve("../docs/blog/posts");
const OUTPUT_DIR = outputDirArg ? path.resolve(outputDirArg) : path.resolve("../docs/assets/social");
const BASE_URL   = baseUrlArg   || "http://localhost:9000/blog";

const FORCE = flags.includes("--force");

function extract_slug(markdown_text) {
  if (!markdown_text.startsWith("---")) return null;
  const end = markdown_text.indexOf("\n---", 3);
  if (end === -1) return null;
  const fm = markdown_text.slice(0, end + 1);
  const m = fm.match(/^\s*slug\s*:\s*["']?([^"'\n]+)["']?\s*$/m);
  return m ? m[1].trim() : null;
}

function run_generator(slug) {
  return new Promise((resolvePromise, reject) => {
    const url = `${BASE_URL}/${slug}`;
    const genPath = resolve(__dirname, "generate-social-card.mjs");  // 👈 always inside .og-generator
    const child = spawn("node", [genPath, OUTPUT_DIR, url, slug], { stdio: "inherit" });
    child.on("close", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`generator failed: ${slug}`))
    );
  });
}

async function needs_regen(md_path, png_path) {
  if (FORCE) return true;
  try {
    const [md, png] = await Promise.all([stat(md_path), stat(png_path)]);
    return md.mtimeMs > png.mtimeMs;
  } catch {
    return true;
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const files = (await readdir(BLOG_DIR)).filter(f => f.endsWith(".md"));

  console.log(`📝 scanning ${files.length} markdown posts in ${BLOG_DIR} (force=${FORCE})`);

  let done = 0, skipped = 0, missing = 0;

  for (const file of files) {
    const md_path = path.join(BLOG_DIR, file);
    const text = await readFile(md_path, "utf8");
    const slug = extract_slug(text);

    if (!slug) {
      console.warn(`⚠️  no slug in ${file} — skipping`);
      missing++;
      continue;
    }

    const png_path = path.join(OUTPUT_DIR, `${slug}.png`);
    if (!(await needs_regen(md_path, png_path))) {
      console.log(`⏭️  up-to-date: ${slug}`);
      skipped++;
      continue;
    }

    console.log(`⚡ generating: ${slug}`);
    await run_generator(slug);
    done++;
  }

  console.log(`✅ done: ${done} generated, ${skipped} skipped, ${missing} missing slug`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



