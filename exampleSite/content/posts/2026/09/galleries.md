---
title: "Galleries"
date: 2026-09-24T12:00:00-07:00
summary: "The gallery shortcode in its three forms, from one picture to eleven."
categories: [Meta]
---
Three pictures, named by path:

{{< gallery "/media/2026/10/dawn.jpg" "/media/2026/10/harbor.jpg" "/media/2026/10/moss.jpg" />}}

Five, written as Markdown images so each has alt text:

{{< gallery >}}
![A gradient from orange to teal](/media/2026/10/dawn.jpg)
![A gradient from slate to gold](/media/2026/10/harbor.jpg)
![A green gradient](/media/2026/10/moss.jpg)
![A tall gradient](/media/2026/10/tall.jpg)
![A wide gradient](/media/2026/10/wide.jpg)
{{< /gallery >}}

Eleven, which split into blocks of six and five:

{{< gallery >}}
![1](/media/2026/10/dawn.jpg) ![2](/media/2026/10/harbor.jpg) ![3](/media/2026/10/moss.jpg)
![4](/media/2026/10/tall.jpg) ![5](/media/2026/10/wide.jpg) ![6](/media/2026/10/dawn.jpg)
![7](/media/2026/10/harbor.jpg) ![8](/media/2026/10/moss.jpg) ![9](/media/2026/10/tall.jpg)
![10](/media/2026/10/wide.jpg) ![11](/media/2026/10/dawn.jpg)
{{< /gallery >}}
