# Viktor Zhuk — business card

Personal site of a full-stack engineer: a sidebar with contacts and navigation, then four
production projects one after another — headline numbers, interactive 3D models of the hardware
or screenshots, what was built, and the stack — followed by experience and skills.

Live: <https://zazplay.github.io/viktor-zhuk/>

Built with React 19, TypeScript and Vite; styles are CSS Modules. The kiosk and locker models are
three.js, loaded in a separate chunk only when those sections render. Brand icons are paths in the
site data, so the page loads nothing from third-party CDNs except Google Fonts.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and build to dist/
npm run build:single   # one self-contained HTML file in single/
```

The previous tabbed version of the site lives on the `legacy/v1` branch.

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).

## Where things live

- `src/data/site.json` — all bilingual copy: profile, projects, experience, education, skills, brand icons
- `src/data/site.ts` — types for that data, the CV link, headline totals and project screenshots
- `src/components/` — sidebar and page sections
- `src/models/` — the 3D kiosk and locker (`stage.ts` is the shared three.js scene, `*Scene.ts` build the models)
- `src/assets/` — photo and screenshots
- `design/` — the Claude Design exports the React version was ported from
- `public/Viktor_Zhuk_CV.pdf` — the CV behind the "Download CV" buttons; replace the file to update it (the path is set in `src/data/site.ts`, clear it to hide the buttons)
