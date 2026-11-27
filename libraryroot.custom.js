/**
 * Meridian · runs in the main Steam window and its menus.
 *
 * Navigation menus open on right-click, in both layouts. Steam opens the Store /
 * Library / Community / profile menus as soon as the pointer enters the item, so they
 * pop up while you only pass over them (and in the left rail they cover the items
 * below). Steam's "pointer entered" is kept from those items, and a right-click hands
 * Steam one, which opens the menu as hover would. Leaving the item closes it as
 * before, and a left click still opens the page.
 *
 * How React sees hover: onMouseEnter / onMouseLeave come from mouseout (the element
 * left, with relatedTarget = the element entered), or from mouseover only when the
 * pointer comes from outside React (another window). So:
 * - mouseover into an item is stopped;
 * - a mouseout towards an item is stopped and sent again aimed at the item's parent,
 *   so React still sees the leave of where the pointer was, but no enter of the item;
 * - a right-click sends a mouseout from the parent aimed at the item: an enter.
 * CSS :hover is unaffected.
 */
(function () {
    "use strict";

    const ITEM = ".SuperNavBar .SuperNavMenu";
    let resending = false;

    const itemOf = (node) => (node instanceof Element ? node.closest(ITEM) : null);

    function sendOut(type, from, to, like) {
        resending = true;
        try {
            const Ctor = type.startsWith("pointer") ? PointerEvent : MouseEvent;
            from.dispatchEvent(new Ctor(type, {
                bubbles: true,
                cancelable: true,
                composed: true,
                view: window,
                relatedTarget: to,
                clientX: like.clientX,
                clientY: like.clientY,
                screenX: like.screenX,
                screenY: like.screenY,
            }));
        } finally {
            resending = false;
        }
    }

    function blockEnter(event) {
        if (resending) return;
        if (itemOf(event.target)) event.stopPropagation();
    }

    function blockOutTowardsItem(event) {
        if (resending) return;
        const toItem = itemOf(event.relatedTarget);
        if (!toItem || itemOf(event.target) === toItem) return;
        event.stopPropagation();
        sendOut(event.type, event.target, toItem.parentElement, event);
    }

    function openOnRightClick(event) {
        const item = itemOf(event.target);
        if (!item) return;
        event.preventDefault();
        event.stopPropagation();
        sendOut("mouseout", item.parentElement, item, event);
    }

    for (const type of ["mouseover", "mouseenter", "pointerover", "pointerenter"]) {
        document.addEventListener(type, blockEnter, true);
    }
    for (const type of ["mouseout", "pointerout"]) {
        document.addEventListener(type, blockOutTowardsItem, true);
    }
    document.addEventListener("contextmenu", openOnRightClick, true);
})();

/**
 * Meridian · pieces of the mockup Steam has no element for.
 *
 * - Library home and Downloads get a page heading with summary badges.
 * - The navigation's profile item shows your avatar (CSS reads --mr-avatar).
 * - The navigation gets a Downloads item with a queue badge, in both layouts. It is the
 *   highlighted item on the Downloads page (Steam itself keeps "Library" selected there).
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
    // A summary is a list of facts; each one is shown as its own badge.
    function librarySummary() {
        try {
            const store = shared().collectionStore;
            if (!store) return [];
            const games = store.GetCollection("type-games");
            const total = games ? games.allApps.length : 0;
            const installed = store.localGamesCollection ? store.localGamesCollection.allApps.length : 0;
            if (!total) return [];
            return [{ text: `${total} games` }, { text: `${installed} installed` }];
        } catch (e) {
            return [];
        }
    }

    // Page title with summary badges, inserted before `before` inside `parent`.
    // React only moves its own nodes, so an extra node at the front stays put.
    function ensurePageHead(parent, before, title, facts) {
        let head = parent.querySelector(":scope > .mr-page-head");
        if (!head) {
            head = document.createElement("header");
            head.className = "mr-page-head";
            head.innerHTML = "<h1></h1><p></p>";
            head.querySelector("h1").textContent = title;
            parent.insertBefore(head, before);
        }
        // Rebuild only when the facts change: this runs on every DOM mutation.
        const p = head.querySelector("p");
        const key = facts.map((fact) => (fact.live ? "*" : "") + fact.text).join("|");
        if (p.dataset.mrKey === key) return;
        p.dataset.mrKey = key;
        p.textContent = "";
        for (const fact of facts) {
            const badge = document.createElement("span");
            badge.className = fact.live ? "mr-badge mr-live" : "mr-badge";
            badge.textContent = fact.text;
            p.appendChild(badge);
        }
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

    /* ---- Downloads item in the navigation (sidebar or top row) ---- */

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

    // Badges beside the Downloads heading, e.g. "Downloading", "2 in queue", "1 scheduled".
    function downloadsPageSummary() {
        try {
            const store = shared().downloadsStore;
            const { active } = downloadSummary();
            const queued = (store.QueuedTransfers || []).length;
            const scheduled = (store.ScheduledTransfers || []).length;
            const facts = [];
            if (active) facts.push({ text: "Downloading", live: true });
            if (queued) facts.push({ text: `${queued} in queue` });
            if (scheduled) facts.push({ text: `${scheduled} scheduled` });
            return facts.length ? facts : [{ text: "Nothing in the queue" }];
        } catch (e) {
            return [];
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
            // Appended after Steam's own items; the layout's CSS `order` places it after Community.
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

    // Lets CSS move the navigation highlight off "Library" while Downloads is open.
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
