<?php
/*
Generates a table of contents (toc) as nested unordered lists.
Each list item has a link to the heading.
Each heading receives an id that is its own slug.

Assumes that there are no h1 headings in $html.
*/

error_reporting(E_ALL);
ini_set('display_errors', 1);
function generateToc($html) {
    $doc = new DOMDocument();
    @$doc->loadHTML('<!DOCTYPE html>' . $html);
    $headings = $doc->getElementsByTagName('*');
    $toc = [];
    $slugs = [];

    foreach ($headings as $heading) {
        if (preg_match('/^h[1-6]$/', $heading->nodeName)) {
            $level = (int)substr($heading->nodeName, 1);
            $text = trim($heading->nodeValue);
            $slug = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $text));
            $counter = 1;
            while (in_array($slug, $slugs)) {
                $slug = $slug . "_" . $counter;
                $counter++;
            }
            $slugs[] = $slug;
            $heading->setAttribute('id', $slug);
            $toc[] = ['text' => $text, 'slug' => $slug, 'level' => $level];
        }
    }

    function generateHtml($toc) {
        $html = '<nav class="toc">';
        $level = 1;
        foreach ($toc as $item) {
            if ($level == $item["level"]) { $html .= '</li><li>'; }
            while ($level < $item["level"]) {
                $html .= '<ul><li>';
                $level++;
            }
            while ($level > $item["level"]) {
                $html .= '</li></ul>';
                $level--;
                if ($level == $item["level"]) { $html .= '</li><li>'; }
            }
            $html .= '<a href="#' . $item['slug'] . '">' . htmlspecialchars($item['text']) . '</a>';
        }
        while ($level > 1) {
            $html .= '</li></ul>';
            $level--;
        }
        return $html . '</nav>';
    }

    return generateHtml($toc) . $doc->saveHTML();
}
?>