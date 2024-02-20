---
date: 2024-01-23T19:19:31+08:00
title: Spirit stream design
layout: post
usemathjax: False
updated: 2024-02-20T13:51:42+00:00
commitMsg: Started illustration of backpropagation of MNIST digit classifier
---
## Why

Sick of not interacting with the world. Genuinely engaging things come from the unknown. Offer synchronization to the world. Anybody who wishes to, can synchronize with my brain. Trust through transparency, I'd love to see minds, imagine the possible depth. Also: [Learn in public](https://www.swyx.io/learn-in-public)
This note asks how to get there.

## How

- [What](#what)
	- [Previous page design recap](#previous-page-design-recap)
		- [the pragmatist says it sucks](#the-pragmatist-says-it-sucks)
	- [Note structure](#note-structure)
- [Work in progress](#work-in-progress)
	- [Spirit stream temple vision](#spirit-stream-temple-vision)
	- [Structure](#structure)
	- [version control implementation](#version-control-implementation)
	- [Tech](#tech)
	- [other](#other)

### Direction

2024-01-30 03:35
- Stream more notes, see how the interface works
- test new version control implementation

## What

### Previous page design recap

![](/assets/website.png)

It aimed to be maximally accurate. I'm an opaque blob with some projects on the surface.
Who am I to categorize my project correctly?
I dream of maps. Maps speak for themselves and they display opportunity.
In this spirit, projects are scattered over the surface, users were able to rotate the blob.

bigger spheres = more time spent on the project
brighter spheres = newer project
thumbnails of proximate spheres for recognizability, efficiency (no click needed) and act as buttons

how close they were was determined by "connections" I set.
An optimization algorithm computed the state of "lowest potential energy" given connecting force - repulsive force between foreigners.

![](/assets/pasted-image-20240123193144.png)
figure: Information about me (smol white dot) and the two rather personal works nearby seemed "connected" to me. they all give more direct image of my mind

![](/assets/pasted-image-20240123193439.png)

In the summary at the beginning of each project page, connected notes (neighbors) were referenced to more explitly lay out the structure and help with further reading.

#### the pragmatist says it sucks

- horrible search engine optimization - all content was generated dynamically and undiscovered by crawlers
- can't use it without javascript
- inefficient, not much to the point, just a blob, relies on curiosity of visitor. most interesting bubble could remain unseen on the back side.
- information structure too weak to support large number of projects at various levels of resolution (density, thought hours) and versions
	- low benefit from connections at high cost of visual complexity. imagine dozens of project bubbles

### Note structure

- Why
- How (Overview?)
- Direction
- What (Content) - core, most high res and concise part of the note. should improve with later note versions
- work in progress - low res, current thoughts, multiple different paths are explored, for more complete synchronization

## Work in progress

### Spirit stream temple vision

temple = manifestation of the spirits?
access port to the spirits
this is a tool, not a hypothetical artwork asking for attention.
an expansion to the user

all while minimally distracting from productive thought

**reader perspective:**
- I want to efficiently meet the spirits where they differ from me
- I intuitively determine places of interest. I look at the landscape of information, like any great painting presents it and it guides me
- I easily visit and move between places of interests

like a field where some parts newly grow, some are more complete
easy to identify where to go

Why read?
- Interesting topic
- New / updated 
Why not?
- Too long
- too new and low res

comprehensive:
- support large number of notes
- differnet media
- version history (remove burden of logging inside note)

stream mirrors personal notes and is easily maintained 

### Structure

design test
![](/assets/pasted-image-20240122203205.png)
media format is not the point. Too much information. More relevant is what area was changed, maybe what exactly was changed

![](/assets/pasted-image-20240126212550.png)
history button is not necessary, rarely used I imagine.
click on "updated 10 hours ago" to see what exactly has changed in the last update. easy with `difflib`.

history page could get more stats, person on history page is looking for it
show *how much* each area changed and also show deletions
![](/assets/pasted-image-20240126212515.png)

version control
- record brain in action, not just result
- keep the result tidy without loosing anything
- show when something is new
- new filter: get rid of garbage without loosing it forever makes latest versions cleaner

inside note, only show the note and history button, no need to inform about update, person has already decided not to click on "updated 10 hours ago" to see changes.

better navigation. make it subtle on the side somehow. Mouseover to increase contrast?
collect some ideas online

### Tech

obsidian write in publicNotes folder
python script converts to something jekyll can use
build jekyll
upload to server

Should be possible to click update, builds jekyll and uploads to site.<br>[https://docs.duck.sh/cli/#installation](https://docs.duck.sh/cli/#installation)

[ANSI codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

python script
- changes wikilinks to standard mark down links
- mathkax:
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

arguably, the code for this page should be on github