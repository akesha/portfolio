import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";
import { profile, tools } from "./portfolioData.js";

test("portfolio profile has primary identity and links", () => {
  assert.equal(profile.name, "Dr. Akesha Horton");
  assert.equal(profile.stats[0].value, "27");
  assert.ok(profile.links.length >= 3);

  for (const link of profile.links) {
    assert.ok(link.label);
    assert.ok(link.text);
    assert.equal(new URL(link.url).protocol, "https:");
  }
});

test("tool archive has 27 complete tools with local thumbnails", async () => {
  assert.equal(tools.length, 27);
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
});
