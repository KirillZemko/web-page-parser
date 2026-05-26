// @todo: напишите здесь код парсера

const metaLang = document.querySelector('[lang]');
const metaTitle = document.title.split('—')[0].trim();
const metaKeywords = document.querySelector('meta[name="keywords"').content.split(', ');
const metaDescription = document.querySelector('meta[name="description"]').content;
const ogTags = document.querySelectorAll('meta[property^="og:"]');

// функция преобразования в объект атрибутов property og
function getOgData() {
    const ogData = {};
    ogTags.forEach(tag => {
        const key = tag.getAttribute('property').replace('og:', '');
        ogData[key] = tag.content;
    });
    return ogData;
}

function parsePage() {

    return {
        meta: {
            title: metaTitle,
            language: metaLang.lang,
            description: metaDescription,
            keywords: metaKeywords,
            opengraph: getOgData(ogTags),
        },
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;