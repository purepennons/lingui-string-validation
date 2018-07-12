import checkI18nString, {
  getVariablesArray,
  getAllParantthesesPairs,
  isValidParanthesesPairs,
  isValidVariablesFormat,
  getTagsTree,
  isSameStructureTagTrees,
  isSameVariables,
} from '../src/';

describe('getVariablesArray', () => {
  it('should only parse parantheses with a variable name', () => {
    expect(
      getVariablesArray(
        '{<0>}Some {} text {{{{ with some {var1} and {var2}</0> {0}, {123}, {10}'
      )
    ).toEqual(['{var1}', '{var2}', '{0}', '{123}', '{10}']);
    expect(getVariablesArray('{not-a-valid-variable-name}')).toEqual([]);
    expect(getVariablesArray(null)).toBe(false);
  });
});

describe('getAllParantthesesPairs', () => {
  it('should parse all parantheses pairs', () => {
    expect(
      getAllParantthesesPairs(
        'prefix{abc} {_abc} {a_bc} {abc_} center {!@#$%^&*()_+=-0987654321`~|/? "\'} {} { } {  } { a b c } } { {{}} {0} {10} {123} postfix'
      )
    ).toEqual([
      '{abc}',
      '{_abc}',
      '{a_bc}',
      '{abc_}',
      '{!@#$%^&*()_+=-0987654321`~|/? "\'}',
      '{}',
      '{ }',
      '{  }',
      '{ a b c }',
      '{}',
      '{0}',
      '{10}',
      '{123}'
    ]);
  });
});

describe('isValidParanthesesPairs', () => {
  it('test parantheses pairs with different cases', () => {
    // non-string
    expect(isValidParanthesesPairs(null)).toBe(false);

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

describe('isValidVariablesFormat', () => {
  it('should return true if the results of `getAllParantthesesPairs` and `getVariablesArray` are equal', () => {
    expect(isValidVariablesFormat('normal text with !@#$%^&*()_+=-0987654321`~|/?"\' ')).toBe(true)
    expect(isValidVariablesFormat('prefix{v1} {v2} center {v3} {v4} {0} {10} {123}postfix')).toBe(true)
    expect(isValidVariablesFormat('prefix{v1} {v2} center {v3} { {v4}postfix')).toBe(false)
    expect(isValidVariablesFormat('prefix{v1} {v2} center {v3} {} {v4}postfix')).toBe(false)
    expect(isValidVariablesFormat('prefix{v1} {v2} center {v3} {-abc} {v4}postfix')).toBe(false)
    expect(isValidVariablesFormat('prefix{v1} {v2} center {v3} {{a}} {v4}postfix')).toBe(false)
    expect(isValidVariablesFormat(null)).toBe(false)
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

  it('should get an empty array', () => {
    expect(getTagsTree('some text and {variables} without tags')).toEqual([]);
  });
});

describe('isSameStructureTagTrees', () => {
  it('should return false with different length of arrays', () => {
    const origin = [
      { tag: '0', children: [] },
      { tag: '1', children: [] },
      { tag: '2', children: [] }
    ];
    const other = [{ tag: '0', children: [] }, { tag: '1', children: [] }];
    expect(isSameStructureTagTrees(origin, other)).toBe(false);
  });

  it('should return true with same trees', () => {
    const tree = [
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
    ];
    expect(isSameStructureTagTrees(tree, tree)).toBe(true);
  });

  it('should return true with different children order trees', () => {
    const origin = [
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
    ];

    const other = [
      {
        tag: '1',
        children: [
          {
            tag: '3',
            children: [
              {
                tag: '6',
                children: []
              },
              {
                tag: '4',
                children: []
              }
            ]
          },
          {
            tag: '5',
            children: []
          }
        ]
      },
      {
        tag: '0',
        children: [
          {
            tag: '2',
            children: []
          }
        ]
      }
    ];

    expect(isSameStructureTagTrees(origin, other)).toBe(true);
  });

  it('should return false with different children', () => {
    const origin = [
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
    ];

    const other = [
      {
        tag: '1',
        children: [
          {
            tag: '3',
            children: [
              {
                tag: '6',
                children: []
              },
              {
                tag: 'differentTag',
                children: []
              }
            ]
          },
          {
            tag: '5',
            children: []
          }
        ]
      },
      {
        tag: '0',
        children: [
          {
            tag: '2',
            children: []
          }
        ]
      }
    ];

    expect(isSameStructureTagTrees(origin, other)).toBe(false);
  });

  it('should return false with wrong children strsucture', () => {
    const origin = [
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
    ];

    const other = [
      {
        tag: '1',
        children: [
          {
            tag: '3',
            children: [
              {
                tag: '6',
                children: []
              },
              {
                tag: 'differentTag',
                children: []
              }
            ]
          },
          {
            tag: '2',
            children: []
          }
        ]
      },
      {
        tag: '0',
        children: [
          {
            tag: '5',
            children: []
          }
        ]
      }
    ];

    expect(isSameStructureTagTrees(origin, other)).toBe(false);
  });
});

describe('isSameVariables', () => {
  it('should return true when the content of variable arrays are same (ignore order)', () => {
    expect(isSameVariables(null, null)).toBe(false)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var2}'])).toBe(false)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var2}', '{var3}', '{'])).toBe(false)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var2}', '{}'])).toBe(false)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var2}', '{var3 }'])).toBe(false)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var2}', '{var3}', '{var4}'])).toBe(false)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var2}', '{var4}'])).toBe(false)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var2}', '{var3}'])).toBe(true)
    expect(isSameVariables(['{var1}', '{var2}', '{var3}'], ['{var1}', '{var3}', '{var2}'])).toBe(true)
  })
})

describe('checkI18nString', () => {
  it('should detect bad lingui keys (return -1)', () => {
    const str = 'nothing';
    expect(checkI18nString(null, str)).toBe(-1);
    expect(checkI18nString('lingui key with {variable', str)).toBe(-1);
    expect(checkI18nString('lingui key with {}', str)).toBe(-1);
    expect(checkI18nString('lingui key with {variable with space}', str)).toBe(-1);
    expect(checkI18nString('lingui key with {variable with !@#$%^&*()}', str)).toBe(-1);
  });

  it('should return 2 if the string is empty', () => {
    expect(checkI18nString('lingui key', '')).toBe(2);
  });

  it('should detect bad string (0: bad string, 1: valid string)', () => {
    const linguiKey = 'prefix<0>{var1} <1>center <2>{var2} {0}</2><3>{10}</3></1></0>postfix'
    expect(checkI18nString(linguiKey, null)).toBe(0);
    expect(checkI18nString(linguiKey, 'bad string {}')).toBe(0);
    expect(checkI18nString(linguiKey, 'prefix<0>{var1} <1>center <2>{var2} {0}</2><3>{10}</3></1></0>postfix')).toBe(1);
    expect(checkI18nString(linguiKey, '<0>prefix{var1} <1> <3>{10}</3> center <2>{var2} {0}</2></1></0>postfix')).toBe(1);
    expect(checkI18nString(linguiKey, 'prefix<0> {var2}<1>center <2> {10} {0}</2><3> {var1}</3></1></0>postfix')).toBe(1);
    expect(checkI18nString(linguiKey, 'prefix<0>{var1} <2><1>center {var2} {0}<3>{10}</3></1></2></0>postfix')).toBe(0);
  });
});
