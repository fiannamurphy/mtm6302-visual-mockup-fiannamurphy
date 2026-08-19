/* NASA APOD Search - Capstone Project Part 4 */


const apiKey = "DEMO_KEY";

const searchForm = document.querySelector("#search-form");
const dateInput = document.querySelector("#date");
const searchMessage = document.querySelector("#search-message");

const apodTitle = document.querySelector("#apod-title");
const apodDate = document.querySelector("#apod-date");
const mediaContainer = document.querySelector("#media-container");
const apodExplanation = document.querySelector("#apod-explanation");

const favouriteButton = document.querySelector("#favourite-button");
const favouritesList = document.querySelector("#favourites-list");

let currentApod = null;

let favourites =
  JSON.parse(localStorage.getItem("favourites")) || [];


/* -- Search NASA APOD -- */

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const selectedDate = dateInput.value;

  if (!selectedDate) {
    searchMessage.textContent = "Please choose a date.";
    return;
  }

  searchMessage.textContent = "Loading...";

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${selectedDate}`
    );

    if (!response.ok) {
      throw new Error("Could not load the NASA image.");
    }

    const data = await response.json();

    currentApod = data;

    displayApod(data);

    searchMessage.textContent = "";

  } catch (error) {
    apodTitle.textContent = "Something went wrong";

    apodDate.textContent = "";

    mediaContainer.innerHTML = "";

    apodExplanation.textContent =
      "The NASA image could not be loaded. Please try another date.";

    favouriteButton.hidden = true;

    searchMessage.textContent =
      "Unable to load the selected date.";

    console.error(error);
  }
});


/* -- Display NASA Result -- */

function displayApod(data) {
  apodTitle.textContent = data.title;

  apodDate.textContent = data.date;

  apodExplanation.textContent = data.explanation;

  mediaContainer.innerHTML = "";

  if (data.media_type === "image") {
    const image = document.createElement("img");

    image.src = data.url;

    image.alt = data.title;

    mediaContainer.appendChild(image);

    image.addEventListener("click", function () {
      if (data.hdurl) {
        window.open(data.hdurl, "_blank");
      }
    });

    favouriteButton.hidden = false;

  } else {
    mediaContainer.textContent =
      "This Astronomy Picture of the Day is a video. Please choose another date.";

    favouriteButton.hidden = true;
  }
}


/* -- Add to Favourites -- */

favouriteButton.addEventListener("click", function () {
  if (!currentApod) {
    return;
  }

  const alreadySaved = favourites.some(function (item) {
    return item.date === currentApod.date;
  });

  if (alreadySaved) {
    searchMessage.textContent =
      "This picture is already in your favourites.";

    return;
  }

  favourites.push(currentApod);

  saveFavourites();

  displayFavourites();

  searchMessage.textContent =
    "Added to favourites.";
});


/* -- Save Favourites -- */

function saveFavourites() {
  localStorage.setItem(
    "favourites",
    JSON.stringify(favourites)
  );
}


/* -- Display Favourites -- */

function displayFavourites() {
  favouritesList.innerHTML = "";

  if (favourites.length === 0) {
    const message = document.createElement("p");

    message.id = "no-favourites";

    message.textContent =
      "No favourites saved yet.";

    favouritesList.appendChild(message);

    return;
  }

  favourites.forEach(function (item) {
    const favouriteItem =
      document.createElement("article");

    favouriteItem.classList.add("favourite-item");


    const image =
      document.createElement("img");

    image.src = item.url;

    image.alt = item.title;


    const title =
      document.createElement("h3");

    title.textContent = item.title;


    const date =
      document.createElement("p");

    date.textContent = item.date;


    const deleteButton =
      document.createElement("button");

    deleteButton.type = "button";

    deleteButton.textContent = "Remove";


    deleteButton.addEventListener("click", function () {
      removeFavourite(item.date);
    });


    favouriteItem.appendChild(image);

    favouriteItem.appendChild(title);

    favouriteItem.appendChild(date);

    favouriteItem.appendChild(deleteButton);

    favouritesList.appendChild(favouriteItem);
  });
}


/* -- Remove Favourite -- */

function removeFavourite(date) {
  favourites = favourites.filter(function (item) {
    return item.date !== date;
  });

  saveFavourites();

  displayFavourites();
}


/* -- Load Saved Favourites -- */

displayFavourites();