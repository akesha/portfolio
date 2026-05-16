import assert from "node:assert/strict";
import test from "node:test";
import {
  critiqueLabels,
  examples,
  phases,
  promptModes,
  rubric,
  sentenceStarters,
} from "./activityData.js";

test("activity phases are ordered and uniquely identifiable", () => {
  assert.ok(phases.length >= 5);
  assert.equal(new Set(phases.map((phase) => phase.id)).size, phases.length);
  assert.equal(phases[0].id, "question");
  assert.equal(phases.at(-1).id, "export");
});

test("question examples include context and paired AI samples", () => {
  assert.ok(examples.length >= 3);

  for (const example of examples) {
    assert.ok(example.id);
    assert.ok(example.label);
    assert.ok(example.question.endsWith("?"));
    assert.ok(example.context.length > 20);
    assert.ok(example.sampleA.length > 80);
    assert.ok(example.sampleB.length > 80);
  }
});

test("prompt modes preserve learner judgment requirements", () => {
  assert.ok(promptModes.length >= 4);

  for (const mode of promptModes) {
    assert.match(mode.template, /\{question\}/);
    assert.match(mode.template, /\{context\}/);
  }

  assert.ok(promptModes.some((mode) => /trust|judge|checking/i.test(mode.template)));
});

test("critique and reflection supports are complete", () => {
  assert.deepEqual(
    critiqueLabels.map((label) => label.label),
    [
      "Accurate",
      "Questionable",
      "Missing",
      "Stronger Than Mine",
      "Weaker Than Mine",
    ],
  );
  assert.equal(rubric.length, 5);
  assert.ok(sentenceStarters.every((starter) => starter.endsWith("...")));
});
