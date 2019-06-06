// -----------------------------------------------------------------------------
// STACK
// -----------------------------------------------------------------------------


export default class Stack {
    constructor() {
        this.items = [];
    }


    isEmpty() {
        return this.items.length === 0;
    }


    push(data) {
        this.items.push(data);
        return this;
    }


    pop() {
        if (this.isEmpty()) {
            return undefined;
        }

        return this.items.pop();
    }


    peek() {
        return this.items[this.size() - 1];
    }


    size() {
        return this.items.length;
    }


    toString() {
        let result = '';

        for (let i = 0; i < this.items.length; i++) {
            result += `${this.items[i].toString()},`;
        }

        return result.slice(0, -1);
    }
}

