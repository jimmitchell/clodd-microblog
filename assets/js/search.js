/*
 * The search page, with Pagefind as the index.
 *
 * Clodd fetched /search.json and filtered it; Pagefind's index is built from
 * the finished pages instead (pagefind --site public), so it searches whole
 * bodies and ranks what it finds. The results are drawn as Clodd's post cards
 * — an article card for anything with a title, a note card otherwise — so a
 * results page reads as the same card family as the home page.
 *
 * Pagefind's excerpts arrive as HTML with each match in <mark>; they come
 * from the site's own pages, so they are inserted as they are. Everything
 * else that reaches the page is escaped.
 */
(function () {
    var PAGE_SIZE = 10;

    var resultEl = document.getElementById('search-results');
    var input    = document.getElementById('search-page-q');
    if (!resultEl) return;

    var q = (new URLSearchParams(window.location.search).get('q') || '').trim();
    if (input && q) { input.value = q; }
    if (!q) return;

    function esc(s) {
        return String(s || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function say(html) { resultEl.innerHTML = '<p class="search-empty">' + html + '</p>'; }

    function card(r) {
        var meta  = r.meta || {};
        var kind  = meta.kind || (meta.title ? 'article' : 'note');
        var url   = esc(r.url);
        var date  = esc(meta.date);
        if (kind === 'note' || kind === 'photo') {
            return '<article class="post-card post-card--note"><div class="post-card__inner">'
                + (date ? '<time class="post-card__date"><a href="' + url + '">' + date + '</a></time>' : '')
                + '<p class="post-card__body">' + r.excerpt + '</p>'
                + '</div></article>';
        }
        return '<article class="post-card post-card--article"><div class="post-card__inner">'
            + '<h2 class="post-card__title"><a href="' + url + '">' + esc(meta.title) + '</a></h2>'
            + '<p class="post-card__excerpt">' + r.excerpt + '</p>'
            + (date ? '<footer class="post-card__meta"><time>' + date + '</time></footer>' : '')
            + '</div></article>';
    }

    say('Searching…');

    import(resultEl.dataset.bundle + 'pagefind.js').then(function (pagefind) {
        return pagefind.search(q);
    }).then(function (search) {
        var hits = (search && search.results) || [];
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
            more.disabled = true;
            var batch = hits.slice(shown, shown + PAGE_SIZE);
            return Promise.all(batch.map(function (h) { return h.data(); })).then(function (rows) {
                more.remove();
                resultEl.insertAdjacentHTML('beforeend', rows.map(card).join(''));
                shown += batch.length;
                if (shown < hits.length) {
                    more.disabled = false;
                    resultEl.appendChild(more);
                }
            });
        }

        more.addEventListener('click', next);
        return next();
    }).catch(function () {
        // No bundle: the index is made when the site is built, so a plain
        // `hugo server` has none.
        say('Search isn’t available here yet. The index is built along with the site.');
    });
}());
