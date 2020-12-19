chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var allProducts = 0
    chrome.cookies.getAll({
        domain: 'detail.tmall.com'
    }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].name == 'taobaoVirtualCart') {
                val = decodeURI(cookies[i].value).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%2F/g, '/');
                array = $.makeArray(val)
                products = JSON.parse(array)
                allProducts = allProducts + products.length
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
            }
        }
        chrome.browserAction.setBadgeText({text: allProducts+""});
    });

});