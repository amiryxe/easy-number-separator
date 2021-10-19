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

### Send data to server
If you want to send data to the server, you can set a result input by `resultInput` property and hold the original value.

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


### CDN
```html
<script src="https://cdn.jsdelivr.net/gh/amiryxe/easy-number-separator/easy-number-separator.js"></script>
```

Enjoy :)
