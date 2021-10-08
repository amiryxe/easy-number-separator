# Easy Number Separator

Easy Number Separator is a useful pure JavaScript plugin for currency format and separate numbers on input.

### <a href="https://amiryxe.github.io/easy-number-separator/" target="_blank">View Demo</a>

### Features

- Separate number by your custom character separator like comma character (`,`) or any other characters.
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

Enjoy :)
