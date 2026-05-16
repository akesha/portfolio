export const activity = {
  title: "Student AI Literacy Through Structured Use",
  author: "Akesha Horton",
  purpose:
    "Design a student-facing AI activity where learners critique, compare, and reflect so they build judgment, not dependency.",
};

export const phases = [
  {
    id: "question",
    label: "Set Task",
    title: "Choose the question",
    check: "Question selected",
  },
  {
    id: "think",
    label: "Think",
    title: "Answer before AI",
    check: "Original thinking captured",
  },
  {
    id: "prompt",
    label: "Prompt",
    title: "Ask deliberately",
    check: "Prompt prepared",
  },
  {
    id: "critique",
    label: "Critique",
    title: "Audit the response",
    check: "AI output questioned",
  },
  {
    id: "compare",
    label: "Compare",
    title: "Rate usefulness",
    check: "Responses compared",
  },
  {
    id: "reflect",
    label: "Reflect",
    title: "Revise with judgment",
    check: "Final judgment written",
  },
  {
    id: "export",
    label: "Submit",
    title: "Share the audit trail",
    check: "AI Use Note ready",
  },
];

export const examples = [
  {
    id: "ai-writing",
    label: "AI and writing",
    question:
      "Should students be allowed to use AI tools while drafting an essay?",
    context: "Class discussion on academic integrity, authorship, and revision",
    sampleA:
      "Students should be allowed to use AI tools while drafting an essay because AI can help them brainstorm ideas, organize paragraphs, and improve grammar. Like calculators or spellcheck, AI can support learning when used responsibly. However, students should not submit AI-generated writing as their own. Teachers can require students to show drafts, explain what they changed, and cite or disclose AI use. The best policy is to allow AI for support while still holding students responsible for their ideas, evidence, and final decisions.",
    sampleB:
      "A cautious answer is that AI use during essay drafting can weaken learning if students rely on it too early. Drafting is where students discover what they think. If AI supplies the structure, examples, or wording before students have struggled with the task, it can hide gaps in understanding. A balanced policy might allow AI after a first draft, or only for targeted feedback. Students should be able to identify which suggestions they accepted, rejected, and revised.",
  },
  {
    id: "source-trust",
    label: "Source trust",
    question:
      "What makes an online source trustworthy for a research project?",
    context: "Research skills unit on credibility, evidence, and bias",
    sampleA:
      "A trustworthy online source usually has a clear author, recent publication date, evidence for its claims, and a reputable publisher. Students should check whether the source links to original data, uses expert knowledge, and avoids exaggerated claims. It is also important to compare the source with other reliable sources. A website can look professional and still be unreliable, so students should evaluate the evidence rather than the design alone.",
    sampleB:
      "Trustworthiness depends on the research question. A personal blog may be weak for scientific facts but useful for studying lived experience. A government report may be strong for statistics but still reflect policy choices and categories that deserve critique. Instead of asking whether a source is simply good or bad, students should ask what kind of claim the source can support, what it leaves out, and whose perspective is centered.",
  },
  {
    id: "heat-risk",
    label: "Civic problem",
    question:
      "How can a city reduce heat risk for residents during extreme summer weather?",
    context: "Local problem-solving unit using public health and infrastructure evidence",
    sampleA:
      "A city can reduce heat risk by planting more trees, opening cooling centers, sending heat alerts, and providing water stations in public areas. These actions are especially important for older adults, outdoor workers, people without air conditioning, and residents in neighborhoods with less shade. Long-term planning should include reflective roofs, shaded transit stops, and emergency plans for power outages. The city should also communicate in multiple languages so residents know where to get help.",
    sampleB:
      "Tree planting and cooling centers help, but they can be too slow or too limited if the city ignores housing, transportation, and inequality. Residents may not be able to reach cooling centers, and renters may not control air conditioning or insulation. A stronger plan would combine immediate emergency support with tenant protections, utility assistance, neighborhood heat mapping, and investment in areas that have historically received fewer resources.",
  },
];

export const promptModes = [
  {
    id: "clear",
    label: "Clear Answer",
    title: "Student-friendly explanation",
    template:
      "Answer this question for a student audience. Give a clear explanation with reasons or evidence.\n\nQuestion: {question}\n\nClass context: {context}\n\nEnd with two questions I should ask before trusting your answer.",
  },
  {
    id: "skeptical",
    label: "Skeptical",
    title: "Find weaknesses and complications",
    template:
      "Give a skeptical response to this question. Point out possible weaknesses, missing context, overgeneralizations, or assumptions.\n\nQuestion: {question}\n\nClass context: {context}\n\nDo not write my final answer for me. Help me judge the answer.",
  },
  {
    id: "opposing",
    label: "Alternative",
    title: "Generate another interpretation",
    template:
      "Give an opposing viewpoint or alternative interpretation for this question. Explain where reasonable people might disagree.\n\nQuestion: {question}\n\nClass context: {context}\n\nList what evidence would help decide between the views.",
  },
  {
    id: "source",
    label: "Evidence Check",
    title: "Ask for source-aware reasoning",
    template:
      "Use the class context below to explain what evidence would be needed to answer this question well. Separate facts, interpretations, and claims that require checking.\n\nQuestion: {question}\n\nClass context: {context}\n\nKeep the response concise and label any uncertainty.",
  },
];

export const critiqueLabels = [
  {
    id: "accurate",
    label: "Accurate",
    helper: "Seems correct and supported by what we know.",
  },
  {
    id: "questionable",
    label: "Questionable",
    helper: "Might be vague, biased, unsupported, or too confident.",
  },
  {
    id: "missing",
    label: "Missing",
    helper: "Leaves out an important source, perspective, or condition.",
  },
  {
    id: "stronger",
    label: "Stronger Than Mine",
    helper: "Explains something more clearly than my first attempt.",
  },
  {
    id: "weaker",
    label: "Weaker Than Mine",
    helper: "Less specific, accurate, or thoughtful than my own answer.",
  },
];

export const rubric = [
  {
    id: "specificity",
    label: "Specificity",
    low: "generic",
    high: "precise",
  },
  {
    id: "evidence",
    label: "Evidence",
    low: "unsupported",
    high: "well grounded",
  },
  {
    id: "complexity",
    label: "Complexity",
    low: "flat",
    high: "nuanced",
  },
  {
    id: "voice",
    label: "Your Voice",
    low: "AI-led",
    high: "student-led",
  },
  {
    id: "verification",
    label: "Verification Need",
    low: "ready",
    high: "needs checking",
  },
];

export const sentenceStarters = [
  "AI was helpful when...",
  "AI was risky because...",
  "My original thinking still matters because...",
  "Before trusting this, I would check...",
];
