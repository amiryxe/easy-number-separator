const test = require("node:test");
const assert = require("node:assert/strict");
const { load, addInput, type } = require("./dom-shim");

test("formats a number with the default comma separator", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  const result = addInput(document, { id: "result_input" });
  easyNumberSeparator({ selector: ".number-separator", resultInput: "#result_input" });

  type(input, "1234567.89");
  assert.equal(input.value, "1,234,567.89");
  assert.equal(result.value, "1234567.89");
});

test("rejects non-numeric characters", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  easyNumberSeparator({});

  type(input, "12a3");
  assert.equal(input.value, "123");
});

test("#8: rejects non-numeric characters when separator is '.'", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  easyNumberSeparator({ separator: ".", decimalSeparator: "," });

  type(input, "1234a5x,5b6");
  assert.equal(input.value, "12.345,56");
});

test("#8: rejects letters with '.' separator and default decimal separator", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  easyNumberSeparator({ separator: "." });

  type(input, "12abc34");
  assert.equal(input.value, "1.234");
});

test("#8: supports other regex special characters as separators", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  easyNumberSeparator({ separator: "*" });

  type(input, "1234x567");
  assert.equal(input.value, "1*234*567");
});

test("#9: maxDecimals limits the number of decimal places", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  const result = addInput(document, { id: "result_input" });
  easyNumberSeparator({ maxDecimals: 2, resultInput: "#result_input" });

  type(input, "1234.5678");
  assert.equal(input.value, "1,234.56");
  assert.equal(result.value, "1234.56");
});

test("#9: maxDecimals works with a custom decimal separator", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  const result = addInput(document, { id: "result_input" });
  easyNumberSeparator({ separator: ".", decimalSeparator: ",", maxDecimals: 1, resultInput: "#result_input" });

  type(input, "1234,567");
  assert.equal(input.value, "1.234,5");
  assert.equal(result.value, "1234.5");
});

test("#9: maxDecimals 0 disallows decimals", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  easyNumberSeparator({ maxDecimals: 0 });

  type(input, "12.");
  assert.equal(input.value, "12");
});

test("decimals are unlimited when maxDecimals is not set", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  easyNumberSeparator({});

  type(input, "1.123456");
  assert.equal(input.value, "1.123456");
});
