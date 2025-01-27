/*
Creates Table Of Content from .html file in argument to .html file in second argument
ToC is an unordered list with anchors linking to the respective heading.
each heading receives an id based on its text content.
ToC is put into nav.toc and only considers headings from that element onwards.
Will not consider h1. Assumption is that h1 appears before nav.toc.
*/

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// get document
const inp = process.argv[2];
const out = process.argv[3];
if (!inp || !out) { console.error("Missing argument(s): 1: input file, 2: output file"); process.exit(1); }
if (path.extname(out).toLowerCase() != ".html") { console.error(`Output must be html. Got ${out}`); process.exit(1); }
let inpF;
try { inpF = fs.readFileSync(inp, "utf8");
} catch (e) { console.error(`Error reading ${inp}: ${e.message}`); process.exit(1); }
const dom = new JSDOM(inpF);
const document = dom.window.document;

const navtoc = document.querySelector("nav.toc");
if (navtoc) {
    let prevLvl = 1;
    let toc = ""; // html
    let trackHeading = false;
    const slugs = []; // to make slugs unique
    document.querySelectorAll("h2, h3, h4, h5, h6, nav.toc").forEach( el => {
        if (trackHeading && el.tagName.match(/^H[2-6]$/) ) {
            // get unique slug
            let slug = el.textContent.toLowerCase().trim().replace(/[^A-Za-z0-9 ]+/g, "-") + "0";
            for (let counter = 0; slugs.includes(slug); counter++) slug = slug.slice(0, -1) + counter;
            slugs.push(slug);
            el.id = slug;
    
            // produce toc
            const lvl = el.tagName[1];
            if (lvl == prevLvl) toc += "</li><li>";
            for (; lvl > prevLvl; prevLvl++) toc += "<ul><li>";
            for (; lvl < prevLvl; prevLvl--) toc += "</li></ul>" + (lvl == prevLvl - 1 ? "</li><li>" : "");
            toc += `<a href="#${slug}">${el.textContent}</a>`;
        }
        if (el.tagName == "NAV" && el.classList.contains("toc")) { trackHeading = true; }
    });
    for (; prevLvl > 1; prevLvl--) toc += "</li></ul>";
    navtoc.innerHTML = toc;
}
try { fs.writeFileSync(out, navtoc ? dom.serialize() : inpF, "utf-8");
} catch (e) { console.error(`Error writing to ${out}: ${e.message}`); process.exit(1); }
if (navtoc) {console.log(`ToC generated: ${inp} > ${out}`);}
else {console.warn(`No nav.toc found, wrote unchanged: ${inp} > ${out}`);}