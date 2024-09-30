from markdown import markdown
from datetime import datetime, timezone
from typing import Dict
from pathlib import Path
import re, os, shutil

# changes.html
import subprocess
import sys
from typing import List, Dict
from git import Repo
import difflib

# NOTE: only jpg and png attachments currently supported.
# NOTE: all attachment links must be relative or they will not work
# TODO: robustness?

"""
1. look for changed posts / css.
    - get latest updated date for unchaged files from the commit history for sorting them later
    - changed files receive a new updated date
3. convert posts and landing (+toc)
4. check links
    - move css if necessary
    - check for image mismatch
    - downscale + move new images
    - offer to delete old images
5. produce changes.html
    - make temporary changes.md
    - paragraph with all links to dates
    - headings for file and heading names
    - commented out stuff.
6. commit the changes if given in an argument, else ask in cl
"""

# config
history_length = 15 # commits

cwd = Path(__file__).resolve().parent

try: settings = {key.strip(): value.strip() for line in open(cwd / "settings.txt", "r").readlines() if line[0] != "#" and line.strip() != "" for key, value in [line.split(":", 1)]}
except ValueError: print("Error reading settings.txt. Make sure that entries follow this pattern: 'settingname: settingvalue' and that there is maximum one per line")

head = f"""<head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{title}}</title>
<link rel="stylesheet" href="{{css}}">
<link rel="shortcut icon" href="../{settings["favicon"]}"></head>"""

mathjaxInclude = """<script>MathJax = { tex: {inlineMath: [['$', '$']],displayMath: [['$$', '$$']]}};</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>"""

def basemaker(fm, returnButton=True, landing=False) -> str:
    dateinfo = thishead = ""
    thishead = head.replace("{title}", fm["title"])
    thishead = thishead.replace("{css}", f"../{settings['css']}") if not landing else thishead.replace("{css}", f"{settings['css']}")
    if "date" in fm:
        rawdate = datetime.fromisoformat(fm["date"])
        dateinfo = f"<p class=\"post-date\">Created <time datetime=\"{rawdate.isoformat()}\">{rawdate.strftime('%Y %m %d')}</time>, last changed <time datetime=\"{fm['updated'].isoformat()}\">{fm['updated'].strftime('%Y %m %d')}</time></p>"
    nav = f"<nav><a href='../index.html'>Entrance</a></nav>" if returnButton else ''
    return f"<!DOCTYPE html><html lang=en>{thishead}<body><main>{nav}<article>{dateinfo}"


# ----------------------------------------------------------
# CHANGES.HTML
# ----------------------------------------------------------

def createMathjaxBlock(text, type):
    cl = " class='rem'" if type == "rem" else " class='add'"
    return "\n".join([f"<p{cl}>", "$$", ""] + text + ["", "$$", "</p>"])

