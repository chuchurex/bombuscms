#!/usr/bin/env node

/**
 * BombusCMS Setup Script
 *
 * Interactive setup that configures your site's name, colors, Sanity project,
 * and optionally translates routes to Spanish.
 *
 * Usage: node setup.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
        // Only use if this is the full route map, not individual entry
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

async function main() {
  console.log("\n  BombusCMS Setup\n");
  console.log("  This script configures your site. You can always\n  edit lib/config.ts and .env.local later.\n");

  // 1. Basic info
  const siteName = await ask("Site name", "My Site");
  const siteDescription = await ask("Site description", "A site powered by BombusCMS");
  const siteUrl = await ask("Site URL", "http://localhost:3000");

  // 2. Sanity
  const sanityProjectId = await ask("Sanity project ID (leave empty to skip)");
  const sanityDataset = await ask("Sanity dataset", "production");

  // 3. Formspree
  const formspreeId = await ask("Formspree form ID (leave empty to skip)");

  // 4. Colors
  console.log("\n  Colors (enter hex values, e.g. #00adef)\n");
  const primaryColor = await ask("Primary color", "#00adef");
  const primaryDarkColor = await ask("Secondary/dark color", "#0c0edf");

  // 5. Locale
  const locale = await ask("Locale (en/es)", "en");
  const useSpanishRoutes = locale === "es";

  // --- Apply changes ---

  console.log("\n  Applying configuration...\n");

  // Update .env.local
  const envContent = [
    `NEXT_PUBLIC_SANITY_PROJECT_ID=${sanityProjectId}`,
    `NEXT_PUBLIC_SANITY_DATASET=${sanityDataset}`,
    `NEXT_PUBLIC_SITE_URL=${siteUrl}`,
    formspreeId ? `NEXT_PUBLIC_FORMSPREE_ID=${formspreeId}` : "# NEXT_PUBLIC_FORMSPREE_ID=",
  ].join("\n") + "\n";
  fs.writeFileSync(path.join(__dirname, ".env.local"), envContent, "utf8");
  console.log("  - .env.local created");

  // Update package.json name
  const pkgPath = path.join(__dirname, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.name = siteName.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log("  - package.json updated");
  }

  // Update globals.css colors
  const cssPath = path.join(__dirname, "app", "globals.css");
  if (fs.existsSync(cssPath)) {
    // Compute light variants (10% opacity approximation)
    function hexToLightBg(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const lr = Math.round(r + (255 - r) * 0.9);
      const lg = Math.round(g + (255 - g) * 0.9);
      const lb = Math.round(b + (255 - b) * 0.9);
      return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
    }
    const primaryLight = hexToLightBg(primaryColor);
    const primaryDarkLight = hexToLightBg(primaryDarkColor);

    replaceInFile(cssPath, [
      ["--color-primary: #00adef", `--color-primary: ${primaryColor}`],
      ["--color-primary-dark: #0c0edf", `--color-primary-dark: ${primaryDarkColor}`],
      ["--color-primary-light: #e6f7fe", `--color-primary-light: ${primaryLight}`],
      ["--color-primary-dark-light: #e8e8fd", `--color-primary-dark-light: ${primaryDarkLight}`],
    ]);
    console.log("  - Colors updated in globals.css");
  }

  // Update lib/config.ts
  const configPath = path.join(__dirname, "lib", "config.ts");
  if (fs.existsSync(configPath)) {
    replaceInFile(configPath, [
      ['name: "My Site"', `name: "${siteName}"`],
      ['description: "A site powered by BombusCMS"', `description: "${siteDescription}"`],
      ['locale: "en"', `locale: "${locale}"`],
    ]);

    if (useSpanishRoutes) {
      replaceInFile(configPath, [
        ['{ href: "/about", label: "About" }', '{ href: "/quienes-somos", label: "Quiénes Somos" }'],
        ['{ href: "/posts", label: "Posts" }', '{ href: "/noticias", label: "Noticias" }'],
        ['{ href: "/publications", label: "Publications" }', '{ href: "/publicaciones", label: "Publicaciones" }'],
        ['{ href: "/events", label: "Events" }', '{ href: "/eventos", label: "Eventos" }'],
        ['{ href: "/contact", label: "Contact" }', '{ href: "/contacto", label: "Contacto" }'],
        ['{ href: "/", label: "Home" }', '{ href: "/", label: "Inicio" }'],
      ]);
    }

    console.log("  - lib/config.ts updated");
  }

  // Rename routes if Spanish
  if (useSpanishRoutes) {
    renameRoute("about", "quienes-somos");
    renameRoute("posts", "noticias");
    renameRoute("publications", "publicaciones");
    renameRoute("events", "eventos");
    renameRoute("contact", "contacto");

    // Update href references in all files
    const routeMap = {
      posts: "noticias",
      publications: "publicaciones",
      events: "eventos",
      about: "quienes-somos",
      contact: "contacto",
    };
    updateRouteReferences({ __all__: true, ...routeMap });

    // Also update individual file route strings
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

    // Update components
    const compDir = path.join(__dirname, "components");
    walkFiles(compDir, [".tsx", ".ts"], (filePath) => {
      replaceInFile(filePath, [
        ["Close menu", "Cerrar men\u00fa"],
        ["Menu", "Men\u00fa"],
        ["Message sent", "Mensaje enviado"],
        ["Thank you for reaching out. We'll get back to you soon.", "Gracias por contactarnos. Te responderemos pronto."],
        ["Send another message", "Enviar otro mensaje"],
        ["Name", "Nombre"],
        ["Your full name", "Tu nombre completo"],
        ["Email", "Correo electr\u00f3nico"],
        ["you@example.com", "tu@correo.com"],
        ["Subject", "Asunto"],
        ["Subject of your inquiry", "Asunto de tu consulta"],
        ["Message", "Mensaje"],
        ["Write your message here...", "Escribe tu mensaje aqu\u00ed..."],
        ["There was an error sending your message. Please try again.", "Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente."],
        ['Sending...', 'Enviando...'],
        ["Send message", "Enviar mensaje"],
      ]);
    });

    console.log("  - Routes renamed to Spanish");
  }

  // Update sanity.cli.ts if project ID provided
  if (sanityProjectId) {
    const cliPath = path.join(__dirname, "sanity.cli.ts");
    replaceInFile(cliPath, [
      ['process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "PLACEHOLDER"', `"${sanityProjectId}"`],
    ]);
    console.log("  - sanity.cli.ts updated");
  }

  console.log("\n  Setup complete!\n");
  console.log("  Next steps:");
  console.log("    1. npm install --legacy-peer-deps");
  console.log("    2. npm run dev");
  if (sanityProjectId) {
    console.log("    3. npx sanity deploy  (to deploy Sanity Studio)");
  }
  console.log("");

  // Self-delete
  const selfDelete = await ask("Delete this setup script? (y/n)", "y");
  if (selfDelete.toLowerCase() === "y") {
    fs.unlinkSync(__filename);
    console.log("  - setup.js deleted\n");
  }

  rl.close();
}

main().catch((err) => {
  console.error("Setup failed:", err);
  rl.close();
  process.exit(1);
});
