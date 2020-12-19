Array.from(document.querySelectorAll('a[target="_blank"]'))
    .forEach(link => link.removeAttribute('target'));

hostName = window.location.host 
detailTmall = 'detail.tmall.com'
itemTaobao = 'item.taobao.com'

virtualCartBtn = '<a title="Add to Taobao Virtual Cart" class="virtual-cart-btn">Add to Taobao Virtual Cart</a><span style="display: none;" id="cart-alert">Product added successfully.</span>';
$(virtualCartBtn).insertBefore(".tb-action");
$('.virtual-cart-btn').click(function (e) {
    e.preventDefault();

    id = getUrlParameter('id');
    sku_properties = getUrlParameter('sku_properties');
    sku = getUrlParameter('skuId');
    skuId = sku ? sku : sku_properties;
    if (hostName==detailTmall) {
        link = "https://detail.tmall.com/item.htm?id=" + id; 
        title = $('#detail').find('.tb-detail-hd h1').text().replace(/\s+/g, " ").trim();
        getPrice = $('#detail').find('.tm-price').text();
        price = getPrice.split('-')[1] ? getPrice.split('-')[1] : getPrice
        currency = $('#detail').find('.tm-yen').text();
        quantity = $('#detail').find('.mui-amount-input').val();
        image = $('#detail').find('#J_ImgBooth').attr('src');
    
        attributes = []
        $('#detail .tb-sku dl').each(function (index) {
            if ($(this).find('ul').length && !$(this).hasClass("tb-hidden")) {
                attributeTitle = $(this).find('dt').text();
                attributeSelected = $(this).find('li').hasClass("tb-selected");
                if (attributeSelected) {
                    attributeSelectedTitle = $(this).find('a').text().replace(/\s+/g, " ").trim();
                    attributes.push(attributeTitle + ' :- ' +attributeSelectedTitle);
                }
            }
        });
    } else if (hostName==itemTaobao) {
        link = "https://item.taobao.com/item.htm?id=" + id; 
        title = $('#detail').find('.tb-title h3').text().replace(/\s+/g, " ").trim();
        getPrice = $('#detail').find('.tb-rmb-num').text();
        price = getPrice.split('-')[1] ? getPrice.split('-')[1] : getPrice
        currency = $('#detail').find('.tb-rmb').text();
        quantity = $('#detail').find('#J_IptAmount').val();
        image = $('#detail').find('#J_ImgBooth').attr('src');

        attributes = []
        $('#detail #J_isku dl').each(function (index) {
            if ($(this).find('ul').length && !$(this).hasClass("tb-hidden")) {
                attributeTitle = $(this).find('dt').text();
                attributeSelected = $(this).find('li').hasClass("tb-selected");
                if (attributeSelected) {
                    attributeSelectedTitle = $(this).find('.tb-selected').text().replace(/\s+/g, " ").replace('selected', '').trim();
                    attributes.push(attributeTitle + ' :- ' +attributeSelectedTitle);
                }
            }
        });
    }

    allAttributes = attributes.join(' || ')

    product = {
        id: id,
        skuId: skuId,
        title : title.replace(/'/g, '%27'),
        price : price,
        quantity : quantity,
        currency : currency.split(' ')[0],
        link : link,
        image: image,
        attribute: allAttributes
    }

    newSku = skuId ? '-'+ skuId.replace(/:/g, '').replace(/;/g, '') : ''
    uniqId = 'product-'+id + newSku
    taobaoVirtual = $.cookie('taobaoVirtualCart');
    products = taobaoVirtual ? JSON.parse(taobaoVirtual) : []
    checkArray(products, id ,skuId)
    products.push({
        id: id,
        cookie: uniqId,
        skuId: skuId
    });
    $.cookie(uniqId, JSON.stringify(product));
    $.cookie('taobaoVirtualCart', JSON.stringify(products));
    $('#cart-alert').show(300);
    setTimeout(function() {
        $('#cart-alert').hide(500);
    }, 5000);
});

function checkArray(products, id,skuId) {
    $.each(products, function (index, value) {
        if (value.id == id && value.skuId == skuId) {
            products.splice(index, 1);
            $.removeCookie(value.cookie);
        }
        return true
    });
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};