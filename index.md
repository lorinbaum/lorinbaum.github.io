---
layout: page
title: "Spirit stream of Lorin Baumgarten"
---

<section> <!-- introduction -->
  <p>
    A work in progress to stream the spirits to the collective mind.
    The spirits can be expected to be disagreeable, conscientious, open, reasonably stable and slightly introverted.
    They are currently reachable through <a href="https://twitter.com/lorinbaumgarten">X</a>.
  </p>
  <p>
	  See note <a href="changes.html">changes</a> for current thought stream and history.<br>
	  The website and notes are also open sourced <a href="https://github.com/lorinbaum/lorinbaum.github.io">here</a> on GitHub.
  </p>
</section>

<section>
  <ul class="posts">
    {%- assign posts = site.posts | sort: "updated" | reverse -%}
    {%- for post in posts -%}
      <li>
        <span class="date">{{- post.updated | date: "%Y %m %d" -}}</span>
        <a href="{{post.url}}">{{post.title}}</a>
      </li>
    {% endfor %}
  </ul>
</section>