def diffToHtml(text, output):
    """
    creates file indent and renders any changes between the files as html
    remember to close the indent
    arguably should convert markdown to html
    and support "inline changes", that only affect a few characters in the line
    it sometimes has to process "fake diffs" where all lines have an added "+ "
    at the front because the file was entirely new.
    misinterprets comments (#) in python codeblocks as headings.
    """
    output.append("<div class='indent'>") # file indent
    rank = 0
    oldType, newType = None, None
    mathjax, mathjaxChanged = False, False
    mathjaxText = []
    mathjaxType = None
    text = list(text)
    for i, line in enumerate(text):
        line = line.replace("&", "&amp;").replace("<", "&lt;").replace("{", "&#123;")
        cl = ""
        if line[:2] == "- ": newType = "rem"; cl = " class='rem'"
        if line[:2] == "+ ": newType = "add"; cl = " class='add'"
        if line[:2] == "  " or line[:2] == "? ": newType = "spc"; cl = " class='hdg'"

        if line[2:] == "$$":
            mathjax = not mathjax
            if not mathjax:
                if mathjaxChanged:
                    output.append(createMathjaxBlock(mathjaxText, mathjaxType))
                mathjaxChanged = False
                mathjaxText = []
                mathjaxType = None
                continue
            else: continue
        elif mathjax:
            if newType != "spc":
                line = line[2:].replace("\\", "&#92;")
                if mathjaxType == None:
                    mathjaxType = newType
                if newType == mathjaxType:
                    mathjaxText.append(line)
                    mathjaxChanged = True
                else:
                    output.append(createMathjaxBlock(mathjaxText, mathjaxType))
                    mathjaxText = [line]
                    mathjaxType = newType
            continue
                
        heading = re.search("^..(#+) (.+)$", line)
        if heading != None:
            newRank = len(heading[1])
            rankDiff = newRank - rank
            if rankDiff == 0:
                output.append("</div>")
                output.append(f"<span{cl}>{heading[2]}</span>")
                output.append("<div class='indent'>")
            elif rankDiff < 0:
                for j in range(-rankDiff + 1):
                    output.append("</div>")
                output.append(f"<span{cl}>{heading[2]}</span>")
                output.append("<div class='indent'>")
            else:
                for j in range(rankDiff - 1):
                    output.append("<div class='indent'>")
                output.append(f"<span{cl}>{heading[2]}</span>")
                output.append("<div class='indent'>")
            rank = newRank
        else:
            if oldType == "spc" and newType != "spc" and line[2:] != "": output.append("<br>")
            oldType = newType
            output.append(f"<span{cl}>{line[2:]}</span>")
    for i in range(rank):
        output.append("</div>") # headings indent
    
    output.append("</div>") # file indent
    return output


def cleanOutput(output):
    def popidsfromOutput(idx:List[int]):
        if idx:
            idx.reverse()
            for i in idx: output.pop(i)
        return []
    while True:
        found = False
        idx = []
        for i, line in enumerate(output):
            try: line2 = output[i+1]
            except: break
            if line == "<div class='indent'>" and line2 == "</div>":
                idx += [i, i+1]
                found = True
        idx = popidsfromOutput(idx)

        for i, line in enumerate(output):
            try: line2 = output[i+1]
            except: break
            if line[:18] == "<span class='hdg'>" and line2 != "<div class='indent'>":
                idx.append(i)
                found = True
        idx = popidsfromOutput(idx)

        # remove changes of empty lines
        for i, line in enumerate(output):
            try:
                line2 = output[i+1]
                line3 = output[i+2]
            except: break
            if line == "<div class='indent'>":
                if line2 == "<span class='add'></span>" or line2 == "<span class='rem'><span>":
                    if line3 == "</div>":
                        idx += [i, i+1, i+2]
                        found = True
        idx = popidsfromOutput(idx)

        # remove <br> after indents
        for i, line in enumerate(output):
            try:
                prevLine = output[i-1]
            except: break
            if line == "<br>" and prevLine == "<div class='indent'>":
                idx.append(i)
                found = True
        idx = popidsfromOutput(idx)
            
        if not found: break
    
    for i, line in enumerate(output):
        line = line.replace("  ", "\t")
        line = line.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;")
        output[i] = line

    return output

def stripfrontmatter(text:str):
    if text[:4] == "---\n": return re.search("\n---\n([\S\s]*)", text)[1]
    else: return text

# ------------------------------------------------------------------------------------

repo = Repo(cwd)
dates = []
output:List[str] = []
updated:Dict[str,datetime] = {}

# NEWEST CHANGES --------------------------------

subprocess.run(["git", "add", settings["pages_path"]], cwd=cwd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) # sneaky like opaque enterprise shit
modifiedFiles = [file for file in repo.head.commit.diff(None) if file.a_path.startswith(settings["pages_path"]) and file.a_path[-2:] == "md"]
subprocess.run(["git", "reset"], cwd=cwd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) # Oh no, where did my staging go?

if modifiedFiles:
    today = datetime.now().strftime("%Y %m %d %H:%M")
    dates.append(today)
    output.append(f"<span class='date' id='t{today.replace(' ', '-')}'>{today}</span><div class='indent'>") # date indent

