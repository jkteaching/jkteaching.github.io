function loadProductData (products){
    let productHTMLArray = [];

    products.forEach((product) => {
        productHTMLArray.push('<div class="product-card">');
        productHTMLArray.push('<img src="' + product.imageLink + '" role="presentation" />');
        productHTMLArray.push('<h2><a href="'+ product.productPageLink +'">' + product.title + '</a></h2>');
        productHTMLArray.push('<p class="original-price">MSRP: $' + product.MSRP + '</p>');
        productHTMLArray.push('<p class="current-price">Price you pay <span>$' + product.purchasePrice + '</span></p>');
        productHTMLArray.push('<p class="saving">Your saving $' + getProductSavings(product) + '</p>');
        productHTMLArray.push('</div>');
    });

    document.getElementById("product-cards").innerHTML += productHTMLArray.join('');

}

const add = (number1, number2) => number1 + number2;

const getProductSavings = (product) => product.MSRP - product.purchasePrice;

