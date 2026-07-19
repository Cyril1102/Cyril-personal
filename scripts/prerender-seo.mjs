import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const baseRoutes = [
  '/',
  '/journal',
  '/journal/vibe-coding-portfolio-retrospective',
  '/journal/baixi-xyz-launch-log',
  '/cases/gate-domain-migration',
  '/cases/ai-pmo-automation',
  '/cases/design-delivery-automation',
  '/cases/seo-geo-aso-portfolio',
  '/cases/coins-global-expansion',
  '/cases/binance-global-payments',
];
const routes = [
  ...baseRoutes,
  ...baseRoutes.map((route) => (route === '/' ? '/en/' : `/en${route}`)),
];

const server = await preview({
  root: rootDir,
  logLevel: 'silent',
  preview: { host: '127.0.0.1', port: 0 },
});

const address = server.httpServer.address();
if (!address || typeof address === 'string') {
  throw new Error('Unable to resolve the local preview address.');
}

const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch (error) {
  if (!existsSync(systemChrome)) throw error;
  browser = await chromium.launch({ headless: true, executablePath: systemChrome });
}

try {
  const context = await browser.newContext({
    locale: 'zh-CN',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });

  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${address.port}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#root > *');
    await page.waitForFunction(() => Boolean(document.querySelector('#page-structured-data')));

    const html = await page.content();
    const outputPath =
      route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.slice(1), 'index.html');

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${html}\n`);
    await page.close();
  }

  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()));
  });
}

console.log(`Prerendered ${routes.length} search-ready pages.`);
