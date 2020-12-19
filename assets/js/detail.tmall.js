// quantity increase
$('.mui-amount-increase').click(function (e) {
    e.preventDefault();
    quantity = $('#detail').find('.mui-amount-input').val();
    $('#detail').find('.mui-amount-input').val(parseInt(quantity)+1);
});

// quantity decrease
$('.mui-amount-decrease').click(function (e) {
    e.preventDefault();
    quantity = $('#detail').find('.mui-amount-input').val();
    if (quantity!=0) {
        $('#detail').find('.mui-amount-input').val(parseInt(quantity)-1);
    }
});
