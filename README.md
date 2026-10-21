# Clodd for Hugo

The public theme of [Clodd CMS](https://github.com/jimmitchell/clodd-cms), ported to Hugo. It's a personal site built around three kinds of post (articles, notes and photos), marked up for the IndieWeb.

> **Status: in development.** The theme is complete; the next step is switching jimmitchell.github.io over to it. See [docs/PLAN.md](docs/PLAN.md) for what's done and what's next.

## Features

- **Three post kinds.** Articles have titles. Notes have none and show their whole body on the home page. Photo posts lead with their pictures. The kind comes from the content, so no extra front matter is needed.
- **Microformats2.** A representative `h-card` on the home page, an `h-feed` on every list, and full `h-entry` markup on posts. That covers `p-name`, `p-author`, `dt-published`, `dt-updated`, `e-content`, `u-photo`, `u-featured`, `p-category`, `u-syndication`, `u-in-reply-to`, `u-like-of`, `u-repost-of`, `u-bookmark-of` and `p-rsvp`.
- **Replies, likes, reposts, bookmarks and RSVPs**, from front matter.
- **Webmentions** via [webmention.io]: likes and reposts as an avatar grid, replies as threaded cards, and a form for sending one by hand.
- **Discovery.** `rel="me"` links (with `rel="atproto"` for Bluesky), IndieAuth (with an [IndieKey] shortcut), Micropub, webmention/pingback, `fediverse:creator`, and Bridgy Fed verification.
- **Feeds.** RSS, Atom and JSON Feed with full posts and [Byline] author elements, plus all three for every category and tag.
- **Dark and light modes.** Follows the system setting, with a three-way toggle and no flash of the wrong theme on load.
- Self-hosted DM Sans, with critical CSS inlined.
- **Search** with [Pagefind], from an overlay or a results page.
- An archive by year and month, a photos grid, and a random-post page.
- **Images** with WebP sources, dimensions and lazy loading, whether written in Markdown or as HTML, and a lightbox for every picture.
- Code blocks in Clodd's `xcode-dark` colours, with copy buttons.
- **Shortcodes:** a Mondrian-style `gallery`, privacy-friendly `youtube`, `vimeo`, `gist`, `mastodon`, `instagram`, `tweet` and `linkedin` embeds, and a `subscribe` form.
- A generated Open Graph card for articles without a picture, JSON-LD `BlogPosting`, and a 404 page that offers the Wayback Machine's copy.
- **Optional extras:** [Tinylytics] with a Kudos button, an Email reply pill, and an EmailOctopus signup form.

## Installation

As a Hugo module (needs [Go](https://go.dev/dl/)):

```yaml
# hugo.yaml
module:
  imports:
    - path: github.com/jimmitchell/hugo-theme-clodd
```

```sh
hugo mod init github.com/<you>/<your-site>
hugo mod get -u
```

Or as a git submodule:

```sh
git submodule add https://github.com/jimmitchell/hugo-theme-clodd themes/clodd
```

```yaml
theme: clodd
```

Hugo 0.158.0 or newer, extended edition.

Then add this to the site's config, so the theme's Atom and JSON feeds are switched on (see [Feeds](#feeds)):

```yaml
outputs:
  _merge: shallow
```

## Configuration

Everything goes under `params`, and all of it is optional. The defaults are in [hugo.toml](hugo.toml). [exampleSite/hugo.yaml](exampleSite/hugo.yaml) is a complete working config.

```yaml
params:
  description: Personal site and writing of Sam Example.
  date_format: January 2, 2006               # post pages (Go layout)
  card_date_format: January 2, 2006           # home and archive cards
  show_reading_time: true
  photos_category: Photos   # see "Post kinds"
  home_intro: ""            # after "Hey, I'm <name>."; falls back to author.bio
  footer_text: ""           # Markdown; empty shows "© <year> <site title>"
  custom_css: ""            # injected after the theme's styles
  share_cards: true         # generated og:image for articles, see "Share images"
  favicon: ""               # path or URL; default is the theme's favicon.svg
  google_site_verification: ""   # home page only

  author:
    name: Sam Example
    bio: I write about the open web.
    avatar: images/avatar.png  # under assets/ to inline it and draw it on cards
    email: sam@example.org   # shows the Email reply pill

  social:                    # footer and h-card icons, all rel="me"
    mastodon: "@sam@mastodon.example"   # also emitted as fediverse:creator
    bluesky: https://bsky.app/profile/sam.example.org
    pixelfed: https://pixelfed.example/sam
    github: https://github.com/sam

  rel_me: []                 # more rel="me" links, <head> only
  bridgy_fed: false          # rel="me" for Bridgy Fed verification

  indieauth:
    indiekey: ""             # an indiekey.id site ID fills in all three below
    metadata: ""
    authorization_endpoint: ""
    token_endpoint: ""
  micropub: ""               # Micropub endpoint URL

  webmentions:
    domain: example.org      # as registered at webmention.io
    link_tags: []            # e.g. ["ref=example.com"], see below

  tinylytics:
    code: ""
    kudos: ""                # an emoji; shows the Kudos button
    events: false

  newsletter:               # see "Newsletter" below
    action: ""
    email_field: email
    label: ""
    hidden: {}

  search:
    pagefind: true
  feeds:
    rss_copies: [feed.xml, feed.rss]   # the home RSS feed, again at these paths
```

`webmentions.link_tags` is for sites that add a query string to their outbound links, such as Ghost's `?ref=`. webmention.io stores the target URL exactly as it was sent, so a mention of `/post/?ref=example.com` would otherwise never show on `/post/`. Each tag is asked about alongside the post's own URL.

### Feeds

Every feed carries whole posts. Root-relative links and images are made absolute, and a reply, like, repost, bookmark or RSVP starts with its context line. Notes have no title: RSS leaves the element out and Atom leaves it empty, so a reader shows the text instead of a made-up headline. Channel-level [Byline] elements describe the author from `author` and `social`, and every item points back to them. With Tinylytics on, each item ends with its tracking pixel, as in Clodd.

| Feed | Home | Each category and tag |
|---|---|---|
| RSS | `/index.xml` | `/categories/<name>/index.xml` |
| Atom | `/atom.xml` | `/categories/<name>/atom.xml` |
| JSON Feed | `/feed.json` | `/categories/<name>/feed.json` |

Tags follow the same pattern under `/tags/<name>/`.

The home RSS feed is also written to each path in `feeds.rss_copies` (default `/feed.xml` and `/feed.rss`), for readers subscribed at an older address. Each copy names itself as its `atom:link rel="self"`, but only `/index.xml` is advertised in `<head>`. A section's RSS feed (`/posts/index.xml`) is the same full-content feed.

Feeds list the newest 20 posts. Change that with `services.rss.limit`.

Hugo merges a theme's `params` and `menus` into a site's config, but not its `outputs`, so a site has to ask for the Atom and JSON formats with `outputs: {_merge: shallow}`. A site that sets `outputs` itself instead should include them:

```yaml
outputs:
  home: [html, rss, atom, jsonfeed]
  term: [html, rss, atom, jsonfeed]
```

### Newsletter

Articles end with a signup form, in Clodd's styling, when `newsletter.action` is set. It's an ordinary HTML form, and the browser posts it straight to your list provider, so it works without JavaScript and no secret key has to live on the site. Copy the form's `action` URL and field names from the plain-HTML embed code your provider gives you:

```yaml
params:
  newsletter:
    action: https://buttondown.com/api/emails/embed-subscribe/sam
    email_field: email
    hidden:
      embed: "1"
```

After submitting, the reader lands on the provider's own confirmation page.

### Menus

The header navigation is `menus.main`. An entry with a `parent` appears in that item's dropdown on desktop and indented on mobile.

```yaml
menus:
  main:
    - { name: About, pageRef: /about, weight: 10 }
    - { name: Now, pageRef: /now, parent: About, weight: 11 }
```

### Hooks

Two empty partials let a site add markup without overriding a theme template: `layouts/_partials/hooks/head-end.html` (end of `<head>`) and `layouts/_partials/hooks/body-end.html` (just before `</body>`).

### Search

Search is [Pagefind]: the index is built from the finished site, so it searches whole posts and ranks the results. Results are drawn as the theme's own post cards.

1. Add a search page:

   ```yaml
   # content/search.md
   ---
   title: Search
   layout: search
   search_exclude: true
   ---
   ```

   A page whose body is the `{{< search >}}` shortcode works too.

2. Index the site after Hugo builds it:

   ```sh
   hugo && npx pagefind --site public
   ```

The header's search button and overlay appear once the site has a page at `/search`. Pagefind indexes posts and pages. Set `search_exclude: true` on anything that should stay out. Under a plain `hugo server` there's no index, and the search page says so.

### Archive, photos and random

Each one is switched on by a content file:

| Page | File | What it shows |
|---|---|---|
| Archive | `content/archive/_index.md` | Every post by month, with category pills and a year filter |
| Photos | `content/photos/_index.md` | Square thumbnails of every picture in photo posts and in `photos_category`, by month, opening in the lightbox with a link back to each post |
| Random | `content/random.md` with `layout: random` | Sends the visitor to a random post |

Add them to `menus.main` to put them in the header.

## Images and code

A Markdown image, or an `<img>` written as HTML with a site-relative `src`, becomes what Clodd draws: for a JPEG or PNG Hugo can read (a page resource, or under `assets/`, which `static/media` can be mounted into), a `<picture>` with 800px and full-size WebP sources. The `<img>` keeps the original file and gets its width and height, so the page doesn't jump as pictures load. Everything is lazy except the picture that paints largest: the first one on a photo post's page, on an article that opens with a picture, and on the home page's first card. An HTML `<img>` keeps every attribute its author wrote. One that already has a `srcset`, or sits in a `<picture>`, is left alone.

Pictures in a post open in the lightbox, unless they're inside a link.

Fenced code is highlighted by Hugo's Chroma with classes, coloured with Clodd's `xcode-dark` palette, and dark in both themes. Every block gets a copy button. A block with no language stays plain text in the same dark box.

## Shortcodes

| Shortcode | Example |
|---|---|
| `gallery` | `{{< gallery "/media/a.jpg" "/media/b.jpg" />}}` |
| `youtube` | `{{< youtube dQw4w9WgXcQ >}}` or `id="…"` |
| `vimeo` | `{{< vimeo 76979871 >}}` or `id="…"` |
| `gist` | `{{< gist url="https://gist.github.com/user/abc123" file="x.go" >}}`, or Hugo's `{{< gist user abc123 >}}` |
| `mastodon` | `{{< mastodon url="https://instance/@user/123" >}}` |
| `instagram` | `{{< instagram url="https://www.instagram.com/p/ABC/" >}}`, or Hugo's `{{< instagram ABC >}}` |
| `tweet` | `{{< tweet url="https://x.com/user/status/123" >}}`, or `user="…" id="…"` |
| `linkedin` | `{{< linkedin urn="urn:li:share:123" >}}` |
| `subscribe` | `{{< subscribe >}}`, the newsletter form, for a page written around it |
| `search` | `{{< search >}}`, see [Search](#search) |

The video shortcodes replace Hugo's own, so posts written for those keep working.
- **YouTube** plays from `youtube-nocookie.com`.
- **Vimeo** gets `dnt=1`.
- **Gists** load GitHub's static page in a sandboxed frame, so no GitHub script runs on the page.
- **Mastodon** loads the instance's `embed.js`, which sizes the frame to fit the post.
- **Instagram and X** show a link card that their own scripts turn into the embed.

Each script appears once per page however many embeds use it. A shortcode with a malformed ID or URL draws nothing.

### Galleries

A gallery crops its pictures into a fixed layout for each count from one to seven. Eight or more are split into blocks: 11 becomes 6 and 5, and 15 or more go in sixes. The lightbox steps through all of them in order. There are three ways to list the pictures, and they can be mixed:

```md
{{< gallery "/media/2026/10/a.jpg" "/media/2026/10/b.jpg" />}}

{{< gallery >}}
![The harbour at dusk](/media/2026/10/a.jpg)
![Boats](/media/2026/10/b.jpg)
{{< /gallery >}}

{{< gallery match="images/*" />}}
```

The first form names files by path. The second gives each picture alt text, and the third takes a page bundle's own images. Without inner content the tag has to close itself with `/>`. A picture without alt text is described by its file name, as in Clodd.

## Post kinds

| Kind | How it's recognised | Card | Page |
|---|---|---|---|
| Article | Has a `title` | Title, summary, date and reading time | Heading, byline, reading time, category and tag pills |
| Note | No `title` | The whole body | No heading or byline |
| Photo | No `title`, and either in `photos_category` or opening with an image | Picture first, edge to edge | Pictures, then caption |

### Share images

A post's `og:image` is the first of:

1. its `featured` image
2. the first image anywhere in its body, for any kind of post, so notes and photo posts preview with their own picture
3. for an article, a generated card, written beside the post as `og.png`

A local image is scaled to 1200px wide and given its dimensions. For that, Hugo has to be able to read the file as an asset: a site with uploads in `static/media` mounts that folder into `assets/media` too. See [exampleSite/hugo.yaml](exampleSite/hugo.yaml).

The card is Clodd's: 1200×630 in the dark scheme's colours, the avatar and site name at the top, and the title in bold DM Sans along the bottom, shrinking to fit four lines. The avatar is drawn only when Hugo can read it as an asset (see `author.avatar`). Notes get no card, since there's no title to draw. Set `share_cards: false` to turn cards off.

## Front matter

All of these keys are optional.

```yaml
title: ""            # leave out for a note
summary: ""          # card text, feed summary, meta description
categories: []
tags: []

featured: /media/2026/10/lead.jpg   # an article's lead picture (u-featured)
featured_alt: ""
# Without featured, an article whose body begins with an image uses that one.

in_reply_to: [https://…]   # each renders as a context line above the body
like_of: [https://…]
repost_of: [https://…]
bookmark_of: [https://…]
rsvp: "yes"                # yes | no | maybe | interested; goes with in_reply_to

aliases: []               # old URLs; webmentions sent to them still show
syndication:               # copies elsewhere, shown as pills, u-syndication
  - https://mastodon.example/@sam/115000000000000001
  - https://bsky.app/profile/sam.example.org/post/3kexample
```

Syndication pills are labelled by host: Mastodon (any URL with an `/@user/<id>` path), Bluesky, Pixelfed, or the hostname otherwise.

The theme ignores two more keys. A companion GitHub Action reads them to decide where a new post is syndicated: `posse: false` opts a post out, and `syndicate_to: [mastodon]` narrows its targets.

## Development

```sh
testSite/setup.sh
testSite/.bin/hugo server -s testSite
```

The test site builds the way Micro.blog does, on Hugo 0.158 with Micro.blog's base theme underneath. See [testSite/README.md](testSite/README.md).

## Credits

The design, markup and scripts come from [Clodd CMS](https://github.com/jimmitchell/clodd-cms). DM Sans is by Colophon Foundry, under the SIL Open Font License (`static/fonts/OFL.txt`); the share card uses its static bold cut, `assets/clodd/og-bold.ttf`.

## License

MIT

[webmention.io]: https://webmention.io/
[IndieKey]: https://indiekey.id/
[Byline]: https://bylinespec.org/1.0
[Pagefind]: https://pagefind.app/
[Tinylytics]: https://tinylytics.app/
