const {
    generateParser,
    FunctionCall,
    Comparison,
    ValueNode,
} = require('./grammar.js');


class Interpreter {
    constructor(ast, inputString) {
        this.ast = ast;
        this.inputString = inputString;
    }

    interpret() {
        // console.log("Interpreting AST...");
        // console.log(this.ast);
        return this.evaluate(this.ast);
    }

    evaluate(node) {
        // Debug: Log the current node being evaluated
        // console.log("Evaluating node:", JSON.stringify(node, null, 2));

        if (node instanceof FunctionCall) {
            return this.evaluateFunctionCall(node);
        } else if (node instanceof Comparison) {
            return this.evaluateComparison(node);
        } else if (node instanceof ValueNode) {
            return this.evaluateValueNode(node);
        } else {
            // Enhanced error message
            throw new Error(`Unexpected node type: ${node ? node.constructor.name : "undefined node"}`);
        }
    }

    evaluateFunctionCall(node) {
        const functionName = node.name;
        const args = node.args.map(arg => this.evaluate(arg)); // Evaluate each argument
        // console.log(`Function: ${functionName}, Args: ${args}`);

        if (functionName === 'count') {
            return this.count(args[0]);
        } else if (functionName === 'sum') {
            return this.sum(args[0]);
        } else if (functionName === 'max') {
            return this.max(args);
        }else if (functionName === 'min') {
            return this.min(args);
        } else {
            throw new Error(`Unknown function: ${functionName}`);
        }
    }

    evaluateComparison(node) {
        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);
        const operator = node.operator;

        switch (operator) {
            case '>':
                return left > right;
            case '>=':
                return left >= right;
            case '<':
                return left < right;
            case '==':
                return left === right;
            case '+':
                return left + right;
            case '*':
                return left * right;
            case '-':
                return left - right;
            case '<=':
                return left <=right;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    evaluateValueNode(node) {
        return node.value;
    }

    // Implementations of count, sum, and max functions
    count(arg) {
        const str = this.inputString;
        let cnt = 0;
        const characters = str.split("");
        characters.forEach((character) => {
            // console.log(typeof character, typeof arg);
          if (character[0] === arg[1]) cnt=cnt+1;
        });
        // console.log(cnt);
        return cnt;
      }

    sum(arg) {
        const regex = new RegExp(arg, 'g');
        let total = 0;
        let match;
        while ((match = regex.exec(this.inputString)) !== null) {
            total += parseInt(match[0], 10);
        }
        return total;
    }

    max(args) {
        return Math.max(...args);
    }

    min(args){
        return Math.min(...args);
    }
}

function parsingDSL(data){
    const ast = generateParser(data);
    const inputString = data.string;
    // const inputString = "aaaabbbcder";
    const interpreter = new Interpreter(ast, inputString);
    const result = interpreter.interpret();
    return result;
}

// parsingDSL(data);

module.exports = {parsingDSL, Interpreter};