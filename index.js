//node class for every value entered in a hashmap
class Node {
    constructor(current) {
        this.current = current;
        this.next = null;
        this.previous = null;
    };
}

// linked list class that manages its nodes 
class LinkedList {
    constructor(){
        this.head = null;
        this.tail = null;
    }

    // checks if the entered value exists in the selected linked list
    contains(value) {
        var search = this.head;
        while(search && (value !== search.current)) {
            search = search.next
        };
        return (search) ? true : false;
    }

    // if value does not exist in the currec linked list, makes a node objects containing
    // the value we want to save and pushes it into corresponding lineup of the list
    push(value) {
        const node = new Node(value);

        if(!this.head) {
            this.head = node;
        } else if(this.tail) {
            var formerTail = this.tail;
            formerTail.previous = this.tail.previous;
            this.tail = node;
            this.tail.previous = formerTail;
            formerTail.next = this.tail;
        } else {
            this.tail = node;
            this.tail.next = null;
            this.tail.previous = this.head;
            this.head.next = this.tail;
        }
    }

    // returns the linked list length, with 0 if it's empty
    length(counter = 1, current = this.head){
        if(!current) return counter = 0;
        if(current === this.tail) return counter;

        if(current) {
            current = current.next;
            counter += this.length(counter, current);
        };

        return counter;
    }

    // throws error if linked list is empty, if not, checks for entered value
    // if there's a node object with its current having the same value as entered
    // value, returns the node object, if not, throws the error
    at(value){
        var search = this.head;
        while(search) {
            if(search.current === value) break;
            search = search.next;
        };
        if(!search) throw new Error('Value to be deleted not found within the bucket');
        return search;
    }

    // removes the last element of the linked list (tail)
    pop() {
        this.tail = this.tail.previous;
        this.tail.next = null;
    }

    // if the linked list contains the value, deletes it from the list and adjusts
    // data of other nodes and their positions (next / previous) accordingly
    delete(value) {
        var currentNode = this.at(value);
        if(currentNode === this.tail) return this.pop();
        var currentNodeNext = currentNode.next;
        if(currentNode === this.head) {
            this.head = currentNodeNext;
            this.head.previous = null;
        } else {
            var currentNodePrevious = currentNode.previous;
            currentNodeNext.previous = currentNodePrevious;
            currentNodePrevious.next = currentNodeNext;
        }
    }

}

const Hashmap = (function(){
    // creates original hashmap presented in form of an array, with it's size and load factor being set
    var hashArr = [];
    var hashSize = 6.0;
    const loadFactor = 0.75;
    // creates a linked list for each bucked of the hashmap
    for(let i = 0; i < hashSize; i++) {
        hashArr.push(new LinkedList());
    };

    // expands the current hashmap by creating the new one and reassigning nodes from linked lists
    // of the old hashmap to new one with more indexes 
    const expand = () => {
        var tempArr = hashArr;
        var tempSize = hashSize;
        hashSize *= 2;
        hashArr = [];
        for(let i = 0; i < hashSize; i++) {
            hashArr.push(new LinkedList());
        };

        for(let i = 0; i < tempSize; i++) {
            var linkedList = tempArr[i];
            var search = linkedList.head;
            while(search) {
                set(search.current);
                search = search.next;
            };
        };
    }

    // hashes the value and returns the hash code
    const hash = (value) => {
        var code = 0;
        const primeN = 31;
        for(var i = 0; i < value.length; i++) {
            code += (primeN * code) + value.charCodeAt(i);
            code = code % hashSize;
        };
        
        return code;
    }

    // checks if hashcode is out of bounds, if so throws error, if not
    // checks the bucket under value's hashcode
    // if it exists, do nothing, if it doesn't exits, push it into the linked list and check if
    // the linked list needs expanding or not based on the length of the bucket the value vas pushed into
    // and the hash size and load factor of the hashmap
    const set = (value) => {
        let index = hash(value);
        if (index < 0 || index >= hashArr.length) throw new Error("Trying to access index out of bounds");

        if(!hashArr[index].contains(value)) {
            hashArr[index].push(value);
            if(hashArr[index].length() > (hashSize * loadFactor)) expand();
        };

    }

    // creates the hashcode for entered value, checks if it's out of bounds or not
    // if not, deletes the value;
    const deleteValue = (value) => {
        let index = hash(value);
        if (index < 0 || index >= hashArr.length) throw new Error("Trying to access index out of bounds");
        hashArr[index].delete(value);
    }

    // prints out the current hash map
    const printHashMap = () => {
        console.log('hashmap:');
        console.log(hashArr);
    }

    return {
        set,
        deleteValue,
        printHashMap
    }

})();

// testing the functionalities of Hashmap singleton, Node class and LinkedList class
console.log('Adding data to initial hashmap!');
Hashmap.set('monday');
Hashmap.set('tuesday');
Hashmap.set('maria');
Hashmap.printHashMap();

console.log('Expanding the hashmap now!');
Hashmap.set('carlos sandtos');
Hashmap.set('radiant');
Hashmap.set('wokiwoki');
Hashmap.set('wugawuga');
Hashmap.set('gfhua gcfkyuagwhgsahndgcyuva');
Hashmap.set('wednesday');
Hashmap.printHashMap();

console.log(`Deleting the value 'monday'!`);
Hashmap.deleteValue('monday');
Hashmap.printHashMap();