# Meridian

A calm, modern dark theme for the Steam desktop client, made for [Millennium](https://github.com/SteamClientHomebrew/Millennium).

It makes Steam look and behave like a modern web app: neutral dark surfaces, hairline borders, one accent color and a clearer layout. Library, Store, Community, Downloads and your profile become one set of navigation items, in a left sidebar or in a row across the top. The page sits beside or under them as a lighter panel, game pages are built from cards, and the menus and dropdowns match.

## Design

The layout follows the [Meridian design mockup](https://claude.ai/artifact/8TiVdmBUq3HVG4pC4rLeNs), which has screens for the Library, Game page, Store, Downloads and Friends window.

The look comes from [Tailwind CSS v4](https://tailwindcss.com)'s default theme: its zinc greys and 400-step accent colors in OKLCH, its corner radius scale, translucent white borders, soft focus rings, and Geist with Geist Mono for type. Tailwind itself is not used or needed. Steam's markup can't take utility classes, so the theme keeps those values as CSS variables in `tokens.css`.

## What it covers

| Area | What changes |
| --- | --- |
| **Window** | The title bar and the navigation share one dark ground, and the page is a lighter panel. The navigation items are Library, Store, Community, Downloads and your profile with your avatar. Each has an icon, and the page you are on is filled in. Downloads shows how many games are queued and lights up while you are on the Downloads page. With **Left rail** the items are stacked in a sidebar, with Back and Forward beside your profile, and Add a Game, Friends & Chat and the download progress card at the bottom. With **Top tabs** they sit in a row under the title bar, the game list becomes the sidebar in the Library, and the page beside it gets the rounded corner. |
| **Library** | A "Library" heading with badges for your game and install counts. Press **Ctrl+K** anywhere in the main window to jump to library search. Flat game list with a clear selected row, and Home and the collections button drawn like the navigation items. Covers have an accent ring on hover and a matching preview card, recent games are cards with a Play button, and What's New items are cards. |
| **Game page** | The full banner art in a rounded card, a Play bar card that turns into a frosted header as you scroll, Store Page / Community Hub / Guides as a tab row, and each section as a card. News posts in the activity feed and the opened post are cards too. |
| **Downloads** | A "Downloads" heading with badges for the queue, the speed graph in a card, sentence-case section titles, and each queued game as a card with outlined buttons. |
| **Menus and dropdowns** | Compact rounded panels for the Steam/View/Games menus, right-click menus, Sort By and Settings pickers. They ease in when they open. |
| **Dialogs and buttons** | The main action in a dialog is the one filled accent button, everything else is grey. Text fields show a soft accent halo when focused. |
| **Friends and chat** | Flat friends list, profile header, search box and rounded group rows. |
| **Store and Community** | Flat background, a rounded featured carousel, underlined tabs, discounts as green badges and tags as outlined badges. |
| **Big Picture** | Steam's grey and accent colors remapped to the theme's, with flat accent Play buttons. |

## Requirements

- Steam for Windows
- [Millennium](https://github.com/SteamClientHomebrew/Millennium)

## Install

1. Download or clone this repository into Steam's Millennium themes folder, keeping the folder name `Meridian`:

   ```ps1
   cd "C:\Program Files (x86)\Steam\millennium\themes"
   git clone https://github.com/Sampong-Starluck/Meridian
   ```

2. Open Steam, go to the **Themes** tab in Millennium's settings, and choose **Meridian**.
3. Restart Steam when asked. The Store and Community styling only loads after a restart.

## Options

Change these in Millennium's theme settings for Meridian.

| Option | Choices | Default |
| --- | --- | --- |
| **Navigation** | **Left rail**: the navigation in a sidebar.<br>**Top tabs**: the same items in a row under the title bar, with Steam's hover menus. | Left rail |
| **Accent color** | Blue (Tailwind `blue-400`), Mint (`emerald-400`), Amber (`amber-400`), Violet (`violet-400`) | Blue |

The accent color is used for Play buttons, progress bars, focus rings and highlights.

## Files

| File | Styles |
| --- | --- |
| `tokens.css` | Every color, corner radius, shadow and font, as CSS variables. All the stylesheets below import it |
| `libraryroot.custom.css` | The main window, the navigation items, library, game pages, menus, dialogs and notifications |
| `layouts/rail.css` | Where the navigation goes in the left sidebar layout (only when **Navigation** is **Left rail**) |
| `layouts/tabs.css` | Where the navigation goes in the top row layout, and the game list as a sidebar (only when **Navigation** is **Top tabs**) |
| `libraryroot.custom.js` | Adds the Library and Downloads headings, your avatar and the Downloads item in the navigation, and the Ctrl+K search shortcut. In the sidebar layout, stops Store / Library / Community opening a menu on hover |
| `friends.custom.css` | Friends list and chat windows |
| `webkit.css` | Store and Community web pages |
| `bigpicture.custom.css` | Big Picture mode, Quick Access and the Steam menu |
| `accents/*.css` | One file per accent color |

To change the look, edit `tokens.css`. Each variable has a comment naming the Tailwind utility it stands in for, for example `--mr-radius-lg` is `rounded-lg` and `--mr-line` is `border-white/10`.

## Notes

- **Steam updates:** Meridian targets Steam's readable class names (for example `TopBar` or `PlayBar`), not the auto-generated ones, so it usually survives Steam updates. If something looks off after an update, please open an issue.
- **Store header:** Steam's newer Store header uses auto-generated class names that change often, so Meridian leaves it as is.
- **Reduced motion:** with reduced motion turned on in Windows, the theme switches off its transitions.

## Limitations

- **JavaScript must be on.** The Library and Downloads headings, your avatar in the navigation, the navigation's Downloads item and Ctrl+K come from `libraryroot.custom.js`. With JavaScript turned off in Millennium, the theme still styles everything else.
- **English only.** The text the theme adds ("Library", "Downloads", "16 games", "6 installed", "2 in queue", "Ctrl K") is in English whatever language Steam uses.
- **Steam internals.** Game counts, the download badge and the Downloads highlight read Steam's internal stores (`collectionStore`, `downloadsStore`, `SteamUIStore`). If a Steam update renames them, those pieces disappear without an error, and the rest of the theme keeps working.
- **Ctrl+K needs the main window focused.** It doesn't work while you're clicked into a Store or Community page, because those pages are separate web views.
- **Badge delay.** The Downloads badge refreshes every 2 seconds, so it can lag slightly behind Steam.
- **Sidebar only.** The Downloads item and its highlight appear only with **Navigation** set to **Left rail**.
- **Not built yet.** From the mockup: collection filter chips, the docked friends panel, and free disk space next to the counts. Steam has no element for them, and building them would mean hooking into Steam's filtering and window code.
- **Idle download card.** At the bottom of the sidebar, the download card puts its icon on its own line when nothing is downloading.

## License

[MIT](LICENSE)
