# Meridian

A calm, modern dark theme for the Steam desktop client, made for [Millennium](https://github.com/SteamClientHomebrew/Millennium).

It uses flat surfaces, one accent color and a clearer layout throughout Steam. Store, Library and Community move into a left sidebar, game pages are built from cards, and the menus and dropdowns are rounded to match.

## Design

The theme follows the [Meridian design mockup](https://claude.ai/artifact/8TiVdmBUq3HVG4pC4rLeNs), which has screens for the Library, Game page, Store, Downloads and Friends window. Colors, spacing and corner radii in the stylesheets come from it.

## What it covers

| Area | What changes |
| --- | --- |
| **Window** | Left sidebar with your avatar and profile at the top, then Library, Store, Community and Downloads. Downloads shows how many games are queued and lights up while you are on the Downloads page. Add a Game, Friends & Chat and the download progress card sit at the bottom of the sidebar. Taller title bar with outlined buttons. |
| **Library** | A "Library" heading with your game and install counts. Press **Ctrl+K** anywhere in the main window to jump to library search. Flat game list with a clear selected row. Covers have an accent ring on hover, recent games are cards with a Play button, and What's New items are cards. |
| **Game page** | The full banner art in a rounded card, a Play bar card, Store Page / Community Hub / Guides as a tab row, and each section as a card. News posts in the activity feed and the opened post are cards too. |
| **Downloads** | A "Downloads" heading with a queue summary, the speed graph in a card, sentence-case section titles, and each queued game as a card with outlined buttons. |
| **Menus and dropdowns** | Rounded dark panels for the Steam/View/Games menus, right-click menus, Sort By and Settings pickers. |
| **Friends and chat** | Flat friends list, profile header, search box and rounded group rows. |
| **Store and Community** | Flat background, a rounded featured carousel, underlined tabs, and discount and price styling. |
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
| **Navigation** | **Left rail**: the sidebar layout.<br>**Top tabs**: Steam's usual tabs, with their hover menus. | Left rail |
| **Accent color** | Blue `#6EA8FE`, Mint `#7DD3A7`, Amber `#F2A65A`, Violet `#C4A1FF` | Blue |

The accent color is used for Play buttons, progress bars, focus rings and highlights.

## Files

| File | Styles |
| --- | --- |
| `libraryroot.custom.css` | The main window, library, game pages, menus, dialogs and notifications |
| `layouts/rail.css` | The left sidebar layout (only when **Navigation** is **Left rail**) |
| `libraryroot.custom.js` | Adds the Library and Downloads headings, your avatar and the Downloads item in the sidebar, and the Ctrl+K search shortcut. In the sidebar layout, stops Store / Library / Community opening a menu on hover |
| `friends.custom.css` | Friends list and chat windows |
| `webkit.css` | Store and Community web pages |
| `bigpicture.custom.css` | Big Picture mode, Quick Access and the Steam menu |
| `accents/*.css` | One file per accent color |

All colors, corner radii and the font are variables at the top of each stylesheet, in `:root`.

## Notes

- **Steam updates:** Meridian targets Steam's readable class names (for example `TopBar` or `PlayBar`), not the auto-generated ones, so it usually survives Steam updates. If something looks off after an update, please open an issue.
- **Store header:** Steam's newer Store header uses auto-generated class names that change often, so Meridian leaves it as is.
- **Reduced motion:** with reduced motion turned on in Windows, the theme switches off its transitions.

## Limitations

- **JavaScript must be on.** The Library and Downloads headings, your avatar in the sidebar, the sidebar's Downloads item and Ctrl+K come from `libraryroot.custom.js`. With JavaScript turned off in Millennium, the theme still styles everything else.
- **English only.** The text the theme adds ("Library", "Downloads", "16 games · 6 installed", "2 in queue", "Ctrl K") is in English whatever language Steam uses.
- **Steam internals.** Game counts, the download badge and the Downloads highlight read Steam's internal stores (`collectionStore`, `downloadsStore`, `SteamUIStore`). If a Steam update renames them, those pieces disappear without an error, and the rest of the theme keeps working.
- **Ctrl+K needs the main window focused.** It doesn't work while you're clicked into a Store or Community page, because those pages are separate web views.
- **Badge delay.** The Downloads badge refreshes every 2 seconds, so it can lag slightly behind Steam.
- **Sidebar only.** The Downloads item and its highlight appear only with **Navigation** set to **Left rail**.
- **Not built yet.** From the mockup: collection filter chips, the docked friends panel, and free disk space next to the counts. Steam has no element for them, and building them would mean hooking into Steam's filtering and window code.
- **Idle download card.** At the bottom of the sidebar, the download card puts its icon on its own line when nothing is downloading.

## License

[MIT](LICENSE)
