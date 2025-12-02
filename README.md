## Visual Page Hierarchy Editor

A small React + Vite application that implements the **Brainstorm Force – Frontend Developer** technical assignment.

It visualizes a 3‑level page hierarchy using **React Flow + Dagre**, lets you **reorder Home page sections** using **DndKit**, and supports **Save / Load / Export JSON** via `localStorage`.

### Tech stack

- **React 18** with **Vite**
- **React Flow** for graph rendering
- **Dagre** for automatic vertical layout
- **DndKit** for drag-and-drop inside the Home node
- **Tailwind CSS** for styling
- **Vitest + Testing Library** for basic tests

### Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

3. Open the URL printed in the terminal (typically `http://localhost:5173/`).

### Available scripts

- **`npm run dev`** – start the Vite dev server
- **`npm run build`** – create a production build
- **`npm run preview`** – preview the production build locally
- **`npm test`** – run Vitest unit tests

### Features implemented

- **Hierarchy & layout**

  - Static 3‑level tree:
    - Level 1: `Home`
    - Level 2: `About`, `Services`, `Blog`, `Contact`
    - Level 3: `Service Detail 1`, `Service Detail 2`, `Blog Post 1`, `Blog Post 2`, `Author Page`, `Location Info`, `Support Page`
  - All parent–child connections are auto‑generated from the data structure.
  - React Flow + Dagre handle vertical tree layout and positioning.

- **Home page sections (DndKit)**

  - Inside the `Home` node, the following sections are rendered as draggable cards:
    - `Hero`, `Features`, `Testimonials`, `CTA`, `Footer`
  - Sections can be reordered via drag‑and‑drop.

- **Persistence & export**
  - **Save** – stores `pages` + `homeSections` in `localStorage` under the key `page-hierarchy-structure`.
  - **Load** – restores the full structure from `localStorage`, merging it with the base definition to keep parent relations intact.
  - **Export JSON** – shows the full structure as formatted JSON in the right‑hand panel.

### Tests

Basic tests are written with **Vitest** and **@testing-library/react**:

- App renders the main title and control buttons.
- Clicking **Save** writes to `localStorage`.
- Clicking **Export JSON** fills the JSON preview panel with a structure containing `pages` and `homeSections`.

Run them with:

```bash
npm test
```

### Deployment & submission

- **GitHub repository**: [`Rishikesh-Sarje-Frontend-Developer`](https://github.com/rushi0241/Rishikesh-Sarje-Frontend-Developer)
- **Live demo**: _add your Vercel / Netlify URL here_
- **Demo video**: _add your screen‑recording URL here_

For the assignment submission:

- Create a private GitHub repository named **`Rishikesh Sarje - Frontend Developer`**.
- Add collaborators: `bsf-zanev`, `patilvikasj`, `neerajmasai`, `sandeshjangam`.
- Include this README, the deployed link, and the video URL.
