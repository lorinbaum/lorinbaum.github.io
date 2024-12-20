from pathlib import Path
import re

buildfiles = [x for x in Path.home.iterdir() if x.suffix == ".html"]


for file in buildfiles:
    with open(file, "r") as f:
        t = f.read()
        # creat html object
        # method like get

        # fill nav class="toc" with table of contents
        # find all headings
        #
        # get list of all headings. give id where not already. based on heading content. increment if duplicate
        assert '<nav class="toc">' in t
        headings = 
        break
    with open(file, "w") as f: f.write(t)


used_ids = set()
def make_id(text):
    base_id = re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')
    unique_id = base_id
    counter = 1
    while unique_id in used_ids:
        unique_id = f"{base_id}-{counter}"
        counter += 1
    return unique_id

def get(tag=None, )