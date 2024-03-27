// provide an API for pulling, referencing, and updating data
const baseURL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-ftb-et-web-pt/events";

// creating a state as an object
const state = {
  events: [],
  messages: "This object is not in the database.",
  isError: false,
};

// I am receiving an array of API data, retrieving and converting to json
async function getEvents() {
  const response = await fetch(`${baseURL}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(json.error);
  }
  console.log(result);

  state.events = [...result.data];

  render();
  //   result.data.forEach((event) => {
  //     createCard(event);
  //   });
}

//rendering:
function render() {
  //   const grid = document.querySelector("grid");
  //   grid.innerHTML = "";
  state.events.forEach((item) => {
    createCard(item);
  });
}

// initialization
async function init() {
  await getEvents();
}

// when receiving a string of data, I need to divide the card body contents with spaces

// here I am referencing html structure using the DOM, though I'm not calling for anything because button wasn't hard coded
const buttonsRef = document.getElementsByClassName("btn");
const buttons = document.querySelectorAll("button");

// adding an event listener to delete a given card upon button press
// buttons.addEventListener("click", deleteCard);

// here I am posting new event data onto the API
async function createEvent(event) {
  const response = await fetch(`${baseURL}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

// I also need an event listener to add a given card/event on submit
// In addition, I am creating the process for rendering the array/info to the screen
const form = document.getElementById("partyForm");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name");
  const description = document.getElementById("description");
  const date = document.getElementById("date");
  const location = document.getElementById("location");

  const eventArray = {
    name: name.value,
    description: description.value,
    date: date.value,
    location: location.value,
  };

  try {
    const newEvent = await createEvent(eventArray);
    // add the new recipe to the screen
    addNewEvent(newEvent);
  } catch (err) {
    console.error(err);
  }
});

// this function is needed to create a new event and is part of the process of rendering this new event onto the screen using the DOM/html access

function addNewEvent(event) {
  const eventsElement = document.getElementById("events");
  const elem = document.createElement("div");
  elem.classList.add("event");

  const nameElem = document.createElement("div");
  nameElem.classList.add("name");
  nameElem.append(event.name);

  const descriptionElem = document.createElement("div");
  descriptionElem.classList.add("description");
  descriptionElem.append(event.description);

  const dateElem = document.createElement("div");
  dateElem.classList.add("date");
  dateElem.append(event.date);

  const locationElem = document.createElement("div");
  locationElem.classList.add("location");
  locationElem.append(event.location);

  elem.append(nameElem);
  elem.append(descriptionElem);
  elem.append(dateElem);
  elem.append(locationElem);

  eventsElement.append(elem);
}

// create a function that deletes the selected card via button press (I added an event listener at the top of this code)
// async function deleteCard(event) {
//   const response = await fetch(`${baseURL}`);
//   const result = await response.json();
//   result.data.splice(0, 1);
// }

// created a function to remove an event by entering its given id
async function deleteEvent(id) {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: "delete",
    });

    if (response.status === 204) {
      return true;
    }
    render();
  } catch (error) {
    console.log(error);
    // update state / change message
  }
}

//   if (response.status === 204) {
//     return true;

//   throw new Error(`unable to remove recipe with id ${id}`);

//create a function that creates cards
function createCard(event) {
  //Should create 4 thigs : card, card-header, card-body, card-footer
  const card = document.createElement("div");
  card.className = "card";
  //create card header
  const header = createCardHeader(event.name);
  //create card body
  const cardBodyDescription = createCardBodyDescription(event.description);
  const cardBodyDate = createCardBodyDate(event.date);
  const cardBodyLocation = createCardBodyLocation(event.location);
  //create card footer
  const cardFooter = createCardFooter();

  //append all elements to the card
  card.appendChild(header);
  card.appendChild(cardBodyDescription);
  card.appendChild(cardBodyDate);
  card.appendChild(cardBodyLocation);
  card.appendChild(cardFooter);
  card.setAttribute("data-id", event.id);

  console.log(card);
  const grid = document.querySelector(".content_grid");
  console.log(grid);
  document.querySelector(".content_grid").appendChild(card);
}

function createCardFooter() {
  const cardFooter = document.createElement("div");
  const button = document.createElement("button");
  const buttonText = document.createTextNode("Remove");

  cardFooter.className = "card-footer";
  button.className = "btn";

  button.appendChild(buttonText);
  cardFooter.appendChild(button);

  button.addEventListener("click", async (event) => {
    const selectedCard = event.target.closest(".card");
    const id = selectedCard.dataset.id;
    const result = await deleteEvent(id);
    // re-draw my state
    if (result) {
      selectedCard.remove();
    }
  });
  return cardFooter;
}

function createCardBodyDescription(description) {
  const cardBodyDescription = document.createElement("div");
  const descriptionText = document.createTextNode(description);
  cardBodyDescription.className = "cardBodyDescription";
  cardBodyDescription.appendChild(descriptionText);

  return cardBodyDescription;
}

function createCardBodyDate(date) {
  const cardBodyDate = document.createElement("div");
  const dateText = document.createTextNode(date);
  cardBodyDate.className = "cardDateDescription";
  cardBodyDate.appendChild(dateText);

  return cardBodyDate;
}

function createCardBodyLocation(location) {
  const cardBodyLocation = document.createElement("div");
  const locationText = document.createTextNode(location);
  cardBodyLocation.className = "cardDateDescription";
  cardBodyLocation.appendChild(locationText);

  return cardBodyLocation;
}

function createCardHeader(name) {
  const header = document.createElement("div");
  const h1 = document.createElement("h1");
  const text = document.createTextNode(name);

  header.className = "card-header card-image";

  h1.append(text);
  header.appendChild(h1);

  return header;
}

// I am running the getEvents function here, obtaining the data from the API
getEvents();
