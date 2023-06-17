const apiUrl = 'https://knassbani2.execute-api.us-east-2.amazonaws.com/events/';

const eventCache = new Proxy({}, {
  async get(target, category) {
    if (!(category in target)) {
      target[category] = await fetchEvents(category);
    }
    return target[category];
  }
});

async function fetchEvents(category) {
  const url = `${apiUrl}${category}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function renderEvents(events) {
  const grid = document.querySelector('.event-grid');
  grid.innerHTML = '';
  events.forEach(event => {
    const item = document.createElement('div');
    item.classList.add('event-item');
    item.innerHTML = `
      <img src="${event.image}" alt="${event.title}">
      <h3>${event.title}</h3>
      <p>${formatDate(event.date)}</p>
      <p>${formatLocation(event.location)}</p>
      <p>${formatPrice(event.price)}</p>
    `;
    grid.appendChild(item);
  });
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

function formatLocation(location) {
  return `${location.place} • ${location.city}, ${location.state}`;
}

function formatPrice(price) {
  return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
}

document.querySelector('.tab-nav').addEventListener('click', async function(event) {
  if (event.target.tagName === 'A') {
    const category = event.target.dataset.category;
    const events = await eventCache[category];
    renderEvents(events);
  }
});