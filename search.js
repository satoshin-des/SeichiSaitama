import data from "./data.json" with { type: 'json' };

const txtSearch = document.getElementById('txtSearch');
const listSearch = document.getElementById('listSearch');
let searchTxt = '';
let searchRes = data;

// ----------------------------------------
// Creates embed link using place name
// ----------------------------------------
const googleMapEmbedLink = placeName => {
    // ----------------------------------------
    // Encode for URL
    // ----------------------------------------
    const encodedPlaceName = encodeURIComponent(`埼玉県${placeName}`)
    return `<iframe src="https://www.google.com/maps?q=埼${encodedPlaceName}&output=embed" class="seichi-map" allowfullscreen="" loading="lazy"></iframe>`
};

async function getWikipediaSummary(title) {
    // ----------------------------------------
    // Encode for URL
    // ----------------------------------------
    const encodedTitle = encodeURIComponent(title);
    const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;
    const failedRes = `読み込みエラーまたは記事が存在しません<br /><img src="https://tv2nd.anime-eupho.com/img/story/st03/icon/euph_st03_03.png" width="90px" />`

    try {
        const res = await fetch(url);
        if (!res.ok) {
            return failedRes;
        }
        const wikiData = await res.json();
        return `<b>Wikipediaからの引用</b><br />${wikiData.extract}`;
    } catch {
        return failedRes;
    }
};

// ----------------------------------------
// Clearing all old search results, re-lists
// new search results from upper.
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
    // Inserts new list indices into listSearch
    // that is emptyened
    // ---------------------------------------- 
    for (const search of searchRes) {
        const summaryStr = await getWikipediaSummary(search.anime);
        listSearch.insertAdjacentHTML('beforeend', `<div class="anime-card">作品名：<div class="balloonoya">『${search.anime}』<span class="balloon">${summaryStr}</span></div><br />聖地：${search.place}<br />${googleMapEmbedLink(search.place)}</div>`);
    }

    /*
    searchRes.map(search => {
        listSearch.insertAdjacentHTML('beforeend', `<div class="anime-card">作品名：<div class="balloonoya">『${search.anime}』<span class="balloon">${getWikipediaSummary(search.anime)}</span></div><br />聖地：${search.place}<br />${googleMapEmbedLink(search.place)}</div>`);
    });
    */
};

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
