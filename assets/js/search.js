/*
 * The search page, searching Micro.blog's archive JSON.
 *
 * Clodd fetched /search.json and filtered it; on Micro.blog the equivalent is
 * /archive/index.json, which home.archivejson.json writes with every post's
 * whole text. A post matches when every word of the query is in its title or
 * text. Title matches come first, then the rest, newest first within each.
 * The results are drawn as Clodd's post cards — an article card for anything
 * with a title, a note card otherwise — so a results page reads as the same
 * card family as the home page.
 *
 * Everything that reaches the page is escaped; the excerpts are cut from the
 * post's plain text, with each match then wrapped in <mark>.
 */
(function () {
    var PAGE_SIZE = 10;
    var EXCERPT = 220;

    var resultEl = document.getElementById('search-results');
    var input    = document.getElementById('search-page-q');
    if (!resultEl) return;

    var q = (new URLSearchParams(window.location.search).get('q') || '').trim();
    if (input && q) { input.value = q; }
    if (!q) return;

    var words = q.toLowerCase().split(/\s+/).filter(Boolean);

    function esc(s) {
        return String(s || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function say(html) { resultEl.innerHTML = '<p class="search-empty">' + html + '</p>'; }

    // Escaped text with each query word marked. The words are escaped the
    // same way, so a match never splits an entity.
    function mark(text) {
        var out = esc(text);
        var pattern = words.map(function (w) {
            return esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }).join('|');
        return pattern ? out.replace(new RegExp('(' + pattern + ')', 'gi'), '<mark>$1</mark>') : out;
    }

    // About EXCERPT characters of the text, starting a little before the
    // first match so it reads in context.
    function excerpt(text) {
        var lower = text.toLowerCase();
        var at = -1;
        words.forEach(function (w) {
            var i = lower.indexOf(w);
            if (i !== -1 && (at === -1 || i < at)) { at = i; }
        });
        var start = Math.max(0, at - 60);
        if (start > 0) {
            var space = text.indexOf(' ', start);
            if (space !== -1 && space < at) { start = space + 1; }
        }
        var cut = text.slice(start, start + EXCERPT);
        if (start + EXCERPT < text.length) {
            var end = cut.lastIndexOf(' ');
            if (end > EXCERPT / 2) { cut = cut.slice(0, end); }
            cut += '…';
        }
        return (start > 0 ? '…' : '') + mark(cut);
    }

    function card(item) {
        var meta  = item._clodd || {};
        var kind  = meta.kind || (item.title ? 'article' : 'note');
        var url   = esc(item.url);
        var date  = esc(meta.date);
        var body  = excerpt(item.content_text || '');
        if (kind !== 'article') {
            return '<article class="post-card post-card--note"><div class="post-card__inner">'
                + (date ? '<time class="post-card__date"><a href="' + url + '">' + date + '</a></time>' : '')
                + '<p class="post-card__body">' + body + '</p>'
                + '</div></article>';
        }
        return '<article class="post-card post-card--article"><div class="post-card__inner">'
            + '<h2 class="post-card__title"><a href="' + url + '">' + mark(item.title) + '</a></h2>'
            + '<p class="post-card__excerpt">' + body + '</p>'
            + (date ? '<footer class="post-card__meta"><time>' + date + '</time></footer>' : '')
            + '</div></article>';
    }

    say('Searching…');

    fetch(resultEl.dataset.index).then(function (r) {
        if (!r.ok) { throw new Error(r.status); }
        return r.json();
    }).then(function (feed) {
        var inTitle = [], inText = [];
        (feed.items || []).forEach(function (item) {
            var title = (item.title || '').toLowerCase();
            var all = title + ' ' + (item.content_text || '').toLowerCase();
            if (!words.every(function (w) { return all.indexOf(w) !== -1; })) { return; }
            (words.some(function (w) { return title.indexOf(w) !== -1; }) ? inTitle : inText).push(item);
        });
        var hits = inTitle.concat(inText);
        if (!hits.length) {
            say('No results for <strong>' + esc(q) + '</strong>.');
            return;
        }

        var shown = 0;
        resultEl.innerHTML = '';
        var more = document.createElement('button');
        more.type = 'button';
        more.className = 'button-link search-more';
        more.textContent = 'More results';

        function next() {
            more.remove();
            var batch = hits.slice(shown, shown + PAGE_SIZE);
            resultEl.insertAdjacentHTML('beforeend', batch.map(card).join(''));
            shown += batch.length;
            if (shown < hits.length) { resultEl.appendChild(more); }
        }

        more.addEventListener('click', next);
        next();
    }).catch(function () {
        say('Search isn’t available right now. Try again in a moment.');
    });
}());
