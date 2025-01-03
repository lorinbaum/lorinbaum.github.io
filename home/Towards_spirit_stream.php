<!DOCTYPE html>
<html lang=en>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Towards spirit stream</title>
    <link rel="stylesheet" href="main.css">
    <link rel="shortcut icon" href="favicon.ico">
</head>

<body>
    <main id="top">
        <nav><a href='index.html'>Entrance</a><a href="#top">Top</a></nav>
        <article>
            <p class="post-date">Created <time datetime="2024-01-23T19:19:31+08:00">2024 01 23</time></p>
            <p>i can see the hive mind on the horizon.<br />
            there are hammers, sculptors, hammer blows and sculptures.<br />
                grouped and isolated<br />
                places to stay.<br>
                <br>
                like gazing into a painting, being guided through the impression<br />
                coming along to find a question asked at myself, seeing it unfold and building a response
            </p>
            
            <h1>Towards spirit stream</h1>
            
            <?php ob_start(); ?>
            
            <h2>Direction</h2>
            <ul>
                <li>update thoughts to the new choice of medium: pure html, css, php</li>
                <li>visualize the working model of how coherence oscillates</li>
                <li>integrate it with spirit stream vs X</li>
                <li>reconstruct history / changelog necessity and design</li>
            </ul>
            
            <h2>More refined</h2>

            <h3>Site structure</h3>
            <ul>
                <li>H1 Aspirational spirit stream of Lorin Baumgarten</li>
                <li>Introduction</li>
                <li>Quick Guide</li>
                <li>List of notes sorted by "most recently modified"
                    <ul>
                        <li>note structure:<ul>
                                <li>Text describing why the note exists</li>
                                <li>H1 Title</li>
                                <li>list of contents</li>
                                <li>H2 Direction</li>
                                <li>H2 more refined</li>
                                <li>H2 less refined - current thoughts, multiple different paths being explored, for more complete synchronization. </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>guiding philosophy</li>
            </ul>

            <h3>Stream components derivation</h3>

            <p>
                Senses explore, parse, filter<br />
                Stream of consciousness repeats patterns from<br />
                chaotic and far-reaching<br />
                to filtered and coherent knowledge<br />
                to actionable, linearized and accessible stories <br>
                <br>
                In writing, graphs, images, products<br />
                and the tools to build them<br />
                in progress<br />
                from memory <br>
                <br>
                Share the process in truth to<br />
                test, be surprised, dance, reproduce, join the cutting edge, offer, cohere, support, punish<br />
                into common languages per context<br />
                into any scopes<br />
                with any conditions<br>
                <br>
                Where I am,<br />
                When I am.
            </p>
            
            <h2>Less refined</h2>

            <h3>Components</h3>
            <ul>
                <li>Scrape, filter</li>
                <li>Writing and viewing bits that are grouped into "files" (patterns) along (at least) 3 axes: resolution, completion, age. These dimensions may use a:</li>
                <li>General framework for organization: files, tags, paths lead to the overlap between files, folders/links (graph file sytem. tags that have tags,... that have links to files). Becomes circular through backlinks and possible references from inside the file. Allow linking anything. Images, text, make super easy.</li>
                <li>Simple export into self contained copies</li>
                <li>(opt.) version control: extend, branch, merge and view changes. Version history is a graph of graphs</li>
                <li>compile into optimized formats (HTML)</li>
                <li>File encryption</li>
                <li>Analytics + docs = Interface to the machine</li>
                <li>Compatibility with most hardware to get closer to the user for convenience. (phone, emebedded devices)</li>
                <li>share on static server: SSH, HTTPS, IPFS(?), streaming (SRT?), API</li>
                <li>Dynamic server: authenticate into permission groups + opt. meet conditions (paywall, forms, etc.) to view some content. APi should allow for relaying: Watching a stream from my site but my server is too slow to serve it? Relay to other people -&gt; take load of my server -&gt; get better connection yourself!</li>
            </ul>

            <h3>Next version</h3>
            <p><strong>link based file system</strong><br />
                default html links. a linked file counts as a tag. API for finding backlinks and for search by tags like <a href="https://github.com/amoffat/supertag">supertag</a></p>
            <p><strong>history</strong><br />
                create snapshots: duplicate file, append datetime and link to it from <code>history</code> file.<br />
                later simple API to automate this, maybe create a diff dynamically and/or maintain a <code>changelog</code> that shows recent diffs.<br />
                git is removed, host site somewhere else<br />
                how to detect renames?</p>
            <p><strong>language</strong><br />
                options:</p>
            <ul>
                <li><i>continue writing in md, convert to html, put into a frame</i></li>
                <li>switch to asciidoc</li>
                <li>write pure html in vs code</li>
                <li>write html and create an md/asciidoc tag, write in that, convert</li>
            </ul>
            <p><strong>UI</strong><br />
                options:</p>
            <ul>
                <li>continue obsidian</li>
                <li>write extensions for obsidian</li>
                <li>
                    <p>write local server with ui in the browser:</p>
                    <ul>
                        <li>editor (use existing js OR new in js OR new in c (raylib?) -&gt; wasm)</li>
                        <li><i>converter (python -&gt; c -&gt; wasm OR js)</i></li>
                        <li>server: save files (python OR c OR js)</li>
                    </ul>
                </li>
                <li>
                    <p>.md -&gt; HTML</p>
                    <ul>
                        <li>inputs: path, (permission group)</li>
                        <li>settings: css, frame, favicon</li>
                        <li>(filter links to files outside permission (note this in cache))</li>
                        <li>convert md, put into frame</li>
                        <li>add css</li>
                        <li>output: html</li>
                    </ul>
                </li>
            </ul>
            <p><strong>interface</strong><br />
                content should be 1D: no infinite 2D boards, graphs or tables. Linearized content is easy to deal with and forces improved writing. it should still use the whole screen, not one column. fit as much content in columns onto the screen as possible, then scroll down to see the next page. book-like.<br />
                client side javascript / wasm to rerender if screensize changes.</p>

            <h3>Next next version</h3>
            <ul>
                <li>Interface: programmatically produce list of backlinks! and forward links by search. some code generates one-time, as a shortcut. some generates every time the file is displayed. like link lists.</li>
                <li>
                    <p>text interface like cli: search bar, commands, answer questions</p>
                </li>
                <li>
                    <p>Dynamic HTTP server</p>
                </li>
                <li>Authentication</li>
                <li>API to get raw files / folder structure</li>
            </ul>
            <hr />
            <p>OS that can be streamed. place to build and share.</p>
            <p>frontend:</p>
            <ul>
                <li>UI: display underlying functions, get input</li>
                <li>Editor: html, css, md, anything with preview</li>
                <li>compiler: html, css, js</li>
                <li>can launch local backend</li>
            </ul>
            <p>strategy:</p>
            <ul>
                <li>c+opengl for fast, custom editor, compile to local too but without wysiwyg preview (requires browser engine) or only for simple formatting. write my own fucking browser engine.</li>
                <li>use browser ui only, javascript for logic, harder to display the way i like, slightly slower</li>
            </ul>
            <p>backend:</p>
            <ul>
                <li>
                    <p>server: manage connections, files, users, rendering</p>
                </li>
                <li>
                    <p>terminal editor in C</p>
                </li>
                <li>OpenGL GUI editor</li>
                <li>HTML compiler</li>
                <li>compile to WASM</li>
                <li>WYSIWYG preview</li>
            </ul>
            <p>i would be replacing html, css, js while still requiring a browser engine to preview my stuff in wysiwyg and render html that the crawlers can read.</p>
            <p>php backend<br />
                js frontend</p>
            <p>php is interpreted, so no desktop-app like behavior. needs a webserver that launches it. and php runtime.</p>

            <h3>Dumping on X</h3>
            <p>The social media I know are mostly incoherent<br />
                They bet on an algorithm to <i>always</i> feed me <i>engaging</i> scraps from someone.<br />
                Some scraps are large, long form podcasts.<br />
                Each account is a scrap factory.<br />
                Consider this post from the highly respectable Lex Fridman and the responses:<br />
                <img alt="" src="socialmedia_heaven.png" /><br />
                Utter crap and I am sad to have spent time reading this.<br />
                Without context, such (all visible) statements appear arbitrary and are virtually worthless.<br />
                Assuming I disagree with any of the visible statements, where would I find an explanation? A sincere mind exploring its meaning? On his profile?<br />
                <img alt="" src="lexfridmanX.png" /><br />
                If I wanted to listen to his podcasts, youtube offers a significantly superior interface - many small tiles, one per podcast.<br />
                The best use of this platform I have found is as a torrent of near-random ideas, a glimpse into what bothers humans on their toilet breaks.<br />
                Even the most enjoyable profile I know is a stream of scraps, each pointing in different directions:<br />
                <img alt="" src="plinzX.png" /><br />
                Presumably, in X's endgame, the incoherence problem is solved by an allmighty algorithm that collects and connects, maybe translates information from everywhere into the most valuable personalized package and delivers it directly into my perception. Similarly, it would collect information from me into its X-the-everything-app-database.<br />
                X owns the algorithm and the data.<br />
                I am unaware of sites that function fundamentally differently. Even reddit or discord.
            </p>
            <p>In this spirit I am invited to produce scraps. I happen to have no desire to produce scraps. I perceive it as wasteful to produce new scraps every time my opinion or work evolves and instead would like to keep building towards something increasingly coherent.</p>
            <p><img alt="" src="abandoned-building.jpg" /><br />
                Regarding this image, I previously noted:</p>
            <blockquote>
                <p>These abandoned buildings emitted an aura of great adventure. Ironically? Similar to buildings under construction, they are asking to be used, transformed, to become part of a new story. As they become "finished", this aura weakens, they become "boring". Their (unnecessary?) shiny finish discourages major modification, like drilling into or erecting new walls.</p>
                <p>Think solar panels. theoretically, they need sun+cables+box that could stand anywhere. In the "finished" homes that I know, this is (unnecessarily?) more complicated. Access to the roof? Facade mounting possible? Get cables by the window inside? Need approval from all other residents?<br />
                    What of this makes practical sense? Is it mostly a social problem? Is it solved by having virtual clones that can negotiate for people cheaper and quicker so people can live where their spirit aligns more with the opportunities of the environment?</p>
                <p>It seems that a larger precentage of things in that ("abandoned") environment are beautiful to me, compared to "nice, calm, high living standard" environments. They become too "nice" and they disgust me, make me want to leave or destroy them.</p>
            </blockquote>
            <p>Also applies to different places like these:<br />
                <img alt="" src="taiwan_taichung_roomwindow.jpg" /><br />
                <img alt="" src="taiwan_arcade_kitchen.jpg" />
            </p>
            <p>I see their potential for transformation and their openness to colonization by my spirits.<br />
                Humans are part of the environment that I want to extend into. To cohere and build with.<br />
                Part of this is a stream of new and foreign ideas, but most of it is building:</p>
            <blockquote>
                <p>i can see the hive mind on the horizon.<br />
                    there are hammers, sculptors, hammer blows and sculptures.<br />
                    grouped and isolated<br />
                    places to stay.</p>
                <p>like gazing into a painting, being guided through the impression<br />
                    coming along to find a question asked at myself, seeing it unfold and building a response</p>
            </blockquote>
            <p>The allmighty X algorithm may eventually facilitate this. But it will have to construct and maintain coherent "rooms" from scraps. Seems inefficient.</p>
            <p>Instead make it easy to build rooms to reflect myself and make them easy to interconnect so they can take on virtually arbitrary size. Coherence from bottom up?</p>
            <h3>other</h3>
            <p>markdown</p>
            <ul>
                <li>links to files with <code>![]</code> and just paste their contents like with images, depending on file type</li>
            </ul>
            <p>server</p>
            <ul>
                <li>dyanmic rendering + cache</li>
            </ul>
            <p>database</p>
            <ul>
                <li>tags<ul>
                        <li>permission groups</li>
                        <li>encrypted (raw=renders decrypted file site on client)</li>
                    </ul>
                </li>
                <li>users<ul>
                        <li>permission groups</li>
                        <li>passwords</li>
                    </ul>
                </li>
                <li>shared links, their scope and expiration</li>
                <li>logs</li>
            </ul>
            <p>UI</p>
            <ul>
                <li>download (raw) folder / selection</li>
                <li>selection, file name, created, modified, tags, raw</li>
                <li>generate share link</li>
            </ul>
            <p>home</p>
            <ul>
                <li>intro</li>
                <li>contact</li>
                <li>payment</li>
                <li>most recently changed files and what changed</li>
                <li>login</li>
            </ul>
            <p>top row in file</p>
            <ul>
                <li>go to top button, where the index is too, so can reference another heading easily.</li>
                <li>Entrance</li>
                <li>previous and next if usable</li>
                <li>path to file</li>
                <li>download file</li>
                <li>view raw</li>
            </ul>
            <p><a href="https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797">ANSI codes</a></p>
            <p>llms contain linguistic maps. they can draw the landscape for me if they know my maps too.<br />
                a language model that has not learned to answer questions tells stories.</p>
            <p>TODO:</p>
            <ul>
                <li>choose a more sensitive font</li>
                <li>design to differentiate internal and external link</li>
                <li>clearer heading differentiation</li>
                <li>cli note for attachments that are out of use</li>
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>centralized</th>
                        <th>decentralized</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>mostly HTTPS, SSL certificate</td>
                        <td>custom protocol, slow</td>
                    </tr>
                    <tr>
                        <td>no static address or hard to get -&gt; DDNS</td>
                        <td>content addressing</td>
                    </tr>
                    <tr>
                        <td>domain</td>
                        <td>web3 gateway or its undiscoverable<br>= domain, DDNS</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>easily connectable to wallets</td>
                    </tr>
                    <tr>
                        <td>everyone knows who I am</td>
                        <td>can be anonymous</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>servicing capability automatically expands<br>if people host my stuff</td>
                    </tr>
                    <tr>
                        <td>Ridiculous. Rarely useful, it seems. If the internet sucks, those responsible must be confronted directly, not joined by an inefficient alternative.</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <p><a href="https://docs.gitlab.com/ee/user/markdown.html">git flavored markdown</a></p>
            <p><a href="https://twitter.com/karpathy/status/1751350002281300461">Karpathys ideal blogging platform</a><br />
                <a href="https://stephango.com/file-over-app">file over app</a>
            </p>
            <p>"lazy payment" - unrealized costs become realized when someone pays transaction costs.<br />
                optionally anonymously.</p>
            <p>WYSIWYG<br />
                payment + PAYG</p>
            <p>wikipedia<br />
                tor<br />
                interplanetary file system</p>
            <p>disqus<br />
                plausible analytics<br />
                atom/rss</p>
            <p>"Digital gardens"<br />
                <a href="https://github.com/MaggieAppleton/digital-gardeners">https://github.com/MaggieAppleton/digital-gardeners</a><br />
                <a href="https://simonewebdesign.it/">https://simonewebdesign.it/</a>
            </p>
            <p><a href="https://docs.python.org/3/tutorial/modules.html">Python modules</a></p>
            <p>C preprocessor<br />
                embedded programming<br />
                <code>puts</code> function for errors?<br />
                LLVM / CLANG<br />
                <code>make</code> files for easy compilation
            </p>
            <p>non-hierarchical file system.<br />
                bytes, pointers -&gt; pointers are bytes too and can store tags for their bytes.<br />
                files, tags. Tags are files too. So, structure defined by links.<br />
                How to navigate it?<br />
                design an entry point, link files like obsidian already supports it. Wikipedia.<br />
                Graph view is useless.<br />
                search files by how they are connected.<br />
                tags are unnecessary, they are literally a weak link<br />
                navigate through forward and backward links.<br />
                optionally select an overlap of multiple links. like ctrl-click to add to the group which must overlap.<br />
                the backlink that I come from should be highlighted<br />
                Information, however, becomes hierarchically organized as it matures. No problem. Hierachy is a subset of this system.<br />
                converting from hierarchy is easy. converting to hierarchy requires disambiguation: which link(s) should become the files folder(s)? Mutltiple folders means the file is copied.<br />
                drives are tags.<br />
                branches are tags.<br />
                snapshots from previous commits belong to the commit tag<br />
                omg<br />
                easy<br />
                git gives UI for merging files and tags, like from pull requests or other branches.<br />
                how to limit number of forward links while maintaining their precision? display them as searchable list. searchable also for overlap.</p>
            <p>content addressing solves the streaming relay problem? Choose to relay and others automatically connect based on their connection cost.<br />
                optionally pay for relay<br />
                = IPFS, (filecoin(?))</p>
            <p>messages are files automatically received and that I actively send out.<br />
                can be (are) grouped under tags depending on sender.</p>
                
            <table>
                <tr>
                    <td>Taken hierarchy path</td>
                    <td>forward links, some external</td>
                </tr>
                <tr>
                    <td>backlinks</td>
                    <td>broken links</td>
                </tr>
            </table>

            <ul>
                <li>render images into ones that can load progressively</li>
                <li>
                    <p>if opening encrypted files, use client side javascript to ask for a key to decrypt them.</p>
                </li>
                <li>
                    <p>generate links for sharing files and resolve them in requests</p>
                </li>
                <li>block users that request too much or try passwords</li>
            </ul>
            <p>desktop should be a text file. can do links, images, everything. <br />
                os should support generating output at the cursor using code (open cmd at paste output at cursor)<br />
                some code sits permanently in the file to produce the output when desired.<br />
                when downloading them, I can choose to rerender them, but they don't by default.<br />
                code block: language, kernel (or default), out-only, autorun<br />
                variable context works per file, like jupyter notebooks.<br />
                rendering program keep some default variables.<br />
                file rendered in layers. first step is to execute the blocks.<br />
                allow autorun (trust) is decided by each viewer. advised against.</p>
            <p>for sharing, metadata should be used to specify a source where the file came from so links can be resolved. also author.</p>
            <p>rmlUI<br />
                or local server and actual UI in the browser<br />
                then remote editing from mobile?</p>
            <p>run local server, browser supplies UI<br />
                clicking edit downloads the raw file and the editing software<br />
                saving it could send it to the server as a message (merge request, requires authentication?)</p>
            <p>https://explained-from-first-principles.com/internet/#out-of-order-delivery</p>
            <p>messages understood through the protocol<br />
                handle unexpected response, ask for retransmission, time out if silent, maintain order of messages, account for latency.</p>
            <p>5 layers</p>
            <ol>
                <li>
                    <p>link:<br />
                        addressing using MAC address within a network through ethernet, wifi, bluetooth protocols. maximum transmission unit (MTU) = how many bits in one package max.</p>
                </li>
                <li>
                    <p>network layer<br />
                        uses ip address to connect between different networks through the Internet Protocol (IP). routers send error messages and other information about itself using ICMP (internet control message p)</p>
                </li>
                <li>
                    <p>transport layer<br />
                        os sending/receiving stuff to/from to processes running in the OS. uses port numbers to differentiate. a process that exists to respond is called server, one initiating the connection is called client.<br />
                        can use transmission control p (TCP). pretends there is a direct connection (not packets). enumerates, buffers and confirms received messages to put into right order, retransmit or request retransmission if no confirmation was received. uses checksum for ensuring reliability. sender slows down if it gets no feedback (how is this part of the protocol?). tcp handshake before actual payload transfer sets a random starting point for the enumeration, making it hard for randos to impersonate senders (attackers must now guess correctly to enter a ongoing chat)<br />
                        user datagram p (UDP) fast, unreliable connectionless transport. only source, destination ports, length and checksum in header. streaming!</p>
                </li>
                <li>
                    <p>Security layer</p>
                </li>
            </ol>
            <p></p>
            <p></p>
        </article>
    </main>
    <?php
    // create table of contents
    include "toc.php"; 
    $content = ob_get_clean();
    echo generateTOC($content);
    ?>
</body>

</html>
