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

## logic

Performs logical operations on the arguments. For example, all of these return `true`:

```handlebars
{{#if (logic 'and' true true true)}}
{{#if (logic 'or' true true false)}}
{{#if (logic 'not' false)}}:
{{#if (logic 'xor' true false false)}} (odd number of trues)
```

Parameters are evaluated for truthiness. Supported operations are `and`, `or`, `not`, and `xor`.

## json2tf

Renders an object as a Terraform literal. For example:

```ts
import { Handlebars } from '@karmaniverous/handlebars';

const data = {
  amount: 1234.567,
  anchorText: 'anchor text',
  merchantId: 'abc123',
  userId: 'def456',
  extra: { a: [1, 2, { c: 'd' }] },
};

const template = `
  output "config" { 
    description = "Global config." 
    value = {{json2tf (lodash "omit" this "merchantId" "userId") 4 4}} 
  }`;

console.log(Handlebars.compile(template, { noEscape: true })(data));

/*
    output "config" { 
        description = "Global config." 
        value = {
            amount = 1234.567
            anchorText = "anchor text"
            extra = {
                a = [
                    1,
                    2,
                    {
                        c = "d"
                    }
                ]
            }
        } 
    }
*/
```
