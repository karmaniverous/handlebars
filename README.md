# Handlebars Goodies

This repo adds a handful of very useful helpers to Handlebars.js.

## dataAnchor

This template...

```handlebars
{{dataAnchor 'anchor text' 'merchantId' 'abc123' 'userId' 'xyz789'}}
```

... renders this HTML:

```html
<a data-merchantId="abc123" data-userId="xyz789">anchor text</a>
```

## lodash & numeral

These helpers expose the [Lodash](https://lodash.com/) and [Numeral.js](http://numeraljs.com/) libraries to your templates.

Here's a combined example. If `amount = 1000000` then:

```handlebars
{{numeral 'format' (lodash 'divide' amount 100) '$0,0.00'}}
```

renders:

```html
$10,000.00
```

## terraform

Renders an object as a Terraform literal.
