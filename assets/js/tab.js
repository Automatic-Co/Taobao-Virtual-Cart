chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var allProducts = 0
    $('#emptyCart').show();
    chrome.cookies.getAll({
        domain: 'detail.tmall.com'
    }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].name == 'taobaoVirtualCart') {
                val = decodeURI(cookies[i].value).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%2F/g, '/');
                array = $.makeArray(val)
                products = JSON.parse(array)
                allProducts = allProducts + products.length
                products.forEach((val,index) => {
                    getProduct(cookies,val.cookie)
                });
            }
        }
    });

    chrome.cookies.getAll({
        domain: 'item.taobao.com'
    }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].name == 'taobaoVirtualCart') {
                val = decodeURI(cookies[i].value).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%2F/g, '/');
                array = $.makeArray(val)
                products = JSON.parse(array)
                allProducts = allProducts + products.length
                products.forEach((val,indexW) => {
                    getProduct(cookies,val.cookie)
                });
            }
        }
        chrome.browserAction.setBadgeText({text: allProducts+""});
    });
});

function getProduct(cookies,product) {
    cookies.forEach((val,index) => {
        if (val.name==product) {
            decodeVal = decodeURI(val.value).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%2F/g, '/');
            array = $.makeArray(decodeVal)
            products = JSON.parse(array)
            productHtml(products)
            totalPrice(products.price,products.quantity)
        }
    });
}

function totalPrice(price,quantity) {
    total=parseFloat(price)*parseFloat(quantity)
    totalPrices = parseFloat($('.total').text())+total
    $('.total').text(totalPrices);

    totalBadge=$('.badge').text()
    badge = parseFloat(totalBadge)+1
    $('.badge').text(badge);
}

function productHtml(product) {
    $('.currency').text(product.currency);
    image = product.image.replace(/https:/g, '').replace(/http:/g, '')
    html =   "<li class='clearfix product' data-value='" + JSON.stringify(product) + "'>\
                    <img src='http:" + image + "' />\
                        <span class='item-name' title='" + unescape(product.title) +"'>" + unescape(product.title).slice(0,50) +"...</span>\
                        <span class='item-price'>" + product.currency + product.price+"</span>\
                        <span class='item-quantity'>Quantity : " + product.quantity+"</span>\
                    </li>\
                ";
    $("#cartTable").append(html);

    $('#botmBtn').show();
    $('#emptyCart').hide();
    $('.container').show();
}

$('#clear-cart').click(function (e) {
    chrome.cookies.remove({
        "url": "https://item.taobao.com",
        "name": "taobaoVirtualCart"
    });
    chrome.cookies.remove({
        "url": "https://detail.tmall.com",
        "name": "taobaoVirtualCart"
    }, function(deleted_cookie) {
        // alert('Cart items deleted successfully.')
        window.location.reload()
    });
});

$('#export-btn').click(function (e) {
    csvData = new Array('%23%2CLink%2CTitle%2CQuantity%2CPrice%2CAttributes%2CTotal%20Amount%0A');

    $('#cartTable li').each(function (index) {
        value = JSON.parse($(this).attr('data-value'))

        total = parseFloat(value.price)*parseFloat(value.quantity)
        csvData.push(index + 1 + '%2C' + value.link + '%2C' + value.title.replace(/ /g, "%20") + '%2C' + value.quantity + '%2C' + value.price + '%2C' + value.attribute.replace(/ /g, "%20") + '%2C' + total + '%0A')
    });
    totalPrices = $('.total').text();
    csvData.push('%0A%0A%20%2C%20%2C%20%2C%20%2C%20%2CTotal%20price%20of%20all%20items%2C'+totalPrices+'%0A')

    $('#export-btn').attr('href', 'data:application/csv;charset=utf-8,' + csvData.join(''));
});
