import os
import re
from pathlib import Path
from datetime import datetime, timezone
import subprocess
from git import Repo
import difflib
import sys

# COMMANDS:
# all: changes, convert, commit, build
# convert [--all]: convert links in changed or all posts
# changes: create changes.md
# commit: commit changes and push to remote repository

cwd = "M:/synched/lorinbaum.github.io/"
path = Path("M:/synched/lorinbaum.github.io/_posts/")
assert len(sys.argv) > 1, "No command given. Usage: blog ['all', 'convert', 'changes', 'commit']"
task = sys.argv[1]    
assert task in ["all", "convert", "changes", "commit"], "Invalid command. Usage: blog ['all', 'convert', 'changes', 'commit']"

# -------------------------------------

# CONVERT MDs
if task == "all" or task == "convert":
    completeConversion = False
    if len(sys.argv) > 2:
        if sys.argv[2] == "--all":
            completeConversion = True
    
    mdFiles = [f for f in os.listdir(path) if f.endswith(".md")]
    # get titles
    titles = {}
    for md in mdFiles:
        with open(path / md, "r") as f:
            titles[md] = re.search("title:(.+)", f.read())[1].strip()

    # let git see if a file changed or not
    subprocess.run(["git", "add", "."], cwd=cwd, check=True, shell=True)
    gitStatus = subprocess.run(["git","status"], capture_output=True, cwd=cwd, check=True, shell=True).stdout.strip().split()
    subprocess.run(["git", "reset", "HEAD", "--", "."], cwd=cwd) # undo staging. I only staged to see what files changed

    # converting files
    for md in mdFiles:
        bytePath = "/".join(str(path / md).split("\\")[-2:]).encode("utf-8")
        fileChanged = True if bytePath in gitStatus else False
        if fileChanged or completeConversion:
            print(f"Converting {md}")
            with open(path / md, "r") as f:
                nt = f.read()
                
                # Converting internal wikilinks
                i = 0
                while True:
                    internalWikiref = re.search("[^!]\[\[#(?:[^\]]|\](?!\]))+]]", nt)
                    if internalWikiref != None:
                        i += 1
                        name = internalWikiref.group()[1:].strip("[]#")
                        target = name.lower().replace(' ','%20')
                        link = f"[{name}](#{target})"
                        nt = nt.replace(internalWikiref.group()[1:], link, 1)
                        # print(f"replaced '{internalWikiref.group()[1:]}' with '{link}'")
                    else:
                        break
                if i > 0:
                    print(f"    Converted \033[32m{i}\033[0m internal wikilinks")
                    fileChanged = True
                    
                # Converting post wikilinks
                i = 0
                while True:
                    postWikirefs = re.search("[^!]\[\[(?:[^\]]|\](?!\]))+]]", nt)
                    if postWikirefs != None:
                        i += 1
                        name = postWikirefs.group()[1:].strip("[]")
                        link = f"[{titles[name]}](/{name})"
                        nt = nt.replace(postWikirefs.group()[1:], link, 1)
                        # print(f"    replaced '{postWikirefs.group()[1:]}' with '{link}'")
                    else:
                        break
                if i > 0:
                    print(f"    Converted \033[32m{i}\033[0m post wikilinks")
                    fileChanged = True

                # Converting images, so they link into the assets folder
                i = 0
                j = 0
                while True:
                    mediaLink = re.search("!\[\[(?:[^\]]|\](?!\]))+]]", nt)
                    if mediaLink != None:
                        i += 1
                        oldLink = mediaLink.group().strip("![]").split("|")
                        name, alt = oldLink[0], oldLink[1] if len(oldLink) > 1 else ""
                        newLink = f"![{alt.strip()}](/assets/{name})"
                        nt = nt.replace(mediaLink.group(), newLink, 1)
                        # print(f"    replaced {mediaLink.group()} with {newLink}")
                    else:
                        break
                if i > 0 or j > 0: 
                    print(f"    Converted \033[32m{i}\033[0m media links and moved \033[32m{j}\033[0m media")
                    fileChanged = True
                
                # Converting urls
                i = 0
                pattern = re.compile("(..)(www\.|https:\/\/|http:\/\/)([^\s\)\]<>]+)", re.DOTALL)
                validFound = True
                while validFound:
                    validFound = False
                    url = re.findall(pattern, nt)
                    for string in url:
                        start = string[0]
                        link = "".join(string[1:3])
                        whole = "".join(string)
                        if start[-1] != "[" and start != "](":
                            validFound = True
                            i += 1
                            start = start.replace("\n", "<br>")
                            newUrl = f"{start}[{link}]({link})"
                            nt = nt.replace(whole, newUrl)
                            # print(f"    replaced {repr(whole)} with {repr(newUrl)}")
                if i > 0:
                    print(f"    Converted \033[32m{i}\033[0m urls")

                # find block mathjax, ensure double linebreak around it to make it recognizable as a block
                mathjax = re.search("\$\S+\$", nt) != None or re.search("\$\$[\S\s]+\$\$", nt) != None
                if mathjax:
                    i,j = 0,0
                    while True:
                        dollar = re.search("([^\n]\n)\$\$", nt)
                        if dollar != None: nt = nt[:dollar.start()] + dollar[1] + "\n$$" + nt[dollar.end():]; i += 1
                        else: break
                    while True:
                        dollar = re.search("([^\n]{2})\$\$", nt)
                        if dollar != None: nt = nt[:dollar.start()] + dollar[1] + "\n\n$$" + nt[dollar.end():]; i += 1
                        else: break
                    while True:
                        dollar = re.search("\$\$(\n[^\n])", nt)
                        if dollar != None: nt = nt[:dollar.start()] + "$$\n" + dollar[1] + nt[dollar.end():]; j += 1
                        else: break
                    while True:
                        dollar = re.search("\$\$([^\n]{2})", nt)
                        if dollar != None: nt = nt[:dollar.start()] + "$$\n\n" + dollar[1] + nt[dollar.end():]; j += 1
                        else: break
                    if i > 0: print(f"    Converted \033[32m{i}\033[0m mathjax dollar entries")
                    if j > 0: print(f"    Converted \033[32m{j}\033[0m mathjax dollar exits")

                # update frontmatter
                newFm = {
                    "usemathjax": f"{mathjax}",
                    "updated": datetime.now(timezone.utc).isoformat("T", "seconds")
                }
                fm = re.search("---\n([\S\s]*)\n---", nt)
                keys = [line.split(":")[0].strip() for line in fm[1].splitlines()]
                values = [":".join(line.split(":")[1:]).strip() for line in fm[1].splitlines()]
                for key in newFm:
                    if key in keys:
                        values[keys.index(key)] = newFm[key]
                    else:
                        keys.append(key)
                        values.append(newFm[key])
                newFmString = "---\n"
                for key, val in zip(keys, values):
                    newFmString += key + ": " + val + "\n"
                newFmString += "---"
                nt = nt[:fm.start()] + newFmString + nt[fm.end():]
                
                # write new file
                with open(path / md, "w") as nf:
                    nf.write(nt)
                print(f"updated frontmatter, wrote file\n")


