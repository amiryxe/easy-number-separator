# Easy Number Separator

A tiny, dependency-free JavaScript plugin that formats numbers in text inputs while you type (e.g. `1234567.5` → `1,234,567.5`). It rejects non-numeric characters and can give you the raw number for form submission.

**[View demo](https://amiryxe.github.io/easy-number-separator/)**

## Install

**CDN**
```html
<script src="https://cdn.jsdelivr.net/gh/amiryxe/easy-number-separator/easy-number-separator.js"></script>
```

**Download:** save [`easy-number-separator.js`](https://raw.githubusercontent.com/amiryxe/easy-number-separator/master/easy-number-separator.js) into your project and include it:
```html
<script src="js/easy-number-separator.js"></script>
```

## Quick start

```html
<input type="text" class="number-separator" />

<script>
  easyNumberSeparator({ selector: '.number-separator' })
</script>
```

## Options

| Option | Default | Description |
|---|---|---|
| `selector` | `'.number-separator'` | CSS selector of the input(s) to format |
| `separator` | `','` | Thousands separator |
| `decimalSeparator` | `'.'` | Decimal separator |
| `maxDecimals` | unlimited | Maximum decimal places (`0` = no decimals) |
| `resultInput` | none | Selector of an input that receives the raw number (e.g. `1234567.5`) |
| `submitRaw` | `false` | Adds a hidden input with the input's `name` holding the raw number, so forms submit it unformatted |
| `disallowPaste` | `false` | Block pasting into the input |
| `disallowDrop` | `false` | Block dragging and dropping text into the input |

## Examples

**Custom separators**
```js
easyNumberSeparator({ selector: '.price', separator: '.', decimalSeparator: ',' }) // 1.234.567,89
```

**Limit decimals and get the raw value**
```html
<input type="text" class="price" />
<input type="hidden" id="price_raw" name="price" />
```
```js
easyNumberSeparator({ selector: '.price', maxDecimals: 2, resultInput: '#price_raw' })
```

**Submit raw values automatically**
```html
<form>
  <input type="text" class="price" name="price" />
</form>
```
```js
easyNumberSeparator({ selector: '.price', submitRaw: true })
```
The visible input stays formatted (its `name` moves to `data-name`), and a hidden `<input name="price">` placed after it sends the raw number. Works for any number of inputs.

**Several inputs, each with its own raw value**
```js
easyNumberSeparator({ selector: '#price', resultInput: '#price_raw' })
easyNumberSeparator({ selector: '#qty', resultInput: '#qty_raw' })
```
Inputs added to the page later are picked up automatically.

**Values set from code**

Inputs that already have a value are formatted on start. If you change a value from code later (e.g. jQuery's `.val()`), call `refresh()`:
```js
const separator = easyNumberSeparator({ selector: '.price' })
$('.price').val(1500000)
separator.refresh() // 1,500,000
```

**Pasting**

Pasted or dropped text is cleaned up by default (` $1,234 USD` → `1,234`). To block it instead:
```js
easyNumberSeparator({ selector: '.price', disallowPaste: true, disallowDrop: true })
```

## Development

Open `index.html` in a browser for the demo. Run the tests (Node 18+, no dependencies):
```bash
node --test test/
```
