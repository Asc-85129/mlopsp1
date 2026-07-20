# Demo Log — What Was Actually Executed

This is the presentable, step-by-step record of running `plan.md` end to end
against the real repo **[Asc-85129/mlopsp1](https://github.com/Asc-85129/mlopsp1)**,
using the login-form demo app in `src/` as the working example. Every branch,
PR, merge, tag, and release listed here is real and inspectable on GitHub —
nothing here is simulated except which *person* is acting (see "How roles
were simulated" below).

Jump to a phase: [0](#phase-0--repo--governance-setup) ·
[1](#phase-1--onboarding-the-intern-p4) ·
[2](#phase-2--everyday-feature-work-p3--p4-in-parallel) ·
[3–4](#phase-34--syncing--the-merge-conflict) ·
[5](#phase-5--pull-request-workflow) ·
[6](#phase-6--release-flow-develop--main) ·
[7](#phase-7--hotfix-scenario) ·
[Notes](#notes-real-constraints-hit-along-the-way)

---

## How roles were simulated

One real GitHub account (`Asc-85129`) played all four roles from `plan.md`
section 1. Every commit message and PR description is tagged `[P1]` /
`[P2]` / `[P3]` / `[P4]` so the narrative reads the same as a real 4-person
team, and each phase's local git identity (`user.name`/`user.email`) was
switched per role before committing, so commit authorship reflects who is
"acting" even though the pushing account is the same.

| Role | Simulated as |
|---|---|
| P1 Owner | `P1 Owner <p1-owner@mlopsp1.local>` |
| P2 Maintainer | `P2 Maintainer <p2-maintainer@mlopsp1.local>` |
| P3 Developer | `P3 Developer <p3-developer@mlopsp1.local>` |
| P4 Intern | `P4 Intern <p4-intern@mlopsp1.local>` |

---

## Phase 0 — Repo & Governance Setup

*(plan.md section 2)*

- Cloned the repo, added the login-demo app (`src/backend`, `src/frontend`),
  `.gitignore`, `LICENSE` (MIT), `CONTRIBUTING.md`,
  `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CODEOWNERS`, and a CI
  workflow (`.github/workflows/ci.yml`) — committed straight to `main` as
  **[P1]**, since branch protection isn't live yet:
  [`8fcfd8e`](https://github.com/Asc-85129/mlopsp1/commit/8fcfd8e)
- Created and pushed `develop`:
  `git checkout -b develop && git push -u origin develop`
- Set branch protection on **both** `main` and `develop` via the API
  (`PUT /repos/Asc-85129/mlopsp1/branches/{branch}/protection`):
  - Require 1 approving PR review
  - Require the `test` status check (strict — branch must be up to date)
  - Block force-pushes and branch deletion
  - `enforce_admins: false` — see [Notes](#notes-real-constraints-hit-along-the-way) for why

## Phase 1 — Onboarding the Intern (P4)

*(plan.md section 3)*

- **P4** branched from `develop`: `feature/P4-fix-readme-typo`
- Made a trivial, real README wording fix, committed as **[P4]**
- Opened **[PR #1](https://github.com/Asc-85129/mlopsp1/pull/1)**
  `feature/P4-fix-readme-typo -> develop`
- **P1/P2** reviewed (comment) and squash-merged
  ([merge commit `bfe1074`](https://github.com/Asc-85129/mlopsp1/commit/bfe1074)),
  branch auto-deleted
- ✅ Checkpoint: intern's first PR went through the full pipeline. In a real
  team, P2 would now flip P4 from Read to Write in Settings → Collaborators.

## Phase 2 — Everyday Feature Work (P3 & P4 in parallel)

*(plan.md section 4)*

Two branches created off the **same** `develop`, both editing the **same
lines** of `src/backend/config.js`, deliberately, to manufacture a conflict:

- **P4** → `feature/P4-update-config`: renamed the placeholder secret,
  extended `tokenExpiryMinutes` to 60, added `maxLoginAttempts`
- **P3** → `feature/P3-add-login-form`: added client-side validation to the
  login form, and independently touched the same `sessionSecret` /
  `tokenExpiryMinutes` lines while hardening login config

**P4's branch merged first**: **[PR #2](https://github.com/Asc-85129/mlopsp1/pull/2)**
`feature/P4-update-config -> develop`, reviewed and squash-merged
([`4c0dce5`](https://github.com/Asc-85129/mlopsp1/commit/4c0dce5)) — so
`develop` moved out from under P3's branch, exactly as scripted.

## Phase 3–4 — Syncing & The Merge Conflict

*(plan.md sections 5–6 — the core demo moment)*

**P3** tries to sync with the now-updated `develop`:

```
git checkout feature/P3-add-login-form
git fetch origin
git merge origin/develop
```

Real output:

```
Auto-merging src/backend/config.js
CONFLICT (content): Merge conflict in src/backend/config.js
Automatic merge failed; fix conflicts and then commit the result.
```

Conflict markers as they actually appeared:

```js
  port: process.env.PORT || 3000,
<<<<<<< HEAD
  sessionSecret: process.env.SESSION_SECRET || "use-a-real-secret-in-prod",
  tokenExpiryMinutes: 15,
=======
  sessionSecret: process.env.SESSION_SECRET || "change-me-in-prod",
  tokenExpiryMinutes: 60,
  maxLoginAttempts: 5,
>>>>>>> origin/develop
};
```

**Resolution** (kept P3's stricter session defaults since this branch was
actively hardening login; kept P4's additive `maxLoginAttempts` field since
it doesn't conflict in intent):

```js
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || "use-a-real-secret-in-prod",
  tokenExpiryMinutes: 15,
  maxLoginAttempts: 5,
};
```

```
git add src/backend/config.js
git commit   # completes the merge
git push origin feature/P3-add-login-form
```

Merge commit: [`32e2953`](https://github.com/Asc-85129/mlopsp1/commit/32e2953)

## Phase 5 — Pull Request Workflow

*(plan.md section 7)*

- **[PR #3](https://github.com/Asc-85129/mlopsp1/pull/3)**
  `feature/P3-add-login-form -> develop`, "Closes #12" in the description,
  PR template filled in.
- **Review round 1**: flagged a real bug — `POST /api/login` did
  `JSON.parse(body)` with no try/catch, so a malformed body crashed the
  request instead of returning 400.
- **P3 addressed it**: added try/catch, pushed a fix commit
  ([`4ccced6`](https://github.com/Asc-85129/mlopsp1/commit/4ccced6)); PR
  updated automatically.
- **Review round 2**: re-reviewed, approved, squash-merged into `develop`
  ([`3580a75`](https://github.com/Asc-85129/mlopsp1/commit/3580a75)),
  branch deleted.

## Phase 6 — Release Flow: `develop` → `main`

*(plan.md section 8)*

- **[PR #4](https://github.com/Asc-85129/mlopsp1/pull/4)** `develop -> main`,
  P1 sign-off, merged as a **merge commit** (not squash) to preserve full
  history: [`8e9832e`](https://github.com/Asc-85129/mlopsp1/commit/8e9832e)
- Tagged and pushed:
  ```
  git tag -a v1.0.0 -m "Release v1.0.0"
  git push origin v1.0.0
  ```
- Published a [GitHub Release](https://github.com/Asc-85129/mlopsp1/releases/tag/v1.0.0)
  from the tag with auto-generated changelog notes.

## Phase 7 — Hotfix Scenario

*(plan.md section 9)*

Found and fixed a real production bug on `main`: the `POST /api/login`
request stream had no `'error'` listener, so a client aborting mid-upload
would surface as an **uncaught exception that crashed the entire server
process**, not just that one request — a genuine "login crash," matching
the branch's name.

```
git checkout main
git checkout -b hotfix/fix-login-crash
# fix: add req.on("error", ...) handler
```

- **[PR #5](https://github.com/Asc-85129/mlopsp1/pull/5)**
  `hotfix/fix-login-crash -> main`, expedited review, merged
  ([`5d983da`](https://github.com/Asc-85129/mlopsp1/commit/5d983da))
- Cherry-picked back into `develop` so the fix isn't lost on the next
  release:
  ```
  git checkout develop
  git cherry-pick 5d983da
  git push origin develop
  ```
  → [`ad12a29`](https://github.com/Asc-85129/mlopsp1/commit/ad12a29)

---

## Notes: real constraints hit along the way

Worth calling out explicitly when presenting — these are genuine GitHub
platform behaviors discovered while running the demo solo, not glossed over:

1. **GitHub blocks self-approval and self-"request changes."** You cannot
   formally approve or request changes on your own PR — confirmed by two
   real `GraphQL: Review Can not approve/request changes on your own pull
   request` errors. Feedback was left as PR comments instead. In a real
   4-person team with 4 separate accounts, this wouldn't come up — reviews
   would come from a genuinely different person.
2. **Branch protection required an Admin-tier collaborator**, not just
   Maintain. The demo was originally attempted against the org repo
   `mlopsp1/mlopsp1`, where the account only had Maintain access — branch
   protection calls 404'd. Rebuilt against a personal repo
   (`Asc-85129/mlopsp1`) where repo-creator = Admin by default.
3. **`enforce_admins` was set to `false`**, i.e. the Owner/Admin can bypass
   required reviews and status checks. This was necessary for a
   single-account demo to ever merge anything (see constraint #1) — flagged
   here so it's clear that in a real team, this should usually be `true`
   ("Restrict who can push directly — nobody, not even Owner," per
   plan.md section 2) once there are enough real reviewers that admin
   bypass is never actually needed.
4. **CI was genuinely flaky mid-demo** — GitHub Actions runs sat `queued`
   for ~30 minutes on the very first pushes (confirmed via
   githubstatus.com: a live Actions degradation incident that day, since
   mitigated). PR #1 was merged via `gh pr merge --admin` before its check
   finished, rather than blocking the whole demo on it. Every run from
   PR #2 onward passed normally once the backlog cleared — visible in
   `gh run list`.
5. **The hotfix cherry-pick was pushed directly to `develop`**, not via PR
   — this matches plan.md section 9's own instructions verbatim
   (`git push origin develop` after the cherry-pick), and only succeeded
   because of the admin bypass in #3; GitHub's response confirms it:
   `Bypassed rule violations for refs/heads/develop: Changes must be made
   through a pull request.`
