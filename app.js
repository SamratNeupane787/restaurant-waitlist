class Queue {
  constructor(limit) {
    this.queue = [];
    this.limit = limit;
  }

  enqueue(data) {
    if (this.queue.length >= this.limit) {
      this.dequeue();
    }
    this.queue.push(data);
  }

  dequeue() {
    if (this.queue.length > 0) {
      this.queue.shift();
    }
  }

  getQueue() {
    return this.queue;
  }

  getLatestCustomer() {
    if (this.queue.length > 0) {
      return this.queue[this.queue.length - 1];
    } else {
      return null;
    }
  }

  getAverageWaitTime() {
    let sum = 0;
    for (let i = 0; i < this.queue.length; i++) {
      sum += this.queue[i].waitTime;
    }
    return (sum / this.queue.length).toFixed(2);
  }
}

const waitlistQueue = new Queue(10);

const addButton = document.querySelector('.add-button');
const nameInput = document.querySelector('.name-input');
const estimateTime = document.getElementById('estimate-time');
const waitlist = document.getElementById('waitlist');
const dequeueButton = document.querySelector('.dequeue-button');

addButton.addEventListener('click', () => {
  let name = nameInput.value;

  if (name === '') {
    alert('Please enter a name!');
  } else {
    alert(`Added ${name} to waitlist!`);
    const customer = {
      name: name,
      timestamp: new Date(),
      waitTime: null
    };
    waitlistQueue.enqueue(customer);
    updateWaitlist();
  }
});

dequeueButton.addEventListener('click', () => {
  waitlistQueue.dequeue();
  updateWaitlist();
});
function updateWaitlist() {
  const tableBody = document.querySelector('#waitlist');
  tableBody.innerHTML = '';

  if (waitlistQueue.getQueue().length > 0) {
    const queueItems = waitlistQueue.getQueue();

    for (let i = queueItems.length - 1; i >= 0; i--) {
      const customer = queueItems[i];
      const tableRow = document.createElement('tr');

      const tableName = document.createElement('td');
      tableName.innerText = customer.name;

      const tableTimestamp = document.createElement('td');
      tableTimestamp.innerText = customer.timestamp.toLocaleTimeString();

      const now = new Date();
      const waitTime = customer.waitTime ?? 0;
      const elapsed = (now - customer.timestamp) / 1000 / 60;
      const totalWaitTime = waitTime + Math.max(elapsed - waitTime, 0);

      const tableWaitTime = document.createElement('td');
      tableWaitTime.innerText = `${totalWaitTime.toFixed(2)} minutes`;

      tableRow.appendChild(tableName);
      tableRow.appendChild(tableTimestamp);
      tableRow.appendChild(tableWaitTime);

      tableBody.appendChild(tableRow);
    }

    const latestCustomer = waitlistQueue.getLatestCustomer();
    if (latestCustomer !== null) {
      const now = new Date();
      const minutes = Math.floor((now - latestCustomer.timestamp) / 60000);
      latestCustomer.waitTime = minutes;
      estimateTime.innerText = `${waitlistQueue.getAverageWaitTime().toFixed(2)} minutes`;
    }
  } else {
    estimateTime.innerText = '0 minutes';
  }
}
