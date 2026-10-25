# app-shell

Lula's default web-app shell. Start every new Next.js product from it.
Stack: Next.js 16 (App Router), Tailwind 4, shadcn/ui (style `radix-vega`, base color neutral), lucide icons, sonner toasts.

## What is in it

| Area | File | Notes |
|---|---|---|
| Brand | `src/config/site.ts`, `public/logo.svg`, `src/app/favicon.ico` | Name, plan, tagline, logo, legal links. Change only these for a new product. |
| Navigation | `src/config/nav.ts` | One list for the sidebar and the page titles. Badges, project group, current user. |
| Colors, radius, fonts | `src/app/globals.css` (`:root` and `.dark` CSS variables) | Design tokens. A brand-kit result replaces these values. Do not hard-code colors in pages. |
| Shell | `src/app/(app)/layout.tsx`, `src/components/shell/*` | Sidebar (collapse to icons, ⌘B, state kept in a cookie, drawer on phones), header, account menu (Settings first, Log out last), floating AI button. |
| Pages | `src/app/(app)/` | `/` dashboard, `/chat` AI chat (history, messages, artifact panel), `/library` list + detail sheet + delete confirm + undo toast + empty state, `/settings` (profile, preferences incl. language, account), `/status` (processing, failed, loading). |
| Auth | `src/app/(auth)/` | Login and sign-up with logo, tagline and legal links. UI only, no backend. |
| Demo data | `src/config/demo-data.ts`, `src/config/dashboard-data.json` | Delete when real data exists. |

## New project from this template

```bash
gh repo create luli-lula/<name> --private --template luli-lula/app-shell --clone
cd <name> && pnpm install && pnpm dev
```

Then:
1. Edit `src/config/site.ts` and `src/config/nav.ts`. Replace `public/logo.svg` and `src/app/favicon.ico`.
2. Delete the pages and demo data that the product does not need.
3. Keep `package.json` name in sync with the project.

## Not included yet

- Dark mode switch (the tokens exist; the setting is not connected).
- Language dictionary (the setting exists; texts are Chinese).
- Auth backend, database, payments. Add them per project (see the `launch` skill).
- Bottom tab bar for phones (the sidebar becomes a drawer instead).

## Checks

```bash
pnpm lint && pnpm exec tsc --noEmit && pnpm build
```
