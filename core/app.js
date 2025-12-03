/* ——————————————————————————
   LUCEN OS – NEUTRAL RUNTIME ENGINE
—————————————————————————— */

const LucenOS = {
  state: {
    level: "core",
    masterId: null,
    fieldId: null,
    moduleId: null,
    miniId: null
  },

  initNeutral() {
    this.app = document.getElementById("app");
    this.footer = this.createFooter();
    document.body.appendChild(this.footer);

    this.renderCore();
    this.setupScrollFooter();
  },

  /* ————————————————
     FOOTER GENERATION
  ———————————————— */
  createFooter() {
    const f = document.createElement("div");
    f.className = "footer";

    const title = document.createElement("div");
    title.textContent = "Lucen OS – Neutral Engine";

    const links = document.createElement("div");
    links.className = "footer-links";

    const btnCore = this.createFooterLink("Core Field", () => this.renderCore());
    const btnMaster = this.createFooterLink("Master Fields", () => this.renderCore());
    const btnField = this.createFooterLink("Current Field", () => this.renderCurrentField());

    const donate = this.createFooterLink(
      "Donate",
      () => window.location.href = "https://www.educationalfreedom.uk/donate",
      true
    );

    links.append(btnCore, btnMaster, btnField, donate);

    f.append(title, links);
    return f;
  },

  createFooterLink(label, onclick, donate = false) {
    const b = document.createElement("button");
    b.className = "footer-link" + (donate ? " footer-donate" : "");
    b.textContent = label;
    b.onclick = onclick;
    return b;
  },

  setupScrollFooter() {
    window.addEventListener("scroll", () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 40;
      this.footer.classList.toggle("visible", bottom);
    });
  },

  /* ————————————————
     RENDER CORE FIELD
  ———————————————— */
  renderCore() {
    this.state = { level: "core", masterId: null, fieldId: null, moduleId: null, miniId: null };
    document.title = "Lucen OS – Core Field";

    this.app.innerHTML = "";
    const view = document.createElement("div");
    view.className = "view active";

    const grid = document.createElement("div");
    grid.className = "grid";

    window.LucenWorld.masterFields.forEach(m => {
      grid.append(
        LucenComponents.createCard({
          title: m.name,
          summary: m.short,
          onOpen: () => this.renderMaster(m.id)
        })
      );
    });

    view.append(grid);
    this.app.append(view);
  },

  /* ————————————————
     RENDER MASTER FIELD
  ———————————————— */
  renderMaster(id) {
    this.state = { level: "master", masterId: id, fieldId: null };

    const master = window.LucenWorld.masterFields.find(m => m.id === id);
    document.title = master.name;

    this.app.innerHTML = "";

    const view = document.createElement("div");
    view.className = "view active";

    const grid = document.createElement("div");
    grid.className = "grid";

    master.fields.forEach(f => {
      grid.append(
        LucenComponents.createCard({
          title: f.name,
          summary: f.short,
          onOpen: () => this.renderField(master.id, f.id)
        })
      );
    });

    view.append(grid);
    this.app.append(view);
  },

  /* ————————————————
     RENDER FIELD
  ———————————————— */
  renderField(masterId, fieldId) {
    this.state = { level: "field", masterId, fieldId };

    const master = window.LucenWorld.masterFields.find(m => m.id === masterId);
    const field = master.fields.find(f => f.id === fieldId);
    document.title = field.name;

    this.app.innerHTML = "";

    const view = document.createElement("div");
    view.className = "view active";

    const grid = document.createElement("div");
    grid.className = "grid";

    field.modules.forEach(mod => {
      grid.append(
        LucenComponents.createCard({
          title: mod.name,
          summary: mod.short,
          onOpen: () => this.renderModule(masterId, fieldId, mod.id)
        })
      );
    });

    view.append(grid);
    this.app.append(view);
  },

  /* ————————————————
     RENDER MODULE
  ———————————————— */
  renderModule(masterId, fieldId, moduleId) {
    this.state = { level: "module", masterId, fieldId, moduleId };

    const master = window.LucenWorld.masterFields.find(m => m.id === masterId);
    const field = master.fields.find(f => f.id === fieldId);
    const mod = field.modules.find(m => m.id === moduleId);

    document.title = mod.name;

    this.app.innerHTML = "";

    const view = document.createElement("div");
    view.className = "view active";

    const title = document.createElement("h2");
    title.textContent = mod.name;

    const miniList = document.createElement("div");
    miniList.style.display = "flex";
    miniList.style.flexDirection = "column";
    miniList.style.gap = "10px";

    mod.minis.forEach(mini => {
      const item = document.createElement("div");
      item.className = "mini-item";
      item.innerHTML = `<div>${mini.name}</div>`;
      item.onclick = () => this.renderMini(masterId, fieldId, moduleId, mini.id);
      miniList.append(item);
    });

    view.append(title, miniList);
    this.app.append(view);
  },

  /* ————————————————
     RENDER MINI MODULE
  ———————————————— */
  renderMini(masterId, fieldId, moduleId, miniId) {
    this.state = { level: "mini", masterId, fieldId, moduleId, miniId };

    const master = window.LucenWorld.masterFields.find(m => m.id === masterId);
    const field = master.fields.find(f => f.id === fieldId);
    const mod = field.modules.find(m => m.id === moduleId);
    const mini = mod.minis.find(mm => mm.id === miniId);

    document.title = mini.name;

    this.app.innerHTML = "";

    const view = document.createElement("div");
    view.className = "view active";

    const t = document.createElement("h3");
    t.textContent = mini.name;

    const body = document.createElement("p");
    body.textContent = mini.body;

    const back = document.createElement("button");
    back.className = "btn";
    back.textContent = "Back to Module";
    back.onclick = () => this.renderModule(masterId, fieldId, moduleId);

    view.append(t, body, back);
    this.app.append(view);
  },

  renderCurrentField() {
    if (this.state.level === "field")
      this.renderField(this.state.masterId, this.state.fieldId);
    if (this.state.level === "module")
      this.renderField(this.state.masterId, this.state.fieldId);
    if (this.state.level === "mini")
      this.renderField(this.state.masterId, this.state.fieldId);
  }
};
