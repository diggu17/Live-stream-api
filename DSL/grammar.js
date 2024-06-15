import Lexer from './lexer.js';

// Define AST Node Classes
class ASTNode {}

class FunctionCall extends ASTNode {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }
}

class Comparison extends ASTNode {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

class Addition extends ASTNode {
    constructor(left,operator, right) {
        super();
        this.left = left;
        this.operator= operator
        this.right = right;
    }
}

class SUBTRACTION extends ASTNode {
    constructor(left,operator, right) {
        super();
        this.left = left;
        this.operator= operator
        this.right = right;
    }
}

class MULTIPLICATION extends ASTNode {
    constructor(left,operator, right) {
        super();
        this.left = left;
        this.operator= operator
        this.right = right;
    }
}

// Parser Class
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    parse() {
        if (this.tokens[this.position].type !== 'RULE_START') {
            throw new Error("Query must start with 'rule'");
        }
        this.position++; // Consume 'RULE_START'

        const comparison = this.parseComparison();

        if (this.tokens[this.position].type !== 'RULE_END') {
            throw new Error("Query must end with 'end'");
        }

        return comparison;
    }

    parseComparison() {
        const left = this.parseOperation();
        const operator = this.parseOperator();
        const right = this.parseOperation();

        return new Comparison(left, operator, right);
    }

    parseOperation() {
        let left = this.parseExpression();

        while (this.tokens[this.position] && this.tokens[this.position].type === 'PLUS') {
            this.position++; // Consume '+'
            const right = this.parseExpression();
            left = new Addition(left,"+", right);
        }
        while (this.tokens[this.position] && this.tokens[this.position].type === 'MINUS') {
            this.position++; // Consume '+'
            const right = this.parseExpression();
            left = new SUBTRACTION(left,"-", right);
        }
        while (this.tokens[this.position] && this.tokens[this.position].type === 'MUL') {
            this.position++; // Consume '+'
            const right = this.parseExpression();
            left = new MULTIPLICATION(left,"*", right);
        }

        return left;
    }

    parseExpression() {
        const token = this.tokens[this.position];

        if (token.type === 'FUNCTION') {
            return this.parseFunctionCall();
        } else if (token.type === 'NUMBER' || token.type === 'IDENTIFIER') {
            this.position++;
            return token;
        } else {
            throw new Error(`Unexpected token: ${token.type}`);
        }
    }

    parseFunctionCall() {
        const functionName = this.tokens[this.position].value;
        this.position++; // Consume function name

        if (this.tokens[this.position].type !== 'LPAREN') {
            throw new Error("Expected '(' after function name");
        }
        this.position++; // Consume '('

        const args = [];
        while (this.tokens[this.position].type !== 'RPAREN') {
            if (this.tokens[this.position].type === 'IDENTIFIER') {
                args.push(this.tokens[this.position].value);
                this.position++; // Consume identifier
            } else if (this.tokens[this.position].type === 'COMMA') {
                this.position++; // Consume ','
            } else {
                throw new Error(`Unexpected token in function call: ${this.tokens[this.position].type}`);
            }
        }
        this.position++; // Consume ')'

        return new FunctionCall(functionName, args);
    }

    parseOperator() {
        const token = this.tokens[this.position];

        if (token.type === 'GT' || token.type === 'GE' || token.type === 'LT' || token.type === 'EQ') {
            this.position++;
            return token.value;
        } else {
            throw new Error(`Unexpected operator: ${token.type}`);
        }
    }
}

// Usage example:
// const input = "rule count('a') > count('b') end";
// const lexer = new Lexer(input);
// const tokens = lexer.tokenize();
// const parser = new Parser(tokens);
// const ast = parser.parse();
// console.log(JSON.stringify(ast, null, 2));

// const input2 = "rule count('a') >= sum('b') + sum('c') end";
// const lexer2 = new Lexer(input2);
// const tokens2 = lexer2.tokenize();
// const parser2 = new Parser(tokens2);
// const ast2 = parser2.parse();
// console.log(JSON.stringify(ast2, null, 2));

const input3 = "rule count('a') >= sum('b') * sum('c') end";
const lexer3 = new Lexer(input3);
const tokens3 = lexer3.tokenize();
const parser3 = new Parser(tokens3);
const ast3 = parser3.parse();
console.log(JSON.stringify(ast3, null, 2));

export default Parser;
