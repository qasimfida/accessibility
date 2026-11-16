import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const width of [1280, 320])
  test(`registry cards keep chrome and keyboard focus visible at ${width}px`, async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/article.html');
    await page.waitForFunction(() => !!Reflect.get(window, 'contentInstance'));
    await page.keyboard.press('Alt+KeyA');
    const panel = page.getByRole('dialog', { name: 'Accessibility options' });
    const body = panel.locator('.accessiblit-body');
    const header = panel.locator('.accessiblit-header');
    const reset = panel.getByRole('button', { name: 'Reset all', exact: true });
    await expect(
      panel.locator('.accessiblit-feature-icon svg[aria-hidden=true]'),
    ).toHaveCount(18);
    const cards = await panel
      .locator('.accessiblit-group')
      .first()
      .locator('.accessiblit-feature')
      .evaluateAll((nodes) =>
        nodes.slice(0, 2).map((node) => node.getBoundingClientRect().toJSON()),
      );
    if (width === 1280) {
      expect(cards[0]!.top).toBe(cards[1]!.top);
      expect(cards[1]!.left).toBeGreaterThan(cards[0]!.right);
    } else expect(cards[1]!.top).toBeGreaterThan(cards[0]!.bottom);
    const initialHeader = await header.boundingBox();
    const initialReset = await reset.boundingBox();
    await body.evaluate((node) => {
      node.scrollTop = node.scrollHeight;
    });
    expect(await header.boundingBox()).toEqual(initialHeader);
    expect(await reset.boundingBox()).toEqual(initialReset);
    await expect(
      panel.getByRole('button', { name: 'Close', exact: true }),
    ).toBeFocused();
    const tab =
      browserName === 'webkit' && process.platform === 'darwin'
        ? 'Alt+Tab'
        : 'Tab';
    for (let index = 0; index < 36; index++) {
      await page.keyboard.press(tab);
      const position = await body.evaluate((node) => {
        const focus =
          node.getRootNode() instanceof ShadowRoot
            ? (node.getRootNode() as ShadowRoot).activeElement
            : null;
        if (!focus || !node.contains(focus)) return null;
        const box = focus.getBoundingClientRect();
        const viewport = node.getBoundingClientRect();
        return {
          top: box.top - viewport.top,
          bottom: viewport.bottom - box.bottom,
        };
      });
      if (position) {
        expect(position.top).toBeGreaterThanOrEqual(3);
        expect(position.bottom).toBeGreaterThanOrEqual(3);
      }
      if (
        await reset.evaluate(
          (node) => node === (node.getRootNode() as ShadowRoot).activeElement,
        )
      )
        break;
    }
    await expect(reset).toBeFocused();
    const overflow = await body.evaluate(
      (node) => node.scrollWidth - node.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    // Audit in a fresh tab after keyboard traversal to avoid the Firefox semantic-walker crash.
    const audit = await page.context().newPage();
    await audit.setViewportSize({ width, height: 1000 });
    await audit.goto('/article.html');
    await audit.waitForFunction(() => !!Reflect.get(window, 'contentInstance'));
    await audit.keyboard.press('Alt+KeyA');
    expect(
      (
        await new AxeBuilder({ page: audit })
          .include('[data-accessiblit-host]')
          .analyze()
      ).violations,
    ).toEqual([]);
    await audit.close();
  });
