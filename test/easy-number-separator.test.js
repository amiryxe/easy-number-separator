const test = require("node:test");
const assert = require("node:assert/strict");
const { load, addInput, type, tick } = require("./dom-shim");

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

test("#11: two inputs on one page are formatted independently", () => {
  const { document, easyNumberSeparator } = load();
  const a = addInput(document, { class: "number-separator" });
  const b = addInput(document, { class: "number-separator" });
  easyNumberSeparator({});

  type(a, "1234");
  type(b, "98765x4");
  type(a, "5");
  assert.equal(a.value, "12,345");
  assert.equal(b.value, "987,654");
});

test("#11: separate calls with different selectors and result inputs", () => {
  const { document, easyNumberSeparator } = load();
  const a = addInput(document, { id: "price" });
  const aRaw = addInput(document, { id: "price_raw" });
  const b = addInput(document, { id: "amount" });
  const bRaw = addInput(document, { id: "amount_raw" });
  easyNumberSeparator({ selector: "#price", resultInput: "#price_raw" });
  easyNumberSeparator({ selector: "#amount", separator: ".", decimalSeparator: ",", resultInput: "#amount_raw" });

  type(a, "1234.5");
  type(b, "7654321,25");
  assert.equal(a.value, "1,234.5");
  assert.equal(aRaw.value, "1234.5");
  assert.equal(b.value, "7.654.321,25");
  assert.equal(bRaw.value, "7654321.25");
});

test("#11: does not leak global variables (works in strict mode / with page globals)", () => {
  const { context, document, easyNumberSeparator } = load();
  const a = addInput(document, { class: "number-separator" });
  easyNumberSeparator({});
  type(a, "1234.5");
  assert.equal(a.value, "1,234.5");
  assert.equal("x" in context, false);
  assert.equal("y" in context, false);
  assert.equal("z" in context, false);
});

test("#11/#6: inputs added later are bound once, existing inputs are not bound twice", async () => {
  const { document, easyNumberSeparator } = load();
  const a = addInput(document, { class: "number-separator" });
  easyNumberSeparator({});

  const b = addInput(document, { class: "number-separator" });
  const c = addInput(document, { class: "number-separator" });
  await tick();

  assert.equal((a.listeners.input || []).length, 1);
  assert.equal((b.listeners.input || []).length, 1);
  assert.equal((c.listeners.input || []).length, 1);

  type(b, "12x345");
  assert.equal(b.value, "12,345");
});

test("#6: inputs nested inside an appended container are bound", async () => {
  const { document, easyNumberSeparator } = load();
  easyNumberSeparator({ selector: "input.money" });

  const wrapper = document.createElement("div");
  const inner = document.createElement("input");
  inner.setAttribute("class", "money");
  wrapper.appendChild(inner);
  document.body.appendChild(wrapper);
  await tick();

  type(inner, "1000000");
  assert.equal(inner.value, "1,000,000");
});

test("#13: an initial value is formatted on load and copied to resultInput", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator", value: "1234567.5" });
  const result = addInput(document, { id: "result_input" });
  easyNumberSeparator({ resultInput: "#result_input" });

  assert.equal(input.value, "1,234,567.5");
  assert.equal(result.value, "1234567.5");
});

test("#13: refresh() re-formats values set from code after initialisation", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  const result = addInput(document, { id: "result_input" });
  const separator = easyNumberSeparator({ resultInput: "#result_input" });

  input.value = "9876543"; // e.g. set by a form library or jQuery .val()
  separator.refresh();
  assert.equal(input.value, "9,876,543");
  assert.equal(result.value, "9876543");

  type(input, "2");
  assert.equal(input.value, "98,765,432");
});

test("#13: dispatching a native input event re-formats the field", () => {
  const { document, easyNumberSeparator } = load();
  const input = addInput(document, { class: "number-separator" });
  easyNumberSeparator({});

  input.value = "5000000";
  input.dispatchEvent({ type: "input", data: null });
  assert.equal(input.value, "5,000,000");
});
