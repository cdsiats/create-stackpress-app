# Minimal Template Contract

Accepted Reusable Truth for the `minimal` scaffold template under `src/templates/minimal/**` (canonical files retained in place).

## Copy And Placeholder Contract

`copyTemplate` in `src/helpers.ts`:

- Copies `src/templates/minimal` recursively into the resolved target directory (created recursively).
- When the target directory already contains `schema.idea`, the template's `schema.idea` is skipped so an existing idea file is preserved.
- Renames the copied `_gitignore` to `.gitignore` in the target (the underscore name keeps the file out of the template package).
- `replaceTemplateValues` replaces placeholders only in `package.json` and `config/common.ts`:
  - `_PROJECT__NAME_` → project name exactly as entered.
  - `_BRAND__NAME_` → brand name, uppercased by the CLI before `copyTemplate` is called.
- No other files contain placeholders replaced at scaffold time.

## Template Package

`package.json`:

- `"type": "module"`, `private: true`, version `1.0.0`, name `_PROJECT__NAME_`.
- `plugins` array (order preserved): `./plugins/app/plugin`, `./plugins/store/plugin`, `stackpress`.
- Scripts (all invoke `stackpress` with `--b config/<name> -v`; the `dev`/`emit`/`migrate`/`populate`/`preview`/`purge`/`push`/`query` scripts prefix `dotenv -e .env`):
  - `build` = `stackpress build --b config/build -v`
  - `dev` = `dotenv -e .env -- stackpress serve --b config/develop -v`
  - `emit` = `dotenv -e .env -- stackpress emit`
  - `generate` = `stackpress generate --b config/develop -v`
  - `generate:client` = `stackpress generate --b config/client -v`
  - `migrate` = `dotenv -e .env -- stackpress migrate --b config/develop -v`
  - `populate` = `dotenv -e .env -- stackpress populate --b config/develop -v`
  - `preview` = `dotenv -e .env -- stackpress serve --b config/preview -v`
  - `purge` = `dotenv -e .env -- stackpress purge --b config/develop -v`
  - `push` = `dotenv -e .env -- stackpress push --b config/develop -v`
  - `query` = `dotenv -e .env -- stackpress query --b config/develop -v`
- Dependencies (pinned): `@electric-sql/pglite 0.3.15`, `@stackpress/inquire-pglite 0.10.8`, `react 19.2.4`, `react-dom 19.2.4`, `stackpress 0.10.8`.
- Dev dependencies (pinned): `@types/node 25.3.5`, `@types/react 19.2.14`, `@types/react-dom 19.2.3`, `@vitejs/plugin-react 5.1.4`, `dotenv-cli 11.0.0`, `fast-glob 3.3.3`, `prettier 3.8.1`, `ts-morph 27.0.2`, `ts-node 10.9.2`, `tsx 4.21.0`, `typescript 5.9.3`, `unocss 66.6.6`, `vite 7.3.1`.

## Environment

`.env.example` (copied to `.env` by the CLI after scaffolding):

- `DATABASE_SEED="abc123"`
- `SESSION_SEED="abc123"`

`config/common.ts` `seed` reads `process.env.DATABASE_SEED` and `process.env.SESSION_SEED` with `'abc123'` fallback each.

`.gitignore` (renamed from `_gitignore`): ignores `/node_modules`, `/dist`, `.build`, `.env`, `.env.*` (with `!.env.example` exception), and `client-source/`.

## Schema

`schema.idea` contains one line: `use "stackpress/stackpress.idea"` — the project starts from the stock Stackpress idea.

## Config Files

All configs live under `config/`. `common.ts` exports shared sections; each environment config spreads `common` and overrides:

