// @todo: напишите здесь код парсера

const metaKeywords = document.querySelector('meta[name="keywords"]').content;
const metaDescription = document.querySelector('meta[name="description"]').content;
const ogTags = document.querySelectorAll('meta[property^="og:"]');

function parsePage() {
    const metaLang = document.querySelector('[lang]');
    const metaTitle = document.title.split('—')[0].trim();

    return {
        meta: {
            title: metaTitle,
            language: metaLang,
        },
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;