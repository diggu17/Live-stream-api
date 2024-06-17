class Lexer {
    constructor(input) {
        this.input = input;
        this.tokens = [];
        this.position = 0;
        this.tokenSpecs = [
            { type: 'RULE_START', regex: /rule/i },
            { type: 'RULE_END', regex: /end/i },
            { type: 'FUNCTION', regex: /(count|sum|min|max)/i },
            { type: 'LPAREN', regex: /\(/ },
            { type: 'RPAREN', regex: /\)/ },
            { type: 'COMMA', regex: /,/ },
            { type: 'GE', regex: />=/ },
            { type: 'GT', regex: />/ },
            { type: 'LT', regex: /</ },
            { type: 'EQ', regex: /==/ },
            { type: 'NUMBER', regex: /\d+/ },
            { type: 'IDENTIFIER', regex: /'[a-zA-Z_][a-zA-Z0-9_]*'/ },
            { type: 'PLUS', regex: /\+/ },
            { type: 'MINUS', regex: /\-/ },
            { type: 'MUL', regex: /\*/ },
            { type: 'WHITESPACE', regex: /\s+/, ignore: true }
        ];
    }

    tokenize() {
        if (!this.input.startsWith('rule') || !this.input.endsWith('end')) {
            throw new Error("Query must start with 'rule' and end with 'end'");
        }
        while (this.position < this.input.length) {
            let matchFound = false;

            for (let spec of this.tokenSpecs) {
                const regex = new RegExp('^' + spec.regex.source);
                const match = regex.exec(this.input.slice(this.position));

                if (match) {
                    if (!spec.ignore) {
                        this.tokens.push({ type: spec.type, value: match[0] });
                    }
                    this.position += match[0].length;
                    matchFound = true;
                    break;
                }
            }

            if (!matchFound) {
                throw new Error(`Unexpected token at position ${this.position}: ${this.input[this.position]}`);
            }
        }

        return this.tokens;
    }
}


// Usage example:
// const input = "rule count('a') > count('b') end";
// const lexer = new Lexer(input);
// const tokens = lexer.tokenize();
// console.log(tokens);

// const input2 = "rule max(4,count('a')) >= sum('b','c')  end";
// const lexer2 = new Lexer(input2);
// const tokens2 = lexer2.tokenize();
// console.log(tokens2);

// const input3 = "rule count('a') >= 4 end";
// const lexer3 = new Lexer(input3);
// const tokens3 = lexer3.tokenize();
// console.log(tokens3);

export default Lexer;