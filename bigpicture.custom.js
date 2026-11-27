/**
 * Meridian · runs in the Big Picture window.
 *
 * The Steam menu (left) and the Quick Access menu (right) are separate windows, and
 * Millennium does not load the theme's stylesheets into them. This copies the
 * stylesheets Big Picture itself was given (accent + bigpicture.custom.css) into
 * those two windows, so they match the rest of the theme.
 */
(function () {
    "use strict";

    const THEME = "/themes/Meridian/";
    const SIDE_WINDOW = /^(MainMenu|QuickAccess)_/;

    // Steam keeps a reference to every Big Picture window with its controller input sources.
    function sideWindows() {
        try {
            const sources = (window.opener || window).SteamUIStore.m_GamepadNavigationManager.m_rgGamepadInputSources || [];
            const found = new Set();
            for (const source of sources) {
                const win = source && source.m_targetWindow;
                if (win && win !== window && win.document && SIDE_WINDOW.test(win.name)) found.add(win);
            }
            return [...found];
        } catch (e) {
            return [];
        }
    }

    function sync() {
        const hrefs = [...document.querySelectorAll(`link[href*="${THEME}"]`)].map((link) => link.href);
        if (!hrefs.length) return;
        const wanted = hrefs.join("\n");
        for (const win of sideWindows()) {
            try {
                const doc = win.document;
                if (!doc.head) continue;
                // Millennium may start styling these windows itself one day; then leave them alone.
                if (doc.querySelector(`link[href*="${THEME}"]:not([data-mr-copy])`)) continue;
                const copies = [...doc.querySelectorAll("link[data-mr-copy]")];
                if (copies.map((link) => link.href).join("\n") === wanted) continue;
                for (const link of copies) link.remove();
                for (const href of hrefs) {
                    const link = doc.createElement("link");
                    link.rel = "stylesheet";
                    link.href = href;
                    link.dataset.mrCopy = "";
                    doc.head.appendChild(link);
                }
            } catch (e) {
                /* window is closing or not ready: the next pass picks it up */
            }
        }
    }

    // The menu windows can be created after this one, and are re-created with it.
    sync();
    setInterval(sync, 3000);
})();
