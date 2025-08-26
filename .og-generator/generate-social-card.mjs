// generate_social_card.js
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const WIDTH = 1200;
const HEIGHT = 630;
const VIEWPORT = { width: WIDTH, height: HEIGHT };

/**
 * Generate a screenshot from a URL and save to a target directory
 * @param {string} target_directory - Output folder path
 * @param {string} url - Blog post URL
 * @param {string} slug - Output filename (without .png)
 */
async function capture_card(target_directory, url, slug) {
    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: VIEWPORT
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    try {
        await page.waitForSelector('main, article, h1', { timeout: 10000 });
    } catch (err) {
        console.warn("⚠️ Could not find expected content selectors. Proceeding anyway...");
    }
    await fs.mkdir(target_directory, { recursive: true });
    const file_path = path.join(target_directory, `${slug}.png`);
    await page.screenshot({
        path: file_path,
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    await browser.close();
    console.log(`✅ Saved social card: ${file_path}`);
}

if (process.argv.length !== 5) {
    console.error(`
Usage: node generate_social_card.mjs <output_dir> <url> <slug>
Example:
  node generate-social-card.mjs ../docs/assets/social https://vargaconsulting.github.io/blog from-curve-to-signature-ecdsa-guide
`);
    process.exit(1);
}


const [dir, url, slug] = process.argv.slice(2);
capture_card(dir, url, slug);
