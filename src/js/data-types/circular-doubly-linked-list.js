// -----------------------------------------------------------------------------
// Circular doubly linked list
// -----------------------------------------------------------------------------
//
// Methods list:
//  - isEmpty()
//  - push(data)
//  - pop()
//
// -----------------------------------------------------------------------------


class Node {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}


export default class CircularDoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }


    isEmpty() {
        return this.size === 0;
    }


    push(data) {
        const node = new Node(data);

        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
            node.prev = node;
            node.next = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail;

            this.head.prev = node;
            node.next = this.head;

            this.tail = node;
        }

        this.size++;

        return this;
    }


    pop() {
        if (this.size === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail.prev.next = this.head;
            this.head.prev = this.tail.prev;
            this.tail = this.tail.prev;
        }

        this.size--;

        return this;
    }


    toString() {
        let result = '';

        let node = this.head;

        for (let i = 0; i < this.size; i++) {
            result += `${node.data.toString()},`;

            node = node.next;
        }

        return result.slice(0, -1);
    }
}
