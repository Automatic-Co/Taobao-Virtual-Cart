// quantity increase
$('.J_Increase').click(function (e) {
    e.preventDefault();
    quantity = $('#J_IptAmount').val();
    $('#J_IptAmount').val(parseInt(quantity)+1);
});

// quantity decrease
$('.J_Reduce').click(function (e) {
    e.preventDefault();
    quantity = $('#J_IptAmount').val();
    if (quantity!=0) {
        $('#J_IptAmount').val(parseInt(quantity)-1);
    }
});

$('#J_isku li').click(function (e) {
    e.preventDefault();
    $(this).closest('ul').find('li').removeClass('tb-selected');
    $(this).addClass('tb-selected');
});

function getParams(sParam) {
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