- `common.ts` sections: `seed`; `admin` (name "Admin", base `/admin`, static menu items for Profiles, Auth, Apps, Sessions); `api` (session expiry of one year, example `auth-signout` webhook to `http://localhost:3000/api/webhook`, scope `user`, endpoints for auth-search (public), profile-search/detail/get, `/api/my/address`, and `/api/my/files`); `auth` (base `/auth`, redirect `/`, 2FA issuer "Stackpress", default roles `['USER']`, sign-in menus for username/email/phone plus signup and footer terms/privacy links, password policy min 8 / max 32 requiring upper, lower, number, and special); `brand` (name `_BRAND__NAME_`, logo `/logo.png`, icon `/icon.png`, favicon `/favicon.ico`); `client` (lang `js`, module and package `_PROJECT__NAME_-client`, revisions under `.build/revisions`, generated client under `node_modules/_PROJECT__NAME_-client`, prettier settings with singleQuote and no trailing commas); `cookie` (`{ path: '/' }`); `csrf` (name `csrf`); `database` (seed, migrations under `.build/migrations`, schema `onDelete: CASCADE` and `onUpdate: RESTRICT`, populate records for a developer profile/auths/application); `email` (`smtp.example.com` placeholder credentials); `language` (URL/cookie key `locale`, locales `en_US` and `th_TH`); `mcp` (example `stackpress-ai` MCP config commented as not enabled by default); `server` (host `127.0.0.1`, port `3000`); `session` (cookie key `session`, role access route lists for ADMIN, MANAGER, USER, GUEST, including `/mcp` for GUEST); `terminal` (label `[_BRAND__NAME_]`, idea path `schema.idea`); `view` (noview flag `json`, base `/`, react-toastify notify settings).
- `develop.ts`: server mode `development`; build dir `.build`; view engine with `clientRoute /client`, client/document templates from `stackpress/view`, cssFiles `frui/frui.css`, `stackpress/stackpress.css`, `virtual:uno.css`, vite plugin `unocss()`; adds dev routes to every role (`/@vite/client`, `/@react-refresh`, `/@fs/**`, `/node_modules/**`, `/__uno.css`, `/plugins/**`, `/react.svg`) plus public GET routes (`/assets/**`, `/client/**`, `/images/**`, `/styles/**`, favicons).
- `build.ts`: server mode `production`; engine `assetPath public/assets`, `clientPath public/client`, `pagePath .build/views`, `pageTemplate PAGE_TEMPLATE`.
- `client.ts`: imports `@stackpress/ingest/http` and `reactus` templates; client lang `ts`, module and package `client-source`, client build dir `client-source/` at cwd; server mode `development`; dev and public route additions for ADMIN, USER, GUEST only (no MANAGER).
- `production.ts`: imports `../plugins/assets/plugin.js`; server mode `production`; engine `clientRoute /client`, `cssRoute /assets`, `pagePath .build/views`; dev and public route additions for all four roles; boots with the assets plugin.
- Every config file exports a default `bootstrap()` that creates a server, sets the config, boots plugins, resolves `config`, `listen`, and `route`, and returns the server.

## Plugins

- `plugins/app/plugin.ts`: on `listen`, maps the `error` event to `./pages/error.js` and re-emits `error` on `response` when `res.error` is set; on `route`, imports `./pages/welcome.js` for GET `/` and registers the view `@/plugins/app/views/welcome`.
- `plugins/app/pages/welcome.ts`: action returning `{ message: 'Welcome to Stackpress!' }` and calling `setViewProps`.
- `plugins/app/pages/error.ts`: action that skips terminal-argument requests, non-GET requests, and responses that already have a body; enriches stack traces with source snippets; returns JS, CSS, or JSON variants for those request types; otherwise renders `@/plugins/app/views/error` with config props, session, request URL/headers/data, and the status response.
- `plugins/app/views/error.tsx` and `plugins/app/views/welcome.tsx`: React views (see files).
- `plugins/store/plugin.ts`: on `config`, registers the `'database'` service with `connect()`.
- `plugins/store/connect.ts`: PGlite store; URL from `process.env.DATABASE_URL` or `./.build/database`; creates the parent directory when missing; wraps `new PGlite(file)` with `stackpress/pglite` `connect`.
- `plugins/assets/plugin.ts`: static asset server on `request` when there is no body and the code is unset or 404; serves files from the configured `assets` folder with a fixed MIME map (`.html`, `.css`, `.js`, `.json`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`), falling back to `application/octet-stream`.

## Client Build Config

- `tsconfig.json` extends `stackpress/tsconfig/esm`; `module`/`moduleResolution` `nodenext`; `outDir .build`; includes `config/**`, `plugins/**` (`.ts` and `.tsx`), and `client-source/**` (`.ts` and `.tsx`); excludes `dist`, `node_modules`, `tests`.
- `uno.config.ts`: UnoCSS with `presetWind3()` and `presetStackpress()`; content pipeline includes `plugins/**/*.{js,ts,tsx}`.

## Public Assets

`public/`: `favicon.ico`, `favicon.png`, `icon.png`, `logo.png`, and `styles/global.css` (default global CSS).

## Default Seeded Data

`database.populate` in `config/common.ts` seeds:

- profile `developer` (type person, roles `[ 'ADMIN' ]`);
- auth username `developer` / secret `developer`;
- auth email `developer@shoppable.ph` / secret `developer` (see GAP-04 in [Project Overview](project-overview.md));
- application "Developer App" with scopes `profile-write`, `auth-read`, expiring one year from creation.

## Source Provenance

Canonical sources retained in place under `src/templates/minimal/`; contract bootstrapped at git head `40f202b`.
