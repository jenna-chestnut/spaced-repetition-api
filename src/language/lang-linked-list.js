class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // insert one after another, to mimic our language list in db
  insert(item) {
    if (this.head === null) {
      this.head = new _Node(item, null);
    }
    else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  incorrect() {
    let currNode = this.head; // create variables to hold values
    let upNextNode = this.head.next;
    let tempNode = upNextNode.next;

    currNode.value.memory_value = 1; 
    currNode.value.incorrect_count++;

    this.head = upNextNode; // set our head to it's next position (we always go 1 at a time)
    this.head.next = currNode; // switching places here as incorrect means we only move 1 spot
    currNode.next = tempNode; // set currNode next to the original next next

    // set our 'next' values for our items
    upNextNode.value.next = currNode.value.id;
    currNode.value.next = tempNode.value.id;
  }
  
  correct() {
    let currNode = this.head; // create variables to hold values
    let tempNode = this.head;
    let positionCount = 0;
    let position = 0;

    currNode.value.memory_value = currNode.value.memory_value * 2; // set our memory value accordingly
    position = currNode.value.memory_value; // create our goal to push out to 
    currNode.value.correct_count++; // add one to our correct count

    // as long as there is a next node & we have spots left to push, change our variables & continue
    while ((currNode.next !== null) && (positionCount !== position)) {  
      currNode = currNode.next;
      positionCount++;
    }

    this.head = this.head.next; // set our head to its next position (we always go 1 at a time)
    tempNode.next = currNode.next; // set our tempNode next from currNode's next (since we are inserting here)
    currNode.next = tempNode; // set our current node next to hold our inserted node

    // set our 'next' values for our items
    !tempNode.next ? tempNode.value.next = null : tempNode.next.value.id;
    currNode.value.next = tempNode.value.id;
    this.head.value.next = this.head.next.value.id;
  }

  // view all values in list (to insert into db)
  all() {
    if (!this.head) {
      return null;
    }

    let node = this.head;
    let all = [];
    while (node.next) {
      all.push(node.value);
      node = node.next;
    }

    all.push(node.value);
    return all;
  }
}

module.exports = LinkedList;