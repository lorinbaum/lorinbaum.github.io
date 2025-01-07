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
    <main>
        <nav><a href='index.html'>Entrance</a><a href="#top">Top</a></nav>
        <article>
            <div id="top"></div>
            <p class="post-date">Created <time datetime="2024-01-23T19:19:31+08:00">2024 01 23</time></p>

            <p>
                i can see the hive mind on the horizon.<br>
                there are hammers, sculptors, hammer blows and sculptures.<br>
                grouped and isolated<br>
                places to stay.<br>
                <br>
                like gazing into a painting, being guided through the impression<br>
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
            <h3>Next version</h3>
            <ul>
                <li>use default links like wikipedia. see if more is needed. api for file management, renaming, searching could become useful</li>
                <li>history still uses git. I wouldn't exactly know how to improve it. Write changelog manually, see if automatable. commit history is separate.</li>
                <li>write pure html, css, js, php. html and css seem hard to improve significantly, both in spec and implementation. js, php seem more arbitrary, pragmatic.</li>
                <li>VS Code for UI. Destorys WYSIWYG. CSS is the visual vocabulary for html. html is pure semantics and its independence from style give nice flexibility. WYSIWYG not needed? Complicated, extendable editor like VS Code seems like good design. Who knows what and how people want to edit. Best editor is a tool to build your own editor?</li>
                <li>Content on this site stays in a column. multi column layout to fill screen. Highly flexible and stories are linear anyway. images and their software (external) suffice to model graphs (and generally anything what can't be linearized yet). pdf viewer like layout very laborious and ugly. CSS does not support it directly. Settle for horizontal scrolling instead.</li>
            </ul>

            <h3>Next next version</h3>
            <ul>
                <li>Dynamic HTTP server</li>
                <li>Authentication -> private files</li>
                <li>pdf export?</li>
                <li>payment</li>
                <li>render images into ones that can load progressively</li>
                <li>if opening encrypted files, use client side javascript to ask for a key to decrypt them.</li>
                <li>generate links for sharing files and resolve them in requests</li>
                <li>php code highlighting</li>
            </ul>

            <h3>Visual design</h3>
            <ul>
                <li>choose a more sensitive font, -> ligatures</li>
                <li>differentiate internal and external link</li>
                <li>clearer heading differentiation</li>
            </ul>

            <h2>More refined</h2>

            <h3>Stream components derivation</h3>

            <p>
                Senses explore, parse, filter<br>
                Stream of consciousness repeats patterns from<br>
                chaotic and far-reaching<br>
                to filtered and coherent knowledge<br>
                to actionable, linearized and accessible stories <br>
                <br>
                In writing, graphs, images, products<br>
                and the tools to build them<br>
                in progress<br>
                from memory <br>
                <br>
                Share the process in truth to<br>
                test, be surprised, dance, reproduce, join the cutting edge, offer, cohere, support, punish<br>
                into common languages per context<br>
                into any scopes<br>
                with any conditions<br>
                <br>
                Where I am,<br>
                When I am.
            </p>
            
            <h2>Less refined</h2>

            <h3>Components</h3>
            <ul>
                <li>scrape</li>
                <li>filter</li>
                <li>view</li>
                <li>write</li>
                <li>find</li>
                <li>keep history: extend, branch, merge and view changes.</li>
                <li>compile into sharing optimized formats</li>
                <li>encryption</li>
                <li>Introspection: analytics, docs</li>
                <li>compatibility for convenient use</li>
                <li>share with scope</li>
                <li>host: for human and machine
                    <ul>
                        <li>static content</li>
                        <li>dynamic for authentication and API if any</li>
                    </ul>
                </li>
            </ul>

             <h3>Coherence, X and building places</h3>
            <figure>
                <img class="fullwidth" src="coherence.gif" alt="">
                <figcaption>Stream of consciousness coherence forming and dissolving due to imperfection</figcaption>
            </figure>
            <p>Coherent parts form a simpler, larger structure than themselves.</p>
            <p>How to increase coherence?</p>
            <p>Lay out the parts, find patterns and simplify the whole</p>
            <p>The X feed can present a series of conscious states</p>
            <p>New posts can summarize old ones, but I argue, this is a poor way to organize. Condensed posts will drown in less condensed posts. "Highlights" is insufficient.</p>
            <p>I find, that I want to construct spaces, externalize my consciousness over time, condense experience.</p>
            <p>The relationships between content in this space is additional content. Most valuable information mostly connects instead of being self-contained.</p>
            <p>Regrettably, X and other platforms poorly facilitate building and containing spaces, which makes them largely empty for me. Instead of using people's spaces to improve recommendation, X relies on the algorithm to solve it all, to build the spaces itself from the feed and present the user with coherence.</p>
            <p>Less feed-based, more commit-based, like Git. Commit history or a selection of it still form feeds.</p>
            <p>An honest, beautiful place, that I can merge with is the one that I build as I need it, using it myself to view, reference and restructure my ideas.</p>
            <figure>
                <img alt="" src="abandoned-building.jpg" />
                <figcaption>Some places offer ground to build, invite adventure, ask to be transformed.</figcaption>
            </figure>
            <p>An information rich place is one my spirits can colonize effortlessly.</p>
            <blockquote>
                <p>
                    i can see the hive mind on the horizon.<br>
                    there are hammers, sculptors, hammer blows and sculptures.<br>
                    grouped and isolated<br>
                    places to stay.
                </p>
                <p>
                    like gazing into a painting, being guided through the impression<br>
                    coming along to find a question asked at myself, seeing it unfold and building a response
                </p>
            </blockquote>

            <h3>other</h3>
            <p>database</p>
            <ul>
                <li>permission groups</li>
                <li>encrypted (raw=renders decrypted file site on client)</li>
                <li>users<ul>
                        <li>permission groups</li>
                        <li>password hashes</li>
                    </ul>
                </li>
                <li>shared links, their scope and expiration</li>
                <li>logs</li>
            </ul>
            <p><a href="https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797">ANSI codes</a></p>
            <p>llms contain linguistic maps. they can draw the landscape for me if they know my maps too.<br>
            a language model that has not learned to answer questions tells stories.</p>

            <!-- <table>
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
            </table> -->
            <p><a href="https://twitter.com/karpathy/status/1751350002281300461">Karpathys ideal blogging platform</a><br>
                <a href="https://stephango.com/file-over-app">file over app</a>
            </p>
            <p>
                "lazy payment" - unrealized costs become realized when someone pays transaction costs? optionally anonymously.<br>
                payment + PAYG<br>
                wikipedia<br>
                tor<br>
                interplanetary file system</p>
                disqus<br>
                discord<br>
                plausible analytics<br>
                atom/rss<br>
                C preprocessor<br>
            </p>

            <p>"Digital gardens"<br>
                <a href="https://github.com/MaggieAppleton/digital-gardeners">https://github.com/MaggieAppleton/digital-gardeners</a><br>
                <a href="https://simonewebdesign.it/">https://simonewebdesign.it/</a>
            </p>
            <p>non-hierarchical file system.<br>
                bytes, pointers -&gt; pointers are bytes too and can store tags for their bytes.<br>
                files, tags. Tags are files too. So, structure defined by links.<br>
                How to navigate it?<br>
                design an entry point<br>
                Graph view is useless.<br>
                search files by how they are connected.<br>
                tags are unnecessary, they are literally a weak link<br>
                navigate through forward and backward links.<br>
                optionally select an overlap of multiple links. like ctrl-click to add to the group which must overlap.<br>
                the backlink that I come from should be highlighted<br>
                Information becomes hierarchically organized as it matures. No problem. Hierachy is a subset of this system.<br>
                converting from hierarchy is easy. converting to hierarchy requires disambiguation: which link(s) should become the files folder(s)? Mutltiple folders means the file is copied.<br>
                drives are tags.<br>
                branches are tags.<br>
                git gives UI for merging files and tags, like from pull requests or other branches.<br>
                how to limit number of forward links while maintaining their precision? display them as searchable list. searchable also for overlap.</p>
            <p>content addressing solves the streaming relay problem? Choose to relay and others automatically connect based on their connection cost.<br>
                optionally pay for relay<br>
                = IPFS, (filecoin(?))</p>
            <p>messages are files automatically received and that I actively send out.<br>
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

            <p>https://explained-from-first-principles.com/internet/#out-of-order-delivery</p>
            <p>
                messages understood through the protocol<br>
                handle unexpected response, ask for retransmission, time out if silent, maintain order of messages, account for latency.
            </p>
            <p>5 layers</p>
            <ol>
                <li>
                    <p>link:<br>
                        addressing using MAC address within a network through ethernet, wifi, bluetooth protocols. maximum transmission unit (MTU) = how many bits in one package max.</p>
                </li>
                <li>
                    <p>network layer<br>
                        uses ip address to connect between different networks through the Internet Protocol (IP). routers send error messages and other information about itself using ICMP (internet control message p)</p>
                </li>
                <li>
                    <p>transport layer<br>
                        os sending/receiving stuff to/from to processes running in the OS. uses port numbers to differentiate. a process that exists to respond is called server, one initiating the connection is called client.<br>
                        can use transmission control p (TCP). pretends there is a direct connection (not packets). enumerates, buffers and confirms received messages to put into right order, retransmit or request retransmission if no confirmation was received. uses checksum for ensuring reliability. sender slows down if it gets no feedback (how is this part of the protocol?). tcp handshake before actual payload transfer sets a random starting point for the enumeration, making it hard for randos to impersonate senders (attackers must now guess correctly to enter a ongoing chat)<br>
                        user datagram p (UDP) fast, unreliable connectionless transport. only source, destination ports, length and checksum in header. streaming!</p>
                </li>
                <li>
                    <p>Security layer</p>
                </li>
            </ol>
        </article>
        <script src="scroll.js"></script>
    </main>
    <?php
    // create table of contents
    include "toc.php"; 
    $content = ob_get_clean();
    echo generateTOC($content);
    ?>
</body>

</html>
