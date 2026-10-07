import data from "./data.json" with { type: 'json' };

const txtSearch = document.getElementById('txtSearch');
const listSearch = document.getElementById('listSearch');
let searchTxt = '';
let searchRes = data;

// ----------------------------------------
// Creates embed link using place name
// ----------------------------------------
const googleMapEmbedLink = placeName => {
    return `<iframe src="https://www.google.com/maps?q=${placeName}&output=embed" width="300" height="225" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
}

// ----------------------------------------
// Clearing all old search results, re-lists
// new search results from upper.
// ----------------------------------------
const searchResList = () => {
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
    searchRes.map(search => {
        listSearch.insertAdjacentHTML('beforeend', `<div class="anime-card">作品名：『${search.anime}』<br />聖地：${search.place}<br />${googleMapEmbedLink(search.place)}</div>`);
    });
}

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
