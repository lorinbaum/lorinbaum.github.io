import os
import re
from pathlib import Path
import shutil
import subprocess
import difflib
from datetime import datetime, timezone
import sys
import time

startTime = time.time()
path = Path("./_posts/")
mdFiles = [f for f in os.listdir(path) if f.endswith(".md")]
# get titles
titles = {}
for md in mdFiles:
    with open(path / md, "r") as f:
        titles[md] = re.search("title:(.+)", f.read())[1].strip()

commitMsg = input("Commit message: ")

# converting files
for md in mdFiles:
    print(f"Converting {md}")
    with open(path / md) as f:
        nt = f.read()
        fileChanged = False
        
        # Converting internal wikilinks
        i = 0
        while True:
            internalWikiref = re.search("[^!]\[\[#(?:[^\]]|\](?!\]))+]]", nt)
            if internalWikiref != None:
                i += 1
                name = internalWikiref.group()[1:].strip("[]#")
                target = name.lower().replace(' ','-')
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
                print(f"    replaced '{postWikirefs.group()[1:]}' with '{link}'")
            else:
                break
        if i > 0:
            print(f"    Converted \033[32m{i}\033[0m post wikilinks")
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
            fileChanged = True

        # find block mathjax, ensure double linebreak around it to make it recognizable as a block
        i = 0
        j = 0
        mathjax = False
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
        if i > 0 or j > 0:
            mathjax = True
            fileChanged = True

        # # find inline mathjax, add $ around it so it is recognized
        # i = 0
        # while True:
        #     inlineMJ = re.search("[^\$]\$[^\$\n]+\$[^\$]", nt)
        #     if inlineMJ != None:
        #         i += 1
        #         nt = nt[:inlineMJ.start()] + inlineMJ[0].replace("$", "$$") + nt[inlineMJ.end():]
        #     else:
        #         break
        # if i > 0:
        #     print(f"    Converted \033[32m{i}\033[0m inline mathjax strings")
        #     mathjax = True
        #     fileChanged = True

        if fileChanged:
            # update frontmatter
            newFm = {
                "usemathjax": "True" if mathjax else "False",
                "updated": datetime.now(timezone.utc).isoformat("T", "seconds"),
                "commitMsg": commitMsg
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
            with open(path / md, "w") as nf: # new file
                nf.write(nt)
            print(f"updated frontmatter, wrote file\n")


# update 
subprocess.run(["git", "add", "."], cwd="M:/lorinbaum.github.io/", check=True, shell=True)
subprocess.run(["git", "status"], cwd="M:/lorinbaum.github.io/", check=True, shell=True)
confirmed = input("continue? [y,n]: ")
if confirmed in ["", "y", "Y"]:
    subprocess.run(["git", "commit", "-m", commitMsg], cwd="M:/lorinbaum.github.io/", check=True, shell=True)
    # subprocess.run(["git", "push", "origin", "main"], cwd="M:/lorinbaum.github.io/", check=True, shell=True)
    # 

# if len(toUpdate) == 0:
#     print("Nothing to update.")
# elif updatedCount > 0:
#     print("Building Jekyll")
#     subprocess.run(["jekyll", "build"], cwd=targetPath, check=True, shell=True)
# else:
#     print("Updated nothing")

# if "synch" in sys.argv:
#     if updatedCount == 0:
#         print("Building Jekyll")
#         subprocess.run(["jekyll", "build"], cwd=targetPath, check=True, shell=True)
#     # subprocess.run(["duck", "--upload", serverUrl,"_site"], cwd=targetPath, check=True, shell=True)
#     print("")
#     subprocess.run(["duck", "--synchronize", serverUrl,"_site", "--existing", "upload"], cwd=targetPath, check=True, shell=True)

# # if "--verbose" in sys.argv:
# #     print("this is the verbose version!")

# endTime = time.time()
# print(f"\nFinished in {round(endTime - startTime, 2)} seconds.")