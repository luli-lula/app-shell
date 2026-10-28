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
| Pages | `src/app/(app)/` | `/` dashboard, `/chat` AI chat (see "AI chat" below), `/library` list + detail sheet + delete confirm + undo toast + empty state, `/settings` (profile, preferences incl. language, account), `/status` (processing, failed, loading). |
| Auth | `src/app/(auth)/` | Login and sign-up with logo, tagline and legal links. UI only, no backend. |
| Demo data | `src/config/demo-data.ts`, `src/config/dashboard-data.json` | Delete when real data exists. |

## AI chat (mock backend)

`/chat` shows the five AI-era interaction patterns with a fake backend (`src/components/chat/mock-chat.ts`, timers only, no network, no cost):
streaming answer with stop and retry, inline citations that open source cards, artifact side panel, visible work (reasoning, steps, tool call), and an approval card only for an irreversible action (suggestion 2). Suggestion 3 shows the failure state.
To connect a real backend, replace `run()` in `mock-chat.ts`; the components do not change.

Library: AI Elements only (copied into `src/components/ai-elements/` as source, shadcn style; excluded from lint). Its CLI is announced to move to shadcn/ui at the end of November 2026; the installed code is not affected.
Conversation management (reuse as is, all in `src/components/chat/`):
- `conversation-list.tsx`: borderless "New chat" and "New group", then Pinned, your own groups (collapsible, with a count), then ungrouped chats split into Today / Yesterday / Earlier. Row menu on hover: Rename, Pin, Move to group (existing groups, "New group...", "Remove from group"), Delete. Group menu: Rename, Delete (chats stay, back to ungrouped). Delete has no confirm dialog but an Undo toast. Narrow screens use a left drawer.
- `title-editor.tsx`: inline rename (Enter saves, Esc cancels, blur saves). Title row above the messages has the same menu.
- First message becomes the title; sending moves the chat to the top; "New chat" does not create a second blank one.
- The list reads the current time, so the page is wrapped in `<Suspense>` (Next.js 16 rule).
Composer (`composer.tsx`, AI Elements PromptInput): multi-line text (Enter sends, Shift+Enter new line), images and files by the + menu, paste or drag-and-drop (max 6, 10 MB each), screenshot, Stop button while answering. Footer layout: "+" on the left; model select (list in `composer.tsx`, the chosen id goes out with `onSend`), voice dictation (rare, so it sits on the right; browser speech recognition, hidden where unsupported) and Send on the right. There is no "regenerate" entry; only a failed answer has Retry. Attachments show as chips in the input and above the user message.
Long chats (`jump-buttons.tsx`): Jump to top appears after scrolling away from the top, Jump to bottom appears when not at the bottom. Needs `stopScroll()` before scrolling up, otherwise the stick-to-bottom library pulls the view back.
Look: few boxes. Only the user bubble, one grouped "process" block and the approval card have a frame; the answer, sources and actions are plain text.
Dark mode: next-themes, follows the system; toggle in the header and the Appearance select in Settings.

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

- Language dictionary (the setting exists; texts are Chinese).
- Auth backend, database, payments. Add them per project (see the `launch` skill).
- Bottom tab bar for phones (the sidebar becomes a drawer instead).

## Checks

```bash
pnpm lint && pnpm exec tsc --noEmit && pnpm build
```
