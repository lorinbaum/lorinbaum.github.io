---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: page
title: "Spirit stream of Lorin Baumgarten"
---

<section> <!-- introduction --> <p> A work in progress to stream the spirits to the collective mind.
    The spirits can be expected to be disagreeable, conscientious, open, reasonably stable and slightly introverted.
    They are currently reachable through <a href="https://twitter.com/lorinbaumgarten">X</a>.
  </p>
</section>
<!-- 
{% assign postsByYearMonth = site.posts | group_by_exp: "post", "post.date | date: '%B %Y'" %}
{% for yearMonth in postsByYearMonth %}
  <h2>{{ yearMonth.name }}</h2>
  <h2>{{ post.title }}</h2>
  <ul>
    {% for post in yearMonth.items %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
-->

<section>
<!-- content -->
  <!-- <ul>
    {%- assign posts = site.posts | sort: "updated" | reverse -%}
    {%- for post in posts -%}
      <li class="updateInfo">
        <a href="{{post.url}}">{{post.title}}</a>
        updated&nbsp;{{- post.updated | date: "%Y %m %d" -}}
        {%- if post.updatedHeadings != nil and post.updatedHeadings != "" -%}
          :&nbsp;{{ post.updatedHeadings }}
        {%- endif -%}
      </li>
    {%- endfor -%}
  </ul> -->
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Newest update</th>
      </tr>
    </thead>
    <tbody>
      {%- assign posts = site.posts | sort: "updated" | reverse -%}
      {%- for post in posts -%}
        <tr class="updateInfo">
          <td>
            <a href="{{post.url}}">{{post.title}}</a>
          </td>
          <td>
            <span class="date">{{- post.updated | date: "%Y %m %d" -}}</span>
            {%- if post.commitMsg != nil and post.commitMsg != "" -%}
              <!-- <span class="commitMsg">&nbsp;{{ post.commitMsg }}</span> -->
              <span class="commitMsg">&nbsp;{{ post.last_commit.message }}</span>
            {%- endif -%}
          </td>
        </tr>
        {{ page.last_commit.time }}
        {%- endfor -%}
    </tbody>
  </table>
</section>