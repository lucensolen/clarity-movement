/* ______________________________
   LUCEN OS – NEUTRAL RUNTIME ENGINE
________________________________ */

const LucenOS = {
  state: {
    level: "core",   // "core" | "master" | "field" | "module" | "mini"
    masterId: null,
    fieldId: null,
    moduleId: null,
    miniId: null
  },

  initNeutral() {
    this.app = document.getElementById("app");

    // Build header + footer shells
    this.buildHeader();
    this.buildFooter();

    // Initial render
    this.render();
    this.setupScrollFooter();
  },

  /* ===== HEADER ===== */

  buildHeader() {
    const shell = document.createElement("div");
    shell.className = "header-shell";

    const header = document.createElement("div");
    header.className = "header";

    const top = document.createElement("div");
    top.className = "header-top";

    const title = document.createElement("div");
    title.className = "header-title";
    title.textContent = "Clarity Movement Core";

    const sub = document.createElement("div");
    sub.className = "header-sub";
    sub.textContent = "Multi-field skeleton • Core layer";

    const pos = document.createElement("div");
    pos.className = "header-pos";
    pos.textContent = "";

    top.appendChild(title);
    top.appendChild(sub);
    top.appendChild(pos);

    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";

    header.appendChild(top);
    header.appendChild(toolbar);
    shell.appendChild(header);

    document.body.insertBefore(shell, this.app);

    this.headerShell = shell;
    this.headerPos = pos;
    this.toolbar = toolbar;
  },

  updateHeader(context) {
    // Position breadcrumb text
    const parts = [];
    if (context.master) parts.push(context.master.name);
    if (context.field) parts.push(context.field.name);
    if (context.module) parts.push(context.module.name);
    if (context.mini) parts.push(context.mini.name);

    const levelLabel = this.state.level.toUpperCase();
    const path = parts.length ? parts.join(" / ") : "Core Field";

    this.headerPos.textContent = `${levelLabel} • ${path}`;

    // Rebuild toolbar pills based on level
    this.toolbar.innerHTML = "";

    const WC = window.LucenWorld;

    if (this.state.level === "core") {
      WC.masterFields.forEach(mf => {
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(
            mf.name,
            false,
            () => this.goMaster(mf.id)
          )
        );
      });
    } else if (this.state.level === "master") {
      // Back to core
      this.toolbar.appendChild(
        LucenComponents.createToolbarPill("Core overview", false, () => this.goCore())
      );

      context.master.fields.forEach(f => {
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(
            f.name,
            context.field && context.field.id === f.id,
            () => this.goField(context.master.id, f.id)
          )
        );
      });
    } else if (this.state.level === "field") {
      this.toolbar.appendChild(
        LucenComponents.createToolbarPill(
          context.master.name,
          false,
          () => this.goMaster(context.master.id)
        )
      );

      context.field.modules.forEach(mod => {
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(
            mod.name,
            context.module && context.module.id === mod.id,
            () => this.goModule(context.master.id, context.field.id, mod.id)
          )
        );
      });
    } else if (this.state.level === "module" || this.state.level === "mini") {
      this.toolbar.appendChild(
        LucenComponents.createToolbarPill(
          context.field.name,
          false,
          () => this.goField(context.master.id, context.field.id)
        )
      );

      context.field.modules.forEach(mod => {
        this.toolbar.appendChild(
          LucenComponents.createToolbarPill(
            mod.name,
            context.module && context.module.id === mod.id,
            () => this.goModule(context.master.id, context.field.id, mod.id)
          )
        );
      });
    }
  },

  /* ===== FOOTER ===== */

  buildFooter() {
    const shell = document.createElement("div");
    shell.className = "footer-shell";

    const footer = document.createElement("div");
    footer.className = "footer";

    const title = document.createElement("div");
    title.className = "footer-title";
    title.textContent = "Clarity Movement – Core Field (c)";

    const sub = document.createElement("div");
    sub.className = "footer-sub";
    sub.textContent =
      "You are at the top layer of your ecosystem. Each Master Field can host its own worlds.";

    const links = document.createElement("div");
    links.className = "footer-links";

    const coreBtn = document.createElement("button");
    coreBtn.type = "button";
    coreBtn.className = "footer-link";
    coreBtn.textContent = "Core Field";
    coreBtn.onclick = () => this.goCore();

    const mastersBtn = document.createElement("button");
    mastersBtn.type = "button";
    mastersBtn.className = "footer-link";
    mastersBtn.textContent = "All Master Fields";
    mastersBtn.onclick = () => this.goCore();

    const donate = document.createElement("a");
    donate.href = "https://www.educationalfreedom.uk/donate";
    donate.target = "_blank";
    donate.rel = "noopener noreferrer";
    donate.className = "footer-link footer-donate";
    donate.textContent = "Donate to Educational Freedom";

    links.appendChild(coreBtn);
    links.appendChild(mastersBtn);
    links.appendChild(donate);

    footer.appendChild(title);
    footer.appendChild(sub);
    footer.appendChild(links);

    shell.appendChild(footer);
    document.body.appendChild(shell);

    this.footerShell = shell;
  },

  setupScrollFooter() {
    const onScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= docHeight - 40) {
        this.footerShell.classList.add("visible");
      } else {
        this.footerShell.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
  },

  /* ===== NAV HELPERS ===== */

  goCore() {
    this.state = {
      level: "core",
      masterId: null,
      fieldId: null,
      moduleId: null,
      miniId: null
    };
    this.render();
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  goMaster(masterId) {
    this.state = {
      level: "master",
      masterId,
      fieldId: null,
      moduleId: null,
      miniId: null
    };
    this.render();
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  goField(masterId, fieldId) {
    this.state = {
      level: "field",
      masterId,
      fieldId,
      moduleId: null,
      miniId: null
    };
    this.render();
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  goModule(masterId, fieldId, moduleId) {
    this.state = {
      level: "module",
      masterId,
      fieldId,
      moduleId,
      miniId: null
    };
    this.render();
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  goMini(masterId, fieldId, moduleId, miniId) {
    this.state = {
      level: "mini",
      masterId,
      fieldId,
      moduleId,
      miniId
    };
    this.render();
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  /* ===== WORLD LOOKUPS ===== */

  getContext() {
    const W = window.LucenWorld;
    let master = null,
      field = null,
      module = null,
      mini = null;

    if (this.state.masterId) {
      master = W.masterFields.find(m => m.id === this.state.masterId) || null;
    }
    if (master && this.state.fieldId) {
      field = master.fields.find(f => f.id === this.state.fieldId) || null;
    }
    if (field && this.state.moduleId) {
      module = field.modules.find(m => m.id === this.state.moduleId) || null;
    }
    if (module && this.state.miniId) {
      mini = module.minis.find(mm => mm.id === this.state.miniId) || null;
    }

    return { master, field, module, mini };
  },

  /* ===== RENDER ===== */

  render() {
    const W = window.LucenWorld;
    const ctx = this.getContext();

    // Update header
    this.updateHeader(ctx);

    // Clear main area
    this.app.innerHTML = "";

    const view = document.createElement("div");
    view.className = "view active";

    if (this.state.level === "core") {
      const grid = document.createElement("div");
      grid.className = "grid";

      W.masterFields.forEach(mf => {
        const card = LucenComponents.createCard({
          title: mf.name,
          summary: mf.short,
          meta: `Fields: ${mf.fields.length}`,
          buttonLabel: "Open master field",
          onOpen: () => this.goMaster(mf.id)
        });
        grid.appendChild(card);
      });

      view.appendChild(grid);
    } else if (this.state.level === "master" && ctx.master) {
      const grid = document.createElement("div");
      grid.className = "grid";

      ctx.master.fields.forEach(f => {
        const card = LucenComponents.createCard({
          title: f.name,
          summary: f.short,
          meta: `Modules: ${f.modules.length}`,
          buttonLabel: "Open field",
          onOpen: () => this.goField(ctx.master.id, f.id)
        });
        grid.appendChild(card);
      });

      view.appendChild(grid);
    } else if (this.state.level === "field" && ctx.master && ctx.field) {
      const grid = document.createElement("div");
      grid.className = "grid";

      ctx.field.modules.forEach(mod => {
        const card = LucenComponents.createCard({
          title: mod.name,
          summary: mod.short,
          meta: `Mini modules: ${mod.minis.length}`,
          buttonLabel: "Open module",
          onOpen: () =>
            this.goModule(ctx.master.id, ctx.field.id, mod.id)
        });
        grid.appendChild(card);
      });

      view.appendChild(grid);
    } else if (this.state.level === "module" && ctx.master && ctx.field && ctx.module) {
      const grid = document.createElement("div");
      grid.className = "grid";

      const card = LucenComponents.createCard({
        title: ctx.module.name,
        summary: ctx.module.short,
        meta: `Mini modules: ${ctx.module.minis.length}`,
        buttonLabel: "Back to field",
        onOpen: () => this.goField(ctx.master.id, ctx.field.id)
      });

      const miniList = document.createElement("div");
      miniList.className = "mini-list";

      ctx.module.minis.forEach(mm => {
        const row = document.createElement("div");
        row.className = "mini-item";

        const left = document.createElement("div");
        left.className = "mini-name";
        left.textContent = mm.name;

        const right = document.createElement("div");
        right.className = "mini-body";
        right.textContent = mm.body;

        row.appendChild(left);
        row.appendChild(right);

        row.onclick = () =>
          this.goMini(ctx.master.id, ctx.field.id, ctx.module.id, mm.id);

        miniList.appendChild(row);
      });

      card.appendChild(miniList);
      grid.appendChild(card);
      view.appendChild(grid);
    } else if (this.state.level === "mini" && ctx.mini && ctx.module && ctx.field && ctx.master) {
      const grid = document.createElement("div");
      grid.className = "grid";

      const card = LucenComponents.createCard({
        title: ctx.mini.name,
        summary: ctx.mini.body,
        meta: `${ctx.master.name} • ${ctx.field.name} • ${ctx.module.name}`,
        buttonLabel: "Back to module",
        onOpen: () =>
          this.goModule(ctx.master.id, ctx.field.id, ctx.module.id)
      });

      grid.appendChild(card);
      view.appendChild(grid);
    }

    this.app.appendChild(view);
  }
};
