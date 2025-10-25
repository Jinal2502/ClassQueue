
class PriorityQueue {
    constructor() {
      this.items = [];
    }
  
    // Add element with priority (lower number = higher priority)
    enqueue(element, priority = 1) {
      const queueElement = { element, priority };
      let added = false;
  
      for (let i = 0; i < this.items.length; i++) {
        if (queueElement.priority < this.items[i].priority) {
          this.items.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }
  
      if (!added) {
        this.items.push(queueElement);
      }
      return true;
    }
  
    // Remove element with highest priority (lowest priority number)
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.shift().element;
    }
  
    // View the highest priority element without removing it
    front() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items[0].element;
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
  
    // Get all items with their priorities
    getItems() {
      return this.items.map(item => item.element);
    }
  
    // Get items with priority info (for visualization)
    getItemsWithPriority() {
      return [...this.items];
    }
  
    // Initialize queue with existing items
    initialize(items) {
      this.items = [];
      items.forEach(item => {
        // Assuming items come with priority property
        this.enqueue(item, item.priority || 1);
      });
    }
  
    // Convert queue to array (for display purposes)
    toArray() {
      return this.items.map(item => item.element);
    }
  }
  
  export default PriorityQueue;