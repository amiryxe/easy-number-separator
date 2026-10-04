function easyNumberSeparator(config) {
  // Currency Separator
  let commaCounter = 10;

  const obj = {
    selector: config.selector || ".number-separator",
    separator: config.separator || ",",
    decimalSeparator: config.decimalSeparator || ".",
    resultInput: config.resultInput,
    maxDecimals: config.maxDecimals
  }

  // Escape a string so it is matched literally inside a regular expression
  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\\-\/]/g, "\\$&");
  }

  function numberSeparator(num) {
    for (let i = 0; i < commaCounter; i++) {
      num = num.replace(obj.separator, "");
    }

    x = num.split(obj.decimalSeparator);
    y = x[0];
    let decimals = x.length > 1 ? x[1] : null;

    // Limit the number of decimal places (#9)
    if (decimals !== null && typeof obj.maxDecimals === "number" && obj.maxDecimals >= 0) {
      decimals = obj.maxDecimals === 0 ? null : decimals.slice(0, obj.maxDecimals);
    }

    z = decimals !== null ? obj.decimalSeparator + decimals : "";
    const raw = y + (decimals !== null ? "." + decimals : "");
    let rgx = /(\d+)(\d{3})/;

    while (rgx.test(y)) {
      y = y.replace(rgx, "$1" + obj.separator + "$2");
    }
    commaCounter++;

    if (obj.resultInput) {
      const resInput = document.querySelector(obj.resultInput)

      if (resInput) {
        resInput.value = raw
      }
    }

    return y + z;
  }

  function listenFields() {
    document.querySelectorAll(obj.selector).forEach(function (el) {
      el.addEventListener("input", function (e) {
        const sep = escapeRegExp(obj.separator);
        const dec = escapeRegExp(obj.decimalSeparator);
        const reg = new RegExp(
          `^-?\\d*[${sep}${dec}]?(\\d{0,3}${sep})*(\\d{3}${sep})?\\d{0,3}$`
        );

        const key = e.data || this.value.substr(-1)

        if (reg.test(key)) {
          e.target.value = numberSeparator(e.target.value);
        } else {
          e.target.value = e.target.value.substring(0, e.target.value.length - 1);
          e.preventDefault();
          return false;
        }
      });
      el.value = numberSeparator(el.value);
    });
  }

  listenFields()

  // Fire separator when every element append to page
  document.addEventListener("DOMNodeInserted", function (e) {
    if ((e.target).classList.contains(obj.selector.replace('.', ''))) {
      listenFields()
    }
  });
}
