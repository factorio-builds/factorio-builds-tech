const {expect,assert} = require('chai');

describe('splitArrayIntoGroups', () => {
  const splitArrayIntoGroups = require('../../helpers/array').splitArrayIntoGroups;
  const test = (input, n, expectedOutput) => {
    const output = splitArrayIntoGroups(input, n);
    expect(output).to.deep.equal(expectedOutput);
  }

  it('correctly split an array into multiple groups when input fits perfectly', (done) => {
    const input = [
      { name: 'abc' },
      { name: 'def' },
      { name: 'ghi' },
      { name: '123' },
      { name: '456' },
      { name: '789' }
    ];
    const expectedOutput = [
      [
        { name: 'abc' },
        { name: '123' }
      ],
      [
        { name: 'def' },
        { name: '456' }
      ],
      [
        { name: 'ghi' },
        { name: '789' }
      ]
    ];

    test(input, 3, expectedOutput);
    done();
  });

  it('correctly split an array into multiple groups when input doesn\'t fit perfectly', (done) => {
    const input = [
      { name: 'abc' },
      { name: 'def' },
      { name: 'ghi' },
      { name: '123' },
      { name: '456' },
      { name: '789' },
      { name: 'and then' }
    ];
    const expectedOutput = [
      [
        { name: 'abc' },
        { name: '123' },
        { name: 'and then' }
      ],
      [
        { name: 'def' },
        { name: '456' },
      ],
      [
        { name: 'ghi' },
        { name: '789' },
      ]
    ];

    test(input, 3, expectedOutput);
    done();
  });

  it('correctly split an array into a single group when split into a single group', (done) => {
    const input = [
      { name: 'abc' },
      { name: 'def' },
      { name: 'ghi' },
      { name: '123' },
      { name: '456' },
      { name: '789' },
      { name: 'and then' }
    ];
    const expectedOutput = [
      [
        { name: 'abc' },
        { name: 'def' },
        { name: 'ghi' },
        { name: '123' },
        { name: '456' },
        { name: '789' },
        { name: 'and then' }
      ]
    ];

    test(input, 1, expectedOutput);
    done();
  });

  it('correctly split an array into multiple empty groups when input is an empty array split into multiple groups', (done) => {
    const input = [
    ];
    const expectedOutput = [
      [],
      [],
      []
    ];

    test(input, 3, expectedOutput);
    done();
  });

  it('correctly split an array into a single empty group when input is an empty array split into a single group', (done) => {
    const input = [
    ];
    const expectedOutput = [
      []
    ];

    test(input, 1, expectedOutput);
    done();
  });
});
