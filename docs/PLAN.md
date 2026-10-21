# Plan

How the Clodd Hugo theme ([hugo-theme-clodd]) becomes a Micro.blog theme. This repo was forked from it with full history; `upstream` points there, and changes meant for both themes land upstream first and are merged in.

## Decisions

- **Hugo 0.158**, Micro.blog's recommended version. The theme's `_partials/`, `_shortcodes/` and `_markup/` layout and its newer template functions stay as they are.
- **Micro.blog's base theme stays underneath.** `head.html` calls `microblog_head.html`, which brings IndieAuth, Micropub, Webmention and Microsub discovery, `rel="me"` for Micro.blog and GitHub, the favicon, `custom.css`, and plug-in CSS and HTML. Clodd's own versions of those come out. `baseof.html` also ranges over `plugins_js`.
- **Settings come from `plugin.json`, as flat `params.*` keys.** Micro.blog saves an unticked box as `false`, which beats the theme's default, so every boolean is worded so that `false` is Clodd's default (`hide_reading_time`, `hide_share_cards`, `hide_conversation`). A blank text field arrives as `""`, so templates fall back with `default`, not by relying on `hugo.toml`.
- **Param mapping:**

  | Clodd | Micro.blog |
  |---|---|
  | `author.name`, `author.avatar` | `.Site.Author.name`, `.Site.Author.avatar` |
  | `author.bio` | `params.about_me` |
  | `author.email` | `params.email` |
  | `social.mastodon`, `.bluesky`, `.pixelfed` | `params.mastodon`, `params.bluesky`, `params.pixelfed` |
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
- [ ] **1. Test site.** A local site shaped like Micro.blog's: the base theme's `config.json` with its outputs, `microblog-theme` and this theme as theme components, and posts with Micro.blog's front matter (`type: post`, `photos`, `photos_with_metadata`, `reply_to_url`, `bluesky`, the `replies` section). It replaces `exampleSite/`; `go.mod` goes too.
- [ ] **2. Head and layout.** `microblog_head.html` in, Clodd's discovery and feed links out, `plugins_js`, `theme_seconds` cache-busting. Check on a test blog whether Hugo Pipes (`resources.Get`, `css`, fingerprinting) builds there; fall back to `static/` if not.
- [ ] **3. Params.** Map every template to the table above.
- [ ] **4. Content.** Posts come from `where site.RegularPages "Type" "post"`. Post kinds read Micro.blog's front matter: photos from `photos`, replies from `reply_to_url`. Year sections mean Newer/Older must walk the whole post list, not `InSection`. Uploaded images are remote, so the image partials must pass remote URLs through untouched. The avatar can't be inlined unless `resources.GetRemote` works there. The `replies` section, the `redirect` layout and `newsletter.html` (Micro.blog's newsletter template) are new.
- [ ] **5. Archive, photos, search.** Archive and photos as Micro.blog's `archivehtml` and `photoshtml` layouts, at `/archive/` and `/photos/`. Search over `archive/index.json`. Random reads the same JSON.
- [ ] **6. Feeds and share cards.** RSS and JSON Feed on Micro.blog's formats and paths. Share cards, if `images.Text` works on Micro.blog's build.
- [ ] **7. Release.** `icon.jpg`, README for Micro.blog, a test blog switched over, then submit to the theme directory.

[hugo-theme-clodd]: https://github.com/jimmitchell/hugo-theme-clodd
[Tinylytics plug-in]: https://github.com/jimmitchell/Tinylytics-for-Micro.blog
