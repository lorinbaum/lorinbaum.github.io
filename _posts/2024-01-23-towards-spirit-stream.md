---
date: 2024-01-23T19:19:31+08:00
title: Towards spirit stream
layout: post
usemathjax: False
updated: 2024-04-14T12:32:07+00:00
commitMsg: implement changes page + merged and distilled scss
---
There seems to be way living inward, but genuinely interesting things come from the unknown. And turning outward seems like a great adventure. Offer synchronization with my brain to the world. Offer trust through transparency. I'd love to see minds, imagine the possible depth.
Also curious where this leads: [Learn in public](https://www.swyx.io/learn-in-public).
How to build the spirit stream?

# Towards spirit stream

- [Direction](#Direction)
- [More refined](#More%20refined)
	- [Previous page design recap](#Previous%20page%20design%20recap)
		- [the pragmatist says it sucks](#the%20pragmatist%20says%20it%20sucks)
	- [Note structure](#Note%20structure)
- [Less refined](#Less%20refined)
	- [Spirit stream temple vision](#Spirit%20stream%20temple%20vision)
	- [Stream structure design](#Stream%20structure%20design)
	- [Tech](#Tech)
	- [other](#other)

### Direction

2024-01-30 03:35
- Stream more notes, see how the interface works

2024-03-07 20:34
- new note structure
- notes listed by modified date
- stream with all changes
- heading/link formatting

## More refined

### Previous page design recap

![](/assets/website.png)

It aimed to be maximally accurate. I'm an opaque blob with some projects on the surface.
Who am I to categorize my project correctly? Instead, I dream of maps. They speak for themselves and display opportunity. In this spirit, projects are scattered over the surface, users were able to rotate the blob. The distance between them was determined by "connections" I set as I saw fit. More flexible and accurate than categories, I thought.
I then simulated the surface as if connected blobs attract each other and disconnected ones repell each other. This was meant to lead to a visually quickly and intuitively understood blob distribution.

bigger spheres = more time spent on the project
brighter spheres = newer project
thumbnails of proximate spheres that act as buttons to the projects make them more distinct.


![](/assets/pasted-image-20240123193144.png)
example for connections: Information about me (smol white dot) and the two rather personal works nearby seemed "connected" to me: they all give a more direct image of my mind.

![](/assets/pasted-image-20240123193439.png)

In the summary at the beginning of each project page, connected notes (neighbors) were referenced explitly to lay out the structure and provide further reading.

#### the pragmatist says it sucks

- horrible search engine optimization - all content was generated dynamically and undiscovered by crawlers
- can't use it without javascript
- inefficient, not much to the point, just a blob, relies on curiosity of visitor. most interesting bubble could remain unseen on the back side.
- information structure too weak to support large number of projects at various levels of resolution (density, thought hours) and versions
	- low benefit from connections at high cost of visual complexity. imagine dozens of project bubbles

### Note structure

- Why (without heading)
- Title
- list of contents (without heading)
- Direction
- more refined
- less refined - current thoughts, multiple different paths are explored, for more complete synchronization. 

## Less refined

### Spirit stream temple vision

temple = manifestation of the spirits?
access port to the spirits
this is a tool, not a hypothetical artwork asking for attention.
an expansion to the user

streaming the spirits should require minimal additional work

**reader perspective:**
- I want to efficiently meet the spirits where they differ from me
- I intuitively determine places of interest. I look at the landscape of information, like any great painting presents it and it guides me
- I easily visit and move between places of interests

like a field where it is easy to identify parts that are newly planted and parts that are more grown

Why read?
- Interesting topic
- New / updated 
Why not?
- Too long
- too new and low res
- too complicated structure

comprehensive:
- support large number of notes
- differnet media
- version history (remove burden of logging inside note)

### Stream structure design

design test
![](/assets/pasted-image-20240122203205.png)
media format is not the point but is taking much attention and space. Too much information. More relevant is what area was changed, maybe what exactly was changed.

![](/assets/pasted-image-20240126212550.png)
history button is not necessary, rarely used I imagine.
click on "updated 10 hours ago" to see what exactly has changed in the last update. easy with `difflib`.

history page could get more stats, person on history page is looking for it
show *how much* each area changed and also show deletions
![](/assets/pasted-image-20240126212515.png)

version control
- record brain in action, not just result
- keep the current notes tidy without deleting anything forever
- show when something is new

better navigation. make it subtle on the side somehow. Mouseover to increase contrast?
collect some ideas online


Version 2024 03 07:
![](/assets/20240307-spirit-stream.png)
2024-02-28 21:04 rant collection, the spirit stream SUCKS!
- where is the history?
- the newest update column provides only garbage information, who cares if I fixed a typo? It should reflect the actual content not an abstracted commit message I made up.
- why is git storing my files in this unreadable way?
- who decided to make links suddenly be red?
- why can't I tell when I already visited them?
- is it an external or internal link?
- can't tell the difference between headings
- who needs these lines between notes in the table?
- how do I see only what was recently changed?
- is this even streaming my spirits? then what is happening during all this downtime between updates? where is the spirit?
- where is the manifested streamer? where is my spider hat that records what I am experiencing directly?
### Tech

- there is an obsidian vault with markdown notes and templates
- they are converted to something viewable on a website, which obsidian already does for its own display.
	- links
	- paragraphs
	- headings
	- images
	- lists
	- code blocks
	- LaTeX
- build a functional website from this including some parametric design like "make link for each note"
- upload to server

currently python script helps convert markdown files to something jekyll can use
jekyll builds the site
committed to github repository
viewable on github pages

python script
- changes wikilinks to standard mark down links
- mathjax:
	- add a return before mathjax that is not inline
	- for inline mathjax, add dollars before and after because it does not work otherwise, but will rendering inline if surrounded by text ([its great](https://webdocs.cs.ualberta.ca/~zichen2/blog/coding/setup/2019/02/17/how-to-add-mathjax-support-to-jekyll.html)
- git add .
- git commit -m \[messge]
- git push
- (design to differentiate internal and external link)
- (add br after list if no empty line, to avoid making it part of li)
- (add heading hierarchy before every heading for orientation make nice heading symbols - distracting? try out, probably a waste of time, but could at atmosphere. Fake aesthetic? shit. only needed for ###, ####, #####, ######)

general:
- (can't tell what number a heading is, add lines before it to indicate hierarchy and make font larger)
- `tqdm` for progress bars

### other

[https://docs.duck.sh/cli/#installation](https://docs.duck.sh/cli/#installation)
[ANSI codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

- Discord Server / Email contact like a cafe where people would meet me
	- fake aesthetik. discord server is what it functionally is. what is it? people will know?
	- how to make it easy to reach me and know that it is an actual place, not just a dead contact form?
- Guide gaze like in a painting, comprehensive visual impression
	- i wish. what is the structure of information? what is the map to represent the information. Was in a buddha museum recently. figures, reliefs. They spoke a language I didn't understand (the images) and it was accordingly boring. How to communicate in high resolution without aliening people and forming an "in group". Should be possible as information is ideally presented to each person differently based on past experience/knowlege/predisposition. 

where does the history graph go when notes are refactored? was it merged into somewhere else?

"Digital gardens"<br>[https://overreacted.io/](https://overreacted.io/)<br>[https://github.com/MaggieAppleton/digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)<br>[https://wiki.nikiv.dev/sharing/everything-I-know](https://wiki.nikiv.dev/sharing/everything-I-know)<br>[https://simonewebdesign.it/](https://simonewebdesign.it/)<br>[https://stephango.com/](https://stephango.com/) (blog)<br>[https://karpathy.github.io/](https://karpathy.github.io/) (blog, jekyll)

stream is continuous, repeats patterns from the past. the past is filtered and organized, the present it not always organized -> inbox
I am an information structuring engine
old, high res, crystallized structures are refined and references as we go
in them, the structures are hidden
like Joscha Bach does it

as information is refined, a few blocks of interest form.
they are reused and every new reuse is a different path through the same blocks connecting and testing them with other ideas and experiences.
they may fragment into smaller blocks to become more reusable
a path through the blocks that is the ultimate test of their consistency is a true story.
A true story is indistinguishable from life
a language model that has not learned to answer questions tells stories, but with low refinement. It recounts its experience given a prompt.
usually, describing individual blocks becomes too laborious and abstract, so the path through the blocks is the preferred medium.
an individual block and its environment might be represented in an artwork, aiming to maximize resolution around this area of the idea landscape.
If it is refined enough its essence will be recognized even by those who see the same block in lower resolution in their own thinking.
Perhaps this node will set off a story in the observer, automatically connecting itself in the observers network.
it has become an effective meme.

In math and physics perhaps such a block is a formula, a new tool to be applied. The stories it produces are its applications.
in mathematics, a game with strict rules (by my understanding), the truth of a block can be verified.

engineering, of which I mostly know programming, feels like branching off of a given path or some base of information in search of new paths.
Reverse engineering is starting from the fog and trying to find the branch of light to clear it.

when a story takes a "wrong turn", I remain curious about its branches but am swept away.
if there is no high resolution node that points to that branch, as there often isn't, I have to walk all the paths that I can find (that the person speaks or writes about) and see if I can explore it on my own from there.

I need to remember that the world works in true stories and that writing and formalizing, extracting, refining and building blocks is only there to improve future stories.
Maybe it is an exploration in its own way. When a lot of information has been picked up but not refined, there may be gems in it.

It sucks that so many stories are already told but I don't know them. Maybe it is childhood curiosity that leads to these stories. I am, now, not patient enough to read them and instead may waste time reinventing them.
However, I must verify them anyway and as long as I feel that there are things to be seen in the world, I must explore it.
I must build things to survive and to reach a vantage point.
It will be occasionally good to consider the stories so as to avoid mistakes.

it is a holy mission to build the website
it will make my brain accessible like never before and will make my spirits extractable.

2024-01-26 20:40
aesthetic refinement: choose a more sensitive font


the stream is pouring into different areas all the time. the challenge is to see those areas instead of only the stream. its like seeing individual hammer blows but not the sculpture. need to see both and at various resolutions. how to translate it?
history is made of changes. the more complete the stream becomes, the more the current state will become visible. There is no need to see the whole world at a particular point in time because the world at any moment is no bigger than its changes and if the changes are documented with high resolution, one already sees the world as it was. To achieve this resolution, perceptions need to be recorded too.
1. notes
2. note changes, chronological
	- will eventually grow *very* big with images, video.
		- lazy loading and search
		- or separated into different pages by date (month or year)
	- structure
		- date
			- note title
				- heading hierarchy
					- changes (pictures are smaller, changes within the line should be visualized compactly)
			- note title for new, renamed and deleted notes

restructure to show "why" first, then title, links, content, work in progress
titles and links are parts of the same thing, headings. one has the content next to it, one points to it.
headings flow from the bottom up as text needs to become more differentiated. the higher they go the more abstract they become. Could be visualized by them getting an increasingly strong tint.

2024-03-07 19:30
assuming the structure notes + stream is good.
it may reflect blogs/papers/books + X
technically, X alone supports this through "highlights", which could be long posts or any other media
X does not support editing them or advanced formatting for long posts like code, internal links, heading hierarchy.
X offers interaction
and distraction
here, the scope goes beyond the spirit stream to organizing information. creating rooms for thought, development and exhange.
Need to specify further to see how big the upside of such a system is, if it is worth pursuing. Look for literature since this is a long game.
This leads towards what I want to use AI for.

should test it for the spirit stream by implementing:
- notes listed by modified date
- stream with all changes
	- date
	- note that changed
	- deleted parts (gray)
	- new parts (green)
- new note structure
- heading/link formatting


- entrance fixed nav is bocking title
- change to %20 instead of dash and to spaces in \#id