# CHANGES.MD
if task == "all" or task == "changes":
    def createMathjaxBlock(text, type):
        cl = " class='rem'" if type == "rem" else " class='add'"
        return "\n".join([f"<p{cl}>", "$$", ""] + text + ["", "$$", "</p>"])

    def diffToHtml(text, output):
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
        return output


    def cleanOutput(output):
        while True:
            found = False
            idx = []
            for i, line in enumerate(output):
                try: line2 = output[i+1]
                except: break
                if line == "<div class='indent'>" and line2 == "</div>":
                    idx += [i, i+1]
                    found = True
            idx.reverse()
            for i in idx:
                output.pop(i)
        
            idx = []
            for i, line in enumerate(output):
                try: line2 = output[i+1]
                except: break
                if line[:18] == "<span class='hdg'>" and line2 != "<div class='indent'>":
                    idx.append(i)
                    found = True
            idx.reverse()
            for i in idx:
                output.pop(i)

            # remove changes of empty lines
            idx = []
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
            idx.reverse()
            for i in idx:
                output.pop(i)

            # remove <br> after indents
            idx = []
            for i, line in enumerate(output):
                try:
                    prevLine = output[i-1]
                except: break
                if line == "<br>" and prevLine == "<div class='indent'>":
                    idx.append(i)
                    found = True
            idx.reverse()
            for i in idx:
                output.pop(i)
                
            if not found: break
        
        for i, line in enumerate(output):
            line = line.replace("  ", "\t")
            line = line.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;")
            output[i] = line

        return output

    # WRITE CHANGES.MD #

    print("Writing changes.md")
    repo = Repo(cwd)
    modifiedFiles = repo.index.diff(None) + repo.index.diff("HEAD")
    untrackedFiles = [file for file in repo.untracked_files if file[-2:] == "md"]
    commits = list(repo.iter_commits(all=True))
    commits.sort(key=lambda x: -x.committed_date)
    dates = []
    output = []

    # newest changes
    md = False
    for file in modifiedFiles:
        if file.a_path[-2:] == "md" and "changes.md" not in file.a_path:
            md = True
    for file in untrackedFiles:
        if file[-2:] == "md" and file != "changes.md":
            md = True

    if md:
        today = datetime.now().strftime("%Y %m %d %H:%M")
        dates.append(today) # only if today changes an md file
        output.append(f"<span class='date' id='t{today.replace(' ', '-')}'>{today}</span>")
        output.append("<div class='indent'>") # date indent

    for file in modifiedFiles:
        if file.a_path[-2:] == "md" and "changes.md" not in file.a_path:
            if file.change_type == "M":
                # output.append(f"<span>{file.a_path.split('/')[-1]}</span>")
                output.append(f"<span>{file.a_path.split('/')[-1]}</span>")
                output.append("<div class='indent'>") # file indent
                oldFile = re.search("\n---\n([\S\s]*)", repo.git.cat_file("-p", file.a_blob.hexsha))[1].splitlines()
                with open(cwd + file.a_path, "r") as f:
                    newFile = re.search("\n---\n([\S\s]*)", f.read())[1].splitlines()
                output = diffToHtml(difflib.ndiff(oldFile, newFile), output)
                output.append("</div>") # file indent
            if file.change_type == "D":
                output.append(f"<span class='rem'>{file.a_path.split('/')[-1]}</span>")

    # add new files
    for file in untrackedFiles:
        if file != "changes.md":
            output.append(f"<span class='add'>{file.split('/')[-1]}</span>")
            output.append("<div class='indent'>") # file indent
            with open(cwd + file, "r") as f:
                newFile = re.search("\n---\n([\S\s]*)", f.read())[1].splitlines()
            output = diffToHtml(["+ " + line for line in newFile], output)
            output.append("</div>") # file indent
    if md: output.append("</div>") # date indent

    # AlL COMMITS
    for comm1, comm2 in zip(commits[1:], commits):
        createNewDate = False
        for change in comm1.diff(comm2):
            # temp = []
            atype = change.a_blob.path[-2:] if change.a_blob != None and "changes.md" not in change.a_path else None
            btype = change.b_blob.path[-2:] if change.b_blob != None and "changes.md" not in change.b_path else None

            if "md" in [atype, btype]:
                if not createNewDate:
                    createNewDate = True
                    newDate = comm2.committed_datetime.strftime('%Y %m %d %H:%M')
                    dates.append(newDate)
                    output.append(f"<span class='date' id='t{newDate.replace(' ', '-')}'>{newDate}</span>")
                    output.append("<div class='indent'>") # date indent

                h1 = change.a_blob.name if atype else None
                h2 = change.b_blob.name if btype else None
                if not h1: output.append(f"<span class='add'>{h2}</span>")
                elif not h2: output.append(f"<span class='rem'>{h1}</span>")
                elif h1 != h2: output.append(f"<span class='rem'>{h1}</span><span class='add'>{h2}</span>")
                else: output.append(f"<span>{h1}</span>")

                # output += temp

                output.append("<div class='indent'>") # file indent
                t1 = re.search("\n---\n([\S\s]*)", repo.git.cat_file("-p", change.a_blob.hexsha))[1].splitlines() if atype else [""]
                t2 = re.search("\n---\n([\S\s]*)", repo.git.cat_file("-p", change.b_blob.hexsha))[1].splitlines() if btype else [""]
                output = diffToHtml(difflib.ndiff(t1,t2), output)
                output.append("</div>") # file indent
        if createNewDate: output.append("</div>") # date indent

    # initial commit
    createNewDate = False
    tree_entries = list(commits[-1].tree)
    for tree_entry in tree_entries:
        if tree_entry.type == "tree": 
            tree_entries += list(tree_entry)
            
        if tree_entry.type == "blob" and tree_entry.name[-2:] == "md" and "changed.md" not in tree_entry.name:
            if not createNewDate:
                createNewDate = True
                newDate = commits[-1].committed_datetime.strftime("%Y %m %d %H:%M")
                dates.append(newDate)
                output.append(f"<span class='date' id='t{newDate.replace(' ', '-')}'>{newDate}</span>")
                output.append("<div class='indent'>") # date indent
            output.append(f"<span>{tree_entry.name}</span>")
            output.append("<div class='indent'>") # file indent
            blob = re.search("\n---\n([\S\s]*)", repo.git.cat_file('-p', tree_entry.hexsha))[1].splitlines()
            text = []
            for line in blob:
                text.append("+ " + line)
            output = diffToHtml(text, output)
            output.append("</div>") # file indent 
    if createNewDate: output.append("</div>") # date indent

    # changes.md index
    days = [dates[0][:10]]
    times = []
    currentTimes = []
    for date in dates:
        day = date[:10]
        if day not in days:
            days.append(day)
            currentTimes.sort()
            currentTimes.reverse()
            times.append(currentTimes)
            currentTimes = []
        currentTimes.append(date)
    currentTimes.sort()
    currentTimes.reverse()
    times.append(currentTimes)

    txt = ["<ul>"]
    for i, day in enumerate(days):
        txt.append(f"<li class='date'>{day}")
        for t in times[i]:
            txt.append(f"<a href='#t{t.replace(' ','-')}'>{t[-5:]}</a>")
        txt.append("</li>")
    txt.append("</ul>")
    output.insert(0, "\n".join(txt))
    # txt.reverse()
    # for line in txt:
        # output.insert(0, line)


    # WRITE CHANGES.MD
    output = cleanOutput(output)

    with open(f"{cwd}changes.md", "w", encoding="utf-8") as f:
        default = """---
layout: post
date: 2024-03-10T10:30:00+00:00
usemathjax: true
---
<h1>Changes</h1>

<p>
Changes to all notes sorted like: date > note > heading > changed lines (gray lines represent deletions, orange lines replacements or new additions).
</p>
"""
        f.write(default + "\n".join(output))

# commit 
if task == "all" or task == "commit":
    subprocess.run(["bundle", "exec", "jekyll", "build"], cwd=cwd, check=True, shell=True)
    subprocess.run(["git", "add", "."], cwd=cwd, check=True, shell=True) # staging newest changes files were converted
    subprocess.run(["git", "status"], cwd=cwd, check=True, shell=True)
    commitMsg = input("Commit message: ")
    subprocess.run(["git", "commit", "-m", commitMsg], cwd=cwd, check=True, shell=True)
    subprocess.run(["git", "push", "origin", "main"], cwd=cwd, check=True, shell=True)