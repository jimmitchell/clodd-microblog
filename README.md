# Clodd for Micro.blog

The public theme of [Clodd CMS](https://github.com/jimmitchell/clodd-cms), ported to [Micro.blog](https://micro.blog) by way of [Clodd for Hugo]. It's a personal site built around three kinds of post (articles, notes and photos), marked up for the IndieWeb.

> **Status: in testing.** The port is complete and builds the way Micro.blog does, but hasn't yet run on a hosted blog. See [docs/PLAN.md](docs/PLAN.md) for what's done and what's still to check.

## Features

- **Three post kinds.** Articles have titles. Notes have none and show their whole body on the home page. Photo posts lead with their pictures. The kind comes from the post itself, so there's nothing to set.
- **Microformats2.** A representative `h-card` on the home page, an `h-feed` on every list, and full `h-entry` markup on posts and replies.
- **Micro.blog's conversation** under each post: replies drawn as Clodd's cards, and Micro.blog's form for replying with a Micro.blog, Mastodon or Bluesky account.
- **Feeds.** RSS and JSON Feed with full posts and [Byline] author elements, at Micro.blog's own addresses, for the site and every category. Items keep Micro.blog's IDs, so switching to the theme doesn't make subscribers see old posts again.
- **Dark and light modes.** Follows the system setting, with a three-way toggle and no flash of the wrong theme on load.
- Self-hosted DM Sans, with critical CSS inlined.
- **Search** over every post's whole text, from an overlay or a results page.
- An archive by year and month, a photos grid with a lightbox, and a random-post page.
- Code blocks in Clodd's `xcode-dark` colours, with copy buttons.
- **Shortcodes:** a Mondrian-style `gallery`, privacy-friendly `youtube`, `vimeo`, `gist`, `mastodon`, `instagram`, `tweet` and `linkedin` embeds, and a `subscribe` form.
- A generated Open Graph card for articles without a picture, JSON-LD `BlogPosting`, and a 404 page that offers the Wayback Machine's copy.
- **Optional extras:** an Email reply pill, a newsletter signup, and a Kudos button with the [Tinylytics for Micro.blog] plug-in.

## Installation

Clodd is a Micro.blog plug-in that provides a full theme, like mnml.

1. Install it from Micro.blog's plug-ins, and choose it as the blog's theme under **Design**.
2. In **Design**, set the Hugo version to **0.158**, which the theme needs.
3. Fill in its settings from the plug-in's settings screen (see [Settings](#settings)).

Micro.blog keeps doing what it already does for the site: IndieAuth, Micropub, Webmention and Microsub discovery, `rel="me"` for your Micro.blog and GitHub profiles, the favicon, Custom CSS, Custom Footer and plug-ins all come through as with any theme.

## Settings

All optional. A box left unticked keeps Clodd's default, and so does a blank field.

| Setting | What it does |
|---|---|
| Home page intro | Text after "Hey, I'm *name*." on the home page. Blank uses your Micro.blog bio. |
| Post date format | A Go date layout for post pages. Default `January 2, 2006`. |
| Home and archive date format | The same for cards. Default `January 2, 2006`. |
| Hide reading time on articles | Drops the "4 min read" line. |
| Photos category | A titleless post in this category is a photo post. Default `Photos`. |
| Don't generate share images… | Turns off the generated share card. See [Share images](#share-images). |
| Hide Micro.blog replies under posts | Drops the conversation. |
| Reply by email address | Shows an Email pill under posts, opening a reply with the post in the subject. |
| Mastodon | `@you@instance`. A footer icon with `rel="me"`, and `fediverse:creator`. |
| Bluesky, Pixelfed | Profile URLs, as footer icons with `rel="me"`. GitHub comes from your Micro.blog profile. |
| Newsletter form URL, email field name, signup text | A signup form under articles. See [Newsletter](#newsletter). |
| Footer text | Markdown. Blank shows "© *year* *site title*". |
| Google site verification | The `google-site-verification` meta tag, on the home page. |

The site's title, your name, avatar and bio come from Micro.blog. The site description is Micro.blog's too, as plain text.

### Tinylytics

Install [Tinylytics for Micro.blog] and the theme works with it. The plug-in loads the script, and each feed item carries Tinylytics' tracking pixel, as in Clodd. With the plug-in's Kudos option on, posts also get Clodd's Kudos button.

### Newsletter

Articles end with a signup form, in Clodd's styling, when the newsletter form URL is set. It's an ordinary HTML form, and the browser posts it straight to your list provider, so it works without JavaScript and no secret key has to live on the site. Copy the form's `action` URL and the email field's name from the plain-HTML embed code your provider gives you. After submitting, the reader lands on the provider's own confirmation page.

Micro.blog's own email newsletter is separate and unaffected.

## Pages

| Page | How to get it |
|---|---|
| Archive | Built in, at `/archive/`: every post by month, with category pills and a year filter |
| Photos | Built in, at `/photos/`: square thumbnails of every picture in photo posts and in the photos category, by month, opening in the lightbox with a link back to each post |
| Search | A page at `/search/` whose body is `{{< search >}}` |
| Random | A page whose body is `{{< random >}}`: it sends the visitor to a random post |
| Replies | Built in, at `/replies/`: your replies on Micro.blog, which stay off the home page and the feeds |

Tick **Include in navigation** on a page to put it in the header. A page that only points elsewhere is linked straight to its destination.

Once there's a page at `/search/`, the header grows a search button that opens an overlay. Search reads Micro.blog's `/archive/index.json`, which the theme writes with each post's whole text. Every word of a query has to match; matches in titles come first, and the results are drawn as the theme's own cards.

Photo thumbnails come from Micro.blog's image resizer at 600px, so the photos page doesn't load every original.

## Feeds

| Feed | Site | Each category |
|---|---|---|
| RSS | `/feed.xml` | `/categories/<name>/feed.xml` |
| JSON Feed | `/feed.json` | `/categories/<name>/feed.json` |

Every feed carries whole posts, with root-relative links and images made absolute. Notes have no title: RSS leaves the element out, so a reader shows the text instead of a made-up headline. Channel-level [Byline] elements describe the author, and every item points back to them. JSON Feed has no Byline form, so its `authors` carries the same details.

## Images and code

Pictures you upload to Micro.blog are used as Micro.blog writes them, with their width and height, so the page doesn't jump as they load. Everything is lazy except the picture that paints largest: the first one on a photo post's page, on an article that opens with a picture, and on the home page's first card. Pictures in a post open in the lightbox, unless they're inside a link.

Fenced code is highlighted by Hugo's Chroma, coloured with Clodd's `xcode-dark` palette, and dark in both themes. Every block gets a copy button. A block with no language stays plain text in the same dark box.

## Shortcodes

| Shortcode | Example |
|---|---|
| `gallery` | `{{< gallery "https://…/a.jpg" "https://…/b.jpg" />}}` |
| `youtube` | `{{< youtube dQw4w9WgXcQ >}}` or `id="…"` |
| `vimeo` | `{{< vimeo 76979871 >}}` or `id="…"` |
| `gist` | `{{< gist url="https://gist.github.com/user/abc123" file="x.go" >}}`, or Hugo's `{{< gist user abc123 >}}` |
| `mastodon` | `{{< mastodon url="https://instance/@user/123" >}}` |
| `instagram` | `{{< instagram url="https://www.instagram.com/p/ABC/" >}}`, or Hugo's `{{< instagram ABC >}}` |
| `tweet` | `{{< tweet url="https://x.com/user/status/123" >}}`, or `user="…" id="…"` |
| `linkedin` | `{{< linkedin urn="urn:li:share:123" >}}` |
| `subscribe` | `{{< subscribe >}}`, the newsletter form, for a page written around it |
| `search` | `{{< search >}}`, see [Pages](#pages) |
| `random` | `{{< random >}}`, see [Pages](#pages) |

- **YouTube** plays from `youtube-nocookie.com`.
- **Vimeo** gets `dnt=1`.
- **Gists** load GitHub's static page in a sandboxed frame, so no GitHub script runs on the page.
- **Mastodon** loads the instance's `embed.js`, which sizes the frame to fit the post.
- **Instagram and X** show a link card that their own scripts turn into the embed.

Each script appears once per page however many embeds use it. A shortcode with a malformed ID or URL draws nothing.

### Galleries

A gallery crops its pictures into a fixed layout for each count from one to seven. Eight or more are split into blocks: 11 becomes 6 and 5, and 15 or more go in sixes. The lightbox steps through all of them in order. Pictures can be listed by URL, or as Markdown images so each has alt text:

```md
{{< gallery "https://example.com/uploads/2026/a.jpg" "https://example.com/uploads/2026/b.jpg" />}}

{{< gallery >}}
![The harbour at dusk](https://example.com/uploads/2026/a.jpg)
![Boats](https://example.com/uploads/2026/b.jpg)
{{< /gallery >}}
```

Without inner content the tag has to close itself with `/>`. A picture without alt text is described by its file name, as in Clodd.

## Post kinds

| Kind | How it's recognised | Card | Page |
|---|---|---|---|
| Article | Has a title | Title, summary, date and reading time | Heading, byline, reading time, category pills |
| Note | No title | The whole body | No heading or byline |
| Photo | No title, and either in the photos category or opening with a picture | Picture first, edge to edge | Pictures, then caption |

A post's Bluesky copy, when Micro.blog has made one, is linked under it as a Bluesky pill.

### Share images

A post's `og:image` is the first picture in its body, for any kind of post, so notes and photo posts preview with their own picture. An article without one gets a generated card, written beside the post as `og.png`: Clodd's 1200×630 card in the dark scheme's colours, with the site name at the top and the title in bold DM Sans along the bottom, shrinking to fit four lines. Notes get no card, since there's no title to draw.

## Development

```sh
testSite/setup.sh
testSite/.bin/hugo server -s testSite
```

The test site builds the way Micro.blog does, on Hugo 0.158 with Micro.blog's base theme underneath. See [testSite/README.md](testSite/README.md).

Changes that belong to both themes go into [Clodd for Hugo] first and are merged in from the `upstream` remote.

## Credits

The design, markup and scripts come from [Clodd CMS](https://github.com/jimmitchell/clodd-cms), by way of [Clodd for Hugo]. DM Sans is by Colophon Foundry, under the SIL Open Font License (`static/fonts/OFL.txt`); the share card uses its static bold cut, `assets/clodd/og-bold.ttf`.

## License

MIT

[Clodd for Hugo]: https://github.com/jimmitchell/hugo-theme-clodd
[Byline]: https://bylinespec.org/1.0
[Tinylytics for Micro.blog]: https://github.com/jimmitchell/Tinylytics-for-Micro.blog
