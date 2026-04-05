#!/usr/bin/env node

/**
 * BombusCMS Setup Script
 *
 * Interactive setup that configures your site, creates a Sanity project,
 * imports demo content, and optionally translates routes to Spanish.
 *
 * Usage: node setup.js
 * Prerequisites: Node.js 18+, Sanity account (free at sanity.io)
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync, spawnSync } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// --- Utility functions ---

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    const suffix = defaultValue ? ` (${defaultValue})` : "";
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  for (const [search, replace] of replacements) {
    content = content.replaceAll(search, replace);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

function renameRoute(oldDir, newDir) {
  const oldPath = path.join(__dirname, "app", oldDir);
  const newPath = path.join(__dirname, "app", newDir);
  if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
  }
}

function walkFiles(dir, extensions, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, extensions, callback);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      callback(fullPath);
    }
  }
}

function updateRouteReferences(routeMap) {
  const extensions = [".ts", ".tsx"];
  const dirs = ["app", "components", "lib"];

  for (const dir of dirs) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) continue;
    walkFiles(dirPath, extensions, (filePath) => {
      let content = fs.readFileSync(filePath, "utf8");
      let changed = false;
      for (const [oldRoute, newRoute] of Object.entries(routeMap)) {
        const patterns = [
          [`href="/posts`, `href="/${newRoute.posts || "posts"}`],
          [`href="/publications`, `href="/${newRoute.publications || "publications"}`],
          [`href="/events`, `href="/${newRoute.events || "events"}`],
          [`href="/about`, `href="/${newRoute.about || "about"}`],
          [`href="/contact`, `href="/${newRoute.contact || "contact"}`],
        ];
        if (oldRoute === "__all__") {
          for (const [search, replace] of patterns) {
            if (content.includes(search) && search !== replace) {
              content = content.replaceAll(search, replace);
              changed = true;
            }
          }
        }
      }
      if (changed) {
        fs.writeFileSync(filePath, content, "utf8");
      }
    });
  }
}

function hexToLightBg(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * 0.9);
  const lg = Math.round(g + (255 - g) * 0.9);
  const lb = Math.round(b + (255 - b) * 0.9);
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

function run(cmd, options = {}) {
  const { silent = false } = options;
  try {
    if (silent) {
      return execSync(cmd, { encoding: "utf8", stdio: "pipe" }).trim();
    }
    const result = spawnSync(cmd, { shell: true, stdio: "inherit" });
    return result.status === 0;
  } catch {
    return null;
  }
}

function isoDate(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
}

// --- Main ---

async function main() {
  console.log("\n  BombusCMS Setup\n");
  console.log("  This script configures your site, sets up Sanity CMS,");
  console.log("  and imports demo content so you have a working site");
  console.log("  from the start. You can always edit lib/config.ts");
  console.log("  and .env.local later.\n");

  // ========== Phase 0: Sanity auth check ==========

  console.log("  Checking Sanity CLI (first run may download packages)...\n");
  const authResult = run("npx sanity projects list 2>/dev/null", { silent: true });
  if (authResult === null) {
    console.log("  Sanity CLI requires authentication.\n");
    run("npx sanity login");
    const recheck = run("npx sanity projects list 2>/dev/null", { silent: true });
    if (recheck === null) {
      console.log("\n  Could not verify Sanity authentication.");
      console.log("  Continuing without Sanity setup. Run 'npx sanity login'");
      console.log("  and restart setup to enable Sanity features.\n");
    } else {
      console.log("\n  Authenticated.\n");
    }
  } else {
    console.log("  Sanity CLI ready.\n");
  }

  // ========== Phase 1: Questions ==========

  const siteName = await ask("Site name", "My Site");
  const siteDescription = await ask(
    "Site description",
    "A site powered by BombusCMS",
  );
  const organization = await ask("Organization name", siteName);
  const contactEmail = await ask("Contact email", "hello@example.com");
  const siteUrl = await ask("Site URL", "http://localhost:3000");

  console.log("");
  let sanityProjectId = await ask(
    "Sanity project ID (leave empty to create new)",
  );
  const sanityDataset = await ask("Sanity dataset", "production");
  const formspreeId = await ask("Formspree form ID (leave empty to skip)");

  console.log("\n  Colors (enter hex values, e.g. #00adef)\n");
  const primaryColor = await ask("Primary color", "#00adef");
  const primaryDarkColor = await ask("Secondary/dark color", "#0c0edf");

  console.log("");
  const locale = await ask("Locale (en/es)", "en");
  const useSpanishRoutes = locale === "es";

  // ========== Phase 2: Create Sanity project if needed ==========

  if (!sanityProjectId) {
    const createProject = await ask(
      "\n  Create a new Sanity project? (y/n)",
      "y",
    );
    if (createProject.toLowerCase() === "y") {
      console.log("\n  Creating Sanity project...\n");
      const safeName = siteName.replace(/"/g, '\\"');
      const output = run(`npx sanity projects create --name "${safeName}"`, {
        silent: true,
      });
      if (output) {
        const match = output.match(/([a-z0-9]{8,})/);
        if (match) {
          sanityProjectId = match[1];
          console.log(`  Project created with ID: ${sanityProjectId}\n`);
        }
      }
      if (!sanityProjectId) {
        console.log(
          "  Check https://www.sanity.io/manage for your project ID.\n",
        );
        sanityProjectId = await ask("  Enter the project ID");
      }
    }
  }

  // ========== Phase 3: Apply configuration ==========

  console.log("\n  Applying configuration...\n");

  // .env.local
  const envContent =
    [
      `NEXT_PUBLIC_SANITY_PROJECT_ID=${sanityProjectId}`,
      `NEXT_PUBLIC_SANITY_DATASET=${sanityDataset}`,
      `NEXT_PUBLIC_SITE_URL=${siteUrl}`,
      formspreeId
        ? `NEXT_PUBLIC_FORMSPREE_ID=${formspreeId}`
        : "# NEXT_PUBLIC_FORMSPREE_ID=",
    ].join("\n") + "\n";
  fs.writeFileSync(path.join(__dirname, ".env.local"), envContent, "utf8");
  console.log("  - .env.local created");

  // package.json name
  const pkgPath = path.join(__dirname, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.name = siteName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log("  - package.json updated");
  }

  // globals.css colors
  const cssPath = path.join(__dirname, "app", "globals.css");
  if (fs.existsSync(cssPath)) {
    const primaryLight = hexToLightBg(primaryColor);
    const primaryDarkLight = hexToLightBg(primaryDarkColor);
    replaceInFile(cssPath, [
      ["--color-primary: #00adef", `--color-primary: ${primaryColor}`],
      ["--color-primary-dark: #0c0edf", `--color-primary-dark: ${primaryDarkColor}`],
      ["--color-primary-light: #e6f7fe", `--color-primary-light: ${primaryLight}`],
      [
        "--color-primary-dark-light: #e8e8fd",
        `--color-primary-dark-light: ${primaryDarkLight}`,
      ],
    ]);
    console.log("  - Colors updated in globals.css");
  }

  // lib/config.ts - general personalization
  const configPath = path.join(__dirname, "lib", "config.ts");
  if (fs.existsSync(configPath)) {
    replaceInFile(configPath, [
      ['name: "My Site"', `name: "${siteName}"`],
      [
        'description: "A site powered by BombusCMS"',
        `description: "${siteDescription}"`,
      ],
      ['locale: "en"', `locale: "${locale}"`],
      [
        'description: "Your site description here."',
        `description: "${siteDescription}"`,
      ],
      ['legal: "Your Organization"', `legal: "${organization}"`],
      ['institution: "Your Institution"', `institution: "${organization}"`],
      ['organization: "Your Organization"', `organization: "${organization}"`],
      ['email: "hello@example.com"', `email: "${contactEmail}"`],
    ]);

    // Spanish locale: translate nav labels, footer section titles
    if (useSpanishRoutes) {
      replaceInFile(configPath, [
        [
          '{ href: "/about", label: "About" }',
          '{ href: "/quienes-somos", label: "Qui\u00e9nes Somos" }',
        ],
        [
          '{ href: "/posts", label: "Posts" }',
          '{ href: "/noticias", label: "Noticias" }',
        ],
        [
          '{ href: "/publications", label: "Publications" }',
          '{ href: "/publicaciones", label: "Publicaciones" }',
        ],
        [
          '{ href: "/events", label: "Events" }',
          '{ href: "/eventos", label: "Eventos" }',
        ],
        [
          '{ href: "/contact", label: "Contact" }',
          '{ href: "/contacto", label: "Contacto" }',
        ],
        ['{ href: "/", label: "Home" }', '{ href: "/", label: "Inicio" }'],
        ['title: "SITE"', 'title: "SITIO"'],
        ['title: "CONTENT"', 'title: "CONTENIDO"'],
        ['title: "LINKS"', 'title: "ENLACES"'],
      ]);
    }

    console.log("  - lib/config.ts updated");
  }

  // sanity.cli.ts
  if (sanityProjectId) {
    const cliPath = path.join(__dirname, "sanity.cli.ts");
    replaceInFile(cliPath, [
      [
        'process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "PLACEHOLDER"',
        `"${sanityProjectId}"`,
      ],
    ]);
    console.log("  - sanity.cli.ts updated");
  }

  // Spanish route renaming
  if (useSpanishRoutes) {
    renameRoute("about", "quienes-somos");
    renameRoute("posts", "noticias");
    renameRoute("publications", "publicaciones");
    renameRoute("events", "eventos");
    renameRoute("contact", "contacto");

    const routeMap = {
      posts: "noticias",
      publications: "publicaciones",
      events: "eventos",
      about: "quienes-somos",
      contact: "contacto",
    };
    updateRouteReferences({ __all__: true, ...routeMap });

    // Translate UI strings in app pages
    const appDir = path.join(__dirname, "app");
    walkFiles(appDir, [".tsx", ".ts"], (filePath) => {
      replaceInFile(filePath, [
        ['href="/posts"', 'href="/noticias"'],
        ['href="/posts/', 'href="/noticias/'],
        ['href="/publications"', 'href="/publicaciones"'],
        ['href="/publications/', 'href="/publicaciones/'],
        ['href="/events"', 'href="/eventos"'],
        ['href="/events/', 'href="/eventos/'],
        ['href="/about"', 'href="/quienes-somos"'],
        ['href="/contact"', 'href="/contacto"'],
        ["Back to posts", "Volver a noticias"],
        ["View all posts", "Ver todas las noticias"],
        ["Back to publications", "Volver a publicaciones"],
        ["View all publications", "Ver todas las publicaciones"],
        ["Back to events", "Volver a eventos"],
        ["View all events", "Ver todos los eventos"],
        ["Coming soon", "Pr\u00f3ximamente"],
        ["Past event", "Evento finalizado"],
        ["Upcoming Events", "Pr\u00f3ximos Eventos"],
        ["Past Events", "Eventos Anteriores"],
      ]);
    });

    // Translate UI strings in components
    const compDir = path.join(__dirname, "components");
    walkFiles(compDir, [".tsx", ".ts"], (filePath) => {
      replaceInFile(filePath, [
        ["Close menu", "Cerrar men\u00fa"],
        ["Menu", "Men\u00fa"],
        ["Message sent", "Mensaje enviado"],
        [
          "Thank you for reaching out. We'll get back to you soon.",
          "Gracias por contactarnos. Te responderemos pronto.",
        ],
        ["Send another message", "Enviar otro mensaje"],
        ["Name", "Nombre"],
        ["Your full name", "Tu nombre completo"],
        ["Email", "Correo electr\u00f3nico"],
        ["you@example.com", "tu@correo.com"],
        ["Subject", "Asunto"],
        ["Subject of your inquiry", "Asunto de tu consulta"],
        ["Message", "Mensaje"],
        ["Write your message here...", "Escribe tu mensaje aqu\u00ed..."],
        [
          "There was an error sending your message. Please try again.",
          "Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.",
        ],
        ["Sending...", "Enviando..."],
        ["Send message", "Enviar mensaje"],
      ]);
    });

    console.log("  - Routes renamed to Spanish");
  }

  // ========== Phase 4: Sanity operations ==========

  if (sanityProjectId) {
    console.log("\n  Configuring Sanity...\n");

    // CORS origins
    run(
      `npx sanity cors add http://localhost:3000 --project ${sanityProjectId} --no-credentials`,
      { silent: true },
    );
    console.log("  - CORS: http://localhost:3000");

    if (siteUrl && !siteUrl.includes("localhost")) {
      run(
        `npx sanity cors add ${siteUrl} --project ${sanityProjectId} --no-credentials`,
        { silent: true },
      );
      console.log(`  - CORS: ${siteUrl}`);
    }

    // Demo content import
    const ndjsonPath = path.join(__dirname, "demo-content.ndjson");
    if (fs.existsSync(ndjsonPath)) {
      const importContent = await ask(
        "\n  Import demo content? (y/n)",
        "y",
      );
      if (importContent.toLowerCase() === "y") {
        // Check for existing data
        const existingData = run(
          `npx sanity documents query '*[0]' --project ${sanityProjectId} --dataset ${sanityDataset} 2>/dev/null`,
          { silent: true },
        );
        let shouldImport = true;
        if (existingData && existingData !== "null" && existingData !== "[]") {
          const overwrite = await ask(
            "  Dataset has existing data. Continue import? (y/n)",
            "n",
          );
          shouldImport = overwrite.toLowerCase() === "y";
        }

        if (shouldImport) {
          console.log("\n  Importing demo content...\n");

          let content = fs.readFileSync(ndjsonPath, "utf8");

          // Replace placeholders with actual values
          const placeholders = {
            "{{SITE_NAME}}": siteName,
            "{{SITE_DESCRIPTION}}": siteDescription,
            "{{CONTACT_EMAIL}}": contactEmail,
            "{{ORGANIZATION}}": organization,
            "{{PAST_7D}}": isoDate(-7),
            "{{PAST_14D}}": isoDate(-14),
            "{{PAST_30D}}": isoDate(-30),
            "{{PAST_30D_PLUS1}}": isoDate(-29),
            "{{FUTURE_30D}}": isoDate(30),
            "{{FUTURE_30D_PLUS1}}": isoDate(31),
            "{{FUTURE_60D}}": isoDate(60),
          };
          for (const [placeholder, value] of Object.entries(placeholders)) {
            content = content.replaceAll(placeholder, value);
          }

          // Translate category titles/slugs for ES locale
          if (useSpanishRoutes) {
            content = content.replaceAll(
              '"title":"Research"',
              '"title":"Investigaci\u00f3n"',
            );
            content = content.replaceAll(
              '"current":"research"',
              '"current":"investigacion"',
            );
            content = content.replaceAll(
              '"title":"News"',
              '"title":"Noticias"',
            );
            content = content.replaceAll(
              '"current":"news"',
              '"current":"noticias"',
            );
            content = content.replaceAll(
              '"title":"Announcements"',
              '"title":"Anuncios"',
            );
            content = content.replaceAll(
              '"current":"announcements"',
              '"current":"anuncios"',
            );
          }

          // Write temp file, import, clean up
          const tmpPath = path.join(__dirname, ".demo-content-tmp.ndjson");
          fs.writeFileSync(tmpPath, content, "utf8");
          run(
            `npx sanity dataset import "${tmpPath}" ${sanityDataset} --project ${sanityProjectId} --replace`,
          );
          fs.unlinkSync(tmpPath);
          console.log("  - Demo content imported");
        }
      }
    }

    // Deploy Studio
    const deployStudio = await ask("\n  Deploy Sanity Studio? (y/n)", "y");
    if (deployStudio.toLowerCase() === "y") {
      console.log(
        "\n  Deploying Studio (you will choose a hostname)...\n",
      );
      run("npx sanity deploy");
      console.log("");
    }
  }

  // ========== Phase 5: Finalization ==========

  console.log("\n  Setup complete!\n");
  console.log("  Next steps:");
  console.log("    1. npm install --legacy-peer-deps");
  console.log("    2. npm run dev");
  if (sanityProjectId) {
    console.log("    3. Open http://localhost:3000 to see your site");
  }
  console.log("");

  // Clean up
  const selfDelete = await ask("Delete setup files? (y/n)", "y");
  if (selfDelete.toLowerCase() === "y") {
    const ndjsonPath = path.join(__dirname, "demo-content.ndjson");
    if (fs.existsSync(ndjsonPath)) {
      fs.unlinkSync(ndjsonPath);
    }
    fs.unlinkSync(__filename);
    console.log("  - Setup files deleted\n");
  }

  rl.close();
}

main().catch((err) => {
  console.error("Setup failed:", err);
  rl.close();
  process.exit(1);
});
