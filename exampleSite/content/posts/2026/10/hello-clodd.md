---
title: "Hello, Clodd"
date: 2026-10-12T09:30:00-07:00
summary: "A first article, with a featured image, categories, tags and links to its copies elsewhere."
categories: [Meta]
tags: [hugo, indieweb]
featured: /media/2026/10/dawn.jpg
featured_alt: "A gradient from orange to teal"
syndication:
  - https://mastodon.example/@sam/115000000000000001
  - https://bsky.app/profile/sam.example.org/post/3kexample
---
This is an **article**: a post with a title. Its card on the home page shows the title, the summary and a reading time, and its page carries a full `h-entry`.

The featured image above came from front matter. A post that simply *begins* with an image gets the same treatment.

## A heading

Some text with a footnote.[^1] And a list:

- One
- Two
- Three

> A quotation, to see how blockquotes look.

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, Clodd")
}
```

[^1]: Footnotes render at the foot of the post.
