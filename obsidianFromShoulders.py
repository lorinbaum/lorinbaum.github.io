from markdown import markdown
from datetime import datetime
from typing import Dict
from pathlib import Path
import re, os, shutil

# NOTE: only jpg and png attachments currently supported.
# NOTE: all attachment links must be relative or they will not work
# TODO: robustness?

"""
1. look for changed posts / css.
    - get latest updated date for all posts from the commit history for sorting them later
2. give changed posts updated time
3. convert posts and landing (+toc)
4. check links
    - move css if necessary
    - check for image mismatch
    - downscale + move new images
    - offer to delete old images
5. produce changes.html
6. commit the changes
"""

try: settings = {key.strip(): value.strip() for line in open("settings.txt", "r").readlines() if line[0] != "#" and line.strip() != "" for key, value in [line.split(":", 1)]}
except ValueError: print("Error reading settings.txt. Make sure that entries follow this pattern: 'settingname: settingvalue' and that there is maximum one per line")

head = f"""<head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{title}}</title>
<link rel="stylesheet" href="{{css}}">
<link rel="shortcut icon" href="../{settings["favicon"]}"></head>"""

mathjaxInclude = """<script>MathJax = { tex: {inlineMath: [['$', '$']],displayMath: [['$$', '$$']]}};</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>"""

def frontmatter(text) -> Dict[str, str]:
    fm, i = {}, 1 # skipping fist line, which is "---\n"
    while text[i] != "---\n":
        idx = text[i].find(":")
        key, value = text[i][:idx], text[i][idx+1:].strip()
        fm[key] = value
        i += 1
    return fm, i + 1

def basemaker(fm, returnButton=True, landing=False) -> str:
    dateinfo = thishead = ""
    thishead = head.replace("{title}", fm["title"])
    thishead = thishead.replace("{css}", f"../{settings['css']}") if not landing else thishead.replace("{css}", f"{settings['css']}")
    if "date" in fm:
        xmldate = datetime.fromisoformat(fm["date"]).isoformat()
        hmndate = datetime.fromisoformat(fm["date"]).strftime("%Y %m %d")
        updated = ''
        if "updated" in fm:
            upxmldate = datetime.fromisoformat(fm["updated"]).isoformat()
            uphmndate = datetime.fromisoformat(fm["updated"]).strftime("%Y %m %d")
            updated = ', last changed <time datetime="' + upxmldate + '">' + uphmndate + '</time>'
        dateinfo = f"<p class=\"post-date\">Created <time datetime=\"{xmldate}\">{hmndate}</time>{updated}</p>"
    nav = f"<nav><a href='../index.html'>Entrance</a></nav>" if returnButton else ''
    return f"<!DOCTYPE html><html lang=en>{thishead}<body><main>{nav}<article>{dateinfo}"

if settings["pages_path"] not in os.listdir(settings["output"]): os.mkdir((settings["output"] + "/" + settings["pages_path"]))
sites, hrefs = [], []
files = [file for file in os.listdir(settings["pages_path"]) if file.split(".")[-1] == "md" and file != setttings["landingpage"]] + [settings["landingpage"]]
for file in files:
    with open(Path(settings["pages_path"]) / file, "r", encoding="utf-8") as f:
        outpath, base = None, None
        title = ".".join(Path(f.name).name.split(".")[:-1])
        t = f.readlines()
        if t[0] == "---\n": fm, index = frontmatter(t)
        else: fm, index = {}, 0
        fm["title"] = title
        fm["path"] = Path(settings["pages_path"]) / f"{title}.html"
        t = "".join(t[index:])
        if title + ".md" == settings["landingpage"]:
            fm["title"] = settings["landingpage_title"]
            outpath = Path(settings["output"]) / "index.html"
            base = basemaker(fm, returnButton = False, landing = True)
            if len(sites) > 0:
                sitelist = ["<ul class=\"posts\">"]
                sites.sort(key=lambda x: x["updated" if "updated" in x else "date"], reverse=True)
                for site in sites:
                    date = datetime.fromisoformat(site["updated" if "updated" in site else "date"]).strftime("%Y %m %d")
                    sitelist.append(f"<li><span class=\"date\">{date}</span> <a href={site['path']}>{site['title']}</a></li>")
                sitelist.append("</ul>")
            t = t.replace("{{sitelist}}", ("\n".join(sitelist) if sitelist else ''))
        else:
            sites.append(fm)
            outpath = Path(settings["output"]) / settings["pages_path"] / (title.replace(" ", "_") + ".html")
            base = basemaker(fm)
        mathjax = bool(re.search("\n\$\$\n|\$\S+\$", t))
        content = markdown(t, extensions=["nl2br", "wikilinks", "fenced_code", "codehilite", "toc", "tables"], extension_configs={'codehilite': {'guess_lang': False}})
        end = f"""</article></main>{mathjaxInclude if mathjax else ''}</body></html>"""

        out = "\n".join([base, content, end])
        hrefs.extend(re.findall("src=[\"'](.+)[\"']",out))
        
        with open(outpath, "w", encoding="utf-8") as o:
            o.write(out)

shutil.copy2("main.css", "docs/main.css")
shutil.copy2("favicon.ico", "docs/favicon.ico")
for src in set(hrefs):
    if src[-3:] in ["png", "jpg"]:
        try: shutil.copy2(settings["pages_path"] + "/" + src, settings["output"] + "/" + settings["pages_path"] + "/" + src)
        except FileNotFoundError:
            os.makedirs(os.path.dirname(settings["output"] + "/" + settings["pages_path"] + "/" + src), exist_ok=True)
            try: shutil.copy2(settings["pages_path"] + "/" + src, settings["output"] + "/" + settings["pages_path"] + "/" + src)
            except FileNotFoundError: print("WARNING! missing file:", src)
