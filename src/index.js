import { isString, isArray, isEqual } from 'lodash';

export function getVariablesArray(str) {
  if (!isString(str)) return false;
  return str.match(/(\{[A-Za-z_][A-Za-z0-9_]*\})|(\{[0-9]+\})/g) || [];
}

export function getAllParantthesesPairs(str) {
  if (!isString(str)) return false;
  return str.match(/\{([^{}])*\}/g) || [];
}

export function isValidParanthesesPairs(str) {
  if (!isString(str)) return false;

  const m = str.match(/\{|\}/g) || [];
  const result = m.reduce(
    (acc, v, idx, arr) => {
      if (acc.done) return acc;

      switch (v) {
        case '{':
          if (acc.prev !== '' || idx === arr.length - 1) {
            acc.result = false;
            acc.done = true;
          }
          acc.prev = '{';
          break;
        case '}':
          if (acc.prev !== '{') {
            acc.result = false;
            acc.done = true;
          }
          acc.prev = '';
          break;
        default:
          acc.result = false;
          acc.done = true;
      }
      return acc;
    },
    { prev: '', result: true, done: false }
  );
  return result.result;
}

export function isValidVariablesFormat(str) {
  if (!isString(str)) return false;

  const allPairs = getAllParantthesesPairs(str);
  const variablesPairs = getVariablesArray(str);

  if (
    !allPairs ||
    !variablesPairs ||
    allPairs.length !== variablesPairs.length ||
    !isEqual(allPairs, variablesPairs)
  ) {
    return false;
  }

  return isValidParanthesesPairs(str);
}

export function getTagsTree(str) {
  if (!isString(str)) return [];
  const tree = [];
  const regx = /<(\s*(\d+)[^>]*)>(.*?)<\s*\/\s*\1>/g;
  let m = null;
  while ((m = regx.exec(str))) {
    const tag = {
      tag: m[1],
      children: getTagsTree(m[3])
    };
    tree.push(tag);
  }
  return tree;
}

export function isSameStructureTagTrees(origin, other) {
  if (!isArray(origin) || !isArray(other)) return false;
  if (origin.length !== other.length) return false;

  // TODO: tree structure check

  return other.reduce((otherAcc, otherTag) => {
    return (
      otherAcc &&
      origin.reduce((originAcc, originTag) => {
        if (originTag.tag !== otherTag.tag) return originAcc || false;
        return (
          originAcc ||
          isSameStructureTagTrees(originTag.children, otherTag.children)
        );
      }, false)
    );
  }, true);
}

export function isSameVariables(origin, other) {
  if (!isArray(origin) || !isArray(other)) return false;
  if (origin.length !== other.length) return false;

  return origin.reduce(
    (acc, originV) => acc && other.findIndex(otherV => otherV === originV) > -1,
    true
  );
}

export default function checkI18nString(linguiKey, str) {
  /**
   * -1: bad key
   * 0: bad text
   * 1: valid text
   * 2: empty text
   */
  // TODO: check lingu key
  // current only detects parantheses
  if (!linguiKey || !isString(linguiKey)) return -1;
  if (!isString(str)) return 0;
  if (!str) return 2;

  const origin = {
    isValidVariablesFormat: isValidVariablesFormat(linguiKey),
    variables: getVariablesArray(linguiKey),
    tree: getTagsTree(linguiKey)
  };

  const other = {
    isValidVariablesFormat: isValidVariablesFormat(str),
    variables: getVariablesArray(str),
    tree: getTagsTree(str)
  };

  // check lingui key
  if (!origin.isValidVariablesFormat) return -1;

  // check string
  if (!other.isValidVariablesFormat) return 0;

  const isValid =
    isSameVariables(origin.variables, other.variables) &&
    isSameStructureTagTrees(origin.tree, other.tree);
  return isValid ? 1 : 0;
}
