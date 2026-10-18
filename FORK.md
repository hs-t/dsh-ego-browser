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
