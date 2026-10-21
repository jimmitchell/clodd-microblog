+++
title = "Galleries"
date = "2026-09-24T12:00:00-07:00"
type = "post"
url = "/2026/09/24/galleries.html"
guid = "http://sam.micro.blog/2026/09/24/galleries.html"
categories = ["Meta"]
photos = ["http://localhost:1313/uploads/2026/dawn.jpg", "http://localhost:1313/uploads/2026/harbor.jpg", "http://localhost:1313/uploads/2026/moss.jpg", "http://localhost:1313/uploads/2026/tall.jpg", "http://localhost:1313/uploads/2026/wide.jpg"]
images = ["http://localhost:1313/uploads/2026/dawn.jpg", "http://localhost:1313/uploads/2026/harbor.jpg", "http://localhost:1313/uploads/2026/moss.jpg", "http://localhost:1313/uploads/2026/tall.jpg", "http://localhost:1313/uploads/2026/wide.jpg"]
+++
The gallery shortcode with Micro.blog uploads, which are URLs Hugo can't read as resources. Three pictures, named by URL:

{{< gallery "http://localhost:1313/uploads/2026/dawn.jpg" "http://localhost:1313/uploads/2026/harbor.jpg" "http://localhost:1313/uploads/2026/moss.jpg" />}}

Five, written as Markdown images so each has alt text:

{{< gallery >}}
![A gradient from orange to teal](http://localhost:1313/uploads/2026/dawn.jpg)
![A gradient from slate to gold](http://localhost:1313/uploads/2026/harbor.jpg)
![A green gradient](http://localhost:1313/uploads/2026/moss.jpg)
![A tall gradient](http://localhost:1313/uploads/2026/tall.jpg)
![A wide gradient](http://localhost:1313/uploads/2026/wide.jpg)
{{< /gallery >}}
