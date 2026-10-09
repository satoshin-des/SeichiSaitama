import data from "./data.json" with { type: 'json' };

const ITEMS_PER_PAGE = 12;

const txtSearch = document.getElementById('txtSearch');
const listSearch = document.getElementById('listSearch');
const toPrev = document.getElementById('toPrev');
const toNext = document.getElementById('toNext');
const pageInfo = document.getElementById('pageInfo');
let searchTxt = '';
let searchRes = data;

let currPage = 1;

// ----------------------------------------
// Creates embed link using place name
// ----------------------------------------
const googleMapEmbedLink = placeName => {
    // ----------------------------------------
    // Encode for URL
    // ----------------------------------------
    const encodedPlaceName = encodeURIComponent(`埼玉県${placeName}`);
    return `<iframe src="https://www.google.com/maps?q=${encodedPlaceName}&output=embed" class="seichi-map" allowfullscreen="" loading="lazy"></iframe>`;
};

async function getWikipediaSummary(title) {
    // ----------------------------------------
    // Encode for URL
    // ----------------------------------------
    const encodedTitle = encodeURIComponent(title);
    const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;
    const failedRes = `読み込みエラーまたは記事が存在しません<br /><img src="https://tv2nd.anime-eupho.com/img/story/st03/icon/euph_st03_03.png" width="90px" />`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            return failedRes;
        }
        const wikiData = await res.json();
        return `<b><a href="https://ja.wikipedia.org/wiki/${encodedTitle}">Wikipedia</a>からの引用</b><br />${wikiData.extract}`;
    } catch {
        return failedRes;
    }
};

// ----------------------------------------
// Clearing all old search results, re-lists
// new search results from upper.
// Based on `https://weblog.walk-life.me/search_json_list/`
// ----------------------------------------
const searchResList = async () => {
    // ----------------------------------------
    // Checks that there exists old child elements
    // in the HTML-element `listSearch.`
    // If there exists old elements, remove it
    // from upper.
    //
    // Relation of parent elements and child
    // element is like the below:
    // <ul id="listSearch">
    //   <li>Apple</li>
    //   <li>Banana</li>
    // </ul>
    // parent element: `<ul id="listSearch">`
    // child element: Two element `<li>` in the
    // parent element.
    // // Here, `listSearch.firstChild` is `<li>`
    // of Apple
    // ----------------------------------------
    while (listSearch.firstChild) {
        listSearch.removeChild(listSearch.firstChild);
    }

    // ----------------------------------------
    // Computes the number of total pages
    // ----------------------------------------
    const totalPages = Math.ceil(searchRes.length / ITEMS_PER_PAGE);
    if (totalPages === 0) {
        totalPages = 1;
    }

    if (currPage > totalPages) {
        currPage = totalPages;
    }

    // ----------------------------------------
    // Samples the data to display on the current
    // pages using slice
    // ----------------------------------------
    const startIdx = (currPage - 1) * ITEMS_PER_PAGE;
    const pagesItems = searchRes.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const numberOfPagesItems = pagesItems.length;
    let i, j;
    // ----------------------------------------
    // Inserts new list indices into listSearch
    // that is emptyened
    // ---------------------------------------- 
    for (i = 0; i < numberOfPagesItems; ++i) {
        // ----------------------------------------
        // Gets summary of Wikipedia on the works
        // and to display on the page, joints all
        // informations of works
        // ----------------------------------------
        let works = ''
        for (j = 0; j < pagesItems[i].work.length; ++j) {
            const summaryStr = await getWikipediaSummary(pagesItems[i].work[j]);
            works += `『<div class="balloonoya">${pagesItems[i].work[j]}<span class="balloon-bottom">${summaryStr}</span></div>』<br />`;
        }

        // ----------------------------------------
        // Inserts informations on works and seichis
        // to HTML.
        // ----------------------------------------
        listSearch.insertAdjacentHTML('beforeend', `
            <div class="work-card">
                聖地：${pagesItems[i].place}<br />
                <details>
                    <summary>作品名</summary>
                    ${works}
                </details>
                ${googleMapEmbedLink(pagesItems[i].place)}
            </div>
        `);
    }

    /*
    searchRes.map(search => {
        listSearch.insertAdjacentHTML('beforeend', `<div class="work-card">作品名：<div class="balloonoya">『${search.work}』<span class="balloon">${getWikipediaSummary(search.work)}</span></div><br />聖地：${search.place}<br />${googleMapEmbedLink(search.place)}</div>`);
    });
    */

    pageInfo.textContent = `${currPage}/${totalPages}`;
};

// ----------------------------------------
// The click event to previous page
// ----------------------------------------
toPrev.addEventListener('click', () => {
    if (currPage > 1) {
        --currPage;
        searchResList();
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
});

// ----------------------------------------
// The click event to next page
// ----------------------------------------
toNext.addEventListener('click', () => {
    const totalPages = Math.ceil(searchRes.length / ITEMS_PER_PAGE);
    if (totalPages === 0) {
        totalPages = 1;
    }

    if (currPage < totalPages) {
        ++currPage;
        searchResList();
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
});

// ----------------------------------------
// If users input or delete characters from
// `txtSearch` i.e. event input-event, it
// runs.
// ----------------------------------------
txtSearch.addEventListener('input', function (e) {
    searchTxt = e.target.value;

    // ----------------------------------------
    // Filters data by tag from data.json.
    // To search simply, transforms all alphabets
    // to lower case.
    // ----------------------------------------
    searchRes = data.filter(data => {
        return data.tag.toLocaleLowerCase().includes(searchTxt);
    });

    // ----------------------------------------
    // Using filtered data `searchRes`, clears
    // lists on screen
    // ----------------------------------------
    searchResList();
});

// ----------------------------------------
// When users do nothing, print lists on screen
// ----------------------------------------
searchResList();
