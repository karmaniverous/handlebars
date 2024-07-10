import Handlebars from 'handlebars';
import _ from 'lodash';
import numeral, { Numeral } from 'numeral';
import TerraformGenerator from 'terraform-generator';

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
    // @ts-expect-error - unable to characterize params with dynamc method name
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
    // @ts-expect-error - unable to characterize params with dynamisc method name
    return _[fn](value, ...params.slice(0, -1)) as unknown;
  },
);

type TerraformBlock =
  | 'Backend'
  | 'Comment'
  | 'Data'
  | 'Import'
  | 'Locals'
  | 'Module'
  | 'Moved'
  | 'Output'
  | 'Provider'
  | 'Provisioner'
  | 'Removed'
  | 'Resource'
  | 'Variable';

Handlebars.registerHelper(
  'terraform',
  function (block: TerraformBlock, ...params: unknown[]) {
    // @ts-expect-error - unable to characterize constructor params with dynamic class name
    return new TerraformGenerator[block](...params.slice(0, -1)).toTerraform();
  },
);

export { Handlebars };
