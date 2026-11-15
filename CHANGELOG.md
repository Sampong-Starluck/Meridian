# Changelog

What changed in each version of Meridian, newest first. The version number is the one in `skin.json`.

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
