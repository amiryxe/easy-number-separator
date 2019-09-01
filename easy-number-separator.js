$(document).ready(function () {
    // Currency Separator
    var commaCounter = 10;

    function numberSeparator(Number) {
        Number += '';

        for (var i = 0; i < commaCounter; i++) {
            Number = Number.replace(',', '');
        }

        x = Number.split('.');
        y = x[0];
        z = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;

        while (rgx.test(y)) {
            y = y.replace(rgx, '$1' + ',' + '$2');
        }
        commaCounter++;
        return y + z;
    }

    // Set Currency Separator to input fields
    $('.number-separator').on('input', function (e) {
        if (/^-?\d*[,.]?(\d{0,3},)*(\d{3},)?\d{0,3}$/.test(e.originalEvent.data)) {
            e.target.value = numberSeparator(e.target.value);
        } else {
            e.target.value = e.target.value.substring(0, e.target.value.length - 1);
        }
    });

    $(document).on('input', '.number-separator', function (e) {
        if (/^-?\d*[,.]?(\d{0,3},)*(\d{3},)?\d{0,3}$/.test(e.originalEvent.data)) {
            e.target.value = numberSeparator(e.target.value);
        } else {
            e.target.value = e.target.value.substring(0, e.target.value.length - 1);
        }
    });
});