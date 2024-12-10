"""
- inputs: path, (permission group)
	- settings: css, frame
	- (filter links to files outside permission (note this in cache))
	- convert md, put into frame
	- add css
	- output: html
return links in the file and store in sql to avoid reading the file again?
NOTE: links must be relative
"""

from markdown import markdown
from pathlib import Path
from __future__ import annotations
import re, os

cwd = Path(__file__).resolve().parent
css = "main.css"
favicon = "favicon.ico"
home = "home"

mathjaxInclude = """<script>MathJax = { tex: {inlineMath: [['$', '$']],displayMath: [['$$', '$$']]}};</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>"""

def convert(text:str, title:str) -> str:
    mathjax = bool(re.search("\n\$\$\n|\$\S+\$", text))
    content = markdown(text, extensions=["nl2br", "wikilinks", "fenced_code", "codehilite", "toc", "tables"], extension_configs={'codehilite': {'guess_lang': False}})
    return f""""<!DOCTYPE html><html lang=en>
    <head><meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <link rel="stylesheet" href="{css}">
        <link rel="shortcut icon" href="{favicon}">
    </head>
    <body>
    {mathjaxInclude if mathjax else ''}
    {content}
    </body>
</html>
"""

# get files after considering .gitgnore
considerList:List[Path] = []
with open(".gitignore", "r") as f: ignoreList:List[Path] = [Path(line.strip()).parts for line in f.readlines()]
for parts1 in [(Path("home") / i).parts for i in os.listdir("home")]:
    for ignoreItem in ignoreList:
        if all([p1 == p2 for p1, p2 in zip(ignoreItem, parts1)]): continue
        else:
            print(list(zip(parts1, ignoreItem)))
            considerList.append(Path("/".join(parts1)))
considerList