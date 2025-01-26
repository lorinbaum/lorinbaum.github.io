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
                Since being a child I have been wondering about information distribution, feeling inefficient.<br>
                This page reflects on how to build it.
            </p>
            
            <h1>Towards spirit stream</h1>
            
            <?php ob_start(); ?>
            
            <h2>Direction</h2>
            <ul>
                <li>Refine Me, Computer, Internet</li>
                <li>update thoughts to the new choice of medium: pure html, css, php</li>
            </ul>
            <h3>Next version</h3>
            <ul>
                <li>No cloudflare proxy</li>
                <li>Authentication -> private files</li>
                <li>if opening encrypted files, use client side javascript to ask for a key to decrypt them.</li>
                <li>payment</li>
                <li>replace php preprocessor with node.js? code highlighting</li>
                <li>render images into ones that can load progressively</li>
                <li>generate links for sharing files and resolve them in requests</li>
                <li>Git integration and web interface -> history / changelog</li>
            </ul>

            <h3>Visual design</h3>
            <ul>
                <li>choose a more sensitive font, -> ligatures</li>
                <li>differentiate internal and external link</li>
                <li>clearer heading differentiation</li>
            </ul>

            <h2>More refined</h2>

            <h3>Spirit Stream</h3>
            <!--                    
                - How to explore the machine?
                - The spirit stream should facilitate a passage, an interface to the machine. Where I can tell it who I am and where it can tell me what it is.
                - Direct brain computer interfaces seem exciting, but I suspect they are not the bottleneck.
                - Instead text, image, sound to capture translations of ideas into the body seem sufficient. The problem is not bandwidth, its the smartness of the interface and my own limits in thought and expression. If a path is found, it seems, it would be easy to scale it up using a BCI.
                - To reflect myself the computer has to permit:
                    - patterns of differing resolutions and in different media. from raw and exploratory, through filtered and coherent to actionable and accessible. Including speech, video
                    - work at different stages of completion
                    - history to allow cleaning
                    - access by other computers and humans
                    - differentiate scope fo sharing
                    - access from anywhere
                    - at any time and in persistent formats
                    - exploration, parsing and filtering of outside content
                    - live streaming of any information
                    - transactions
                - This translates to:
                    - a remote server(s) (VPS) (with a local copy?)
                        - sync servers
                        - WEB UI
                        - local server if offline or app, makes no difference.
                    - editor (placing of symbols in a sequence)
                    - version history (git), which produces a commit stream, some of which could be public posts, categorized by tags (post, tech)
            -->
            <p> 
                When I follow curiosity, leaning into my wonder about computer and internet, I sense dissolution: The edges of my body fade and I float through the associations between all possible spaces. Into the space, through trees, stories, videogames, temples, beauty, destruction. I see my questions answered, not definitively, but as completely as the collective mind can. I sense connection, trusting and deep. I sense the conflicts in the world as internal, not as foggy, distant pain. There are no external barriers to my being and I stream into others to see exactly what they mean. And in my action, the structure of the world, not merely my individual life, is reflected.<br>
                Returning to my body, I can't help but wonder what the fuck this is: Me, stopping with my fingertips, not being able to walk through walls, facing the endless world in mist asking hello with no answer.
            </p>
            <figure>
                <img src="creative-destruction-detail-3.jpg" alt="Floating head, slightly tilted. Partly shaded, mask-like. Reminiscent of a skull. Dark background and dark lines across the white head, partly messy, decorative and minimally defining facial features. Closer eye is white, further eye is black. Red-magenta lines overlay the skull, partly straight and splitting the image, partly squiggly."/>
                <figcaption>Spirit of curiosity</figcaption>
            </figure>
            <blockquote>
                i can see the hive mind on the horizon.<br>
                there are hammers, sculptors, hammer blows and sculptures.<br>
                grouped and isolated<br>
                places to stay.<br>
                <br>
                like gazing into a painting, being guided through the impression<br>
                coming along to find a question asked at myself, seeing it unfold and building a response
            </blockquote>
            <p>
                Computers, able to execute practically any function;<br>
                AI, approximating more complex functions;<br>
                Internet, being a global, instant post office;<br>
            </p>
            <p>
                The spirits, seeking continuity with the environment and particularly the spirit of curiosity are calling towards internalizing these technologies.
            </p>
            <p>
                The spirit stream aims to become the passage into the machine.<br>
                It will have to be able to contain me and respond in its own spirit.
            </p>
            <figure>
                <figcaption>Me, to be reflected in the machine:</figcaption>
                <blockquote>
                    <p>
                        Sense, explore, parse circling patterns from<br>
                        chaotic and far-reaching,<br>
                        through filtered and coherent knowledge,<br>
                        to linearized, actionable and accessible stories.
                    </p>
                    <p>
                        Express in sound, body,<br>
                        writing, graphs, images, products,<br>
                        and any tools to build them,<br>
                        in process,<br>
                        from memory.
                    </p>
                    <p>
                        Share in truth,<br>
                        to test, be surprised, dance, reproduce, join the cutting edge, offer, cohere, support, punish,<br>
                        into common languages per context,<br>
                        into scopes of recipients,<br>
                        under optional conditions.
                    </p>
                    <p>
                        Where I am,<br>
                        When I am.
                    </p>
                </blockquote>
            </figure>
            <figure>
                <figcaption>The target:</figcaption>
                <blockquote>
                    <p>
                        Executors of machine code within instruction sets,<br>
                        of functions, programs, function approximators compiled from many languages,<br>
                        from and to memory.
                    </p>
                    <p>
                        Expressing in any electronic actuator,<br>
                        speaker, display, motor.<br>
                        Receiving from any electronic sensor,<br>
                        keyboard, mouse, camera, microphone
                    </p>
                    <p>
                        Exchange anything at up to ~storage speeds,<br>
                        through ports, through fundamentally unreliable, insecure connections,<br>
                        to any available address,<br>
                        made reliable, secure through protocol and application server
                    </p>
                </blockquote>
            </figure>
            
            <h2>Less refined</h2>
            
            <h3>How to merge?</h3>
            <p>
                Is there a throughput problem and must I build the neural interface? I suspect not, as sometimes simple words or images speak so loudly and clearly, throwing open the doors to the world with their precision and closeness. If the interface becomes seamless, reflective of the user, and the spirits of computer and internet reveal themselves, there is no difference between the machine and the body. When I can speak with clarity and my computer extension answers with clarity, we merge.
            </p>
            <p>
                Synchrozined web servers, always available through any browser, locally and worldwide.<br>
                Exportable to physical and persistent formats<br>
                Authenticate to full web access<br>
                Editor to place symbols into any language to manifest patterns. On display, symbols are rendered into the images they represent.<br>
                Within a single column, wrapping to fill the screen<br>
                In different areas of refinement, On different sites, linked.<br>
                To be committed to history and/or streamed.<br>
            </p>
            <p>
                Commit history is a timeline to comment on.<br>
                Receive general messages through email
            </p>
            <p>
                Introspection for access logs and performance review.
            </p>
            <p>
                To discover and be discovered, search engines, LLM pretraining or dynamic research through an LLM seem sufficient. There is limited upside to being connected to <i>everyone</i>, as on X, and most lasting connections still seem happen through reference by already known people, not through the algorithm.<br>
                Algorithms are able to interact in the same ways as me -> UI connects to API.
            </p>
            <ul>
                <li>
                    Inboxes contain content not yet categorized.
                </li>
                <li>
                    To share into scopes, other users can authenticate on the server too. By invitiation only or through some registration process. The public can comment, suggest through email, which is easily enough to get noticed. A form for this may improve convenience.
                </li>
            </ul>

            <h3>Currently implemented structure</h3>
            <p>
                Writing in pure html, php, css, javascript: VS Code,
                prerendered into static sites locally: php server<br>
                keeping history in a git repository,<br>
                Sent to remote server: Hetzner VPS: OpenSSH, nginx (HTTP, HTTPS),<br>
                Reachable through Cloudflare DNS + proxy<br>
            </p>
            <!--
            <p>
                The things I know appear so simple, so efficiently encoded. Like how to make rice. But trying to explain it in its entirety, I watch in pain, as I require many words to capture it even approximately.
            </p> -->

            <!-- h3 components -->
            <!-- <ul>
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
            </ul> -->

            <h3>Text editor</h3>
            <p>The world is open when I can understand and create my own infrastructure. I will own my environment and can test how far I can merge with the machine. Start with C+OpenGL text editor compiled to web. C+OpenGL Because they are low level (offer insight) and extremely widely supported.</p>
            <ul>
                <li>Write fira code ttf into an infinite column</li>
                <li>display line numbers</li>
                <li>scrolling</li>
                <li>cursor control with keys and mouse</li>
            </ul>

            <h4>Setup</h4>
            <p>OpenGL is a language to talk to the GPU to efficiently produce graphical output. It's implemented by the graphics card vendors. <a href="https://learnopengl.com">How to use OpenGL</a></p>
            <p>
                To open a window and handle input, talking to the OS is necessary. Possible to do manually, but using <a href="https://open.gl/context#GLFW">GLFW</a> here.<br>
                <a href="https://www.glfw.org/docs/latest/compile_guide.html">Compile GLFW with CMake</a>. Then copy include folder and libglfw3.a from build/src/ to project folder include and lib respectively.
            </p>
            <p>
                Same article goes into GLEW. Download, run <code>make</code> in the directory, copy contents from lib and include to project folder. Compiled with<code>-D GLFW_BUILD_WAYLAND=0</code> to compile only for X11.
            </p>
            <p>OpenGL already installed on Ubuntu Linux, but dev tools required: <code>sudo apt-get install libglu1-mesa-dev</code>. Works without <code>libgl1-mesa-dev</code> and <code>libglew-dev</code> for now.</p>
            
            <p>main.c to get OpenGL working and test it</p>
            <pre><code>#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <stdio.h>

