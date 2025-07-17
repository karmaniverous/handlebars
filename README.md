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

## humanizeDuration

Renders a human-readable duration from a number of milliseconds. Syntax:

```handlebars
{{humanizeDuration <milliseconds> [(object ...options)]}}
```

For example:

```handlebars
{{humanizeDuration 1000}}
```

renders:

```html
1 second
```

You can also pass an `object` to customize the output. For example:

```handlebars
{{humanizeDuration 86401000 (object conjunction=' and ' serialComma=false)}}
```

renders:

```html
1 day and 1 second
```

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

## namify

Converts a string into a form valid for a particular target, substituting an optional delimiter for sequences of invalid characters. Syntax:

```handlebars
{{namify '<target>' <input string> [delimiter]}}
```

If no `delimiter` is supplied, it will default to a `target`-specific value.

For example:

```handlebars
{{namify 's3' 'My Resource Name'}}

# my-resource-name
```

These targets are currently available:

| `target` | Description                                                                                     | default `delimiter` |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------- |
| `s3`     | [S3 bucket names](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) | `'-'`               |

## object

Returns the `hash` object passed to it. This is useful for passing an object to a helper that expects an object as its first argument. Syntax:

```handlebars
{{object key1=value1 key2=value2 ...}}
```

## params

This helper converts its arguments into an array. Very useful for Lodash functions that expect an array argument. For example:

```handlebars
{{lodash 'get' object (params 'a' 'b' 'c')}}
```

## throwif

Checks an condition. If true, throws an error before evauating the block content. Syntax:

```handlebars
{{#throwif <condition> <message>}}No Error!{{/throwif}}
```

## recursiveRender

A helper function that recursively renders a Handlebars template until the output stabilizes or a maximum depth is reached. This is useful for templates that may contain recursive structures. Syntax:

```ts
import { recursiveRender } from '@karmaniverous/handlebars';

const data = {
  baseUrl: 'https://example.com',
  jwt: 'abc123',
  url: '{{baseUrl}}?jwt={{jwt}}',
};

const template = '{{url}}';

const result = recursiveRender(template, data);

console.log(result); // Outputs: https://example.com?jwt=abc123
```
