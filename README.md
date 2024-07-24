# Handlebars Goodies

This repo adds a handful of very useful helpers to Handlebars.js.

## dataAnchor

Renders an anchor tag with data attributes. Syntax:

```handlebars
{{dataAnchor '<anchor text>' '<data attribute 1>' '<value 1>' '<data attribute 2>' '<value 2>' ...}}
```

This template...

```handlebars
{{dataAnchor 'anchor text' 'merchantId' 'abc123' 'userId' 'xyz789'}}
```

... renders this HTML:

```html
<a data-merchantId="abc123" data-userId="xyz789">anchor text</a>
```

## lodash & numeral

These helpers expose the [Lodash](https://lodash.com/) and [Numeral.js](http://numeraljs.com/) libraries to your templates. Syntax:

```handlebars
{{lodash '<function>' <arg1> <arg2> ...}}
{{numeral '<function>' <arg1> <arg2> ...}}
```

Here's a combined example. If `amount = 1000000` then:

```handlebars
{{numeral 'format' (lodash 'divide' amount 100) '$0,0.00'}}
```

renders:

```html
$10,000.00
```

## params

This helper converts its arguments into an array. Very useful for Lodash functions that expect an array argument. For example:

```handlebars
{{lodash 'get' object (params 'a' 'b' 'c')}}
```

## logic

Performs logical operations on the arguments. Syntax:

```handlebars
{{logic '<operator>' <arg1> <arg2> ...}}
```

For example, all of these return `true`:

```handlebars
{{#if (logic 'and' true true true)}}
{{#if (logic 'or' true true false)}}
{{#if (logic 'not' false)}}:
{{#if (logic 'xor' true false false)}} (odd number of trues)
```

Parameters are evaluated for truthiness. Supported operations are `and`, `or`, `not`, and `xor`.

## ifelse

A ternary operator. Syntax:

```handlebars
{{ifelse <condition> <value if truthy> <value if falsy>}}
```

## json2tf

Renders an object as a Terraform literal using [json2tf](https://github.com/karmaniverous/json2tf). The syntax is:

```handlebars
{{json2tf <object> [offset] [tabWidth]}}
```

For example:

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
