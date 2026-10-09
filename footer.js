const footer = document.querySelector('.footer');
const thisYear = new Date().getFullYear();
const remarkTxt = "聖地巡礼を行う際は地元の方々や他の観光客の迷惑にならないように心がけましょう．また，法律や条例，マナーなども守り，写真撮影の際には写真撮影可能かどうかをチェックしましょう．";

const displayFooter = () => {
    if (footer) {
        if (thisYear == 2026) {
            footer.insertAdjacentHTML('beforeend', `${remarkTxt}<br />(C) satoshin 2026`);
        }
        else {
            footer.insertAdjacentHTML('beforeend', `${remarkTxt}<br />(C) satoshin ${thisYear}`);
        }
    }
};

displayFooter();
