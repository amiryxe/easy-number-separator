document.querySelectorAll('.number-separator').forEach((item) => {
  item.addEventListener('input', (e) => {
    if (/^[0-9.,]+$/.test(e.target.value)) {
      e.target.value = parseFloat(
        e.target.value.replace(/,/g, '')
      ).toLocaleString('en');
    } else {
      e.target.value = e.target.value.substring(0, e.target.value.length - 1);
    }
  });
});
