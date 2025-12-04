/* ______________________________________
   LUCEN OS – UI COMPONENT FACTORY
______________________________________ */

window.LucenComponents = {
  createToolbarPill(label, active, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "toolbar-pill" + (active ? " active" : "");
    b.textContent = label;
    b.onclick = onClick;
    return b;
  },

  createCard({ title, summary, meta, buttonLabel, onOpen }) {
    const card = document.createElement("div");
    card.className = "card";

    const t = document.createElement("div");
    t.className = "card-title";
    t.textContent = title;

    const s = document.createElement("div");
    s.className = "card-summary";
    s.textContent = summary;

    const m = document.createElement("div");
    m.className = "card-meta";
    m.textContent = meta;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn card-btn";
    btn.textContent = buttonLabel;
    btn.onclick = onOpen;

    card.append(t, s, m, btn);
    return card;
  }
};
