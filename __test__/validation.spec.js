import {
  getVariablesArray,
  isValidParanthesesPairs,
  getTagsTree
} from '../src/';

describe('getVariablesArray', () => {
  it('should only parse parantheses with a variable name', () => {
    expect(
      getVariablesArray(
        '{<0>}Some {} text {{{{ with some {var1} and {var2}</0>'
      )
    ).toEqual(['{var1}', '{var2}']);
    expect(getVariablesArray('{not-a-valid-variable-name}')).toEqual([]);
    expect(getVariablesArray(null)).toBe(false);
  });
});

describe('isValidParanthesesPairs', () => {
  it('test parantheses pairs with different cases', () => {
    // string
    expect(
      isValidParanthesesPairs(
        '<0>Play {name} Ping-<1>Pong</1> with <2>{name} {age}</2></0>'
      )
    ).toBe(true);

    // basic
    expect(isValidParanthesesPairs('prefix{}{}center{}{}postfix')).toBe(true);

    // end with `{`
    expect(isValidParanthesesPairs('prefix{}center{}{postfix')).toBe(false);

    // start with `}`
    expect(isValidParanthesesPairs('prefix}{}center{}{}postfix')).toBe(false);

    // start with `}` and end with `{`
    expect(isValidParanthesesPairs('}prefix{}{center}{}postfix{')).toBe(false);

    // contain uncorrect order
    expect(isValidParanthesesPairs('prefix{}{}center}{{}{}postfix')).toBe(
      false
    );

    // contain nested pairs
    expect(isValidParanthesesPairs('prefix{}{{center}}{}postfix')).toBe(false);

    // unpaired
    expect(isValidParanthesesPairs('prefix{}{center{}postfix')).toBe(false);
  });
});

describe('getTagsTree', () => {
  it('should parse string to a tree', () => {
    const str = `prefix<0>aaa<2>bbb</2></0>center<1><5>ddd</5><3><4>some text with {variable}</4><6>ccc</6></3></1>postfix`;

    expect(getTagsTree(str)).toEqual([
      {
        tag: '0',
        children: [
          {
            tag: '2',
            children: []
          }
        ]
      },
      {
        tag: '1',
        children: [
          {
            tag: '5',
            children: []
          },
          {
            tag: '3',
            children: [
              {
                tag: '4',
                children: []
              },
              {
                tag: '6',
                children: []
              }
            ]
          }
        ]
      }
    ]);
  });
});
