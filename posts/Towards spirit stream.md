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
to actionable, linearized and accessible stories

In writing, graphs, images, products
and the tools to build them
in progress
from memory

Share the process in truth to
test, be surprised, dance, reproduce, join the cutting edge, offer, cohere, support, punish
into common languages per context
into any scopes
with any conditions

Where I am,
When I am.

## Less refined

### Components

- Scrape, filter
- Writing and viewing bits that are grouped into "files" (patterns) along (at least) 3 axes: resolution, completion, age. These dimensions may use a:
- General framework for organization: files, tags, paths lead to the overlap between files, folders/links (graph file sytem. tags that have tags,... that have links to files). Becomes circular through backlinks and possible references from inside the file. Allow linking anything. Images, text, make super easy.
- Simple export into self contained copies
- (opt.) version control: extend, branch, merge and view changes. Version history is a graph of graphs

- compile into optimized formats (HTML)
- File encryption
- Analytics + docs = Interface to the machine
- Compatibility with most hardware to get closer to the user for convenience. (phone, emebedded devices)

- share on static server: SSH, HTTPS, IPFS(?), streaming (SRT?), API
- Dynamic server: authenticate into permission groups + opt. meet conditions (paywall, forms, etc.) to view some content. APi should allow for relaying: Watching a stream from my site but my server is too slow to serve it? Relay to other people -> take load of my server -> get better connection yourself!

### Next version

make raw files available via API
- Hierarchy = clone from windows
- version control = git
- compile to HTML
	- get folder structure with this permission
	- invoke compilers by folder or file type
	- styles
		- css (styled by user after compiling?)
		- frame
		- file browser
	- folder
	- md
	- (jpg png gif)
	- markdown -> html text
	- other stuff just links to the file itself
	- compile views for different permission groups
- Dynamic HTTP server
- Authentication

### other

markdown
- links to files with `![]` and just paste their contents like with images, depending on file type

- dyanmic rendering + cache

database
- tags
	- permission groups
	- encrypted (raw=renders decrypted file site on client)
- users
	- permission groups
	- passwords
- shared links, their scope and expiration
- logs

UI
file browser:
- download (raw) folder / selection
- selection, file name, created, modified, tags, raw
- generate share link
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

[ANSI codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

llms contain linguistic maps. they can draw the landscape for me if they know my maps too.
a language model that has not learned to answer questions tells stories.

TODO:
- choose a more sensitive font
- design to differentiate internal and external link
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
Ridiculous. Rarely useful, it seems. If the internet sucks, those responsible must be confronted directly, not joined by an inefficient alternative.

[git flavored markdown](https://docs.gitlab.com/ee/user/markdown.html)

[Karpathys ideal blogging platform](https://twitter.com/karpathy/status/1751350002281300461)
[file over app](https://stephango.com/file-over-app)

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

non-hierarchical file system.
bytes, pointers -> pointers are bytes too and can store tags for their bytes.
files, tags. Tags are files too. So, structure defined by links.
How to navigate it?
design an entry point, link files like obsidian already supports it. Wikipedia.
Graph view is useless.
search files by how they are connected.
tags are unnecessary, they are literally a weak link
navigate through forward and backward links.
optionally select an overlap of multiple links. like ctrl-click to add to the group which must overlap.
the backlink that I come from should be highlighted
Information, however, becomes hierarchically organized as it matures. No problem. Hierachy is a subset of this system.
converting from hierarchy is easy. converting to hierarchy requires disambiguation: which link(s) should become the files folder(s)? Mutltiple folders means the file is copied.
drives are tags.
branches are tags.
snapshots from previous commits belong to the commit tag
omg
easy
git gives UI for merging files and tags, like from pull requests or other branches.
how to limit number of forward links while maintaining their precision? display them as searchable list. searchable also for overlap.

content addressing solves the streaming relay problem? Choose to relay and others automatically connect based on their connection cost.
optionally pay for relay
= IPFS, (filecoin(?))

messages are files automatically received and that I actively send out.
can be (are) grouped under tags depending on sender.

| Taken hierarchy path | forward links, some external |
| -------------------- | ---------------------------- |
| backlinks            | broken links                 |

- render images into ones that can load progressively
- if opening encrypted files, use client side javascript to ask for a key to decrypt them.

- generate links for sharing files and resolve them in requests
- block users that request too much or try passwords

sciter for html, css, js engine for UI
