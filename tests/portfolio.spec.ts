import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { profile, projects, experience } from "../src/content/portfolio";

test("content is server-rendered with SEO metadata and no public resume", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Complex problems.");
  expect(html).toContain("application/ld+json");
  expect(html).toContain('name="description"');
  expect(html).toContain('property="og:image"');
  expect(html).not.toContain("your-domain.com");
  expect((await request.get("/Shishir_Jha_Resume.pdf")).status()).toBe(404);
  expect(html).not.toContain('download=""');
  expect(html).not.toContain('href="/Shishir_Jha_Resume.pdf"');
  const social = await request.get("/opengraph-image");
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/png");
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
});

test("project filtering follows the content and has accurate source links", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".project-card")).toHaveCount(projects.length);
  for (const category of new Set(projects.map((project) => project.category))) {
    await page.getByRole("button", { name: category, exact: true }).click();
    const matching = projects.filter(
      (project) => project.category === category,
    );
    await expect(page.locator(".project-card")).toHaveCount(matching.length);
    for (const project of matching) {
      const card = page.locator(".project-card").filter({
        has: page.getByRole("heading", { name: project.title, exact: true }),
      });
      await expect(
        card.locator(".project-links > a[target=_blank]").first(),
      ).toHaveAttribute("href", project.githubUrl ?? profile.github);
    }
  }
  await page.getByRole("button", { name: "All work", exact: false }).click();
  await expect(page.locator(".project-card")).toHaveCount(projects.length);
});

test("glass navigation follows section selection", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Skills", exact: true })
      .click();
    await expect(page).toHaveURL(/#skills$/);
  } else {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    const indicator = page.locator(".nav-indicator");
    const initial = await indicator.evaluate(
      (element) => getComputedStyle(element).transform,
    );
    await nav.getByRole("link", { name: "Experience", exact: true }).hover();
    // Hover and focus must not move the selection away from the current section.
    await page.waitForTimeout(450);
    expect(
      await indicator.evaluate(
        (element) => getComputedStyle(element).transform,
      ),
    ).toBe(initial);
    await nav.getByRole("link", { name: "Experience", exact: true }).focus();
    expect(
      await indicator.evaluate(
        (element) => getComputedStyle(element).transform,
      ),
    ).toBe(initial);
    await nav.getByRole("link", { name: "Skills", exact: true }).click();
    await expect(page).toHaveURL(/#skills$/);
    await expect(
      nav.getByRole("link", { name: "Skills", exact: true }),
    ).toHaveAttribute("aria-current", "location");
  }
  await expect(
    page.getByRole("heading", { name: "My working stack." }),
  ).toBeInViewport();
});