int main() {
    glfwInit();

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);

    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

    GLFWwindow* window = glfwCreateWindow(800, 600, "OpenGL", NULL, NULL);
    glfwMakeContextCurrent(window);

    glewExperimental = GL_TRUE;
    glewInit();

    // Testing only: output should print 1
    GLuint vertexBuffer;
    glGenBuffers(1, &vertexBuffer);
    printf("%u\n", vertexBuffer);
    
    while(!glfwWindowShouldClose(window))
    {
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();
    return 0;
}</code></pre>
            <p>
                Convention says to put main.c into src/ of project folder and the compiled output into build/.    
                Compiling with: <code>clang -I ./include/ src/main.c -L ./lib/ -lGLEW -lglfw3 -lGL -lGLU -lm -o build/main</code>
            </p>
            <p>Compiling freetype2 to render true type fonts. Compiled from source with <code>./configure --enable-static --disable-shared --with-png=yes CFLAGS="-static"</code> and <code>make</code>. Then adding the <code>-lpng -lz -lbrotlidec -lfreetype</code> compiler flags.</p>

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
            <p>
                <a href="https://casual-effects.com/markdeep/">markdeep</a><br>
                <a href="https://powerdns.org/libh2o/">libh2o</a>
                <a href="https://powerdns.org/">PowerDNS.org with nice articles</a>
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
            <p>P2P streaming with relay nodes</p>
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
            <p>
                VS Code for UI. Destroys WYSIWYG. CSS is the visual vocabulary for html. html is pure semantics and its independence from style give nice flexibility. WYSIWYG not needed? Complicated, extendable editor like VS Code seems like good design. Who knows what and how people want to edit. Best editor is a tool to build your own editor?
            </p>

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
