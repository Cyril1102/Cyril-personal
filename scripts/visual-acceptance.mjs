import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'artifacts', 'visual-acceptance');

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 1000 },
  { name: '4k', width: 3840, height: 2160 },
];

const typographySelectors = {
  heroGreeting: '.hero-greeting',
  heroName: '.hero-name',
  heroStatement: '.hero-manifesto',
  carouselTitle: '.hero-map-header h2',
  carouselStageTitle: '.hero-map-stage h3',
  carouselResult: '.hero-map-outcome strong',
  sectionTitle: '.section-head h2',
  caseTitle: '.case-copy h3',
  methodTitle: '.method-card h3',
  educationTitle: '.education-card h3',
  contactTitle: '.contact-panel h2',
};

const componentSelectors = {
  hero: '#top',
  heroCarousel: '.hero-case-carousel',
  firstCase: '#case-studies .case-chapter',
  method: '#method',
  education: '#education',
};

const densityBudgets = {
  mobile: {
    carouselTitle: 18.5,
    carouselResult: 46,
  },
  desktop: {
    carouselTitle: 21.5,
    carouselResult: 45.5,
  },
  '4k': {
    carouselTitle: 18.5,
    carouselStageTitle: 12.5,
    carouselResult: 35,
  },
};

const px = (value) => Number.parseFloat(value || '0');
const format = (value) => (Number.isFinite(value) ? value.toFixed(1) : '-');

async function inspectPage(page) {
  return page.evaluate(
    ({ typography, components }) => {
      const visibleElement = (selector) =>
        [...document.querySelectorAll(selector)].find((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        });

      const type = Object.fromEntries(
        Object.entries(typography).map(([name, selector]) => {
          const element = visibleElement(selector);
          if (!element) return [name, null];
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return [
            name,
            {
              fontSize: Number.parseFloat(style.fontSize),
              lineHeight: Number.parseFloat(style.lineHeight),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            },
          ];
        }),
      );

      const boxes = Object.fromEntries(
        Object.entries(components).map(([name, selector]) => {
          const element = visibleElement(selector);
          if (!element) return [name, null];
          const rect = element.getBoundingClientRect();
          return [
            name,
            {
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            },
          ];
        }),
      );

      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        typography: type,
        boxes,
      };
    },
    { typography: typographySelectors, components: componentSelectors },
  );
}

async function revealFullPage(page) {
  await page.evaluate(async () => {
    const pause = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
    const step = Math.max(Math.round(innerHeight * 0.72), 480);
    for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
      scrollTo(0, top);
      await pause(45);
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await pause(120);
    scrollTo(0, 0);
  });
  await page.waitForTimeout(180);
}

function evaluateLayout(report) {
  const failures = [];
  const overflow = report.document.width - report.viewport.width;
  if (overflow > 1) failures.push(`Horizontal overflow: ${overflow}px`);

  for (const [name, box] of Object.entries(report.boxes)) {
    if (!box) {
      failures.push(`Missing visible component: ${name}`);
      continue;
    }
    if (box.left < -1 || box.right > report.viewport.width + 1) {
      failures.push(`${name} exceeds viewport (${box.left}px to ${box.right}px)`);
    }
  }

  return failures;
}

function evaluateDensity(viewportName, typography) {
  const failures = [];
  for (const [name, maximum] of Object.entries(densityBudgets[viewportName])) {
    const metric = typography[name];
    if (!metric) {
      failures.push(`Missing typography metric: ${name}`);
      continue;
    }
    if (metric.fontSize > maximum) {
      failures.push(`${name} is ${metric.fontSize}px; budget is ${maximum}px`);
    }
  }

  const title = typography.carouselTitle?.fontSize;
  const stageTitle = typography.carouselStageTitle?.fontSize;
  const result = typography.carouselResult?.fontSize;
  if (title && stageTitle && title / stageTitle > 1.7) {
    failures.push(`Carousel title hierarchy ratio is ${(title / stageTitle).toFixed(2)}; maximum is 1.70`);
  }
  if (result && stageTitle && result / stageTitle > 3.6) {
    failures.push(`Carousel result hierarchy ratio is ${(result / stageTitle).toFixed(2)}; maximum is 3.60`);
  }

  return failures;
}

