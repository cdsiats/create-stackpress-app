# Project Overview

Accepted Reusable Truth for the generator package. Source Provenance paths are repo-relative; canonical source files are retained in place (no Raw Source archive).

## Identity

- Package: `create-stackpress-app`, version `0.1.3`, license MIT, author `cdsiats` (`package.json`).
- Type: global CLI project generator; `preferGlobal: true` is set. Install with `npm i -g create-stackpress-app` (`README.md`).
- Repository: `git+https://github.com/cdsiats/create-stackpress-app.git`.
- npm `files` allowlist: `dist` only. Published bin entry: `"create-stackpress-app": "dist/main.js"`.
- Purpose: help developers and AI scaffold working [Stackpress](https://stackpress.io) applications easily, depending on what they need, by generating a project into a target directory from a bundled template (currently `minimal`).

## Generator Tech Stack

- ESM Node CLI written in TypeScript (`"type": "module"` in `package.json`).
- Prompt library: `@clack/prompts` `1.7.0`; terminal colors: `picocolors` `1.1.1`.
- Dev dependencies: `typescript` `7.0.2`, `@types/node` `26.1.2`.
- Root `tsconfig.json`: `module`/`moduleResolution` `nodenext`, `target` `esnext`, `strict`, `jsx: react-jsx`, `verbatimModuleSyntax`, `isolatedModules`, `moduleDetection: force`, `skipLibCheck`, source maps and declarations on, `rootDir: ./src`, `outDir: ./dist`, excludes `src/templates`, `node_modules`, `dist`, `scripts`.
- Build helper scripts are plain Node ESM JavaScript in `src/scripts/`.

## Repository Layout

- `src/main.ts` — CLI entrypoint (shebang `#!/usr/bin/env node`).
- `src/helpers.ts` — cancellation check, template copy, placeholder replacement, child-process runner.
- `src/types.ts` — `CopyTemplateOptions` and `ReplaceTemplateValues` types.
- `src/scripts/clean-build.js` — removes `dist`.
- `src/scripts/copy-assets.js` — copies `src/templates` to `dist/templates` and `src/logo.txt` to `dist/logo.txt`.
- `src/scripts/chmod-bin.js` — `chmod 0o755` on `dist/main.js`.
- `src/logo.txt` — ASCII logo printed on start.
- `src/templates/minimal/**` — the only template; contract in [Minimal Template Contract](template-contract.md).
- `.agents/skills/**` and `skills-lock.json` — installed ChrisAI skill packages (tooling, outside Agent File rules).

## CLI Flow

`main()` in `src/main.ts` runs this sequence:

1. `console.clear()`, print `logo.txt`, print an inverse-styled `intro` of " Create Stackpress App ".
2. Prompt `text` "Enter project directory"; placeholder "Press enter to install in current directory"; default `./`; empty input falls back to `./`.
3. Prompt `text` "Enter project name"; default is the basename of the resolved target directory.
4. Prompt `text` "Enter a brand name"; default is the same default project name.
5. Prompt `select` "Select a database": options are PGlite (`pglite`, enabled, initial), MySQL (`mysql`, disabled, hint "Coming Soon"), Postgres (`postgres`, disabled, hint "Coming Soon").
6. Prompt `confirm` "Install dependencies?" (default true).
7. Prompt `confirm` "Initialize git repository?" (default true).
8. Only when install-deps is true: `confirm` "Run `stackpress generate`?" (default true), then `confirm` "Generate migrations and deploy?" (default true).
9. `copyTemplate({ templateName: 'minimal', targetDirectory, projectName, brandName: brandName.toUpperCase() })`.
10. When install-deps: spinner around `npm install` in the target directory.
11. When init-git: `git init`, then `git add .`, then `git commit -m 'Initial commit'` in the target directory.
12. When generate: `npm run generate` in the target directory.
13. When migrate+deploy: `npm run migrate`, then `npm run push`, in the target directory.
14. Always: `cp .env.example .env` in the target directory.
15. `outro` "<projectName> has been created. Welcome to stackpress!".

## Behavior Notes

- Every prompt result is passed through `isCancelled()` in `src/helpers.ts`; on `@clack/prompts` cancel it calls `cancel('App creation cancelled.')` and `process.exit(0)`.
- The selected database value is not used downstream in this version; the `minimal` template always targets PGlite. (Consistent with the disabled MySQL/Postgres options and roadmap.)
- `runCommand` spawns with `stdio: 'ignore'` (no child output relayed to the user), `shell: true` only on win32, resolves on exit code 0, and rejects with "<command> <args> failed." on non-zero exit.
- `main().catch` logs `err.message` and calls `process.exit(0)`; failures therefore exit with code 0. See GAP-03.
- The final `.env` copy step invokes the `cp` binary on every platform. See GAP-02.
- `copyTemplate` throws "Templates <name> does not exist." when the requested template folder is missing.

## Build And Publish

- `npm run build` = `clean` (remove `dist`) then `tsc` then `copy` (templates and logo into `dist`) then `chmod-bin` (`dist/main.js` set to `0o755`).
- Publishing ships only `dist` (`files: ["dist"]`), so `dist/templates` must contain `minimal` for runtime template copying.
- Root `.gitignore`: `/node_modules`, `/src/templates/**/node_modules`, `/dist`.

## Project Direction

From user direction (chat, context-bootstrap session):

- Stackpress framework documentation is still a work in progress; do not assume external docs are complete or authoritative, and verify framework behavior against code.
- The CLI's goal is to help developers and AI scaffold projects easily depending on what they need.
- Add support for multiple databases: Postgres, MySQL, SQLite, PGlite, CockroachDB, and others.
- Add support for multiple project types: full-stack projects, API-only projects, and others.

## Roadmap

From `README.md` (planned, not implemented):

- Add support for Postgres.
- Add support for MySQL.
- Add package manager selection (only yarn and pnpm are planned).
- Add an API-only project type.

## Known Gaps And Conflicts

Unresolved items found while bootstrapping context; resolve them before treating the related claim as final.

- GAP-01, Status: unresolved. README-vs-bin mismatch: `README.md` tells users to run `create-sp-app`, but the `package.json` bin key is `create-stackpress-app`. Which command should users run?
- GAP-02, Status: unresolved. `.env` copy portability: `runCommand('cp', ['.env.example', '.env'], ...)` relies on a `cp` binary; the win32 `shell: true` default (`cmd.exe`) has no built-in `cp`, so the final step likely fails on Windows. Intended?
- GAP-03, Status: unresolved. Exit code: `main().catch` calls `process.exit(0)` on failure, so CI and scripts see success even when scaffolding failed. Intended?
- GAP-04, Status: unresolved. Seeded email: template seed data uses `developer@shoppable.ph` (`src/templates/minimal/config/common.ts`), which appears unrelated to this project. Leftover to replace?
- GAP-05, Status: unresolved. Translation typo: template locale `th_TH` maps "Home Page" to "Home Pagesss" (`src/templates/minimal/config/common.ts`). Example typo to clean up?

## Source Provenance

Canonical repo files retained in place; context bootstrapped at git head `40f202b`.

- `package.json` — identity, scripts, dependencies, bin, files.
- `README.md` — intro, setup instructions, roadmap.
- `src/main.ts` — CLI flow and behavior.
- `src/helpers.ts` — copy, replace, and command-run semantics.
- `src/types.ts` — shared types.
- `src/scripts/*.js` — build steps.
- `tsconfig.json` — generator compile settings.
- `.gitignore` — root ignores.
- `src/templates/minimal/**` — template; contract in [Minimal Template Contract](template-contract.md).
- User direction in this session — project goals: developers and AI as consumers, multiple databases and project types, Stackpress docs still a work in progress.
