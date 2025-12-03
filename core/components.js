/* ——————————————————————
   LUCEN OS – COMPONENTS
—————————————————————— */

window.LucenComponents = {
  createToolbarPill(label, active, onClick) {
    const btn = document.createElement("button");
    btn.className = "toolbar-pill" + (active ? " active" : "");
    btn.textContent = label;
    btn.onclick = onClick;
    return btn;
  },

  createCard({ title, summary, tag, count, onOpen }) {
    const card = document.createElement("div");
    card.className = "card";

    const t = document.createElement("div");
    t.className = "card-title";
    t.textContent = title;

    const s = document.createElement("div");
    s.className = "card-summary";
    s.textContent = summary;

    const open = document.createElement("button");
    open.className = "btn btn-primary";
    open.innerHTML = "Open";
    open.onclick = onOpen;

    card.append(t, s, open);
    return card;
  }
};
