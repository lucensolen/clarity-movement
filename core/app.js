/* ______________________________
   LUCEN OS – NEUTRAL RUNTIME ENGINE
   Local Nav (header) + Global Nav (footer)
   Footer modes: interactive / reveal / static
________________________________ */

const LucenOS = {
  settings: {
    footerMode: "static", // interactive | reveal | static
    footerHideThreshold: 80,
    theme: "rich-neutral",

    showMasterFields: true,
    showSettings: true,
    showModes: true,
    showSupport: true,
    showDonate: true
  },

  state: {
    level: "core",
    masterId: null,
    fieldId: null,
    moduleId: null,
    miniId: null
  },

  initNeutral() {
    this.app = document.getElementById("app");
    this.buildHeader();
    this.buildFooter();
    this.initFooterMode();

    window.addEventListener("hashchange", () => this.applyRouteFromHash());

    if (location.hash && location.hash.length > 1) {
      this.applyRouteFromHash();
    } else {
      this.setState({ level: "core" }, true);
    }
  },

  /* ROUTE ENCODING */
  encodeRoute(state) {
    const { level, masterId, fieldId, moduleId, miniId } = state;
    if (level === "core") return "#core";
    if (level === "master") return `#master|${masterId}`;
    if (level === "field") return `#field|${masterId}|${fieldId}`;
    if (level === "module") return `#module|${masterId}|${fieldId}|${moduleId}`;
    if (level === "mini") return `#mini|${masterId}|${fieldId}|${moduleId}|${miniId}`;
    return "#core";
  },

  decodeRoute(hash) {
    if (!hash || hash.length <= 1)
      return { level: "core", masterId: null, fieldId: null, moduleId: null, miniId: null };

    const parts = hash.replace(/^#/, "").split("|");
    const kind = parts[0];

    if (kind === "core")
      return { level: "core", masterId: null, fieldId: null, moduleId: null, miniId: null };

    if (kind === "master" && parts.length >= 2)
      return { level: "master", masterId: parts[1], fieldId: null, moduleId: null, miniId: null };

    if (kind === "field" && parts.length >= 3)
      return {
        level: "field",
        masterId: parts[1],
        fieldId: parts[2],
        moduleId: null,
        miniId: null
      };

    if (kind === "module" && parts.length >= 4)
      return {
        level: "module",
        masterId: parts[1],
        fieldId: parts[2],
        moduleId: parts[3],
        miniId: null
      };

    if (kind === "mini" && parts.length >= 5)
      return {
        level: "mini",
        masterId: parts[1],
        fieldId: parts[2],
        moduleId: parts[3],
        miniId: parts[4]
      };

    return { level: "core" };
  },

  applyRouteFromHash() {
    const parsed = this.decodeRoute(location.hash);
    this.setState(parsed, false);
  },

  setState(newState, pushHistory) {
    this.state = { ...newState };

    if (pushHistory) {
      const target = this.encodeRoute(this.state);
      if (location.hash !== target) location.hash = target;
    }

    this.render();
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  /* HEADER */
  buildHeader() {
    const shell = document.createElement("div");
    shell.className = "header-shell";

    const header = document.createElement("div");
    header.className = "header";

    const topRow = document.createElement("div");
    topRow.className = "header-top-row";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "btn header-back";
    back.textContent = "Back";
    back.onclick = () => this.navigateUp();

    const top = document.createElement("div");
    top.className = "header-top";

    const title = document.createElement("div");
    title.className = "header-title";
    title.textContent = "Hub – Clarity Movement";

    const sub = document.createElement("div");
    sub.className = "header-sub";
    sub.textContent = "Local Nav • Universe Navigation";

    const pos = document.createElement("div");
    pos.className = "header-pos";

    top.appendChild(title);
    top.appendChild(sub);
    top.appendChild(pos);

    topRow.appendChild(back);
    topRow.appendChild(top);

    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";

    header.appendChild(topRow);
    header.appendChild(toolbar);
    shell.appendChild(header);

    document.body.insertBefore(shell, this.app);

    this.headerShell = shell;
    this.headerPos = pos;
    this.toolbar = toolbar;
    this.backButton = back;
  },

  updateHeader(ctx) {
    const isHub = this.state.level === "core";
    this.backButton.style.display = isHub ? "none" : "inline-flex";

    const parts = [];
    if (ctx.master) parts.push(ctx.master.name);
    if (ctx.field) parts.push(ctx.field.name);
    if (ctx.module) parts.push(ctx.module.name);
    if (ctx.mini) parts.push(ctx.mini.name);

    const label = this.state.level.toUpperCase();
    const path = parts.length ? parts.join(" / ") : "Hub";

    this.headerPos.textContent = `${label} • ${path}`;

    this.toolbar.innerHTML = "";
    const WC = window.LucenWorld;

    if (this.state.level === "core") {
      WC.masterFields.forEach(mf =>
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(mf.name, false, () => this.goMaster(mf.id))
        )
      );
      return;
    }

    if (this.state.level === "master") {
      this.toolbar.appendChild(
        LucenComponents.createToolbarPill("Hub", false, () => this.goCore())
      );

      ctx.master.fields.forEach(f =>
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(f.name, false, () =>
            this.goField(ctx.master.id, f.id)
          )
        )
      );
      return;
    }

    if (this.state.level === "field") {
      this.toolbar.appendChild(
        LucenComponents.createToolbarPill(ctx.master.name, false, () =>
          this.goMaster(ctx.master.id)
        )
      );

      ctx.field.modules.forEach(mod =>
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(
            mod.name,
            false,
            () => this.goModule(ctx.master.id, ctx.field.id, mod.id)
          )
        )
      );
      return;
    }

    if (this.state.level === "module") {
      this.toolbar.appendChild(
        LucenComponents.createToolbarPill(ctx.field.name, false, () =>
          this.goField(ctx.master.id, ctx.field.id)
        )
      );

      ctx.field.modules.forEach(mod =>
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(
            mod.name,
            mod.id === ctx.module.id,
            () => this.goModule(ctx.master.id, ctx.field.id, mod.id)
          )
        )
      );
      return;
    }

    if (this.state.level === "mini") {
      this.toolbar.appendChild(
        LucenComponents.createToolbarPill(ctx.module.name, false, () =>
          this.goModule(ctx.master.id, ctx.field.id, ctx.module.id)
        )
      );
      return;
    }
  },

  /* FOOTER */
  buildFooter() {
    const shell = document.createElement("div");
    shell.className = "footer-shell";

    const footer = document.createElement("div");
    footer.className = "footer";

    const title = document.createElement("div");
    title.className = "footer-title";
    title.textContent = "Global Nav – Lucen Hub";

    const sub = document.createElement("div");
    sub.className = "footer-sub";
    sub.textContent = "OS navigation • Modes • Settings";

    const rows = document.createElement("div");
    rows.className = "footer-rows";

    /* — Row 1 — */
    const r1 = document.createElement("div");
    r1.className = "footer-row";
    r1.appendChild(this.createFooterButton("Hub", () => this.goCore()));
    r1.appendChild(
      this.settings.showMasterFields
        ? this.createFooterButton("Master Fields", () => this.goCore())
        : this.createFooterSpacer()
    );

    /* — Row 2 — */
    const r2 = document.createElement("div");
    r2.className = "footer-row";
    r2.appendChild(
      this.settings.showSettings
        ? this.createFooterButton("Settings", () => alert("Settings – to wire"))
        : this.createFooterSpacer()
    );
    r2.appendChild(
      this.settings.showModes
        ? this.createFooterButton("Modes", () => alert("Modes – to wire"))
        : this.createFooterSpacer()
    );

    /* — Row 3 — */
    const r3 = document.createElement("div");
    r3.className = "footer-row";
    r3.appendChild(
      this.settings.showSupport
        ? this.createFooterButton("Support", () => alert("Support – to wire"))
        : this.createFooterSpacer()
    );

    if (this.settings.showDonate) {
      const donate = document.createElement("a");
      donate.href = "https://www.educationalfreedom.uk/donate";
      donate.target = "_blank";
      donate.className = "footer-link footer-donate";
      donate.textContent = "Donate";
      r3.appendChild(donate);
    } else r3.appendChild(this.createFooterSpacer());

    rows.append(r1, r2, r3);

    footer.appendChild(title);
    footer.appendChild(sub);
    footer.appendChild(rows);
    shell.appendChild(footer);
    document.body.appendChild(shell);

    this.footerShell = shell;
  },

  createFooterButton(label, handler) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "footer-link";
    btn.textContent = label;
    btn.onclick = handler;
    return btn;
  },

  createFooterSpacer() {
    const d = document.createElement("div");
    d.className = "footer-spacer";
    return d;
  },

  initFooterMode() {
    const mode = this.settings.footerMode;

    if (!this.footerSentinel) {
      const s = document.createElement("div");
      s.style.height = "1px";
      s.id = "lucen-footer-trigger";
      this.app.appendChild(s);
      this.footerSentinel = s;
    }

    if (this.footerObserver) this.footerObserver.disconnect();
    if (this.footerScrollHandler)
      window.removeEventListener("scroll", this.footerScrollHandler);

    this.footerShell.classList.remove("footer-static", "visible");
    this.footerVisible = false;

    if (mode === "static") {
      this.footerShell.classList.add("footer-static", "visible");
      return;
    }

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            this.footerShell.classList.add("visible");
            this.footerVisible = true;
            this.footerLastRevealScrollY = window.scrollY;
          } else if (mode === "reveal") {
            this.footerShell.classList.remove("visible");
            this.footerVisible = false;
          }
        });
      },
      { threshold: 0.1 }
    );

    obs.observe(this.footerSentinel);
    this.footerObserver = obs;

    if (mode === "interactive") {
      const th = this.settings.footerHideThreshold;
      this.footerLastScrollY = window.scrollY;

      this.footerScrollHandler = () => {
        const now = window.scrollY;
        const delta = now - this.footerLastScrollY;

        if (delta < 0 && this.footerVisible) {
          if (this.footerLastScrollY - now >= th) {
            this.footerShell.classList.remove("visible");
            this.footerVisible = false;
          }
        }

        this.footerLastScrollY = now;
      };

      window.addEventListener("scroll", this.footerScrollHandler, { passive: true });
    }
  },

  /* NAVIGATION */
  navigateUp() {
    const s = this.state;

    if (s.level === "mini")
      return this.setState(
        { level: "module", masterId: s.masterId, fieldId: s.fieldId, moduleId: s.moduleId },
        true
      );

    if (s.level === "module")
      return this.setState(
        { level: "field", masterId: s.masterId, fieldId: s.fieldId },
        true
      );

    if (s.level === "field")
      return this.setState({ level: "master", masterId: s.masterId }, true);

    if (s.level === "master")
      return this.setState({ level: "core" }, true);
  },

  goCore() {
    this.setState({ level: "core" }, true);
  },
  goMaster(id) {
    this.setState({ level: "master", masterId: id }, true);
  },
  goField(mid, fid) {
    this.setState({ level: "field", masterId: mid, fieldId: fid }, true);
  },
  goModule(mid, fid, mod) {
    this.setState({ level: "module", masterId: mid, fieldId: fid, moduleId: mod }, true);
  },
  goMini(mid, fid, mod, mini) {
    this.setState(
      { level: "mini", masterId: mid, fieldId: fid, moduleId: mod, miniId: mini },
      true
    );
  },

  /* LOOKUPS */
  getContext() {
    const W = window.LucenWorld;

    const m = this.state.masterId
      ? W.masterFields.find(x => x.id === this.state.masterId)
      : null;

    const f = m && this.state.fieldId ? m.fields.find(x => x.id === this.state.fieldId) : null;

    const mod =
      f && this.state.moduleId ? f.modules.find(x => x.id === this.state.moduleId) : null;

    const mini =
      mod && this.state.miniId ? mod.minis.find(x => x.id === this.state.miniId) : null;

    return { master: m, field: f, module: mod, mini };
  },

  /* RENDER */
  render() {
    const W = window.LucenWorld;
    const ctx = this.getContext();

    this.updateHeader(ctx);
    this.app.innerHTML = "";

    const view = document.createElement("div");
    view.className = "view active";

    if (this.state.level === "core") {
      const g = document.createElement("div");
      g.className = "grid";

      W.masterFields.forEach(mf =>
        g.appendChild(
          LucenComponents.createCard({
            title: mf.name,
            summary: mf.short,
            meta: `Fields: ${mf.fields.length}`,
            buttonLabel: "Open master field",
            onOpen: () => this.goMaster(mf.id)
          })
        )
      );

      view.appendChild(g);
    }

    else if (this.state.level === "master" && ctx.master) {
      const g = document.createElement("div");
      g.className = "grid";

      ctx.master.fields.forEach(f =>
        g.appendChild(
          LucenComponents.createCard({
            title: f.name,
            summary: f.short,
            meta: `Modules: ${f.modules.length}`,
            buttonLabel: "Open field",
            onOpen: () => this.goField(ctx.master.id, f.id)
          })
        )
      );

      view.appendChild(g);
    }

    else if (this.state.level === "field" && ctx.field) {
      const g = document.createElement("div");
      g.className = "grid";

      ctx.field.modules.forEach(mod =>
        g.appendChild(
          LucenComponents.createCard({
            title: mod.name,
            summary: mod.short,
            meta: `Mini modules: ${mod.minis.length}`,
            buttonLabel: "Open module",
            onOpen: () => this.goModule(ctx.master.id, ctx.field.id, mod.id)
          })
        )
      );

      view.appendChild(g);
    }

    else if (this.state.level === "module" && ctx.module) {
      const g = document.createElement("div");
      g.className = "grid";

      const card = LucenComponents.createCard({
        title: ctx.module.name,
        summary: ctx.module.short,
        meta: `Mini modules: ${ctx.module.minis.length}`,
        buttonLabel: "Back to field",
        onOpen: () => this.goField(ctx.master.id, ctx.field.id)
      });

      const list = document.createElement("div");
      list.className = "mini-list";

      ctx.module.minis.forEach(mm => {
        const row = document.createElement("div");
        row.className = "mini-item";

        const name = document.createElement("div");
        name.className = "mini-name";
        name.textContent = mm.name;

        const body = document.createElement("div");
        body.className = "mini-body";
        body.textContent = mm.body;

        row.append(name, body);

        row.onclick = () =>
          this.goMini(ctx.master.id, ctx.field.id, ctx.module.id, mm.id);

        list.appendChild(row);
      });

      card.appendChild(list);
      g.appendChild(card);
      view.appendChild(g);
    }

    else if (this.state.level === "mini" && ctx.mini) {
      const g = document.createElement("div");
      g.className = "grid";

      const card = LucenComponents.createCard({
        title: ctx.mini.name,
        summary: ctx.mini.body,
        meta: "",
        buttonLabel: "Back to module",
        onOpen: () =>
          this.goModule(ctx.master.id, ctx.field.id, ctx.module.id)
      });

      g.appendChild(card);
      view.appendChild(g);
    }

    this.app.appendChild(view);
  }
};
