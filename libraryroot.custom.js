/**
 * Meridian · runs in the main Steam window and its menus.
 *
 * Left rail layout: Steam opens the Store / Library / Community menus on hover,
 * right under the item. In a vertical rail that menu would cover the items
 * below it, so hover-open is switched off while the rail is active.
 * Clicking an item still opens its page. With "Top tabs" nothing changes.
 */
(function () {
    "use strict";

    const HOVER_EVENTS = ["mouseover", "mouseenter", "pointerover", "pointerenter"];

    function railActive() {
        const frame = document.querySelector(".OuterFrame");
        return !!frame && getComputedStyle(frame).display === "grid";
    }

    function blockHover(event) {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (!target.closest(".SuperNavBar .SuperNavMenu")) return;
        if (!railActive()) return;
        // Stop Steam's handler before it sees the event. CSS :hover is unaffected.
        event.stopPropagation();
    }

    for (const type of HOVER_EVENTS) {
        document.addEventListener(type, blockHover, true);
    }
})();

/**
 * Meridian · pieces of the mockup Steam has no element for.
 *
 * - Library home and Downloads get a page heading with a one-line summary.
 * - The rail's profile item shows your avatar (CSS reads --mr-avatar).
 * - The rail gets a Downloads item with a queue badge. It is the highlighted item
 *   on the Downloads page (Steam itself keeps "Library" selected there).
 * - Ctrl+K focuses library search; the box shows a search icon and the shortcut.
 *
 * Steam re-renders often, so everything is re-applied on DOM changes, at most once a frame.
 * Steam's stores live in the shared JS context, reached through window.opener.
 */
