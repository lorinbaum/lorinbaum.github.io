---
date: 2024-01-23T19:19:31+08:00
---
i can see the hive mind on the horizon.
there are hammers, sculptors, hammer blows and sculptures.
grouped and isolated
places to stay.

like gazing into a painting, being guided through the impression
coming along to find a question asked at myself, seeing it unfold and building a response

# Towards spirit stream

[TOC]

### Direction

## More refined

### Site structure

- H1 Aspirational spirit stream of Lorin Baumgarten
- Introduction
- Quick Guide
- List of notes sorted by "most recently modified"
	- note structure:
		- Text describing why the note exists
		- H1 Title
		- list of contents
		- H2 Direction
		- H2 more refined
		- H2 less refined - current thoughts, multiple different paths being explored, for more complete synchronization. 
- guiding philosophy

### Stream components derivation

Senses explore, parse, filter
Stream of consciousness repeats patterns from
chaotic and far-reaching
to filtered and coherent knowledge
to actionable stories

Writing, graphs, images, products
and the tools to build them
in progress
in memory

Large vocabulary is deceptive
Hard is simplification

Share the process in truth to
test, be surprised, dance, reproduce, join the cutting edge, offer, cohere, support, punish
into common languages per context
into any scopes
with any conditions

Where I am,
When I am.

#### Components

- Scrape, filter, download
- Produce content, at least markdown (nice language)
- Organizing storage into groups -> files, folders, links
- compile Edit-> View and WYSIWYG into common human and machine languages.
- create snapshots. language to extend, branch, merge and view changes.
- share in packets or live
- share with scope selection and conditions
- authenticate
- API for scrape and download
- analytics
- use close various devices between embedded, phone, workstation
- host on my or rented hardware
- store in persistent forms (simple, open, redundant and printable)

## Less refined

"lazy payment" - unrealized costs become realized when someone pays transaction costs.
optionally anonymously.

WYSIWYG
payment + PAYG

wikipedia
tor
interplanetary file system

disqus
plausible analytics
atom/rss

"Digital gardens"
[https://github.com/MaggieAppleton/digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)
[https://simonewebdesign.it/](https://simonewebdesign.it/)

[Python modules](https://docs.python.org/3/tutorial/modules.html)

C preprocessor
embedded programming
`puts` function for errors?
LLVM / CLANG
`make` files for easy compilation

### 2024-10-29 16:08 Spirit stream II: file sharing generalization

render md -> render folder structure
- md -> html
- view/download raw files via button or API
- login to see all files
- prerender everything

database
- tags
	- public
	- encrypted (raw=renders decrypted file site on client)
- admin users
- shared links, their scope and expiration
- logs

file browser:
- clicked on produces gallery, which renders them large on screen. maybe lower res for images. with progressive rendering
- download (raw) folder / selection
- selection, file name, created, modified, tags, raw
- generate share link

if some files private, append admin to folder view and let server decide which he sends to the client

home
- only place to open file browser, which is a full screen site that expands to the right and down
- contact
- payment
- links to top level folders
- most recently changed files and what changed
- login

top row in file
- go to top button, where the index is too, so can reference another heading easily.
- Entrance
- previous and next if usable
- path to file
- download file
- view raw

#### Implementation

1. convert folder
- if index.md, then convert, otherwise index is generated: file browser at top view
	- keyword in index.md to substitute with file browser top level links
- file browser = an index.html in every folder
- files that can be opened become a link to a site with them on it, either html, text or image
- render images into ones that can load progressively
- site for every file that can be opened with shell + content. convert markdown
- copy raw files to raw folder and set up links to them
- if private, make another "admin" filebrowser window
- if opening encrypted files, use client side javascript to ask for a key to decrypt them.

2. server
- login
- send private files only to authenticated users, else page that says either file does not exist or lack the privilege for viewing them
- generate links for sharing files
- resolve shared links to files
- block users that request too much or try passwords

### other

[ANSI codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

llms contain linguistic maps. they can draw the landscape for me if they know my maps too.
a language model that has not learned to answer questions tells stories.

TODO:
- choose a more sensitive font
- design to differentiate internal and external link)
- clearer heading differentiation
- cli note for attachments that are out of use

| centralized                              | decentralized                                                         |
| ---------------------------------------- | --------------------------------------------------------------------- |
| mostly HTTPS, SSL certificate            | custom protocol, slow                                                 |
| no static address or hard to get -> DDNS | content addressing                                                    |
| domain                                   | web3 gateway or its undiscoverable<br>= domain, DDNS                  |
|                                          | easily connectable to wallets                                         |
| everyone knows who I am                  | can be anonymous                                                      |
|                                          | servicing capability automatically expands<br>if people host my stuff |
Ridiculous. Rarely useful, it seems. If the internet sucks, those responsible must be confronted directly.

[git flavored markdown](https://docs.gitlab.com/ee/user/markdown.html)

[Karpathys ideal blogging platform](https://twitter.com/karpathy/status/1751350002281300461)
[file over app](https://stephango.com/file-over-app)