for file in modifiedFiles:
    title = file.a_path.split('/')[-1]
    if file.change_type == "D": output.append(f"<span class='rem'>{title}</span>")
    else:
        updated[file.b_blob.name] = datetime.now(timezone.utc)
        if file.change_type == "R": output.append(f"<span class='rem'>{title}</span>")
        output.append(f"<span>{title}</span>")
        oldFile = [""] if file.change_type == "A" else stripfrontmatter(repo.git.cat_file("-p", file.a_blob.hexsha)).splitlines()
        newFile = stripfrontmatter(repo.git.cat_file("-p", file.b_blob.hexsha)).splitlines()
        output = diffToHtml(difflib.ndiff(oldFile, newFile), output)

if modifiedFiles: output.append("</div>") # date indent

# AlL COMMITS -----------------------------------

commits = list(repo.iter_commits(all=True))
commits.sort(key=lambda x: -x.committed_date) # new -> old
includeChanges = commits[:history_length]

for comm1, comm2 in zip(commits[1:], commits):
    createNewDate = False
    for change in comm1.diff(comm2):
        atype = change.a_blob.path[-2:] if change.a_blob != None and "changes.md" not in change.a_path else None
        btype = change.b_blob.path[-2:] if change.b_blob != None and "changes.md" not in change.b_path else None

        if "md" in [atype, btype]:
            if not createNewDate:
                createNewDate = True
                newDate = comm2.committed_datetime.strftime('%Y %m %d %H:%M')
                dates.append(newDate)
                output.append(f"<span class='date' id='t{newDate.replace(' ', '-')}'>{newDate}</span><div class='indent'>") # date indent

            h1 = change.a_blob.name if atype else None
            h2 = change.b_blob.name if btype else None

            if h2 not in updated: updated[h2] = comm2.committed_datetime
            if comm2 not in includeChanges: continue

            if not h1: output.append(f"<span class='add'>{h2}</span>")
            elif not h2: output.append(f"<span class='rem'>{h1}</span>")
            elif h1 != h2: output.append(f"<span class='rem'>{h1}</span><span class='add'>{h2}</span>")
            else: output.append(f"<span>{h1}</span>")


            t1 = stripfrontmatter(repo.git.cat_file("-p", change.a_blob.hexsha)).splitlines() if atype else [""]
            t2 = stripfrontmatter(repo.git.cat_file("-p", change.b_blob.hexsha)).splitlines() if btype else [""]
            output = diffToHtml(difflib.ndiff(t1,t2), output)
    if createNewDate: output.append("</div>") # date indent

# INDEX -----------------------------------------

days = [dates[0][:10]]
times = []
currentTimes = []
for date in dates:
    day = date[:10]
    if day not in days:
        days.append(day)
        currentTimes.sort(reverse=True)
        times.append(currentTimes)
        currentTimes = []
    currentTimes.append(date)
currentTimes.sort(reverse=True)
times.append(currentTimes)

txt = ["<p>"]
for i, day in enumerate(days):
    txt.append(f"{day}")
    for t in times[i]:
        txt.append(f"<a href='#t{t.replace(' ','-')}'>{t[-5:]}</a>")
    txt.append("|")
txt.pop(-1) # last |
txt.append("</p>")
output = txt + output

# NOTE: writing changes.html is move to after converting markdown, because then the folder exists too


# PREPARE FOLDERS FOR WRITING -------------------

# delete previous output
for filename in os.listdir(cwd / settings["output"]):
    filepath = os.path.join(cwd / settings["output"], filename)
    if os.path.isfile(filepath): os.remove(filepath)
    elif os.path.isdir(filepath):
        try: shutil.rmtree(filepath) # no permissions?
        except: pass
# ensure output pages folder
(cwd / settings['output'] / settings['pages_path']).mkdir(parents=True, exist_ok=True)

# WRITE CHANGES.HTML ----------------------------

base = basemaker({"title": "Changes"}) # landing so it assumes base directory when linking css
base2 = f"""
<h1>Changes</h1>
<p>{history_length} newest committed changes to all notes sorted new -> old like: date > note > heading > changed lines (gray lines = deletions, orange lines = replacements or new additions).</p>
"""
output = "\n".join(cleanOutput(output))
mathjax = bool(re.search("\n\$\$\n|\$\S+\$", output))
end = f"</article></main>{mathjaxInclude if mathjax else ''}</body></html>"
with open(cwd / settings['output'] / settings["pages_path"] / 'changes.html', "w", encoding="utf-8") as f:
    f.write("".join([base, base2, output, end]))

