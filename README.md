# Viktor Zhuk — business card

Personal site of a full-stack engineer: three production projects shown as tabs, each with its
headline numbers, architecture diagrams and stack.

Live: <https://zazplay.github.io/viktor-zhuk/>

Built with React 19, TypeScript and Vite; styles are CSS Modules, icons are bundled
(`lucide-react`, `simple-icons`), so the page loads nothing from third-party CDNs except Google Fonts.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and build to dist/
```

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).

## Where things live

- `src/data/profile.ts` — name, intro, contact links
- `src/projects/<project>/data.ts` — all text and numbers for each tab
- `src/projects/index.ts` — the list of tabs
- `src/components/` — shared blocks: sections, stats, work list, stack, flow diagrams
- `design/` — the original Claude Design export the React version was ported from
- `public/Viktor_Zhuk_CV.pdf` — the CV behind the "Download CV" buttons; replace the file to update it (the path is set in `src/data/profile.ts`, clear it to hide the buttons)
