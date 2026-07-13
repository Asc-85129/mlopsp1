# End-to-End Git/GitHub Team Workflow — Demo Plan
### For a 4-person team: Owner, Maintainer, Developer, Intern

---

## 1. Cast & Roles

| Person | GitHub Role | Access Level | Real-world equivalent |
|---|---|---|---|
| P1 | **Owner** (repo creator) | Admin — everything | Tech Lead / Repo Owner |
| P2 | **Maintainer** | Write + branch protection bypass for admins only if configured, manage PRs, manage issues | Senior Dev |
| P3 | **Developer** | Write | Regular team member |
| P4 | **Intern** | Read → upgraded to Write after onboarding | New joiner |

GitHub's actual permission tiers (use these exact names when assigning): **Read, Triage, Write, Maintain, Admin**. Owner = creator/org owner (implicit Admin). For this demo:
- P1 = Admin (repo settings)
- P2 = Maintain (can manage PRs/issues/branch protection but not delete repo or manage billing)
- P3 = Write (push branches, open PRs)
- P4 = Read initially, then Write

---

## 2. Phase 0 — Repo & Governance Setup (P1 — Owner)

1. Create the repo (or use an existing one), initialize with a `README.md`, `.gitignore`, and `LICENSE`.
2. Create the base branching structure:
   ```
   git checkout -b develop
   git push -u origin develop
   ```
   Branch model to use: **`main`** (production-ready, protected) → **`develop`** (integration branch, protected) → **`feature/*`**, **`bugfix/*`**, **`hotfix/*`** (working branches).
3. Add collaborators: **Settings → Collaborators and teams → Add people**
   - P2 → Maintain
   - P3 → Write
   - P4 (intern) → Read (upgrade later)
4. Set up **branch protection rules** on `main` and `develop`: **Settings → Branches → Add rule**
   - Require a pull request before merging
   - Require at least 1 (or 2) approving reviews
   - Require status checks to pass (if using CI/CD via GitHub Actions)
   - Require branches to be up to date before merging
   - Restrict who can push directly (nobody, not even Owner — force everyone through PRs, to make the demo realistic)
   - Optionally: require signed commits, require linear history
5. Add a `CODEOWNERS` file so specific reviewers get auto-requested for specific paths:
   ```
   /src/backend/  @P2-username
   /src/frontend/ @P3-username
   ```
6. Add a `PULL_REQUEST_TEMPLATE.md` and `CONTRIBUTING.md` describing branch naming, commit message convention (e.g. Conventional Commits: `feat:`, `fix:`, `chore:`), and PR checklist.

---

## 3. Phase 1 — Onboarding the Intern (P4)

This is its own mini demo-within-a-demo — show the full "day 1" experience.

1. **P1/P2** sends P4 the repo invite (GitHub emails an invite; P4 accepts it).
2. **P4** sets up local environment:
   ```
   git config --global user.name "Intern Name"
   git config --global user.email "intern@company.com"
   ```
3. **P4** sets up authentication — SSH key or a Personal Access Token (PAT), since GitHub no longer accepts plain passwords over HTTPS:
   ```
   ssh-keygen -t ed25519 -C "intern@company.com"
   ```
   → Add the public key under **Settings → SSH and GPG keys**.
4. **P4** clones the repo:
   ```
   git clone git@github.com:org/repo.git
   cd repo
   git checkout develop
   ```
5. **P4** reads `CONTRIBUTING.md`, confirms branch naming convention and commit style.
6. **P1/P2** reviews P4's first trivial PR (e.g. fixing a typo in README) as a controlled test of the whole PR pipeline — once merged cleanly, P4's access is upgraded from **Read → Write**.
7. **P2** upgrades P4 in **Settings → Collaborators** to Write access.

✅ *Checkpoint:* Intern can now branch, commit, push, and open PRs independently.

---

## 4. Phase 2 — Everyday Feature Work (All 4, in parallel)

Simulate real parallel work by having **two people edit files that will eventually conflict**, plus two people working independently.

### 4.1 Branch creation (each person, from up-to-date `develop`)
```
git checkout develop
git pull origin develop
git checkout -b feature/P3-add-login-form
```
Naming convention: `feature/<name>-<short-desc>`, `bugfix/...`, `hotfix/...`.

