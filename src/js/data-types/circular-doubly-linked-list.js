// -----------------------------------------------------------------------------
// Circular doubly linked list
// -----------------------------------------------------------------------------
//
// Methods list:
//  - isEmpty()
//  - push(data)
//  - pop()
//  - at(index)
//  - toString()
//
// -----------------------------------------------------------------------------


import { forEach } from '../utils/uncategorized';


class Node {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}


export default class CircularDoublyLinkedList {
    constructor(arr) {
        this.head = null;
        this.tail = null;
        this.length = 0;

        if (arr) {
            arr = Array.from(arr);

            if (Array.isArray(arr)) {
                forEach(arr, (item) => {
                    this.push(item);
                });
            }
        }
    }


    isEmpty() {
        return this.length === 0;
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

        this.length++;

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

        this.length--;

        return this;
    }


    at(index) {
        let node = this.head;

        for (let i = 0; i < index; i++) {
            node = node.next;
        }

        return node;
    }


    toString() {
        let result = '';

        let node = this.head;

        for (let i = 0; i < this.length; i++) {
            result += `${node.data.toString()},`;

            node = node.next;
        }

        return result.slice(0, -1);
    }
}
