/* ______________________________
   LUCEN OS – COMPONENTS
________________________________ */

window.LucenComponents = {
  createToolbarPill(label, active, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toolbar-pill" + (active ? " active" : "");
    btn.textContent = label;
    btn.onclick = onClick;
    return btn;
  },

  createCard({ title, summary, meta, buttonLabel, onOpen }) {
    const card = document.createElement("div");
    card.className = "card";

    const t = document.createElement("div");
    t.className = "card-title";
    t.textContent = title;
    card.appendChild(t);

    if (summary) {
      const s = document.createElement("div");
      s.className = "card-summary";
      s.textContent = summary;
      card.appendChild(s);
    }

    if (meta) {
      const m = document.createElement("div");
      m.className = "card-meta";
      m.textContent = meta;
      card.appendChild(m);
    }

    if (onOpen) {
      const actions = document.createElement("div");
      actions.className = "card-actions";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary";
      btn.textContent = buttonLabel || "Open";
      btn.onclick = onOpen;

      actions.appendChild(btn);
      card.appendChild(actions);
    }

    return card;
  }
};
