# Test site

A local stand-in for a Micro.blog build: Micro.blog's Hugo version, its base theme underneath this one, its config, and posts written the way Micro.blog writes them.

```sh
testSite/setup.sh                        # once: Hugo 0.158.0 and theme-blank, into gitignored folders
testSite/.bin/hugo server -s testSite    # http://localhost:1313/
```

- **Hugo** is 0.158.0, Micro.blog's recommended version, whatever `hugo` is on the system.
- **Themes.** `config.json` sets `theme: ["clodd", "theme-blank", "plugin-check"]`, so this theme wins over [theme-blank], which supplies `microblog_head.html`, the archive and photos JSON, `rsd.xml`, the podcast feeds and the fallbacks for anything Clodd lacks. `themes/clodd` is a symlink to the repo root; `themes/theme-blank` is a clone pinned in `setup.sh`.
- **`config.json`** is theme-blank's own, with its placeholders filled in, plus what Micro.blog adds: the theme stack, a menu, and a value for every `plugin.json` field.
- **`themes/plugin-check`** stands in for an installed plug-in. Micro.blog adds a plug-in to the theme stack and lists its files in `plugins_css`, `plugins_js` and `plugins_html`; each of the three leaves a marker in every page (`plugin-check.css`, `plugin-check.js`, `<meta name="plugin-check">`).
- **`static/custom.css`** is empty. Micro.blog writes the site's own CSS there, and `microblog_head.html` links it.
- **Posts** live in year folders with TOML front matter: `title = ""` on notes, `type = "post"`, a `url` ending in `.html`, a `guid`, `categories`, and `photos` and `images` on posts with pictures. Replies are `type = "reply"` in `replies/`. Pages carry their own `url` and an optional `menu.main` entry; `links.md` is a page that only points elsewhere (`type = "redirect"`, `redirect`, `redirect_url`). A 2025 note sits in a year folder of its own, since Micro.blog's sections are years.
- **Uploads** are in `static/uploads/` and referenced by absolute URL, as Micro.blog's are. Hugo can't read them as resources, which is the point: on Micro.blog they're served from outside the build.

Some of the front matter is inferred from Micro.blog's own templates and export rather than seen in a hosted build. The keys theme-blank and published themes read are here (`photos`, `images`, `guid`, `bluesky.url`, `categories`, `type`, `url`, `redirect`, `redirect_url`); anything the theme comes to depend on beyond those should be checked on a real blog first.

[theme-blank]: https://github.com/microdotblog/theme-blank
