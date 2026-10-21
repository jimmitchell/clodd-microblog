# Plan

How the Clodd Hugo theme ([hugo-theme-clodd]) becomes a Micro.blog theme. This repo was forked from it with full history; `upstream` points there, and changes meant for both themes land upstream first and are merged in.

## Decisions

- **Hugo 0.158**, Micro.blog's recommended version. The theme's `_partials/`, `_shortcodes/` and `_markup/` layout and its newer template functions stay as they are.
- **Micro.blog's base theme stays underneath.** `head.html` calls `microblog_head.html`, which brings IndieAuth, Micropub, Webmention and Microsub discovery, `rel="me"` for Micro.blog and GitHub, the favicon, `custom.css`, and plug-in CSS and HTML. Clodd's own versions of those come out. `baseof.html` also ranges over `plugins_js`.
- **Settings come from `plugin.json`, as flat `params.*` keys.** Micro.blog saves an unticked box as `false`, which beats the theme's default, so every boolean is worded so that `false` is Clodd's default (`hide_reading_time`, `hide_share_cards`, `hide_conversation`). A blank text field arrives as `""`, so templates fall back with `default`, not by relying on `hugo.toml`.
- **Param mapping:**

  | Clodd | Micro.blog |
  |---|---|
  | `author.name`, `author.avatar` | unchanged: Micro.blog sets `params.author.name`, `.avatar` and `.username` (`.Site.Author` is gone from Hugo) |
  | `author.bio` | `params.about_me` |
  | `author.email` | `params.email` |
  | `social.mastodon`, `.bluesky`, `.pixelfed` | `params.social_mastodon`, `params.social_bluesky`, `params.social_pixelfed` |
  | `social.github` | `params.github_username` (Micro.blog's own) |
  | `show_reading_time`, `share_cards` | `hide_reading_time`, `hide_share_cards` (inverted) |
  | `newsletter.action`, `.email_field`, `.label` | `newsletter_action`, `newsletter_email_field`, `newsletter_label` |
  | `tinylytics.code`, `.kudos` | the [Tinylytics plug-in]'s `site_id`, `show_kudos`, `kudos_label` |
  | `date_format`, `card_date_format`, `photos_category`, `home_intro`, `footer_text`, `google_site_verification` | same names |

- **Dropped, because Micro.blog does it:** `indieauth`, `micropub`, `webmentions` (domain and link tags), `rel_me`, `bridgy_fed`, `favicon`, `custom_css`, `feeds.rss_copies`, and `newsletter.hidden`.
- **Webmentions display becomes Micro.blog's conversation.** `webmentions.js` and the webmention form give way to `conversation.js`, unless `hide_conversation` is set.
- **Tinylytics is the plug-in's job.** The theme draws the Kudos pill when the plug-in's partial exists and `show_kudos` is on, as mnml does, and loads no script of its own.
- **Feeds take over Micro.blog's formats.** The site's config decides the outputs, so there's no Atom. Clodd's RSS becomes the `RSS` format (`/feed.xml`), and its JSON Feed becomes the `JSON` format (`/feed.json`), Byline included.
- **Search can't use Pagefind,** because Micro.blog runs no step after Hugo. The overlay and search page search `/archive/index.json` instead, as mnml's `search.js` does, drawing the same cards.

## Phases

- [x] **0. Fork.** `clodd-microblog` with full history; `plugin.json` and `theme.toml` for Micro.blog.
- [x] **1. Test site.** `testSite/`, replacing `exampleSite/` (and `go.mod`, since Micro.blog doesn't use modules). See its README.
  - `setup.sh` fetches Hugo 0.158.0 (checksummed, expanded from the `.pkg` rather than installed) and [theme-blank] at a pinned commit. `config.json` is theme-blank's, filled in, with `theme: ["clodd", "theme-blank"]`.
  - The current theme-blank reads the author from `params.author`, not `.Site.Author`, and its config has `ArchiveHTML` and `PhotosHTML` outputs that the older local `microblog-theme` copy lacks.
  - Profile fields became `social_mastodon`, `social_bluesky` and `social_pixelfed`: a post's own `bluesky` key is its Bluesky copy, and `.Param` falls back from page to site.
  - The first build failed: the share card was written inside the post's path, and a Micro.blog permalink ends in `.html`. The card now goes in a folder named after the post (`/2026/10/12/hello-clodd/og.png`).
  - **Baseline**, with the theme otherwise unchanged: 41 pages, no errors. The only deprecation notices (`languageCode`) come from Micro.blog's config and theme-blank's feeds.
    - Already working: post kinds (four articles, a note, two photo posts), replies kept off the home page, remote uploads passed through untouched with `u-photo` and eager loading, galleries of URLs, the menu from both config and page front matter, the share card and reading time on articles.
    - No `microblog_head.html`, so no IndieAuth, Micropub, Webmention, `rel="me"`, `custom.css` or plug-ins (phase 2).
    - Micro.blog's default `description` is HTML (`Follow <a …>@sam</a>`) and comes out escaped in the meta description and RSS (phase 3).
    - A post's `bluesky.url` gets no syndication pill (phase 4).
    - `/archive/` and `/photos/` are theme-blank's bare lists in Clodd's frame (phase 5).
    - `/feed.json` is theme-blank's. `/feed.xml` is Clodd's, but `feeds.rss_copies` writes it a second time and adds a stray `/feed.rss` (phase 6).
- [x] **2. Head and layout.**
  - `head.html` calls `microblog_head.html` after the theme's styles, so `custom.css` and plug-in CSS come later in the cascade and win. It brings the feed links (a category's own as well), `rel="me"` for Micro.blog and GitHub, the favicon, RSD, IndieAuth, Micropub, Webmention, Microsub and `plugins_html`.
  - Out: Clodd's `head/favicon.html`, `head/feeds.html` and `head/indieweb.html`, `static/favicon.svg`, and the `custom_css`, `favicon`, `rel_me`, `bridgy_fed`, `indieauth` and `micropub` defaults. Pingback goes with webmention.io.
  - `baseof.html` ends with Micro.blog's `custom_footer.html` and a deferred script per `plugins_js`.
  - `theme_seconds` isn't needed: the theme's CSS and JS are already fingerprinted, and its only other static files are the fonts.
  - Category feed links are titled with the site name alone, as `microblog_head.html` writes them. Clodd added the term.
  - Tested with a stand-in plug-in in the test site: its partial, stylesheet and script appear on every page.
  - Still open: whether Hugo Pipes (`resources.Get`, `minify`, `fingerprint`, `images.Text`) runs in Micro.blog's build. It does locally on 0.158. Check on a test blog, and fall back to `static/` if not.
- [x] **3. Params.**
  - `_partials/settings.html` reads Micro.blog's params and returns them in Clodd's shape (`author`, `social`, `newsletter`, `tinylytics`, and the flat keys), defaults applied. Every template asks it, through `partialCached`, instead of `site.Params`, so the table above lives in one file and the templates stay close to upstream's.
  - `hugo.toml` has no `[params]` any more: a default there would lose to the `false` or `""` Micro.blog writes for an untouched field. That also ends the `rss_copies` default, so `/feed.xml` is written once and `/feed.rss` is gone.
  - The description is plainified: `Follow @sam on Micro.blog.` in the meta description and RSS.
  - Tinylytics: the theme's own loader is gone, since the plug-in loads the script (with its Kudos label). `site_id` counts as a Tinylytics code only when the plug-in's `tinylytics.html` exists, because Micro.blog sets `site_id` to the blog's own ID on every site. Clodd's `events` option has no plug-in equivalent and stays off.
  - Tested both ways: the test config's values, and every box ticked, custom dates, a newsletter, and the real Tinylytics plug-in with Kudos. One script, a Kudos button and the feed pixel; no reading time, Email pill or share card; both date formats.
- [ ] **4. Content.** Posts come from `where site.RegularPages "Type" "post"`. Year sections mean Newer/Older must walk the whole post list, not `InSection`. Syndication pills from `bluesky.url`. The avatar can't be inlined unless `resources.GetRemote` works there. The `replies` section, the `redirect` layout and `newsletter.html` (Micro.blog's newsletter template) are new.
- [ ] **5. Archive, photos, search.** Archive and photos as Micro.blog's `archivehtml` and `photoshtml` layouts, at `/archive/` and `/photos/`. Search over `archive/index.json`. Random reads the same JSON.
- [ ] **6. Feeds and share cards.** RSS and JSON Feed on Micro.blog's formats and paths; drop `rss_copies`. Share cards, if `images.Text` works on Micro.blog's build.
- [ ] **7. Release.** `icon.jpg`, README for Micro.blog, a test blog switched over, then submit to the theme directory.

[hugo-theme-clodd]: https://github.com/jimmitchell/hugo-theme-clodd
[Tinylytics plug-in]: https://github.com/jimmitchell/Tinylytics-for-Micro.blog
[theme-blank]: https://github.com/microdotblog/theme-blank
