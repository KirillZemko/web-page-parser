// @todo: напишите здесь код парсера

// meta
const metaLang = document.querySelector('[lang]');
const metaTitle = document.title.split('—')[0].trim();
const metaKeywords = document.querySelector('meta[name="keywords"').content.split(', ');
const metaDescription = document.querySelector('meta[name="description"]').content;
const ogTags = document.querySelectorAll('meta[property^="og:"]');

// функция преобразования в объект атрибутов тега meta property
function getOgData(tags) {
    const ogData = {};

    tags.forEach(tag => {
        const key = tag.getAttribute('property').replace('og:', '');
        ogData[key] = tag.content.split('—')[0].trim()
    });

    return ogData;
}

// product - карточка товара
const productId = document.querySelector('.product').dataset.id; // id
// product images
const mainProductImage = document.querySelector('figure img');
const productImageThumbnails = document.querySelectorAll('nav button img')
const images = [];

images.push({
    preview: productImageThumbnails[0].src,
    full: productImageThumbnails[0].dataset.src,
    alt: productImageThumbnails[0].alt,
})

productImageThumbnails.forEach((item, index) => {
    if (index === 0) return;

    images.push({
        preview: item.src,
        full: item.dataset.src,
        alt: item.alt,
    })
});

const isLiked = document.querySelector('.preview nav button'); // product isLiked
const name = document.querySelector('h1').textContent; // product name
// product tags
const tags = document.querySelectorAll('.tags span');
const category = [];
const discount = [];
const label = [];

tags.forEach(tag => {
    if (tag.classList.contains('green')) {
        category.push(tag.textContent);
    } else if (tag.classList.contains('blue')) {
        label.push(tag.textContent);
    } else if(tag.classList.contains('red')) {
        discount.push(tag.textContent);
    }
});

// product prices
const productPrice = document.querySelector('.price');
const currentPrice = Number(productPrice
                                .childNodes[0]
                                .textContent
                                .replace('₽', '')
                                .trim());
const productOldPrice = Number(document.
                                querySelector('.price span')
                                .textContent
                                .replace('₽', '')
                                .trim());

// product discount
function getProductDiscountPercent(oldPrice, currentPrice) {
    let discountPercent;;

    if (oldPrice === currentPrice) {
        discountPercent = '0%';
    } else if (oldPrice < currentPrice) {
        discountPercent = 'Ошибка: первоначальная цена меньше цены с учетом скидки'
    } else {
        discountPercent = String((100 - ((currentPrice * 100) / oldPrice)).toFixed(2)) + '%';
    }

    return discountPercent;
}

function getProductDiscountAmount(oldPrice, currentPrice) {
    let amount;
    if (oldPrice === currentPrice) {
        amount = 0;
    } else if (oldPrice > currentPrice) {
        amount = oldPrice - currentPrice;
    }

    return amount;
}

// product currency
function getProductCurrency(productPrice) {
    let productCurrency;
    const rub = 'RUB';
    const eur = '€';
    const usd = '$';
    
    if (productPrice.textContent.includes('₽')) {
        productCurrency = rub;
    } else if (productPrice.textContent.includes('€')) {
        productCurrency = eur;
    } else if (productPrice.textContent.includes('$')) {
        productCurrency = usd;
    }

    return productCurrency;
}
// product properties
const productProperties = document.querySelectorAll('.properties li');
function getProductProperties(productProperties) {
    let propertiesResult = {}

    productProperties.forEach(item => {
        const spans = item.querySelectorAll('span');
        let key = spans[0].textContent;
        let value = spans[1].textContent;
        
        propertiesResult[key] = value;
    })

    return propertiesResult;
};

// product description
const productDescription = document.querySelector('.description');

function getProductDescription(node) {
    const clone = node.cloneNode(true);
    // удаляем все аттрибуты клонированной ноды
    clone.querySelectorAll('*').forEach(el => {
        [...el.attributes].forEach(attr => {
            el.removeAttribute(attr.name);
        });
    });

    return clone.innerHTML.trim();
}

// suggested products
const productCards = document.querySelectorAll('.suggested .items article');

function getSuggestedProducts(cards) {
    let suggestedResult = [];

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const image = card.querySelector('img').src;

        const price = card.querySelector('b').textContent;
        const priceText = price.replace(price[0], '').trim();
        const priceCurrency = card.querySelector('b');

        suggestedResult.push({
            name: title,
            description,
            image,
            price: priceText,
            currency: getProductCurrency(priceCurrency),
        });
    });

    return suggestedResult;
}

// reviews
const reviews = document.querySelectorAll('.reviews .items article');
let reviewsResult = [];

reviews.forEach(review => {
    const title = review.querySelector('h3').textContent;
    const description = review.querySelector('p').textContent;

    const ratings = review.querySelectorAll('.rating span');
    let ratingCounter = 0;
    ratings.forEach(rating => {
        if (rating.classList.contains('filled')) {
            ratingCounter += 1;
        }
    });

    const date = review.querySelector('.author i').textContent;
    const dateModified = date.replaceAll('/', '.');

    const authorAvatar = review.querySelector('.author img').src;
    const authorName = review.querySelector('.author span').textContent;
    const authorData = {
        avatar: authorAvatar,
        name: authorName,
    }

    reviewsResult.push({
        title,
        description,
        rating: ratingCounter,
        date: dateModified,
        author: authorData,
    });    
});

function parsePage() {

    return {
        meta: {
            title: metaTitle,
            language: metaLang.lang,
            description: metaDescription,
            keywords: metaKeywords,
            opengraph: getOgData(ogTags),
        },
        product: {
            id: productId,
            name,
            isLiked: isLiked.hasAttribute('disabled') ? false : true,
            images: images,
            tags: { category, discount, label },
            price: currentPrice,
            oldPrice: productOldPrice,
            discount: getProductDiscountAmount(productOldPrice, currentPrice),
            discountPercent: getProductDiscountPercent(productOldPrice, currentPrice),
            currency: getProductCurrency(productPrice),
            properties: getProductProperties(productProperties),
            description: getProductDescription(productDescription),
        },
        suggested: getSuggestedProducts(productCards),
        reviews: reviewsResult,
    };
}

window.parsePage = parsePage;