# TODO: add the css to the commit if it changed too
# TODO: when frontmatter is updated, no changes show because frontmatter is ignored but it still shows up as a changed file in changes.html
# TODO: diffToHtml could use major improvement

# ----------------------------------------------------------
# CONVERT MARKDOWN, MOVE ATTACHMENTS AND CSS
# ----------------------------------------------------------

def frontmatter(text) -> Dict[str, str]:
    fm, i = {}, 1 # skipping fist line, which is "---\n"
    while text[i] != "---\n":
        idx = text[i].find(":")
        key, value = text[i][:idx], text[i][idx+1:].strip()
        fm[key] = value
        i += 1
    return fm, i + 1

sites, hrefs = [], []
files = [file for file in os.listdir(cwd / settings['pages_path']) if file.split(".")[-1] == "md" and file != settings["landingpage"]] + [settings["landingpage"]]
for file in files:
    with open(cwd / settings["pages_path"] / file, "r", encoding="utf-8") as f:
        outpath, base = None, None
        title = ".".join(Path(f.name).name.split(".")[:-1])
        t = f.readlines()
        if t[0] == "---\n": fm, index = frontmatter(t)
        else: fm, index = {}, 0
        fm["title"] = title
        assert f"{title}.md" in updated, f"Most recent update not found for {title}. This is generated while looking through commits and modifiedFiles."
        fm["updated"] = updated[f"{title}.md"]
        fm["path"] = settings["pages_path"] +"/" + f"{title.replace(' ', '_')}.html"
        t = "".join(t[index:])
        if title + ".md" == settings["landingpage"]:
            t = t.replace("{{changes}}", f"[changes]({settings['pages_path']}/changes.html)")
            fm["title"] = settings["landingpage_title"]
            outpath = cwd / settings["output"] / "index.html"
            base = basemaker(fm, returnButton = False, landing = True)
            if len(sites) > 0:
                sitelist = ["<ul class=\"posts\">"]
                sites.sort(key=lambda x: x["updated"], reverse=True)
                for site in sites:
                    date = site["updated"].strftime("%Y %m %d")
                    sitelist.append(f"<li><span class=\"date\">{date}</span> <a href={site['path']}>{site['title']}</a></li>")
                sitelist.append("</ul>")
            t = t.replace("{{sitelist}}", ("\n".join(sitelist) if sitelist else ''))
        else:
            sites.append(fm)
            outpath = cwd / settings["output"] / settings["pages_path"] / (title.replace(" ", "_") + ".html")
            base = basemaker(fm)
        mathjax = bool(re.search("\n\$\$\n|\$\S+\$", t))
        content = markdown(t, extensions=["nl2br", "wikilinks", "fenced_code", "codehilite", "toc", "tables"], extension_configs={'codehilite': {'guess_lang': False}})
        end = f"</article></main>{mathjaxInclude if mathjax else ''}</body></html>"

        out = "\n".join([base, content, end])
        hrefs.extend(re.findall("src=[\"'](.+)[\"']",out))
        
        with open(outpath, "w", encoding="utf-8") as o:
            o.write(out)

# MOVE ATTACHMENTS ------------------------------
shutil.copy2(cwd / "main.css", cwd / settings['output'] / "main.css")
shutil.copy2(cwd / "favicon.ico", cwd / settings['output'] / "favicon.ico")
for src in set(hrefs):
    if src[-3:] in ["png", "jpg"]:
        try: shutil.copy2(cwd / settings["pages_path"] / src, cwd / settings["output"] / settings["pages_path"] / src)
        except FileNotFoundError:
            os.makedirs(os.path.dirname(cwd / settings["output"] / settings["pages_path"] / src), exist_ok=True)
            try: shutil.copy2(cwd / settings["pages_path"] / src, cwd / settings["output"] / settings["pages_path"] / src)
            except FileNotFoundError: print("WARNING! missing file:", src)


# TODO: this script does not yet work if launched from a different directory
