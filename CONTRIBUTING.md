# Contributing to mlopsp1

This repo demonstrates the end-to-end Git/GitHub team workflow described in
[`plan.md`](./plan.md), using a small login-form demo app as the working
example. Read `plan.md` first for the full narrative and roles.

## Branching model

- `main` — production-ready, protected. Only updated via a release PR from `develop`, or a `hotfix/*` PR for emergencies.
- `develop` — integration branch, protected. All feature/bugfix work merges here first.
- `feature/<name>-<short-desc>` — new functionality, branched from `develop`.
- `bugfix/<name>-<short-desc>` — non-urgent fixes, branched from `develop`.
- `hotfix/<name>-<short-desc>` — urgent production fixes, branched from `main`.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` a new feature
- `fix:` a bug fix
- `chore:` tooling/maintenance, no production code change
- `docs:` documentation only
- `refactor:` code change that neither fixes a bug nor adds a feature

## Workflow

1. Branch from up-to-date `develop`: `git checkout develop && git pull && git checkout -b feature/...`
2. Commit with `git add -p` for granular staging where useful.
3. Before opening a PR, sync with `develop` via `merge` (shared branches) or `rebase` (branches nobody else has pulled).
4. Push and open a PR into `develop` with `gh pr create`, filling in the PR template.
5. Address review feedback with new commits; avoid force-pushing once others are reviewing unless necessary, and use `--force-with-lease` if you must.
6. Once approved and CI is green, squash-merge into `develop` and delete the branch.
7. Releases go out via a `develop -> main` PR, tagged `vX.Y.Z` after merge.

## Access tiers (see plan.md section 1)

| Role | GitHub permission |
|---|---|
| Owner (P1) | Admin |
| Maintainer (P2) | Maintain |
| Developer (P3) | Write |
| Intern (P4) | Read -> Write after first merged PR |