test("case studies, next project navigation and 404s work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const project of projects) {
    await page.goto(`/work/${project.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      `${project.title}.`,
    );
    expect(await page.title()).toContain(profile.name);
    await expect(page.locator(".project-flow > div")).toHaveCount(
      project.flow.length,
    );
  }
  if (projects.length > 1) {
    await page.locator(".next-project").click();
    await expect(page).toHaveURL(new RegExp(`/work/${projects[0].slug}$`));
  }
  const missing = await page.goto("/work/does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nothing here.",
  );
  expect(errors).toEqual([]);
});

test("layouts fit narrow phones, tablets, and wide screens", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({
      screen: innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(
      dimensions.content,
      `horizontal overflow at ${width}px`,
    ).toBeLessThanOrEqual(dimensions.screen);
  }
});

test("navigation is keyboard accessible and mobile menu closes on Escape", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  if (isMobile) {
    const menu = page.locator("button[aria-controls=mobile-navigation]");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await menu.click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: /Skills/ })
      .click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#skills$/);
  }
});

test("main pages meet automated WCAG accessibility checks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/",
    ...projects.map((project) => `/work/${project.slug}`),
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map(({ id, nodes }) => ({
        id,
        nodes: nodes.map((node) => ({
          selector: node.target,
          summary: node.failureSummary,
        })),
      })),
      `Accessibility failures on ${route}`,
    ).toEqual([]);
  }
});

test("content and source links remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/");
  await expect(page.locator(".project-card")).toHaveCount(projects.length);
  await page
    .locator(`.project-title-link[href="/work/${projects[0].slug}"]`)
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    `${projects[0].title}.`,
  );
  await context.close();
});

test("reduced motion disables animated transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.locator(".orb-art").evaluate((element) => ({
    animation: getComputedStyle(element).animationName,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(motion).toEqual({ animation: "none", scrollBehavior: "auto" });
});

// Content changes should preserve usable URLs and navigation.
test("editable project content has unique slugs and usable links", () => {
  expect(projects.length).toBeGreaterThan(0);
  expect(new Set(projects.map((project) => project.slug)).size).toBe(
    projects.length,
  );
  for (const project of projects) {
    expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(project.category).not.toBe("All work");
    expect(project.features.length).toBeGreaterThan(0);
    expect(project.flow.length).toBeGreaterThan(0);
    for (const link of [project.githubUrl, project.liveUrl].filter(Boolean)) {
      expect(new URL(link!).protocol).toBe("https:");
    }
  }
});

test("profile links, private resume, and contribution lists are correct", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /resume/i })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /^All repositories/ }),
  ).toHaveAttribute("href", "https://github.com/shishir2305?tab=repositories");
  await expect(page.getByRole("link", { name: /^LeetCode/ })).toHaveAttribute(
    "href",
    "https://leetcode.com/u/shishir230501/",
  );
  await expect(page.locator(".hero-current svg")).toHaveCount(0);
  for (const item of experience) {
    const role = page.locator(".experience-item").filter({
      has: page.getByRole("heading", { name: item.role, exact: true }),
    });
    await expect(role.getByRole("listitem")).toHaveCount(item.current ? 3 : 2);
  }
});

test("work arrow follows its direction and the artwork caption stays still", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "The decorative artwork is intentionally hidden on phones.",
  );
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const caption = page.locator(".orb-caption");
  const before = await caption.boundingBox();
  await page.getByRole("link", { name: "View my work", exact: true }).hover();
  await expect
    .poll(() =>
      page.locator(".work-button > svg").evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(
          getComputedStyle(element).transform,
        );
        return matrix.m41 > 2.9 && matrix.m42 > 2.9;
      }),
    )
    .toBe(true);
  await page.waitForTimeout(600);
  const after = await caption.boundingBox();
  expect(after?.x).toBe(before?.x);
  expect(after?.y).toBe(before?.y);
  await expect(page.locator(".work-button")).toHaveCSS("transform", "none");
});

test("contact form validates before submitting and preserves drafts on failure", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/contact", async (route) => {
    requests++;
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message:
          "Message delivery is temporarily unavailable. Please try again later.",
      }),
    });
  });
  await page.goto("/");
  const form = page.getByRole("form", { name: "Send a message" });
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByLabel("Your name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(requests).toBe(0);
  await form.getByLabel("Your name").fill("Alex Rivera");
  await form.getByLabel("Your email").fill("alex@example.com");
  await form
    .getByLabel("Your message")
    .fill("I would like to discuss a web application project.");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await expect(form.getByLabel("Your message")).toHaveValue(
    "I would like to discuss a web application project.",
  );
  await expect(
    form.getByRole("button", { name: "Send message" }),
  ).toBeEnabled();
  expect(requests).toBe(1);
});

test("contact form sends visitor details, prevents duplicate submissions, and confirms success", async ({
  page,
}) => {
  let requests = 0;
  let complete!: () => void;
  const release = new Promise<void>((resolve) => {
    complete = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    requests++;
    expect(route.request().postDataJSON()).toMatchObject({
      name: "Alex Rivera",
      email: "alex@example.com",
      message: "I would like to discuss a web application project.",
      website: "",
    });
    await release;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });
  await page.goto("/");
  const form = page.getByRole("form", { name: "Send a message" });
  await form.getByLabel("Your name").fill("Alex Rivera");
  await form.getByLabel("Your email").fill("alex@example.com");
  await form
    .getByLabel("Your message")
    .fill("I would like to discuss a web application project.");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByRole("button", { name: "Sending" })).toBeDisabled();
  await expect(form.getByLabel("Your name")).toBeDisabled();
  complete();
  await expect(form.getByRole("status")).toContainText("Message sent.");
  await expect(form.getByLabel("Your name")).toHaveValue("");
  await expect(form.getByLabel("Your message")).toHaveValue("");
  expect(requests).toBe(1);
});
