// src/ds-implementation/Queue.js

class Queue {
    constructor() {
      this.items = [];
    }
  
    // Add element to the rear of the queue
    enqueue(element) {
      this.items.push(element);
      return true;
    }
  
    // Remove element from the front of the queue
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.shift();
    }
  
    // View the front element without removing it
    front() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items[0];
    }
  
    // Check if queue is empty
    isEmpty() {
      return this.items.length === 0;
    }
  
    // Get the size of the queue
    size() {
      return this.items.length;
    }
  
    // Clear the queue
    clear() {
      this.items = [];
    }
  
    // Get all items in the queue
    getItems() {
      return [...this.items];
    }
  
    // Initialize queue with existing items
    initialize(items) {
      this.items = [...items];
    }
  
    // Convert queue to array (for display purposes)
    toArray() {
      return [...this.items];
    }
  }
  
  export default Queue;