(function () {
    "use strict";

    const shared = () => window.opener || window;

    function openSteamURL(url) {
        try {
            shared().SteamClient.URL.ExecuteSteamURL(url);
        } catch (e) {
            /* Steam API missing: leave the click to do nothing rather than throw */
        }
    }

    function mainHistory() {
        try {
            return shared().SteamUIStore.WindowStore.MainWindowInstance.m_history || null;
        } catch (e) {
            return null;
        }
    }

    // Counts come from Steam's collection store in the shared JS context.
    function librarySummary() {
        try {
            const store = shared().collectionStore;
            if (!store) return "";
            const games = store.GetCollection("type-games");
            const total = games ? games.allApps.length : 0;
            const installed = store.localGamesCollection ? store.localGamesCollection.allApps.length : 0;
            if (!total) return "";
            return `${total} games · ${installed} installed`;
        } catch (e) {
            return "";
        }
    }

    // Page title with a one-line summary, inserted before `before` inside `parent`.
    // React only moves its own nodes, so an extra node at the front stays put.
    function ensurePageHead(parent, before, title, text) {
        let head = parent.querySelector(":scope > .mr-page-head");
        if (!head) {
            head = document.createElement("header");
            head.className = "mr-page-head";
            head.innerHTML = "<h1></h1><p></p>";
            head.querySelector("h1").textContent = title;
            parent.insertBefore(head, before);
        }
        const p = head.querySelector("p");
        if (p.textContent !== text) p.textContent = text;
    }

    function ensureLibraryHead() {
        const home = document.querySelector(".LibraryHome");
        if (!home || !home.parentElement) return;
        // First child, ahead of What's New.
        ensurePageHead(home.parentElement, home.parentElement.firstChild, "Library", librarySummary());
    }

    function ensureDownloadsHead() {
        const page = document.querySelector(".DownloadsPage");
        const top = page && page.querySelector(":scope > .TopSection");
        if (!top) return;
        ensurePageHead(page, top, "Downloads", downloadsPageSummary());
    }

    function syncAvatar() {
        const img = document.querySelector(".TitleBarControls .AccountMenu img, .TitleBarControls img.avatar");
        const root = document.documentElement;
        if (!img || !img.src) return;
        if (root.dataset.mrAvatar === img.src) return;
        root.dataset.mrAvatar = img.src;
        root.style.setProperty("--mr-avatar", `url("${img.src}")`);
    }

    /* ---- Downloads item in the rail ---- */

    // Unfinished transfers: running, queued and scheduled updates.
    function downloadSummary() {
        try {
            const items = (shared().downloadsStore.AllTransfers || []).filter((t) => !t.completed);
            return {
                count: items.length,
                active: items.some((t) => t.active && !t.paused),
            };
        } catch (e) {
            return { count: 0, active: false };
        }
    }

    // Subtitle under the Downloads heading, e.g. "Downloading · 2 in queue · 1 scheduled".
    function downloadsPageSummary() {
        try {
            const store = shared().downloadsStore;
            const { active } = downloadSummary();
            const queued = (store.QueuedTransfers || []).length;
            const scheduled = (store.ScheduledTransfers || []).length;
            const parts = [];
            if (active) parts.push("Downloading");
            if (queued) parts.push(`${queued} in queue`);
            if (scheduled) parts.push(`${scheduled} scheduled`);
            return parts.length ? parts.join(" · ") : "Nothing in the queue";
        } catch (e) {
            return "";
        }
    }

    function ensureDownloadsItem() {
        const nav = document.querySelector(".SuperNavBar .SuperNav");
        if (!nav) return;
        let item = nav.querySelector(":scope > .mr-rail-item");
        if (!item) {
            item = document.createElement("div");
            item.className = "mr-rail-item";
            item.setAttribute("role", "link");
            item.tabIndex = 0;
            item.innerHTML = '<span class="mr-rail-label">Downloads</span><span class="mr-rail-badge"></span>';
            const go = () => openSteamURL("steam://open/downloads");
            item.addEventListener("click", go);
            item.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    go();
                }
            });
            // Appended after Steam's own items; CSS `order` places it after Community.
            nav.appendChild(item);
        }

        const { count, active } = downloadSummary();
        const badge = item.querySelector(".mr-rail-badge");
        const text = count ? String(count) : "";
        if (badge.textContent !== text) badge.textContent = text;
        item.classList.toggle("mr-active", active);
        const label = count ? `Downloads, ${count} in queue` : "Downloads";
        if (item.getAttribute("aria-label") !== label) item.setAttribute("aria-label", label);
    }

    // Lets CSS move the rail highlight off "Library" while Downloads is open.
    function syncRoute() {
        const history = mainHistory();
        const path = history && history.location ? history.location.pathname : "";
        const route = path.startsWith("/library/downloads") ? "downloads" : "";
        const root = document.documentElement;
        if ((root.dataset.mrRoute || "") === route) return;
        if (route) root.dataset.mrRoute = route;
        else delete root.dataset.mrRoute;
        const item = document.querySelector(".SuperNav > .mr-rail-item");
        if (item) item.toggleAttribute("aria-current", !!route);
    }

    /* ---- Library search: Ctrl+K and its hint ---- */

    function searchInput() {
        return document.querySelector(".LeftListSizableContainer .SearchInput input");
    }

    function ensureSearchHint() {
        const box = document.querySelector(".LeftListSizableContainer .SearchInput");
        if (!box || box.querySelector(":scope > .mr-kbd")) return;
        const kbd = document.createElement("kbd");
        kbd.className = "mr-kbd";
        kbd.setAttribute("aria-hidden", "true");
        kbd.textContent = "Ctrl K";
        box.appendChild(kbd);
    }

    function focusSearch() {
        const input = searchInput();
        if (input) {
            input.focus();
            input.select();
            return;
        }
        // Pages without the game list (Downloads, settings pages): open the library first.
        openSteamURL("steam://open/library");
        const started = performance.now();
        (function wait() {
            const found = searchInput();
            if (found) {
                found.focus();
                found.select();
            } else if (performance.now() - started < 2000) {
                requestAnimationFrame(wait);
            }
        })();
    }

    function onKeyDown(event) {
        if (!document.querySelector(".OuterFrame")) return;
        if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
        if (event.key.toLowerCase() !== "k") return;
        event.preventDefault();
        event.stopPropagation();
        focusSearch();
    }

    /* ---- Update loop ---- */

    let queued = false;
    function update() {
        queued = false;
        if (!document.querySelector(".OuterFrame")) return;
        ensureLibraryHead();
        ensureDownloadsHead();
        syncAvatar();
        ensureDownloadsItem();
        syncRoute();
        ensureSearchHint();
    }

    function schedule() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
    }

    let historyHooked = false;
    function hookHistory() {
        if (historyHooked) return;
        const history = mainHistory();
        if (!history || typeof history.listen !== "function") return;
        history.listen(schedule);
        historyHooked = true;
    }

    function start() {
        if (!document.body) return;
        new MutationObserver(() => {
            hookHistory();
            schedule();
        }).observe(document.body, { childList: true, subtree: true });
        document.addEventListener("keydown", onKeyDown, true);
        // Download progress can change without this window re-rendering.
        setInterval(() => {
            if (document.visibilityState === "visible") schedule();
        }, 2000);
        hookHistory();
        schedule();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
