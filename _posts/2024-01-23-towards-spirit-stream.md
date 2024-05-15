---
date: 2024-01-23T19:19:31+08:00
title: Towards spirit stream
layout: post
usemathjax: False
updated: 2024-05-15T06:45:00+00:00
commitMsg: implement changes page + merged and distilled scss
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
	- [Spirit stream evolution](#Spirit%20stream%20evolution)
	- [Note structure](#Note%20structure)
- [Less refined](#Less%20refined)
	- [Stream structure design](#Stream%20structure%20design)
	- [Research](#Research)
	- [Tech](#Tech)
		- [P2P networks](#P2P%20networks)
	- [other](#other)

### Direction

- what does apache do extra compared to simple http server
	- ssl?
- after cleaning up, view end-to-end spirit stream components, decide where to move next
## More refined

### Note structure

- Why (without heading)
- Title
- list of contents (without heading)
- Direction
- more refined
- less refined - current thoughts, multiple different paths are explored, for more complete synchronization. 

### Spirit stream evolution

![](/assets/pasted-image-20240126212515.png)
history page with headings where something was updated

Version 2024 03 07:
![](/assets/20240307-spirit-stream.png)
2024-02-28 21:04 rant collection, the spirit stream SUCKS!
- where is the history?
- the newest update column provides only garbage information, who cares if I fixed a typo?
- who decided to make links suddenly be red?
- why can't I tell when I already visited them?
- is it an external or internal link?
- can't tell the difference between headings
- how do I see only what was recently changed?
- is this even streaming my spirits? then what is happening during all this downtime between updates? where is the spirit?
- where is the manifested streamer? where is my spider hat that records what I am experiencing directly?

2024-05-01 20:40:
![](Pasted%20image%2020240501203222.png)

## Less refined

### Stream structure design

I am an information structuring engine
continuous stream picks up and repeats patterns, initially chaotic and far-reaching, then filtered, refined to form few knowledge blocks in areas of interest, easy to build on.
refining means passing through the blocks from different angles, connecting them and testing for consisency.
they may fragment into smaller blocks to become more reusable
a concise, stable a path through the blocks - the ultimate test of their consistency - is a true story.
As the story becomes refined, its symbols approach realism for maximally dense and applicable representation. Finally, the true story is indistinguishable from life.

Like entering the wild, refining collected information is looking for gems.

sharing stories, I test their consistency
a true story is recognized and directly enteres the recipient, who tests it for consistency in their own mind.
it has become an effective meme.

joscha bach streams in non-integrated posts
the structure is hidden but accessible
what is the preferred interface to the hive mind at different distances into the future?

giving credit encourages story development: payment and quotes (also a form of payment)
a spirit stream should also platform conversations to enable broader consistency.

In summary, the spirit stream has two parts: 
- the stream (hammer blows)
- the structure->blocks->stories the author is building through the stream (sculpture)
its development is furthered by:
- enabling abitrary direct exchange (optionally entering the stream)
- forms of payment, an emergent "meme market"

a history of the stream maintains transparency and a ramp for new readers. It is base reality, should not be lost.

if reuse is easy enough, cooperation works without shared files which requires negotiation to stay tidy. Instead, everyone builds their own stuff, reusing others' work, optionally paying for it.
in an information rich environment, betrayal and exploitation are easily detected and not worth it. simply need to spread information easily and offer easy ways to compensate someone.

conversation can be public too and seamlessly enter the spirit stream. if version history exists, conversations can be modified without hiding the truth.

easily and securely host quotable, changing information, optionally anonymously, without requiring external services.

1. Stream input device
2. Stream format
3. Stream publishing
4. Stream downloading
5. Stream download fomatting
6. Stream output device

### Research

wikipedia
tor
blockchain
interplanetary file system

"Digital gardens"<br>[https://github.com/MaggieAppleton/digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)<br>[https://simonewebdesign.it/](https://simonewebdesign.it/)
### Tech

From scratch
- all markdown features
- WYSIWYG interface
- nice url
- analytics
- comments
- Dynamic site support
- version control
- live stream
- print markdown

- domain -> ip (cloudflare DNS-O-Matic?)
	- holds records to route different requests to different ips. can also route email traffic. records are cached and may point to old ip adress.
- webserver (apache)
- web app (flask)
	- generates html, caching after generating it
- WYSIWYG editor
	- markdown
	- templates
	- css
	- stream
- status viewer
	- traffic

disqus?
[Python modules](https://docs.python.org/3/tutorial/modules.html)
jinja2 templates
plausible analytics
tor network
atom/rss
P2P websites
uploading to server: SSH vs SFTP

From [Host website locally](https://www.youtube.com/watch?v=euXdC0NDgac)
- XAMPP -> Apache, MySQL
- wordpress for content
- ~~packetriot for tunneling (?)~~ use [port forwarding](https://www.quora.com/Can-we-live-a-localhost-server-website-to-the-internet-If-so-how) instead

I use a soft overlay on some files to edit them. Publish. Enter a domain if I want to. And its out.
The overlay is easily understood.
Easily modified
```
markdown, mathjax, css
	.md ++
	.jpg  .png  .gif  .mp4  .mp3 ...
html, css, javascript -> machine version
    templates
```

servers sends markdown and everyone renders it as they wish?
I put out information, the llm filters it anyway

connect to form the hive mind
share experience and build an environment that is greatly supportive of what I want to do. A responsive environment, an overlay over reality to interface optimally with it.
it means finding information when I need it, offers, people, all this fast. Instant. Trust is information, no reason why the internet should destroy trust. elevate, augment and stream the spirit.

build a virtual clone
the llm interface to the world. it does not matter to output information in high quality, it is enough if it is there and readable by the llm.



hosting locally sucks because who lets their computer run 24/7? Who needs to host locally, if the content is public anyway?
hosting on an external computer requires trust and is usually more expensive than necessary. Free options exist but they require negotiation.

- local server that converts .md files when serving. with preview server.
	- integrate as much as possible: small computer, server software, local drive, 
- platform service. pay per bandwidth and compute. at cost with donations. implement whatever structure I like. become a registry too? or host on subdomain. repo\.github\.io or github\.io\/repo. People can buy their domain if they like.
	- google drive should also be a blogging platform
	- twitch should be a spirit stream
	- people can pay with microtransactions, reducing abstractions and forwarding the rules to the user

2: clone that scrapes the network and negotiates between people. Hand over control to the clones. Extend smoothly into real world, as machines are introduced that can extend the clones.
initially, information is stored on the central server. The system should be open enough such that there is a balance of power because the dying system could easily be salvaged, reproduced elsewhere.

hosting locally is also slow. copying to various servers is faster. decentralized. how does tor work?
data is distributed across many private servers? 
blockchain? web3?

get the spirits into the world. what is holding them back? negotiation? a virtual clone. sometimes it is not possible to stream

why would you want a clone? because it connects with people and ideas that are similar and allows to build rather than reinvent.

1. universal publisher (thoughts, experience, weather data, sale/purchase offers, private cloud,...)
	1. local server for anything
	2. desktop software as interface
	3. offer hosting
2. clone and autoscraper, so much potential to replace things
3. physical instantiation
4. accelerate towards independent AI

stream raw files, made web friendly if necessary
#### P2P networks

[P2P networks Introduction](https://www.youtube.com/watch?v=Vw9ynzuGNSw) P2P security challenges:
- how to avoid eaves-dropping
- how to avoid peer identity impersonation
- how to avoid fabrication
- how to avoid replay attacks
- how to provide peer anonymity

### other

[https://docs.duck.sh/cli/#installation](https://docs.duck.sh/cli/#installation)
[ANSI codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

llms contain linguistic maps. they can draw the landscape for me if they know my maps too.
a language model that has not learned to answer questions tells stories.

TODO:
- choose a more sensitive font
- headings flow from the bottom up as text needs to become more differentiated. the higher they go the more abstract they become. Could be visualized by them getting an increasingly strong tint.
- design to differentiate internal and external link)
- add br after list if no empty line, to avoid making it part of li
- clear heading hierarchy
- html table support