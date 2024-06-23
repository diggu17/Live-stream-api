const Lexer = require('./lexer.js');

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

class ValueNode extends ASTNode {
    constructor(value) {
        super();
        this.value = value;
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

        const expression = this.parseExpression();

        if (this.tokens[this.position] && this.isComparisonOperator(this.tokens[this.position].type)) {
            const operator = this.parseOperator();
            const right = this.parseExpression();
            const comparison = new Comparison(expression, operator, right);

            if (this.tokens[this.position].type !== 'RULE_END') {
                throw new Error("Query must end with 'end'");
            }
            return comparison;
        }

        if (this.tokens[this.position].type !== 'RULE_END') {
            throw new Error("Query must end with 'end'");
        }

        return expression;
    }

    parseExpression() {
        return this.parseOperation();
    }

    parseOperation() {
        let left = this.parsePrimary();

        while (this.tokens[this.position] && (this.tokens[this.position].type === 'PLUS' || this.tokens[this.position].type === 'MINUS' || this.tokens[this.position].type === 'MUL')) {
            const operatorToken = this.tokens[this.position];
            this.position++; // Consume operator
            const right = this.parsePrimary();
            left = new Comparison(left, operatorToken.value, right);
        }

        return left;
    }

    parsePrimary() {
        const token = this.tokens[this.position];

        if (token.type === 'FUNCTION') {
            return this.parseFunctionCall();
        } else if (token.type === 'NUMBER' || token.type === 'IDENTIFIER') {
            this.position++;
            return new ValueNode(token.value); // Wrap the value in a ValueNode
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
            if (this.tokens[this.position].type === 'IDENTIFIER' || this.tokens[this.position].type === 'NUMBER') {
                args.push(new ValueNode(this.tokens[this.position].value));
                this.position++; // Consume identifier or number
            } else if (this.tokens[this.position].type === 'COMMA') {
                this.position++; // Consume ','
            } else if (this.tokens[this.position].type === 'FUNCTION') {
                args.push(this.parseFunctionCall());
            } else {
                throw new Error(`Unexpected token in function call: ${this.tokens[this.position].type}`);
            }
        }
        this.position++; // Consume ')'

        return new FunctionCall(functionName, args);
    }

    parseOperator() {
        const token = this.tokens[this.position];

        if (this.isComparisonOperator(token.type)) {
            this.position++;
            return token.value;
        } else {
            throw new Error(`Unexpected operator: ${token.type}`);
        }
    }

    isComparisonOperator(type) {
        return type === 'GT' || type === 'GE' || type === 'LT' || type === 'EQ' || type === 'LE';
    }
}

function generateParser(data) {
    const input3 = data.query;
    const lexer3 = new Lexer(input3);
    const tokens3 = lexer3.tokenize();
    const parser3 = new Parser(tokens3);
    const ast3 = parser3.parse();
    // console.log(JSON.stringify(ast3, null, 2));
    return ast3;
}

// Example usage
// const input3 = "rule max(4,count('b')) >= count('a') end";
// const input3 = "rule count('a') end";
// const input3 = "rule count('a') > count('b') * count('c') end";
// const input3 = data.query;
// const lexer3 = new Lexer(input3);
// const tokens3 = lexer3.tokenize();
// const parser3 = new Parser(tokens3);
// const ast3 = parser3.parse();
// console.log(JSON.stringify(ast3, null, 2));

module.exports = {
    generateParser,
    FunctionCall,
    Comparison,
    ValueNode,
};
