const { parsingDSL, Interpreter } = require('../DSL/interpreter.js'); 
const { FunctionCall, Comparison, ValueNode } = require('../DSL/grammar.js');

describe('Interpreter Tests', () => {
    test('should correctly evaluate count function', () => {
        const inputString = 'aaaabbbcder';
        const ast = new FunctionCall('count', [new ValueNode("'a'")]);
        const interpreter = new Interpreter(ast, inputString);
        expect(interpreter.interpret()).toBe(4);
    });

    test('should correctly evaluate sum function', () => {
        const inputString = '12345';
        const ast = new FunctionCall('sum', [new ValueNode('[0-9]')]);
        const interpreter = new Interpreter(ast, inputString);
        expect(interpreter.interpret()).toBe(15); // 1 + 2 + 3 + 4 + 5
    });

    test('should correctly evaluate max function', () => {
        const inputString = '';
        const ast = new FunctionCall('max', [new ValueNode(1), new ValueNode(2), new ValueNode(3)]);
        const interpreter = new Interpreter(ast, inputString);
        expect(interpreter.interpret()).toBe(3);
    });

    test('should correctly evaluate min function', () => {
        const inputString = '';
        const ast = new FunctionCall('min', [new ValueNode(1), new ValueNode(2), new ValueNode(3)]);
        const interpreter = new Interpreter(ast, inputString);
        expect(interpreter.interpret()).toBe(1);
    });

    test('should correctly evaluate comparisons', () => {
        const inputString = '';
        const ast = new Comparison(new ValueNode(5), '>', new ValueNode(3));
        const interpreter = new Interpreter(ast, inputString);
        expect(interpreter.interpret()).toBe(true);

        const ast2 = new Comparison(new ValueNode(5), '<', new ValueNode(3));
        const interpreter2 = new Interpreter(ast2, inputString);
        expect(interpreter2.interpret()).toBe(false);
    });

    test('should correctly evaluate value node', () => {
        const inputString = '';
        const ast = new ValueNode(42);
        const interpreter = new Interpreter(ast, inputString);
        expect(interpreter.interpret()).toBe(42);
    });
});

describe('parsingDSL Tests', () => {
    test('should parse and interpret a simple rule', () => {
        const data = {
            query: "rule count('a') > 4 end",
            string: "aaaabbbcder"
        };
        expect(parsingDSL(data)).toBe(false);
    });

    test('should parse and interpret a complex rule', () => {
        const data = {
            query: "rule max(4, count('b')) >= count('a') end",
            string: "aaaabbb"
        };
        expect(parsingDSL(data)).toBe(true);
    });

});
