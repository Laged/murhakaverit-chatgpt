# Features TODO

- [x] Sticky header navigation linking to other sections/pages
- [x] Horizontal scroll indicator showing reading progress
- [x] Contextual popup system: clicking a bolded term opens related note (e.g., "[1.9](Kolmatta Maailmansotaa)" → `1.9) KolmasMaailmansota.md`) - use Obsidian notation for these
- [x] Sequential navigation (Next button through overview → note list)
- [x] Replace final "Seuraava" with "Alkuun" linking back to index
- [x] Add direct navigation links for key characters in the header
- [ ] Audit and refine mobile responsiveness throughout
- [ ] Swap typography to Audiowide (headings) + Work Sans (body)
- [ ] Refresh visual styling with futuristic glow and asymmetric corner cuts

For each feature:
1. Ensure git is initialised (`git init`) and current state committed on `main`.
2. Create a dedicated branch (`git checkout -b feature/<name>`).
1. Run `pnpm sync-content` to refresh markdown input.
3. Implement the change.
4. Verify with `pnpm build` (and any relevant runtime checks).
5. Commit before starting the next feature and merge when ready.
