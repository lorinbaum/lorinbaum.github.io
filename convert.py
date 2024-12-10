"""
input: css, favicon, home folder, output folder paths
output: markdown gets converted to html and moved to output folder. also css, favicon and other files
NOTE: links must be relative and no wikilinks
"""

from markdown import markdown
from pathlib import Path
import re, os, shutil

cwd = Path(__file__).resolve().parent
css = "main.css"
favicon = "favicon.ico"
home = "home"
out = "server"

mathjaxInclude = """<script>MathJax = { tex: {inlineMath: [['$', '$']],displayMath: [['$$', '$$']]}};</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>"""

def convert(text:str, title:str) -> str:
  mathjax = bool(re.search("\n\$\$\n|\$\S+\$", text))
  text = re.sub(r'(!?\[.*?\])\(([^)]+?)(#.*)?\)', custom_url, text)
  content = markdown(text, extensions=["nl2br", "fenced_code", "codehilite", "toc", "tables", "meta"], extension_configs={'codehilite': {'guess_lang': False}})
  return f"""<!DOCTYPE html><html lang=en><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title><link rel="stylesheet" href="{css}"><link rel="shortcut icon" href="{favicon}"></head><body>{mathjaxInclude if mathjax else ""}{content}</body></html>"""
  
def custom_url(match) -> str:
  link_text, link_url = match.group(1), match.group(2)
  base_filename, heading = link_url.split('#', 1) if "#" in link_url else link_url, None
  if (full_path := Path(home).joinpath(base_filename.replace("%20"," "))).exists(): # local file?
    if base_filename.endswith('.md'): base_filename = full_path.stem + ".html"
    base_filename = slugify(base_filename)
  return f"{link_text}({base_filename}{'#'+heading if heading else ''})"

# cheap slugification, you are responsible for your own madness
def slugify(string:str) -> str: return string.lower().replace(" ","-").replace("_","-")

# delete previous output
for file in os.listdir(out): Path(out).joinpath(file).unlink()

# get md files in home, assuming it has no subfolders
for md in [filepath for file in os.listdir(home) if (filepath:=Path(file)).suffix == ".md"]:
  with open(Path(home).joinpath(md), "r") as f_in:
    with open(slugify(str(Path(out).joinpath(md.stem + ".html"))), "w") as f_out: f_out.write(convert(f_in.read(), Path(md).stem))

# move non md files
for f in map(Path, [home + "/" + file for file in os.listdir(home) if not file.endswith(".md")] + [css, favicon]): shutil.copy2(f, Path(out).joinpath(slugify(str(f.name))))