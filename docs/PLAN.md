# Plan

How the Clodd CMS theme becomes a Hugo theme, and the decisions already made. The site that uses it is [jimmitchell.github.io](https://github.com/jimmitchell/jimmitchell.github.io). Posts reach it through a Micropub Worker ([jimmitchell/micropub], private), which commits Markdown files to that repo.

## Decisions

- **Packaging.** This standalone repo, imported by the site as a Hugo module.
- **Feed URLs** stay where the site has them. RSS is at `/feed.xml` and `/index.xml`, where Micro.blog followers arrive, and is also served at `/feed.rss`. Atom goes to `/atom.xml`, not `/feed.xml` as in Clodd, and JSON Feed to `/feed.json`. Every feed carries Byline elements, and every category and tag gets its own feeds.
- **URLs don't change.** Category archives stay at `/categories/<slug>/` rather than Clodd's `/category/<slug>/`. Post permalinks are the site's, not the theme's.
- **Post kind comes from the content.**
  - No title → note.
  - A titleless post in the Photos category, or one that is mostly images → photo.
  - Anything else → article.

  The site's existing posts need no edits.
- **Kept from mnml, restyled:** the archive by year and month, the photos grid, the random-post page, and Pagefind search (instead of Clodd's search.json, which only matches titles and excerpts).
- **Extras:** Tinylytics with Kudos, the Email reply pill, and the EmailOctopus signup. Related posts were left out.
- **Not ported,** because they need Clodd's PHP server: the admin, XML-RPC, the REST API, 2FA, the built-in analytics, and Pixelfed POSSE. Posts with a Pixelfed URL still get a pill.
- **POSSE runs by default.** A new post goes to Mastodon and Bluesky unless it has `posse: false` or its Micropub client sent `mp-syndicate-to`, which then picks the targets. Posts dated before the switchover are never syndicated.
- **Syndicated copies are created only.** Editing and deleting them in step with the post comes later.

## Phases

- [x] **0. Repo setup.**
  - `theme.toml`, `go.mod`, theme defaults in `hugo.toml`, the README covering the param and front matter contract.
  - An `exampleSite` with a post of every kind and placeholder layouts.
- [ ] **1. Base layout and design.**
  - Port `theme.css` faithfully. Inline the part above `/* =END CRITICAL= */` and defer the rest, with Hugo Pipes.
  - Self-host DM Sans.
  - Header: avatar and title, `menus.main` with dropdown children, the search overlay, and the three-way theme toggle with the anti-flash script.
  - Footer: social links with rel="me".
  - Port `theme.js`.
- [ ] **2. Head and discovery.**
  - Open Graph, JSON-LD, `fediverse:creator`, rel="me" (including Bridgy Fed).
  - webmention/pingback, IndieAuth/Micropub, feed alternates (including per-term feeds), sitemap, favicon, custom CSS.
- [ ] **3. Content templates.**
  - Home: the h-card intro and an h-feed of cards in three variants.
  - Single post:
    - Full h-entry, the featured image, context lines and photos.
    - Syndication, Email and Kudos pills; the webmention form.
    - Webmentions display (`webmentions.js`), the newsletter form, Newer/Older links.
  - Pages, taxonomy archives, and the 404 page with its Wayback Machine lookup.
- [ ] **4. Pages kept from mnml.** Archive, photos grid, random, and Pagefind in the overlay and results page.
- [ ] **5. Feeds and OG cards.**
  - RSS at `/feed.xml`, `/index.xml` and `/feed.rss`; Atom at `/atom.xml`; JSON Feed.
  - Byline in all of them, notes without titles, per-term feeds.
  - OG cards with `images.Text` and the static DM Sans font from `clodd-cms/fonts/og/`.
- [ ] **6. Markup.**
  - Image render hook: lazy loading, dimensions, lightbox.
  - Code blocks: Chroma's `xcode-dark` style and the copy button.
  - Shortcodes: `gallery` (Mondrian layouts for 1–7 images, larger sets split into blocks), `youtube`, `vimeo`, `gist`, `mastodon`, `instagram`, `tweet`, `linkedin`.
- [ ] **7. Site switchover** (on a branch of the site repo).
  - Install Go for Hugo modules (CI runners already have it).
  - Replace mnml and migrate the params.
  - Delete the overrides in `layouts/` that the theme now covers.
  - Check that URLs are unchanged, then run lychee and mf2 validation.
- [ ] **8. Micropub Worker.**
  - New properties: `in-reply-to`, `like-of`, `repost-of`, `bookmark-of`, `rsvp`, `syndication`, `featured`.
  - Support them in create, update and `q=source`.
  - `q=syndicate-to` lists Mastodon and Bluesky; `mp-syndicate-to` becomes `syndicate_to:` in the front matter.
- [ ] **9. GitHub Action** in the site repo, run after deploy.
  - POSSE new posts to Mastodon and Bluesky, formatted as Clodd does: notes as native posts, articles as title and link.
  - Commit the copies' URLs back to `syndication:`.
  - Send webmentions for new and changed posts.

## Front matter written by the Micropub Worker

Today the Worker writes `title`, `summary`, `categories`, `date`, `draft`, and photos as Markdown images at the top of the body. Phase 8 adds snake_case keys that match the README: `in_reply_to`, `like_of`, `repost_of`, `bookmark_of`, `rsvp`, `syndication`, `featured`, `featured_alt`, `syndicate_to`.

[jimmitchell/micropub]: https://github.com/jimmitchell/micropub
