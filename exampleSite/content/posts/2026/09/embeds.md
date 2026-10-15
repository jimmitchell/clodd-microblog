---
title: "Embeds and Code"
date: 2026-09-22T12:00:00-07:00
summary: "Every embed shortcode, a raw HTML image, and highlighted code."
categories: [Meta]
---
A YouTube video, from youtube-nocookie.com:

{{< youtube dQw4w9WgXcQ >}}

A Vimeo video, with Do Not Track:

{{< vimeo id="76979871" >}}

A gist, as GitHub's static page:

{{< gist url="https://gist.github.com/spf13/7896402" >}}

A Mastodon post:

{{< mastodon url="https://mastodon.social/@Mastodon/117411420916699261" >}}

An Instagram post, a tweet and a LinkedIn post:

{{< instagram url="https://www.instagram.com/p/C1a2b3c4d5e/" >}}

{{< tweet url="https://x.com/gohugoio/status/1234567890123456789" >}}

{{< tweet user="gohugoio" id="1234567890123456790" >}}

{{< linkedin urn="urn:li:share:7000000000000000000" >}}

An image written as raw HTML, which still gets WebP sources and its size:

<img src="/media/2026/10/wide.jpg" alt="A wide gradient" title="Written as HTML" style="border: 1px solid #ddd">

Code, highlighted in Clodd's xcode-dark colours:

```python
def greet(name: str) -> str:
    # Say hello.
    return f"Hello, {name}!"  # 42
```

```
A block with no language stays plain.
```

    An indented block, which theme.js wraps.
