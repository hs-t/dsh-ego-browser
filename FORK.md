# Fork notes

This is a personal fork of [Fisfzy/dsh-ego-browser](https://github.com/Fisfzy/dsh-ego-browser).

- `origin` = this fork; `upstream` = `Fisfzy/dsh-ego-browser`.
- `master` is a clean mirror of upstream. Do not commit to it; keep it
  fast-forward-only so the fork's **Sync fork** button keeps working.
- Local work lives on feature branches (`feat/...`) rebased onto `master`.

## Sync with upstream

```sh
git fetch upstream --tags
git checkout master
git merge --ff-only upstream/master
git push origin master
git checkout feat/<branch>
git rebase master
```

## Build and install

`lib/` and `bin/` are generated artifacts (tsdown). This fork commits source
changes only, so build before packing or installing:

```sh
pnpm install
pnpm run build          # regenerates lib/index.js, lib/client.js, bin/ego-cast-worker.mjs
pnpm pack               # produces dsh-ego-browser-<version>.tgz
```

Install the tarball through the plugin manager (or `pnpm add` it to a profile)
rather than installing straight from git, so the built artifacts are current:

```sh
# in the target DSH profile
pnpm add file:D:/path/to/dsh-ego-browser-<version>.tgz
# then add "dsh-ego-browser" to dsh.profile.bundles
```

Set the browser path in the plugin settings (`chromePath`) when using a
Chromium build outside the standard Chrome/Edge/Brave locations.

## Local changes

- `feat/dsh-right-sidebar`: host the live watch panel in the built-in right
  Sidebar (`ui-sidebar-right`) as a keep-mounted tab type, with automatic
  opening when the agent calls an `ego_*` tool. Fallback order:
  built-in right Sidebar → `dsh-better-sidebar` → floating watch ball.
- Windows HiDPI: `runtime/ego-linux/src/chrome.mjs` no longer passes
  `--force-device-scale-factor=1` on win32. Windows follows the system scale
  (`dpr=2` here) while `--window-size=1280,900` still yields a ~1267 CSS
  viewport.
- Stable live view: `src/client/index.ts` skips keepalive `spaces` re-renders
  when the rendered payload is unchanged, derives the "live" title from
  `streamState` instead of the rolling `lastActive` window, and reserves the
  page aspect ratio on the live image so a frame swap cannot collapse it.
- CDP backstop: `src/worker/capture-cdp.ts` divides the backstop clip scale by
  `devicePixelRatio` (the screencast is capped in device pixels) and skips
  `Page.captureScreenshot` for targets whose document is visible. The capture
  briefly rescales a HiDPI renderer surface, which showed up as a 20-second
  half-scale flash in the browser window.
- Per-session spaces and a space-aware watch panel: `defineEgoTool` derives a
  default space from `exec.agent.session.id` (explicit `space` wins), and
  `ego_space_open` rebinds the session to the opened name. The worker enriches
  tabs with `spaceName` from `task-spaces.json` and publishes `taskSpaces`; the
  right Sidebar adds a multi-select space dropdown (default: the session's
  space once it has tabs, otherwise all) and groups the tab strip by space.
