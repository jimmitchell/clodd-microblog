# Plan

How the Clodd CMS theme becomes a Hugo theme, and the decisions already made. The site that uses it is [jimmitchell.github.io](https://github.com/jimmitchell/jimmitchell.github.io). Posts reach it through a Micropub Worker ([jimmitchell/micropub], private), which commits Markdown files to that repo.

## Decisions

- **Packaging.** This standalone repo, imported by the site as a Hugo module.
- **Feed URLs** stay where the site has them. RSS is at `/feed.xml` and `/index.xml`, where Micro.blog followers arrive, and is also served at `/feed.rss`. Atom goes to `/atom.xml`, not `/feed.xml` as in Clodd, and JSON Feed to `/feed.json`. Every feed carries Byline elements, and every category and tag gets its own feeds.
- **URLs don't change.** Category archives stay at `/categories/<slug>/` rather than Clodd's `/category/<slug>/`. Post permalinks are the site's, not the theme's.
- **Post kind comes from the content.**
  - No title → note.
  - A titleless post in the Photos category, or one whose body opens with an image → photo.
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
- [x] **1. Base layout and design.**
  - Port `theme.css` faithfully. Inline the part above `/* =END CRITICAL= */` and defer the rest, with Hugo Pipes.
  - Self-host DM Sans.
  - Header: avatar and title, `menus.main` with dropdown children, the search overlay, and the three-way theme toggle with the anti-flash script.
  - Footer: social links with rel="me".
  - Port `theme.js`. The newsletter handler is held back for phase 3, because it expects Clodd's `subscribe.php`.
  - Also added: a `footer_text` param, and empty `hooks/head-end.html` and `hooks/body-end.html` partials for sites to override.
- [x] **2. Head and discovery.**
  - Open Graph, JSON-LD, `fediverse:creator`, rel="me" (including Bridgy Fed).
  - The share image follows the site's existing rule rather than Clodd's: `featured`, then the first body image, on notes too. Clodd gives notes no `og:image`, which would have dropped the picture from shared photo posts. The extra tags from the site's override (`og:site_name`, `og:locale`, `article:` times, image dimensions and alt, Twitter cards) are kept as well.
  - Added `<link rel="canonical">`. Clodd only has `og:url`.
  - Pingback uses webmention.io's per-domain endpoint (`/<domain>/xmlrpc`). Clodd links the bare `/xmlrpc`.
  - Feed links: one per feed type, the site's first, plus the term's own on category and tag pages.
  - webmention/pingback, IndieAuth/Micropub, feed alternates (including per-term feeds), sitemap, favicon. (Custom CSS landed in phase 1.)
- [x] **3. Content templates.**
  - Home: the h-card intro and an h-feed of cards in three variants.
  - Single post:
    - Full h-entry, the featured image, context lines and photos.
    - Syndication, Email and Kudos pills; the webmention form.
    - Webmentions display (`webmentions.js`), the newsletter form, Newer/Older links.
  - Pages, taxonomy archives, and the 404 page with its Wayback Machine lookup.
  - Checked with mf2py: every post type is discovered (article, note, photo, reply, like, repost, bookmark, rsvp), and the home page has a representative h-card. Webmentions render the same as on the live site.
  - Where it differs from Clodd:
    - Photo posts keep their pictures in the body (where Micropub and Micro.blog put them), so `u-photo` is added to the body's images.
    - The Email pill isn't `u-syndication`: a `mailto:` isn't a copy of the post.
    - The home h-card gains an invisible `u-photo`.
    - `dt-updated` replaces Clodd's `u-update`.
    - Card dates default to the live site's "October 14, 2026", not the template's weekday form.
    - The external-link arrow's own-host exclusion is written from `baseURL`, not hard-coded.
    - The newsletter is a provider-neutral form posted natively (`newsletter.action`), because EmailOctopus's plain-HTML endpoint couldn't be confirmed. Clodd's `subscribe.php` relies on a server-side API key.
    - Legacy webmention targets come from `aliases`.
- [x] **4. Pages kept from mnml.** Archive, photos grid, random, and Pagefind in the overlay and results page.
  - Their styles are in `assets/css/clodd-hugo.css`, appended to the deferred bundle, so `theme.css` stays a verbatim copy of Clodd's.
  - Search uses Pagefind's JS API rather than its UI, and draws Clodd's cards. Each card's kind, title and date come from data- attributes. A note's title is its date, or Pagefind would fall back to the site name and every note would match it.
  - The shared lightbox in `theme.js` gained a "View post" link for pictures that name their post (`data-post`), and steps only through pictures a filter has left visible.
  - Archive rows for a like or repost show the context line, since there are no words to show.
  - Tested against the real site: 693 pages indexed, 691 archive rows, 107 photos; the year filter, lightbox and result paging all work.
- [x] **5. Feeds and OG cards.**
  - RSS at `/index.xml`, written again to `/feed.xml` and `/feed.rss` (`feeds.rss_copies`), each copy with its own self link; Atom at `/atom.xml`; JSON Feed at `/feed.json`. The home page and every category and tag get all three; a section keeps an RSS feed.
  - Items are Clodd's: context lines, the stored featured image, the full body with absolute URLs, and the Tinylytics pixel. Notes have no RSS `<title>` and an empty Atom one. Byline person and org in RSS and Atom; JSON Feed has no Byline form, so `authors` carries the same details.
  - Additions to Clodd: Atom entries carry `<category>`, JSON items carry `tags` (as the site's feed did), and a JSON item's `image` is the post's own picture.
  - Hugo ignores a theme's `outputs`, so a site opts in with `outputs: {_merge: shallow}`. The README says so.
  - The share card is drawn with `images.Text`, `images.Mask` and `images.Overlay` in Clodd's sizes (its points ×4/3) and lands within a pixel of Clodd's card. Hugo can't measure text from a template, so the title size comes from its length, and titles over 250 characters are cut short. Articles only, after the post's own pictures; 19 of the site's posts get one.
  - Feed `<link>`s are written with printf so the `+` in each media type isn't escaped to `&#43;`.
  - Validated with the W3C Feed Validator: RSS and Atom valid, warnings only for the Byline namespace and the same markup Clodd's feeds carry.
- [x] **6. Markup.**
  - The image render hook draws through `_partials/image.html`, which now also takes extra attributes (title, style, an author's class).
  - `_partials/body.html` (was `photo-content.html`) finishes a post body as Clodd's Builder does:
    - Upgrades raw HTML `<img>` tags (`ResponsiveImages::upgrade`). Imported posts have eight; all their attributes are kept.
    - Adds `u-photo` on photo posts.
    - Makes the lead picture eager (`promoteFirstImage`): a photo post's page, an article opening with a picture, the home page's lead card.
    - Keeps one copy of each embed script.
  - Code blocks use a render hook that wraps Chroma's inline-mode spans in Clodd's `.code-block--dark` markup. Chroma's classes get Clodd's `xcode-dark` colours in `clodd-hugo.css`. Clodd colours `hljs-` classes, which Chroma doesn't emit.
  - Shortcodes take Clodd's attributes and Hugo's positional forms, so the site's existing `{{< youtube ID >}}` keeps working. `gallery` takes paths, inner Markdown images (for alt text) or `match=`; the path form must self-close because the shortcode reads `.Inner`. Added `subscribe`, which Clodd has and the plan missed.
  - Departure: the Mastodon embed includes the instance's `embed.js` and `width="400"`. Clodd's bare iframe stays 150px tall.
  - Tested in Chrome. Galleries of 3, 5 and 11 (6 + 5) tile correctly, and the lightbox steps through all 19 pictures in order. A real Mastodon post resized to fit. Code colours and copy buttons match.
  - Tested against the real site: all 162 post-page images have dimensions, 155 are `<picture>`s, the four code posts and two YouTube posts render, feeds keep only absolute URLs, and microformats are unchanged.
- [ ] **7. Site switchover** (on a branch of the site repo).
  - Install Go for Hugo modules (CI runners already have it).
  - Replace mnml and migrate the params.
  - Feeds: drop the site's `jsonfeed`/`feedxml` output formats and `outputs`, add `outputs: {_merge: shallow}`, and delete `layouts/home.*.xml`, `home.jsonfeed.json` and `_partials/home-rss.xml`.
  - Mount `static/images` into `assets/images` (as `static/media` already is), so the avatar is inlined in the header and drawn on share cards.
  - Delete the overrides in `layouts/` that the theme now covers, including `_markup/render-image.html`, which would otherwise shadow the theme's hook.
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
