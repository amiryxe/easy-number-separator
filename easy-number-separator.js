// Currency Separator
let commaCounter = 10;

function numberSeparator(Number) {
  Number += "";

  for (let i = 0; i < commaCounter; i++) {
    Number = Number.replace(",", "");
  }

  x = Number.split(".");
  y = x[0];
  z = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;

  while (rgx.test(y)) {
    y = y.replace(rgx, "$1" + "," + "$2");
  }
  commaCounter++;
  return y + z;
}

const checker = (e) => {
  if (/^-?\d*[,.]?(\d{0,3},)*(\d{3},)?\d{0,3}$/.test(e.key)) {
    el.addEventListener("input", function () {
      e.target.value = numberSeparator(e.target.value);
    });
  } else {
    e.preventDefault();
    return false;
  }
};

document.querySelectorAll(".number-separator").forEach(function (el) {
  el.addEventListener("keypress", function (e) {
    if (/^-?\d*[,.]?(\d{0,3},)*(\d{3},)?\d{0,3}$/.test(e.key)) {
      el.addEventListener("input", function () {
        e.target.value = numberSeparator(e.target.value);
      });
    } else {
      e.preventDefault();
      return false;
    }
  });
});
