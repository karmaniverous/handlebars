import { json2tf } from '@karmaniverous/json2tf';
import Handlebars from 'handlebars';
import _ from 'lodash';
import numeral, { Numeral } from 'numeral';

type ExtractMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

Handlebars.registerHelper(
  'dataAnchor',
  function (text: unknown, ...rest: unknown[]) {
    if (!(rest.length % 2))
      throw new Error('data attributes must be provided in key-value pairs');

    const keys: string[] = [];
    const values: string[] = [];

    for (let i = 0; i < rest.length - 1; i += 2) {
      keys.push(rest[i] as string);
      values.push(rest[i + 1] as string);
    }

    const dataAttributes = _.zipObject(keys, values);

    const dataString = _.reduce(
      dataAttributes,
      (result, value, key) => {
        return `${result} data-${key}="${value}"`;
      },
      '',
    );

    return new Handlebars.SafeString(
      `<a${dataString}>${Handlebars.escapeExpression(text as string)}</a>`,
    );
  },
);

Handlebars.registerHelper(
  'numeral',
  function (
    fn: ExtractMethodNames<Numeral>,
    value: unknown,
    ...params: unknown[]
  ) {
    // @ts-expect-error - unable to characterize params with dynamic method name
    return numeral(value)[fn](...params.slice(0, -1)) as unknown;
  },
);

Handlebars.registerHelper(
  'lodash',
  function (
    fn: ExtractMethodNames<typeof _>,
    value: unknown,
    ...params: unknown[]
  ) {
    // @ts-expect-error - unable to characterize params with dynamic method name
    return _[fn](value, ...params.slice(0, -1)) as unknown;
  },
);

Handlebars.registerHelper('args2array', function (...args: unknown[]) {
  return args.slice(0, -1);
});

Handlebars.registerHelper('params', function (...args: unknown[]) {
  return args.slice(0, -1);
});

Handlebars.registerHelper(
  'json2tf',
  function (value: unknown, offset: number, tabWidth: number) {
    return json2tf(value, { offset, tabWidth });
  },
);

Handlebars.registerHelper('logic', function (op: string, ...args: unknown[]) {
  if (!args.length) throw new Error('Missing locical operator!');

  if (args.length === 1) throw new Error('Missing logical operand!');

  switch (op) {
    case 'and':
      return args.slice(0, -1).every((arg) => !!arg);
    case 'or':
      return args.slice(0, -1).some((arg) => !!arg);
    case 'not':
      return !args[0];
    case 'xor':
      return args.slice(0, -1).reduce((result, arg) => result !== !!arg, false);
    default:
      throw new Error(`Unsupported operation: ${op}`);
  }
});

export { Handlebars };
