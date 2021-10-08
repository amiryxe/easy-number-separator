function easyNumberSeparator(config) {
  // Currency Separator
  let commaCounter = 10;

  const obj = config
    ? config
    : {
        selector: ".number-separator",
        separator: ",",
      };

  function numberSeparator(num) {
    for (let i = 0; i < commaCounter; i++) {
      num = num.replace(obj.separator, "");
    }

    x = num.split(".");
    y = x[0];
    z = x.length > 1 ? "." + x[1] : "";
    let rgx = /(\d+)(\d{3})/;

    while (rgx.test(y)) {
      y = y.replace(rgx, "$1" + obj.separator + "$2");
    }
    commaCounter++;
    return y + z;
  }

  document.querySelectorAll(obj.selector).forEach(function (el) {
    el.addEventListener("keypress", function (e) {
      const reg = new RegExp(
        `^-?\\d*[${obj.separator}.]?(\\d{0,3}${obj.separator})*(\\d{3}${obj.separator})?\\d{0,3}$`
      );

      if (reg.test(e.key)) {
        el.addEventListener("input", function () {
          e.target.value = numberSeparator(e.target.value);
        });
      } else {
        e.preventDefault();
        return false;
      }
    });
    el.value = numberSeparator(el.value);
  });
}
