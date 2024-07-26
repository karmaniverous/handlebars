/* eslint-env mocha */

// mocha imports
import { expect } from 'chai';

// lib imports
import { Handlebars } from './index.js';

let data: Record<string, unknown>;

describe('Handlebars', function () {
  before(function () {
    data = {
      amount: 1234.567,
      anchorText: 'anchor text',
      merchantId: 'abc123',
      userId: 'def456',
      falsy: false,
    };
  });

  it('dataAnchor', function () {
    const template =
      '{{dataAnchor anchorText "merchantId" merchantId "userId" userId}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal(
      '<a data-merchantId="abc123" data-userId="def456">anchor text</a>',
    );
  });

  it('numeral', function () {
    const template = '{{numeral "format" amount "$0,0.00"}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('$1,234.57');
  });

  it('lodash', function () {
    const template =
      '{{numeral "format" (lodash "divide" amount 100) "$0,0.00"}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('$12.35');
  });

  it('logic and', function () {
    const template =
      '{{#if (logic "and" true true true)}}true{{else}}false{{/if}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('true');
  });

  it('logic or', function () {
    const template =
      '{{#if (logic "or" true true false)}}true{{else}}false{{/if}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('true');
  });

  it('logic not', function () {
    const template = '{{#if (logic "not" false)}}true{{else}}false{{/if}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('true');
  });

  it('logic xor', function () {
    const template =
      '{{#if (logic "xor" true false false)}}true{{else}}false{{/if}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('true');
  });

  it('ifelse true', function () {
    const template =
      '{{#if (ifelse amount true false)}}true{{else}}false{{/if}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('true');
  });

  it('ifelse false', function () {
    const template =
      '{{#if (ifelse falsy true false)}}true{{else}}false{{/if}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('false');
  });

  it('terraform', function () {
    const template = `
  output "config" { 
    description = "Global config." 
    value = {{json2tf (lodash "omit" this "templates" "templatesPath") 4 2}} 
  }`;

    data.extra = { a: [1, 2, { c: 'd' }] };

    const result = Handlebars.compile(template, { noEscape: true })(data);

    expect(result).to.equal(`
  output "config" { 
    description = "Global config." 
    value = {
      amount = 1234.567
      anchorText = "anchor text"
      merchantId = "abc123"
      userId = "def456"
      falsy = false
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
  }`);
  });

  it('namify s3 invalid char', function () {
    const template =
      '{{namify "s3" "metastructure-001-shared_services-s3-access-log"}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('metastructure-001-shared-services-s3-access-log');
  });

  it('throwif true', function () {
    const template = '{{#throwif amount "Error!"}}No Error!{{/throwif}}';

    expect(() => Handlebars.compile(template)(data)).to.throw('Error!');
  });

  it('throwif false', function () {
    const template = '{{#throwif falsy "Error!"}}No Error!{{/throwif}}';

    const result = Handlebars.compile(template)(data);

    expect(result).to.equal('No Error!');
  });
});
