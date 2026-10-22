import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";
import { profile, tools } from "./portfolioData.js";

test("portfolio profile has primary identity and links", () => {
  assert.equal(profile.name, "Dr. Akesha Horton");
  assert.equal(profile.stats[0].value, "42");
  assert.ok(profile.links.length >= 3);

  for (const link of profile.links) {
    assert.ok(link.label);
    assert.ok(link.text);
    assert.equal(new URL(link.url).protocol, "https:");
  }
});

test("tool archive has 42 complete tools with local thumbnails", async () => {
  assert.equal(tools.length, 42);
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length);

  for (const tool of tools) {
    assert.ok(tool.title);
    assert.ok(tool.category);
    assert.ok(tool.summary);
    assert.ok(tool.audience);
    assert.ok(tool.format);
    assert.ok(tool.tags.length > 0);
    assert.equal(new URL(tool.url).protocol, "https:");
    assert.match(tool.image, /^\.\/assets\/current\/.+\.(png|jpeg)$/);
    await stat(new URL(tool.image, import.meta.url));
  }

  assert.equal(new Set(tools.map((tool) => tool.url)).size, tools.length);
});

test("featured tools lead the archive in order", () => {
  const featured = [
    "https://akesha.github.io/graphicNovel/",
    "https://akesha.github.io/luddyindy/",
    "https://akesha.github.io/visionBoard/",
    "https://akesha.github.io/wheelofLife/",
    "https://akesha.github.io/aichar/",
    "https://course-coach-2ms.pages.dev/coach",
  ];

  assert.deepEqual(
    tools.slice(0, featured.length).map((tool) => tool.url),
    featured,
  );
});
