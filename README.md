# Easy Number Separator

Easy Number Separator is a useful pure JavaScript plugin for currency format and separate numbers on input.

### <a href="https://amiryxe.github.io/easy-number-separator/" target="_blank">View Demo</a>

### Features

- Separate numbers by your custom character separators like comma character (`,`) or any other characters.
- Does not accept non-numeric characters.
- Can work on any text inputs by your selector.

### How to Use

1. Add **Easy Number Separator** plugin to your project:

```html
<script src="js/easy-number-separator.js"></script>
```

3. Make your input text field like this:    
```html
<input type="text" class="number-separator" />
```

3. Select your input element:
```javascript
easyNumberSeparator({
    selector: '.number-separator',
    separator: ','
})
```

### Options
|Title|Default|Description|
|-----|-------|-----------|
|selector|`.number-separator`|Selects the input element|
|separator|`,`|The character of number separator|
|decimalSeparator|`.`|The character of decimal separator|
|resultInput|-|Raw number generated for purposes such as server submission and calculations|
|submitRaw|`false`|When `true`, each input's `name` is moved to an automatically created hidden input that holds the raw value, so forms submit the unformatted number|
|maxDecimals|-|Maximum number of decimal places allowed (e.g. `2`). `0` disallows decimals. Unlimited when not set|

### Send data to server
If you want to send pure data to the server (without symbols), you can set a result input by `resultInput` property and hold the original value.

#### Example:

##### HTML:
```html
<input type="text" id="result_input" name="">
```
##### JavaScript:
```javascript
easyNumberSeparator({
    selector: '.number-separator',
    separator: ',',
    resultInput: '#result_input',
})
```


#### Or let the plugin create the raw inputs for you (`submitRaw`)
```html
<form>
  <input type="text" class="number-separator" name="price" />
</form>
```
```javascript
easyNumberSeparator({
    selector: '.number-separator',
    submitRaw: true,
})
```
The visible input keeps the formatted value (its name is moved to `data-name`), and a hidden `<input name="price">` placed right after it is submitted with the raw value (e.g. `1234567.5`). This works for any number of inputs.

### Initial values and values set from code
Inputs that already have a value when `easyNumberSeparator()` is called are formatted immediately (and copied to `resultInput`).
If you change a value from code later (for example with jQuery's `.val()`, which does not fire native `input` events), call `refresh()` on the returned object:

```javascript
const separator = easyNumberSeparator({ selector: '.number-separator', resultInput: '#result_input' })

$('.number-separator').val(1500000)
separator.refresh() // input shows 1,500,000 and #result_input holds 1500000
```

Dispatching a native event also works: `input.dispatchEvent(new Event('input'))`.

### Multiple inputs on one page
All inputs matching `selector` are formatted independently, including inputs that are added to the page later.
If each input needs its own raw value, use `submitRaw: true`, or call `easyNumberSeparator()` once per input with its own `selector` and `resultInput`:

```javascript
easyNumberSeparator({ selector: '#price', resultInput: '#price_raw' })
easyNumberSeparator({ selector: '#amount', resultInput: '#amount_raw' })
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/gh/amiryxe/easy-number-separator/easy-number-separator.js"></script>
```

### Running tests
Tests use Node's built-in test runner (Node 18+) and have no dependencies:
```bash
node --test test/
```

Enjoy :)
