# Changelog

What changed in each version of Meridian, newest first. The version number is the one in `skin.json`.

## 1.4.0 - 2026-11-27

### Added

- **Appearance** option (Theme tab): **Dark**, **Light**, or **Follow system**, which matches the Windows app mode and switches the moment you change it. Light mode is `modes/light.css`: only the color variables change, to white panels on a zinc-100 frame, zinc-950 tints for hover and hairlines, Tailwind's lighter shadows, and a darker step of your accent (`blue-600`, `emerald-700`, `amber-700`, `violet-600`) so accent text keeps at least 4.5:1 contrast on white. It covers the main window, menus, dialogs, the friends and chat windows, and the Store and Community pages. Big Picture stays dark (`modes/dark.css`).
- **Surface tint** option (Theme tab): **None**, **Subtle** or **Strong**. The backgrounds take on a little of your accent color, in dark and light mode.
- Store and Community pages get the same hairline and rounded top-left corner as the Library's panel, so they no longer look cut off beside the navigation. Page edges everywhere use a new `--mr-edge` color that is easier to see, in both modes, drawn 2px wide (`--mr-edge-w`) so the rounded corner shows. With Steam's address bar on, the bar sits on the navigation's ground and the page's corner starts below it, instead of a second corner cutting a notch under the bar.
- The page is now a card: an 8px gutter of window chrome (`--mr-gutter`) on its right and below it, an edge on all four sides and all four corners rounded, in both layouts and every Library sidebar option. On Store and Community pages the page's own scrollbar becomes that right gutter, on the chrome color.
- **Steam Settings** window styled: the page list on the chrome color with a filled selected page, the page on the panel color, settings rows as cards, toggles in the accent with a visible off track, and readable dropdown values. Steam's blue focus gradient along the top edge of dialog windows is gone.
- Store top bar restyled: the theme's chrome color instead of Steam navy, a plain search field, and Cart as the one accent button. Its class names are scrambled, so the rules use attributes Valve keeps stable.
- Store game page: Follow / Ignore and the playtime box are cards, "In library" is a green status strip, Play Now is the accent button, and the right column's blocks are cards.

- **Navigation menus open on right-click**, in both layouts. Right-click Store, Library, Community or your profile for its menu; passing the pointer over them no longer pops one open. A left click still opens the page, and moving away closes the menu.

### Fixed

- Store text that stayed white in light mode: the front page's section titles, "See more" links, the New Releases / Top Sellers tabs and their rows and preview (Valve renamed these, so the old rules missed them), tag chips, the footer, the game page's franchise banner, system requirement labels, controller rows and review filters, the search page's filters, sort box and result rows, and the wishlist heading.
- Text that used Steam's own colors now uses the theme's, so it reads in light mode. Dark mode looks the same. This covers game names in the Library list by state (installed, running, updating), the game page's tab strip, review prompt, news cards, activity feed and sticky header icons, the Downloads section titles and graph legend, the bottom bar's slate bevel, and the Store's text, links, headings and review scores.
- The game preview card that opens on hover no longer has a grey band under its screenshot in light mode, and hover and selected fills are a step stronger in light mode so they show on white.

## 1.3.2 - 2026-11-27

### Fixed

- **Downloads card** at the bottom of the left rail can be clicked anywhere on it. Steam listens for clicks on the content inside the card, and the theme had put the card's padding outside that content, so clicks near the edges did nothing even though the whole card lit up on hover. The padding is now on the clickable part. The card looks the same.

### Changed

- **Big Picture**: the Steam menu and Quick Access menu now match the theme. They are separate windows that Millennium does not style, so `bigpicture.custom.js` copies the theme's stylesheets into them. `bigpicture.custom.css` also restyles the Home and Library tiles, the game page (Play / Install button in the accent color, flat page ground) and Settings (selected page marked like the desktop sidebar, one setting per rounded row), and replaces Steam's ALL CAPS labels with sentence case.

## 1.3.1 - 2026-11-15

### Fixed

- **In the rail** no longer leaks into pages that are not the Library. Each rule now waits for Steam's `Library` marker on the content container, which only Library and game pages carry, instead of only looking for the game list in the window. The Store and Community web views keep the rail beside them again, and the Millennium settings page is no longer drawn under the navigation.

## 1.3.0 - 2026-11-15

### Added

- **Library sidebar** option (Layout tab in the theme settings), for where the Library's game list goes:
  - **Side panel**: its own column inside the page, as before. This is the default.
  - **Blended**: on the same dark ground as the navigation, with no line between them.
  - **In the rail**: inside the left sidebar, under the navigation items, so the Library has one sidebar. The sidebar is a little wider with this choice. Left rail only.
  - **Top bar**: Home, the collections button, the view picker and search in a row above the page, with the game list as a drop-down. Works with both navigation layouts.
- `sidebar/blended.css`, `sidebar/in-rail.css` and `sidebar/top-bar.css`, one for each new choice.
- Screenshots and a feature summary in the README.
- This changelog.

### Changed

- `layouts/rail.css` and `layouts/tabs.css` now set `--mr-layout`, so the Library sidebar stylesheets can tell the two navigation layouts apart.

### Removed

- The README no longer says the Downloads item is only in the left sidebar. It is in the Top tabs row too.

## 1.2.0 - 2026-11-15

### Changed

- Both navigation layouts share one design. Library, Store, Community, Downloads and your profile are the same icon-and-label items in the left sidebar and in the top row, and the page you are on is filled in.
- **Top tabs** is now a full layout (`layouts/tabs.css`): the navigation row sits on the same dark ground as the title bar. In the Library the game list is a sidebar on that dark ground, and the page beside it gets the rounded corner.
- Home and the collections button in the Library are drawn like the navigation items.

### Fixed

- An editor warning about `-webkit-mask` in `libraryroot.custom.css`.

## 1.1.0 - 2026-11-14

### Changed

- The look now comes from Tailwind CSS v4's default theme: zinc greys, 400-step accent colors in OKLCH, its corner radius scale, translucent borders, soft focus rings, and Geist for type.
- Every color, corner radius, shadow and font moved into `tokens.css`, which all the stylesheets import.
- The left sidebar layout became an app shell: the title bar and the sidebar share one dark ground, and the page is an inset panel with a rounded corner.
- The friends list and chat, Store and Community pages and Big Picture were restyled with the same values.

## 1.0.0 - 2026-11-09

- First version. A left sidebar for Store, Library, Community and your profile, or Steam's own top tabs.
- Four accent colors: Blue, Mint, Amber and Violet.
- Styles for the main window, Library, game pages, Downloads, menus, dialogs, the friends list and chat, Store and Community pages and Big Picture.