### 4.2 Make changes, stage, commit
```
git status
git add <file>            # or git add -p for partial/interactive staging
git commit -m "feat: add login form UI skeleton"
```
Demo `git add -p` explicitly — it's the "staging changes" concept the user asked about: it lets you stage only some hunks of a file while leaving others unstaged for a separate commit.

### 4.3 Push the feature branch
```
git push -u origin feature/P3-add-login-form
```

Have **P3** and **P4** both branch off `develop` and independently edit the *same file* (e.g. `src/config.js` or `README.md`) in different lines/sections — this sets up the merge conflict for Phase 4.

---

## 5. Phase 3 — Keeping Your Feature Branch Up to Date

This is the "sync before you push" step the user specifically asked about. Show **both** common approaches and explain the tradeoff:

### Option A — Merge (safer for shared/team branches, preserves history)
```
git checkout feature/P3-add-login-form
git fetch origin
git merge origin/develop
```

### Option B — Rebase (cleaner, linear history, preferred before opening a PR if branch isn't shared with others)
```
git checkout feature/P3-add-login-form
git fetch origin
git rebase origin/develop
```
Explain: rebase rewrites your branch's commits on top of the latest `develop`; never rebase a branch that others have already pulled/built on top of, since it rewrites commit hashes.

If a conflict happens during this step, that's the natural segue into Phase 4.

---

## 6. Phase 4 — Merge Conflict Resolution (the core demo moment)

Deliberately construct the conflict:
- **P3** edits line 10 of `src/config.js` on `feature/P3-add-login-form`.
- **P4** edits the same line 10 of `src/config.js` on `feature/P4-update-config`, merges to `develop` first via PR.
- **P3** now tries to sync `feature/P3-add-login-form` with the updated `develop` → conflict.

```
git checkout feature/P3-add-login-form
git fetch origin
git merge origin/develop
```
Output shows:
```
CONFLICT (content): Merge conflict in src/config.js
Automatic merge failed; fix conflicts and then commit the result.
```

Steps to resolve:
1. Open the conflicted file — show the conflict markers:
   ```
   <<<<<<< HEAD
   (your version)
   =======
   (incoming version from develop)
   >>>>>>> origin/develop
   ```
2. Manually edit to the correct combined version, remove the `<<<<<<<`, `=======`, `>>>>>>>` markers.
3. Check status and stage the resolved file:
   ```
   git status
   git add src/config.js
   ```
4. Complete the merge:
   ```
   git commit
   ```
   (Git auto-generates a merge commit message; edit if needed.)
5. If this had been a **rebase** instead of a merge, the flow differs slightly:
   ```
   git add src/config.js
   git rebase --continue
   ```
   (or `git rebase --abort` to bail out entirely.)
6. Push:
   ```
   git push origin feature/P3-add-login-form
   ```
   (If it was a rebase and the branch was already pushed before, you'll need `git push --force-with-lease` — explain why `--force-with-lease` is safer than `--force`: it fails if someone else pushed new commits you haven't seen, preventing you from silently overwriting their work.)

**Bonus demo tool:** show `git mergetool`, or resolving conflicts directly in the GitHub web UI when the conflict is simple enough, or via VS Code's built-in 3-way merge editor (Accept Current / Accept Incoming / Accept Both).

---

## 7. Phase 5 — Pull Request Workflow

1. **Open PR** (P3, via GitHub UI or `gh` CLI):
   ```
   gh pr create --base develop --head feature/P3-add-login-form \
     --title "feat: add login form" \
     --body "Implements login UI. Closes #12"
   ```
   Fill in the PR template: description, linked issue (`Closes #12`), screenshots if UI, checklist.

2. **Add reviewers**: request P2 (Maintainer) and P4 (peer review) — either manually or automatically via `CODEOWNERS`.

3. **CI checks run automatically** (if configured) — lint, tests, build. PR shows green/red status checks.

4. **Review process (P2 & P4):**
   - Read the diff, leave **inline comments** on specific lines.
   - Use **"Request changes"** if something needs fixing, **"Comment"** for non-blocking notes, **"Approve"** once satisfied.
   - Example requested change: naming convention issue, missing null check.

5. **Address feedback (P3):**
   ```
   git add <fixed-file>
   git commit -m "fix: address review comments - add null check"
   git push origin feature/P3-add-login-form
   ```
   PR updates automatically with the new commit; reviewers re-review.

6. **Re-approve** once satisfied.

