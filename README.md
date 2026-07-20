# mlopsp1

**MLOps Practical 1** — a hands-on, reproducible demo of an end-to-end Git/GitHub
team workflow (branching strategy, protected branches, pull-request review,
merge-conflict resolution, releases, and hotfixes), simulated for a 4-person
team: **Owner, Maintainer, Developer, Intern**.

The goal of this repo isn't the app itself — it's the *process*. The login
form exists purely as a small, realistic codebase to run real Git operations
against, so every concept in `plan.md` (branch protection, code review,
conflict resolution, semantic versioning, hotfix patching) is demonstrated
with actual commits, PRs, and tags rather than described in the abstract.

---

## Table of contents

- [Why this exists](#why-this-exists)
- [Documentation map](#documentation-map)
- [The demo app](#the-demo-app)
  - [Running it locally](#running-it-locally)
  - [Project structure](#project-structure)
- [The workflow being demonstrated](#the-workflow-being-demonstrated)
  - [Simulated roles](#simulated-roles)
  - [Branching model](#branching-model)
  - [Branch protection rules](#branch-protection-rules)
  - [Pull request lifecycle](#pull-request-lifecycle)
  - [Merge conflict resolution](#merge-conflict-resolution)
  - [Releases & hotfixes](#releases--hotfixes)
- [Commit & PR labeling convention](#commit--pr-labeling-convention)
- [Tech stack & rationale](#tech-stack--rationale)
- [Prerequisites](#prerequisites)
- [Contributing](#contributing)
- [License](#license)

---

## Why this exists

Most Git/GitHub tutorials explain branching and PR workflows in isolation —
a diagram here, a command list there — without ever tying them to a real
repo history you can inspect. This practical does the opposite: every phase
of the plan is **actually executed** against this repository, so you can
click into real branches, real pull requests, and real tags and see exactly
how the workflow plays out, including the messy parts (like a genuine merge
conflict) rather than a staged one.

## Documentation map

| File | Purpose |
|---|---|
| [`plan.md`](./plan.md) | The full workflow plan being demonstrated — phases, roles, and what each phase is meant to prove. |
| [`DEMO.md`](./DEMO.md) | The step-by-step record of what was **actually executed** against this repo, with links to the real branches, PRs, and tags produced. |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Contribution and branching conventions — naming, commit style, review expectations. |
| `README.md` (this file) | Orientation: what the repo is, how to run it, and how the pieces fit together. |

If you only read one file to understand *what happened*, read `DEMO.md`. If
you want to understand *why it was structured this way*, read `plan.md`.

## The demo app

To make the workflow concrete, every phase of `plan.md` is exercised against
a tiny login-form web app — deliberately minimal so that the Git history
stays the focus, not the application logic.

```
src/backend/   config.js, server.js   — plain Node http server + config
src/frontend/  index.html, login.js, style.css — login form UI
```

`src/backend/config.js` is deliberately the file two branches edit on the
same lines, so that merging them produces a **real, unstaged merge
conflict** — see `DEMO.md`, Phase 4, for how it's resolved.

### Running it locally

```bash
```
npm install
npm start
# open http://localhost:3000
```

No build step, no framework, no external dependencies beyond Node's
built-in `http` module — the app is intentionally lightweight so the setup
never gets in the way of the Git workflow it exists to support.

### Project structure

```
mlopsp1/
├── src/
│   ├── backend/
│   │   ├── config.js     # shared config — the deliberate conflict file
│   │   └── server.js     # plain Node http server
│   └── frontend/
│       ├── index.html
│       ├── login.js
│       └── style.css
├── plan.md
├── DEMO.md
├── CONTRIBUTING.md
└── README.md
```

## The workflow being demonstrated

### Simulated roles

This repo has a **single real collaborator** (GitHub account `Asc-85129`)
who plays all four roles from `plan.md` in turn:

| Role | Typical responsibilities in the plan |
|---|---|
| **Owner** | Repo administration, branch protection rules, final merge authority on `main`. |
| **Maintainer** | Reviews and approves PRs, manages releases and version tags. |
| **Developer** | Builds features on topic branches, opens PRs against `develop`. |
| **Intern** | Small, closely-reviewed changes; first exposure to the PR review cycle. |

Since one account plays every part, commits and PR descriptions are
labelled `[P1]` / `[P2]` / `[P3]` / `[P4]` (matching the phases in
`plan.md`) so the narrative of *who is acting as whom, and why* stays
legible when you read the history after the fact. See `DEMO.md` for the
exact commit-to-role mapping.

### Branching model

The demo follows a lightweight variant of Git Flow, sized for a 4-person
team rather than a large org:

- **`main`** — always deployable; protected; only updated via reviewed PRs or tagged releases.
- **`develop`** — integration branch; feature branches merge here first.
- **`feature/*`** — one branch per unit of work, opened by the Developer or Intern.
- **`hotfix/*`** — branched directly from `main` for urgent post-release fixes.

This keeps `main` stable at all times while still giving the team a shared
integration point (`develop`) to catch conflicts before they reach
production — a standard tradeoff for small teams that want release safety
without the overhead of a full Git Flow release-branch cadence.

### Branch protection rules

`main` (and typically `develop`) are configured with:

- Required pull request before merging — no direct pushes.
- At least one approving review (Maintainer or Owner) before merge.
- Status checks must pass before a PR is mergeable.
- Linear history preferred — conflicts are resolved on the feature branch, not via merge commits piling up on `main`.

### Pull request lifecycle

1. Developer/Intern branches off `develop` into `feature/<short-description>`.
2. Work is committed in small, reviewable chunks (see `CONTRIBUTING.md` for message conventions).
3. PR opened against `develop`, labelled with its phase (`[P1]`–`[P4]`).
4. Maintainer reviews — requests changes or approves.
5. On approval, PR is merged (squash or merge commit, per `CONTRIBUTING.md`).
6. Periodically, `develop` is merged into `main` via a release PR, reviewed by the Owner.

### Merge conflict resolution

`src/backend/config.js` is edited on the same lines by two different
branches on purpose, so that merging them triggers a genuine conflict
rather than a scripted one. `DEMO.md` Phase 4 walks through:

- Reproducing the conflict locally.
- Reading and resolving the conflict markers.
- Committing the resolution and verifying the app still runs correctly.

### Releases & hotfixes

- **Releases** are cut from `main` once `develop` has stabilized, tagged
  using semantic versioning (`vMAJOR.MINOR.PATCH`), with release notes
  summarizing merged PRs since the last tag.
- **Hotfixes** branch directly from `main` (not `develop`), patch the
  urgent issue, and are merged back into both `main` (immediately) and
  `develop` (to prevent regression), then tagged as a patch release.

See `DEMO.md` for the actual tags and PRs produced by this phase.

## Commit & PR labeling convention

Every commit and PR title in this repo's history is prefixed with the
phase it belongs to, so the workflow narrative is traceable directly from
`git log` without needing to cross-reference `plan.md`:

```
[P1] Set up repo structure and branch protection
[P2] feature/login-validation: add client-side validation
[P3] Resolve config.js merge conflict between feature branches
[P4] hotfix/session-timeout: patch expired session bug
```

## Tech stack & rationale

| Choice | Why |
|---|---|
| **Plain Node `http` module** (no Express) | Keeps the demo app dependency-free, so `npm start` works instantly with zero install friction — the point is the Git workflow, not the backend framework. |
| **Vanilla JS/HTML/CSS frontend** | No build tooling (webpack/vite) means diffs in PRs stay small and readable, which matters for a repo whose whole purpose is to be *read* during review. |
| **Single shared `config.js`** | Chosen specifically as the conflict file — it's small enough that the conflict is easy to read and resolve in a few minutes, unlike a conflict deep in business logic. |

The tradeoff: this stack wouldn't scale to a real production login system
(no session security, no framework conventions, no test suite) — and that's
intentional. Production-readiness was deliberately sacrificed for
readability and reproducibility, since the app is a vehicle for the Git
workflow, not the deliverable itself.

## Prerequisites

- Node.js (any recent LTS version — no framework-specific version constraints)
- Git
- A GitHub account, if you want to reproduce the PR/branch-protection steps yourself rather than just reading `DEMO.md`

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for branch naming, commit message
format, and PR review expectations used throughout this demo.

## License

Add a license here if you intend this repo to be reused or forked
(MIT is the common default for demo/practical repos like this one).
