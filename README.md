# Murhakaverit Vault

THIS IS A WIP EXPERIMENTAL YOLO VIBE CODING ATTEMPT BY GPT-5 CODEX PLS NO LAUGH AT BOT BOT BE NICE

Next.js 15 + React 19 site tailored for Vercel. It renders markdown notes copied from your Obsidian vault into the local `content/` directory using [`react-markdown`](https://github.com/remarkjs/react-markdown) with GitHub-flavoured Markdown.

## Prerequisites

- Node.js 20+ (the repo is set up to use `nix-shell -p nodejs_20 pnpm`)
- pnpm 9/10

## Local Development

```bash
nix-shell -p nodejs_20 pnpm --run "pnpm install"
nix-shell -p nodejs_20 pnpm --run "pnpm dev"
```

Drop or update `.md` files under `content/` and refresh the page. The vault is cached for build-time generation but revalidated hourly.

## Building for Production

```bash
nix-shell -p nodejs_20 pnpm --run "pnpm build"
```

The project is configured with `--turbopack` for both dev and build to align with Vercel’s latest optimisations and ships as a standalone output for lean deployments.

## Syncing Vault Content

Refresh the repository `content/` directory from your primary vault (defaults to `~/Jubensha/Pelit/NKL2068/1) Taustavaihe/`):

```bash
nix-shell -p nodejs_20 pnpm --run "pnpm sync-content"
```

Optionally supply a custom source directory:

```bash
nix-shell -p nodejs_20 pnpm --run "pnpm sync-content -- /path/to/other/folder"
```

## Git Hooks

Husky runs a pre-commit hook that refreshes vault content and ensures the project stays healthy.

```bash
pnpm precommit # sync-content + lint + build
```

After cloning, initialise git and install the hooks:

```bash
git init
pnpm prepare
```

## Deploying to Vercel

1. Push your changes to GitHub/GitLab.
2. Create a new Vercel project from this repository.
3. Set the build command to `pnpm build` (the default for pnpm projects).
4. Ensure the `content/` directory is included so the markdown files deploy alongside the site.

Each new deployment will read the latest vault contents at build time and statically generate every note page.
