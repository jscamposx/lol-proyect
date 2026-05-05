import { expect, test } from "@playwright/test";

const tabs = [
  { id: "home", label: "Inicio" },
  { id: "participants", label: "Jugadores" },
  { id: "matches", label: "Partidas" },
  { id: "ranking", label: "Ranking" },
  { id: "rules", label: "Reglas" },
];

test.describe("mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const tab of tabs) {
    test(`${tab.label} does not overflow horizontally`, async ({ page }) => {
      await page.goto("http://127.0.0.1:5175/");
      const mobileNav = page.locator('nav[aria-label="Navegación principal"]');

      if (tab.id !== "home") {
        await mobileNav.locator("button", { hasText: tab.label }).click();
      }

      await expect(mobileNav).toBeVisible();
      await page.waitForTimeout(700);

      const layout = await page.evaluate(() => {
        const root = document.documentElement;
        const offenders = [...document.body.querySelectorAll("*")]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: String(element.getAttribute("class") || ""),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            };
          })
          .filter((item) => item.width > 0 && (item.left < -1 || item.right > window.innerWidth + 1))
          .slice(0, 8);

        return {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          offenders,
        };
      });

      await page.screenshot({ path: `.codex-mobile-${tab.id}.png`, fullPage: false });

      expect(layout.scrollWidth, JSON.stringify(layout.offenders, null, 2)).toBeLessThanOrEqual(layout.clientWidth + 1);
    });
  }
});
