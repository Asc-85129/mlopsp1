# mlopsp1

MLOps practical 1 — a hands-on demo of an end-to-end Git/GitHub team workflow
(branching, protected branches, PR review, merge-conflict resolution,
releases, and hotfixes) for a 4-person team: **Owner, Maintainer, Developer,
Intern**.

- The full workflow plan being demonstrated: [`plan.md`](./plan.md)
- The step-by-step record of what was actually executed against this repo,
  with links to the real branches, PRs, and tags produced: [`DEMO.md`](./DEMO.md)
- Contribution/branching conventions: [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## The demo app

To make the workflow concrete, every phase of `plan.md` is exercised against
a tiny login-form web app:

```
src/backend/   config.js, server.js   — plain Node http server + config
src/frontend/  index.html, login.js, style.css — login form UI
```

Run it locally:

```
npm install
npm start
# open http://localhost:3000
```

`src/backend/config.js` is deliberately the file two branches edit on the
same lines in the demo, to produce a real merge conflict (see `DEMO.md`
Phase 4).

## Simulated roles

This repo has a single real collaborator (GitHub account `Asc-85129`), which
plays all four roles from `plan.md` in turn — commits and PR descriptions
are labelled `[P1]`/`[P2]`/`[P3]`/`[P4]` so the workflow narrative stays
legible. See `DEMO.md` for the mapping.