7. **Merge** (only possible once branch protection rules are satisfied — required approvals met, CI green, branch up to date):
   - **Squash and merge** — collapses all commits into one clean commit on `develop` (good for messy WIP history).
   - **Merge commit** — preserves full commit history with a merge commit.
   - **Rebase and merge** — replays commits individually onto `develop`, linear history, no merge commit.
   
   Pick one convention for the team (commonly: squash-merge for feature branches into `develop`).

8. **Delete the branch** after merge (GitHub offers a one-click "Delete branch" button post-merge) to keep the repo clean.

9. Everyone syncs locally:
   ```
   git checkout develop
   git pull origin develop
   git branch -d feature/P3-add-login-form   # delete local branch
   ```

---

## 8. Phase 6 — Release Flow: `develop` → `main`

Once several features are merged into `develop` and tested:
1. Open a **release PR**: `develop → main`.
2. P1 (Owner) reviews and approves — this is the "production gate."
3. Merge → tag the release:
   ```
   git checkout main
   git pull origin main
   git tag -a v1.2.0 -m "Release v1.2.0"
   git push origin v1.2.0
   ```
4. (Optional) Create a **GitHub Release** from the tag with changelog notes.

---

## 9. Phase 7 — Hotfix Scenario (optional bonus demo)

Simulate a production bug found on `main`:
```
git checkout main
git pull origin main
git checkout -b hotfix/fix-login-crash
# fix, commit, push
```
Open PR `hotfix/fix-login-crash → main`, expedited review, merge, then **also merge/cherry-pick the fix back into `develop`** so it isn't lost on the next release:
```
git checkout develop
git pull origin develop
git cherry-pick <hotfix-commit-sha>
git push origin develop
```

---

## 10. Suggested Live Demo Script (Order of Operations)

| Step | Who | Action |
|---|---|---|
| 1 | P1 | Create repo, set branch protection, add CODEOWNERS |
| 2 | P1 | Invite P2 (Maintain), P3 (Write), P4 (Read) |
| 3 | P4 | Accept invite, clone, configure SSH, open trivial first PR |
| 4 | P1/P2 | Review + merge intern's first PR, upgrade P4 to Write |
| 5 | P3 & P4 | Both branch from `develop`, edit same file → sets up conflict |
| 6 | P4 | Push branch, open PR, get reviewed, merge into `develop` first |
| 7 | P3 | Try to update local feature branch (`fetch` + `merge`/`rebase`) → hits conflict |
| 8 | P3 | Resolve conflict manually, stage, commit/continue, push |
| 9 | P3 | Open PR, request P2 + P4 as reviewers |
| 10 | P2, P4 | Review, leave comments, request changes |
| 11 | P3 | Push fix commit addressing feedback |
| 12 | P2 | Approve, merge (squash), delete branch |
| 13 | All | Pull latest `develop` locally |
| 14 | P1 | Open release PR `develop → main`, approve, merge, tag `v1.0.0` |
| 15 | (Optional) | Simulate hotfix on `main`, cherry-pick back to `develop` |

---

## 11. Things Commonly Forgotten (worth covering explicitly)

- `.gitignore` correctness (don't commit `node_modules`, `.env`, secrets).
- Commit message conventions (Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- `git log --oneline --graph --all` to visualize branch history during the demo.
- Difference between `git fetch` (downloads refs, doesn't touch working dir) vs `git pull` (fetch + merge/rebase automatically).
- `git stash` — useful if someone needs to quickly switch branches mid-work without committing:
  ```
  git stash push -m "wip: login form styling"
  git checkout develop
  # ...do something else...
  git checkout feature/P3-add-login-form
  git stash pop
  ```
- `.env`/secrets should never be committed — mention `git-secrets` or GitHub's push-protection for secrets as a bonus.
- Protecting `main`/`develop` from direct pushes (even Owner should go through PRs in the demo, to prove the workflow holds under real governance).
- What happens if two people **force-push** — why `--force-with-lease` exists.
- Reverting a bad merge: `git revert -m 1 <merge-commit-sha>`.

---

## 12. Optional Stretch Goals (if time allows)

- Add a GitHub Actions CI workflow (`.github/workflows/ci.yml`) that runs lint/tests on every PR, tying into the "required status checks" branch protection rule.
- Demonstrate GitHub Issues linked to PRs (`Closes #12`) and a Project board (Kanban) tracking issue status automatically as PRs move.
- Show `gh` CLI end-to-end instead of the web UI, for a "power user" version of the same demo.
