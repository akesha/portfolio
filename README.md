# Student AI Literacy Through Structured Use

An interactive student-facing AI literacy activity by Akesha Horton.

Learners move through a structured response audit:

- Start with their own answer before using AI
- Build a deliberate prompt
- Paste and critique AI responses
- Compare usefulness with a judgment rubric
- Revise and export an AI Use Note

## Local Preview

This is a static site. From the project folder, run:

```bash
python3 -m http.server 4174
```

Then open:

```text
http://127.0.0.1:4174/
```

## GitHub Pages

1. Create a new GitHub repository.
2. Add the project files to the repository root.
3. Commit and push to the `main` branch.
4. In GitHub, open `Settings` -> `Pages`.
5. Set `Source` to `Deploy from a branch`.
6. Set `Branch` to `main` and folder to `/root`.
7. Save.

The site uses relative paths, so it will work from a repository Pages URL such as:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

## Files Needed For The Site

- `index.html`
- `styles.css`
- `ai-literacy.js`
- `activityData.js`
- `assets/portfolio-hero.png`
- `.nojekyll`

## Testing

Run:

```bash
npm test
```
