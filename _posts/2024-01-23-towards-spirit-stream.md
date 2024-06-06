---
date: 2024-01-23T19:19:31+08:00
title: Towards spirit stream
layout: post
usemathjax: False
updated: 2024-06-06T11:43:52+00:00
---
There seems to be way living inward, but genuinely interesting things come from the unknown. And turning outward seems like a great adventure. I am curious to share and visit minds. The spirit stream could become the tool.

i can see the hive mind on the horizon.
there are hammers, sculptors, hammer blows and sculptures.
grouped and isolated
places to stay.

like gazing into a painting, being guided through the impression
coming along to find a question asked at myself, seeing it unfold and building a response

stream = raw information I choose to share
spirit = meta being(s) behind the stream
Temple = access port to the spirits

1. the spirit stream expands the user into the digital world with minimal effort
2. It meets the reader where it can expand him

How to build the spirit stream?

# Towards spirit stream

- [Direction](#Direction)
- [More refined](#More%20refined)
	- [Note structure](#Note%20structure)
	- [Stream structure derivation](#Stream%20structure%20derivation)
- [Less refined](#Less%20refined)
	- [Specification](#Specification)
	- [Implementation](#Implementation)
	- [Research](#Research)
	- [Tech](#Tech)
	- [Text editor](#Text%20editor)
	- [other](#other)

### Direction

- assume that there is text/images/video to publish and make it simple to publish
	- decentralized file sharing.
		- cryptography 
			- [Elliptic Curve Cryptography](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/)
			- [Karpathy - A from-scratch tour of Bitcoin in Python](https://karpathy.github.io/2021/06/21/blockchain/)
		- [Nand2Tetris](https://nand2tetris.org/)
		- Ethereum, dApps
		- IPFS
			- [ProtoSchool I PFS](https://proto.school/course/ipfs)
			- IPNS
			- libp2p
	- **Omega simple client**
- live stream capability
- *Spooky Features/Structure TBD*
- testing, "shipping"
- recording and output device robots

## More refined

### Note structure

- Why (without heading)
- Title
- list of contents (without heading)
- Direction
- more refined
- less refined - current thoughts, multiple different paths are explored, for more complete synchronization. 

### Stream structure derivation

I am an information structuring engine
continuous stream picks up and repeats patterns, initially chaotic and far-reaching, then filtered, refined to form few knowledge blocks in areas of interest, easy to build on.
refining means passing through the blocks from different angles, connecting them and testing for consistency. they may fragment into smaller blocks to become more reusable
a concise, stable path through the blocks - the ultimate test of their consistency - is a true story.

As the story becomes refined, its symbols approach realism for maximally dense and applicable representation. Eventually, the true story is indistinguishable from life.

Like entering the wild, refining collected information is looking for gems.

sharing structures/stories, they are further tested. A successful meme directly enteres the recipient, who tests it for consistency in their own mind.

Assuming the goal is playing a long and interesting game. Making sharing of discoveries, offers, uncertainties, plans, progress and spheres of mind context easy means offering a more synchronized, everybody-on-the-front-line discovery tour of the universe.
Seems more interesting than remaining in a confined environment and negotiating with its dominant structure.

Looking for an environment that responds back. Video games respond. It may be my fault that my environment does not very much respond. I seek a group to create things. I don't know where to find it.
The current path says "Working on something to build groups, and large ones, I may find a group and then the tools may enable the group to grow".

In exchange for participation, one gets response. Who feels unable or unwilling to respond meaningfully, can offer reach, credit or money.

The spirit stream is also an enabler for ultra capitalism, bringing everyday microtransactions closer and making cooperation -> competition more accessible.
Probably, extreme capitalism is indistinguishable from normal group dynamics - it forwards the rules of reality to the user without middlemen - , but with some communication tools, extendable to an infinitely large group.


In summary, the spirit stream has two parts: 
- the stream (hammer blows)
- the structure->blocks->stories the author is building through the stream (sculpture). Maybe the structure is a physical tool or a space of "pinned" ideas to repeat going through and refining them.

its development is furthered by:
- abitrary direct exchange, private or public
- forms of payment
- privacy / lack of intrusion


if reuse is easy enough, cooperation works without shared files which require negotiation to stay tidy. Instead, everyone builds their own stuff, reusing others' work, optionally paying for it.
in an information rich environment, betrayal and exploitation are easily detected and not worth it. simply need to spread information easily and offer easy ways to compensate someone.

## Less refined

#### Specification

>Thinking about the ideal blogging platform:<br><br>1. Writing: <br>- in markdown<br>- with full WYSIWYG, not just split view (think: Typora)<br>- super easy to copy paste and add images<br>2. Deploying:<br>- renders into static pages (think: Jekyll)<br>- super simple, super minimal html with no bloat<br>-…&mdash; Andrej Karpathy (@karpathy) [January 27, 2024](https://twitter.com/karpathy/status/1751350002281300461)

content
vocabulary
rendering engine / interface

Direct experience in a responsive environment precedes the need for stamps.
stamps only work if the reader can interpret them.

Featureset:
stamp creation quickly explodes (video, 3d, animation, sound, - to BCI and infinity)
increasing featureset get diminishing returns. The problem in expression is translating to another medium and a limited featureset forces a more concise translation. Infinite possibility/parameters easily distract.
Markdown punches up with linked media and good text formatting.
To honor the continuum between letter stamp and media, images should be easily resizable and inline-placeable. This instantly enables arbitrary positioning.

[file over app](https://stephango.com/file-over-app) but the "file" does not exist long term until printed. with programming languages, storage management, compilers, OSs still between me and my data, it can hardly persist forever.
make the format simple, "general", exportable and printable?
image formats change as coding languages do?

software sometimes emulates the brain. like when the calendar switches days automatically, which goes beyond stamps into scripts, "contracts" or "smart contracts".
recommendation algorithms try to emulate the brains attention patterns to become brain extensions.

have multiple scopes overlap, eg friend party that is watching.
like entering a "channel" with dynamic scope of recipients, opt. hierarchy.
reverse searching for the stream can also find people who are watching.

maybe the tool itself should be so minimal that the interface itself is in markdown too. Means markdown links can now link to code?
Means the text-manipulation tools apply to the software too which avoids duplicating the tools to make a fast interface for messages/filters/including messages.

maybe twitter tries to become so good that they build coherence for users, which requires human level+ AI and near complete knowledge of the user.
"subscribing" = scraping a target, which is expensive. entering on a list on their server is cheaper.

if the system becomes corrupted, it should be extremely easy to fork and rebuild it somewhere else.

- live streaming and recording (sight, hearing, touch, smell, taste + emotion, thought, association)
- viewing
- editing -> making and placing stamps, symbols, tokens at various scales
- make any file available at any scope
	- convert files to sharing formats. SEO/discoverability, translation, compatibility
- opt. notify recipients, signaling relevance, which is on a continuum and approximated by both the sender and recipient.
- API for automation
	- filter messages
- export content to common formats / other services
- analytics

#### Implementation

- ar recording - optionally see live video + ar/vr overlay, otherwise just sits there
- spider hat - includes vr recording. could get bodies for walking, swimming, flying. general legs it can walk with.
- phone

"lazy payment" - unrealized costs become realized when someone pays transaction costs.

WYSIWYG
payment + PAYG
automation - scraping is easy - means you pay per visit or provider finances any visits and hopes for donations or profit from somewhere else

possibly P2P network and optionally hosting on other machines
optionally anonymously.

### Research

wikipedia
tor
blockchain
interplanetary file system

disqus?
jinja2 templates
plausible analytics
atom/rss
uploading to server: SSH vs SFTP

"Digital gardens"<br>[https://github.com/MaggieAppleton/digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)<br>[https://simonewebdesign.it/](https://simonewebdesign.it/)

[Python modules](https://docs.python.org/3/tutorial/modules.html)

C preprocessor
embedded programming
`puts` function for errors?
LLVM / clang? LLVM has a fuzzer
make files for easy compilation

### Tech

why would you want a clone? because it connects with people and ideas that are similar and allows to build rather than reinvent.

[https://github.com/raysan5/raylib?tab=readme-ov-file](https://github.com/raysan5/raylib?tab=readme-ov-file)
[https://github.com/raysan5/raygui?tab=readme-ov-file](https://github.com/raysan5/raygui?tab=readme-ov-file)
```powershell
gcc main.c -o test.exe -I include/ -L lib/ -lraylib -lgdi32 -lopengl32 -lwinmm
```

### Text editor

text editor basic features:
- scrolling (minimap?)
- cursor positioning
- marking text (mouse or keys)
- deleting text, replacing it or moving it
- copy pasting text
- shortcuts
- infinite text files
- nice line breaks, at least between words
- saving and opening a file

- shortcut for opening documents, press tab for options. no distraction by defautl
- show large files or in "Detail" mode like in file browser, opt. with information about sharing
- explore page so that people can actually start from 0 with their content?
- split window
- moodboard is in file explorer? move stuff in a grid if you like. otherwise free movement. "create views in the explorer".
- set background images in explorer
- give overlay when browsing to "bookmark" to a file
- highlight published files that have unpublished changes
- feature to edit the page should also exist client-side.


- rooms, that link together. map is another room. other people rearange your room to their ideas.
- clean raw files
- snapshots (stamps) for version history
- stamp sets

virtually, we teleport. rooms are so disjointed that it isn't obvious what walking would even look like.
even "zooms" like a map are teleports.

- software gives layer on the structure, shows "unused files in the directory" if they are not integrated. see backlinks too, which includes external ones (quotes)
- augmented file browser? for site navigation

files:
- exe
- documentation
- index note
- "template note"
- settings - contains "shortcuts" for stamping, style
- links / icons, images, font

non-shifting text editor, more like a canvas?
marking makes a perfect square. font maybe monospace

use a different way to save it, use compression, which should produce minimal overhead over normal text, but not in memory while editing

### other

[https://docs.duck.sh/cli/#installation](https://docs.duck.sh/cli/#installation)
[ANSI codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

llms contain linguistic maps. they can draw the landscape for me if they know my maps too.
a language model that has not learned to answer questions tells stories.

TODO:
- choose a more sensitive font
- headings flow from the bottom up as text needs to become more differentiated. the higher they go the more abstract they become. Could be visualized by them getting an increasingly strong tint.
- design to differentiate internal and external link)
- other static site generator to render tables, lists correctly without waiting for an empty line at the end
- clear heading hierarchy


2024-05-21 11:45
host a website on traditional web:
- html, css, js / static site generator, md
- hosting static / dynamic
- domain
- extras: streaming, version control, easy deploy + its all fucking expensive

hosting on decentralized web:
- html, css, js / static site generator, md
- host locally / pay pinning service
- web3 gateway
- some blockchain
- wallet

[markdown link to exe](https://stackoverflow.com/questions/32563078/how-link-to-any-local-file-with-markdown-syntax)
[git flavored markdown](https://docs.gitlab.com/ee/user/markdown.html)