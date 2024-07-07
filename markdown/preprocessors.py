# Python Markdown

# A Python implementation of John Gruber's Markdown.

# Documentation: https://python-markdown.github.io/
# GitHub: https://github.com/Python-Markdown/markdown/
# PyPI: https://pypi.org/project/Markdown/

# Started by Manfred Stienstra (http://www.dwerg.net/).
# Maintained for a few years by Yuri Takhteyev (http://www.freewisdom.org).
# Currently maintained by Waylan Limberg (https://github.com/waylan),
# Dmitry Shachnev (https://github.com/mitya57) and Isaac Muse (https://github.com/facelessuser).

# Copyright 2007-2023 The Python Markdown Project (v. 1.7 and later)
# Copyright 2004, 2005, 2006 Yuri Takhteyev (v. 0.2-1.6b)
# Copyright 2004 Manfred Stienstra (the original version)

# License: BSD (see LICENSE.md for details).

"""
Preprocessors work on source text before it is broken down into its individual parts.
This is an excellent place to clean up bad characters or to extract portions for later
processing that the parser may otherwise choke on.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any
from . import util
from .htmlparser import HTMLExtractor
import re

if TYPE_CHECKING:  # pragma: no cover
    from markdown import Markdown


def build_preprocessors(md: Markdown, **kwargs: Any) -> util.Registry[Preprocessor]:
    """ Build and return the default set of preprocessors used by Markdown. """
    preprocessors = util.Registry()
    # preprocessors.register(spaceMaker(md), "space_maker", 50)
    preprocessors.register(listAlienator(md), "list_alien", 40)
    preprocessors.register(MathjaxEmptyLines(md), "mathjax_block", 40)
    preprocessors.register(NormalizeWhitespace(md), 'normalize_whitespace', 30)
    preprocessors.register(HtmlBlockPreprocessor(md), 'html_block', 20)
    return preprocessors


class Preprocessor(util.Processor):
    """
    Preprocessors are run after the text is broken into lines.

    Each preprocessor implements a `run` method that takes a pointer to a
    list of lines of the document, modifies it as necessary and returns
    either the same pointer or a pointer to a new list.

    Preprocessors must extend `Preprocessor`.

    """
    def run(self, lines: list[str]) -> list[str]:
        """
        Each subclass of `Preprocessor` should override the `run` method, which
        takes the document as a list of strings split by newlines and returns
        the (possibly modified) list of lines.

        """
        pass  # pragma: no cover


class NormalizeWhitespace(Preprocessor):
    """ Normalize whitespace for consistent parsing. """

    def run(self, lines: list[str]) -> list[str]:
        source = '\n'.join(lines)
        source = source.replace(util.STX, "").replace(util.ETX, "")
        source = source.replace("\r\n", "\n").replace("\r", "\n") + "\n\n"
        source = source.expandtabs(self.md.tab_length)
        source = re.sub(r'(?<=\n) +\n', '\n', source)
        return source.split('\n')


class HtmlBlockPreprocessor(Preprocessor):
    """
    Remove html blocks from the text and store them for later retrieval.

    The raw HTML is stored in the [`htmlStash`][markdown.util.HtmlStash] of the
    [`Markdown`][markdown.Markdown] instance.
    """

    def run(self, lines: list[str]) -> list[str]:
        source = '\n'.join(lines)
        parser = HTMLExtractor(self.md)
        parser.feed(source)
        parser.close()
        return ''.join(parser.cleandoc).split('\n')


# -------------------------------------------
#    CUSTOM STUFF
# -------------------------------------------

class MathjaxEmptyLines(Preprocessor):
    """
    no empty lines in mathjax blocks so they fit into one paragraph.
    So they are evaluated correctly by the mathjax script
    """
    def run(self, lines: list[str]) -> list[str]:
        mathjax = False
        newLines = []
        for line in lines:
            if line.strip() == "$$": mathjax = not mathjax
            if line.strip() == "" and mathjax: continue
            newLines.append(line)
        return newLines


class listAlienator(Preprocessor):
    """
    lists are only displayed correctly if there is an empty line before and after it
    otherwise they are 1. counted as paragraphs 2. the next block is sucked into
    the list.
    so inserting empty lines before and after if necessary
    """
    def run(self, lines: list[str]) -> list[str]:
        listprev = False
        newLines = []
        for line in lines:
            if len(line) == 0: listnow = False
            else:
                listnow = line.strip()[:2] in ["- ", "* ", "+ "]
                if not listprev and listnow: newLines.append("")
                if listprev and not listnow:
                    if line[0] not in ["\t", " "]: newLines.append("")
            listprev = listnow
            newLines.append(line)
        return newLines
                
class spaceMaker(Preprocessor):
    """
    markdown makes empty lines between paragraphs disappear while I think it shouldn't
    this changes empty lines to &nbsp;
    this, together with the nl2br extension means, paragraphs get sucket together into one.
    """
    def run(self, lines: list[str]) -> list[str]:
        for i, line in enumerate(lines):
            if line == "":
                lines[i] = "&nbsp;\n"
        return lines
                
