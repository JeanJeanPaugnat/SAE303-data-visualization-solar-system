import "./global.css";
import { Router } from "./lib/router.js";

import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";
import { systemSolar } from "./pages/systemSolar/page.js";

// Exemple d'utilisation avec authentification

const router = new Router("app");

router.addLayout("/", RootLayout);


router.addRoute("/", systemSolar);


router.addRoute("*", The404Page);

// Démarrer le routeur
router.start();
