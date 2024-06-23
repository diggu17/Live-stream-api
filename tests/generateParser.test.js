const {
  generateParser,
  FunctionCall,
  Comparison,
  ValueNode,
} = require('../DSL/grammar.js');
const Lexer = require('../DSL/lexer.js');

jest.mock('../DSL/lexer.js'); // Mock the Lexer class

test('generateParser parses a simple rule', () => {
  const data = { query: "rule count('a') > 4 end" };
  Lexer.mockImplementation(() => ({
    tokenize: () => {
      const tokens = [
        { type: 'RULE_START', value: 'rule' },
        { type: 'FUNCTION', value: 'count' },
        { type: 'LPAREN', value: '(' },
        { type: 'IDENTIFIER', value: "a" },
        { type: 'RPAREN', value: ')' },
        { type: 'GT', value: '>' },
        { type: 'NUMBER', value: '4' },
        { type: 'RULE_END', value: 'end' }
      ];
      return tokens;
    },
  }));

  const ast = generateParser(data);

  expect(ast).toBeInstanceOf(Comparison);
  expect(ast.left).toBeInstanceOf(FunctionCall);
  expect(ast.left.name).toBe('count');
  expect(ast.left.args.length).toBe(1);
  expect(ast.left.args[0].value).toBe('a');
  expect(ast.operator).toBe('>');
  expect(ast.right).toBeInstanceOf(ValueNode);
  expect(ast.right.value).toBe("4");
});

test('generateParser throws error for invalid query', () => {
  const data = { query: 'invalid query' };
  Lexer.mockImplementation(() => ({
    tokenize: () => {
      throw new Error("Query must start with 'rule' and end with 'end'");
    },
  }));

  expect(() => generateParser(data)).toThrowError();
});

test('should throw an error for query without "rule" keyword', () => {
  const data = { query: 'count("a") > 4 end' };
  Lexer.mockImplementation(() => ({
    tokenize: () => {
      throw new Error("Query must start with 'rule' and end with 'end'");
    },
  }));

  expect(() => generateParser(data)).toThrowError();
});

test('should throw an error for query without "end" keyword', () => {
  const data = { query: 'rule count("a") > 4' };
  Lexer.mockImplementation(() => ({
    tokenize: () => {
      throw new Error("Query must start with 'rule' and end with 'end'");
    },
  }));

  expect(() => generateParser(data)).toThrowError();
});


test('generateParser parses complex rule with max, count, and sum', () => {
  const data = { query: "rule max(4,count('a')) >= sum('b','c') end" };
  Lexer.mockImplementation(() => ({
    tokenize: () => {
      const tokens = [
        { type: 'RULE_START', value: 'rule' },
        { type: 'FUNCTION', value: 'max' },
        { type: 'LPAREN', value: '(' },
        { type: 'NUMBER', value: '4' },
        { type: 'COMMA', value: ',' },
        { type: 'FUNCTION', value: 'count' },
        { type: 'LPAREN', value: '(' },
        { type: 'IDENTIFIER', value: "a" },
        { type: 'RPAREN', value: ')' },
        { type: 'RPAREN', value: ')' },
        { type: 'GE', value: '>=' }, // greater than or equal operator
        { type: 'FUNCTION', value: 'sum' },
        { type: 'LPAREN', value: '(' },
        { type: 'IDENTIFIER', value: "b" },
        { type: 'COMMA', value: ',' },
        { type: 'IDENTIFIER', value: "c" },
        { type: 'RPAREN', value: ')' },
        { type: 'RULE_END', value: 'end' },
      ];
      return tokens;
    },
  }));

  const ast = generateParser(data);

  // Assertions for complex rule structure
  expect(ast).toBeInstanceOf(Comparison);
  expect(ast.left).toBeInstanceOf(FunctionCall);
  expect(ast.left.name).toBe('max'); // Left side is a max function call
  expect(ast.left.args.length).toBe(2); // max takes two arguments (4 and count('a'))
  expect(ast.left.args[0]).toBeInstanceOf(ValueNode); // First argument is a number (4)
  expect(ast.left.args[0].value).toBe("4");
  expect(ast.left.args[1]).toBeInstanceOf(FunctionCall); // Second argument is a count function call
  expect(ast.left.args[1].name).toBe('count');
  expect(ast.left.args[1].args.length).toBe(1);
  expect(ast.left.args[1].args[0].value).toBe('a');

  expect(ast.operator).toBe('>='); // Comparison operator is greater than or equal
  expect(ast.right).toBeInstanceOf(FunctionCall); // Right side is a sum function call
  expect(ast.right.name).toBe('sum');
  expect(ast.right.args.length).toBe(2);
  expect(ast.right.args[0].value).toBe('b'); // First argument is identifier (b)
  expect(ast.right.args[1].value).toBe('c'); // Second argument is identifier (c)
});


// Add more tests as needed
