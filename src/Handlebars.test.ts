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

  it('terraform', function () {
    const template = '{{terraform "Output" "test" this}}';

    const result = Handlebars.compile(template, { noEscape: true })(data);

    expect(result).to.equal(
      'output &tfgquot;test&tfgquot;{\namount = 1234.567\nanchorText = &tfgquot;anchor text&tfgquot;\nmerchantId = &tfgquot;abc123&tfgquot;\nuserId = &tfgquot;def456&tfgquot;\n}\n\n',
    );
  });
});