function createMarkdown(results, consoleErrors) {
  const layoutFailures = results.flatMap((result) => result.layoutFailures.map((message) => `${result.name}: ${message}`));
  const densityFailures = results.flatMap((result) => result.densityFailures.map((message) => `${result.name}: ${message}`));
  const rows = results.flatMap((result) =>
    Object.entries(result.report.typography).map(([name, metric]) =>
      metric
        ? `| ${result.name} | ${name} | ${format(metric.fontSize)}px | ${format(metric.lineHeight)}px | ${metric.width} x ${metric.height} |`
        : `| ${result.name} | ${name} | missing | missing | missing |`,
    ),
  );

  const list = (items, emptyText) => (items.length ? items.map((item) => `- ${item}`).join('\n') : `- ${emptyText}`);

  return `# Visual acceptance report

Generated: ${new Date().toISOString()}

## Gate 1: layout correctness

Status: **${layoutFailures.length || consoleErrors.length ? 'FAIL' : 'PASS'}**

${list([...layoutFailures, ...consoleErrors], 'No overflow, clipping, missing component, or runtime error detected.')}

## Gate 2: visual scale

Status: **${densityFailures.length ? 'FAIL' : 'PASS'}**

${list(densityFailures, 'Typography stays within the approved density budgets and hierarchy ratios.')}

## Typography metrics

| Viewport | Element | Font size | Line height | Rendered box |
| --- | --- | ---: | ---: | ---: |
${rows.join('\n')}

## Gate 3: manual visual review

Automated checks do not replace visual judgment. Review both the full-page image and the component crops before release.

- [ ] Full-page composition has balanced scale, whitespace, and reading rhythm.
- [ ] Hero carousel typography is proportionate to its card and does not dominate at 4K.
- [ ] Key component crops preserve hierarchy across mobile, desktop, and 4K.
- [ ] Record layout correctness and visual quality as separate decisions.

Screenshots are stored beside this report under one folder per viewport.
`;
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const server = await createServer({
    root: rootDir,
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0 },
  });
  await server.listen();
  const targetUrl = server.resolvedUrls?.local?.[0];
  if (!targetUrl) throw new Error('Vite did not provide a local preview URL.');

  const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    if (!existsSync(systemChrome)) throw error;
    browser = await chromium.launch({ headless: true, executablePath: systemChrome });
  }
  const results = [];
  const consoleErrors = [];

  try {
    for (const viewport of viewports) {
      const folder = path.join(outputDir, viewport.name);
      await mkdir(folder, { recursive: true });
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: 'light',
        reducedMotion: 'reduce',
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(`${viewport.name}: ${message.text()}`);
      });
      page.on('pageerror', (error) => consoleErrors.push(`${viewport.name}: ${error.message}`));

      await page.goto(targetUrl, { waitUntil: 'networkidle' });
      const firstDot = page.locator('.hero-carousel-dot').first();
      if (await firstDot.count()) await firstDot.click();
      await revealFullPage(page);

      const report = await inspectPage(page);
      const layoutFailures = evaluateLayout(report);
      const densityFailures = evaluateDensity(viewport.name, report.typography);
      results.push({ name: viewport.name, report, layoutFailures, densityFailures });

      await page.screenshot({
        path: path.join(folder, 'full-page.jpg'),
        fullPage: true,
        type: 'jpeg',
        quality: 76,
      });

      for (const [name, selector] of Object.entries(componentSelectors)) {
        const locator = page.locator(selector).first();
        if (!(await locator.count())) continue;
        await locator.scrollIntoViewIfNeeded();
        await locator.screenshot({ path: path.join(folder, `${name}.png`), animations: 'disabled' });
      }

      await context.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }

  const markdown = createMarkdown(results, consoleErrors);
  await writeFile(path.join(outputDir, 'report.md'), markdown);
  await writeFile(path.join(outputDir, 'metrics.json'), `${JSON.stringify(results, null, 2)}\n`);

  const failed = results.some((result) => result.layoutFailures.length || result.densityFailures.length) || consoleErrors.length;
  console.log(markdown);
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
