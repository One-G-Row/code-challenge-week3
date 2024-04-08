//create a DOMContentLoaded event listener and place js funtions and variables inside
//to make sure html docs are loaded before loading the js file
document.addEventListener("DOMContentLoaded", function () {
  //get the html element cards displayed on the right of the screen
  const title = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const filmInfo = document.getElementById("film-info");
  const showtime = document.getElementById("showtime");
  const ticketNumber = document.getElementById("ticket-num");
  const button = document.getElementById("buy-ticket");
  const btn = document.querySelector("ui-orange-button");
  const divImage = document.querySelector("four-wide-column");
  const poster = document.getElementById("poster");

  const url = "http://localhost:3000/films";

  fetch(url)
    .then((response) => response.json())
    .then((films) => displayCard(films));

  function displayCard(films) {
    //maps through the movies array to get the movie title and render it on our webpage
    let titles = films.map((film) => film.title)[0];
    title.innerHTML = titles;

    //maps through the movies array to get the runtime and render it on our webpage
    let runTime = films.map((film) => film.runtime)[0];
    runtime.innerHTML = runTime;

    //maps through the movies array to get the movie description and render it on our webpage
    let movieDescription = films.map((film) => film.description)[0];
    filmInfo.innerHTML = movieDescription;

    //maps through the movies array to get the movie description and render it on our webpage
    let showTime = films.map((film) => film.showtime)[0];
    showtime.innerHTML = showTime;

    //maps through the movies array to get the number of tickets(capacity) and the tickets sold
    //then calculate the number of remaining tickets
    let tickets = films.map((film) => film.capacity)[0];
    let ticketsSold = films.map((film) => film.tickets_sold)[0];
    function calculateRemainingTickets() {
      let totalTicketsRemaining = tickets - ticketsSold;
      ticketNumber.innerHTML = totalTicketsRemaining;
      return totalTicketsRemaining;
    }
    calculateRemainingTickets();

    //create a button when clicked reduces the no of tickets available on the ticketNumber.innerHTML
    //when a ticket is bought it should also be updated on the server

    function buyTicket() {
      let remainingTickets = calculateRemainingTickets();
      let tickets = parseInt(remainingTickets);

      button.addEventListener("click", function () {
        //find the solution for decrementing by 1 everytime the button is clicked
        tickets--;
        ticketNumber.innerHTML = tickets;
        //add a class list of sold out to the buy ticket button
        //btn.classList.remove("ui orange button");
        button.classList.add("soldout");

        //set conditions to disable buy ticket when count reaches to 0
        //the button should also have the text of sold out when count reaches 0
        if (tickets === 0) {
          button.disabled = true;
          button.innerHTML = "SOLD OUT";
        } else {
          button.disabled = false;
        }
      });

      let count = 0;
      //increment the tickets sold on the server everytime the buy button is clicked
      button.addEventListener("click", incrementTicketsSold);
      function incrementTicketsSold() {
        let sold_tickets = updateTickets();
        let value = Object.values(sold_tickets);
        let number = parseFloat(value);
        count++;
        number += count;
        return number;
      }

      incrementTicketsSold();
    }
    buyTicket(updateTickets);

    //change the poster image file by placing the image path to the src att of the image element
    let image = films.map((film) => film.poster)[0];
    poster.src = image;
  }

  //create a menu on the left side of the webpage
  //the movie titles should be in the list elements which are appended on the ul element
  const ul = document.getElementById("films");
  const filmItem = document.querySelector("film item");

  //use fetch to get the movies object
  fetch(url)
    .then((response) => response.json())
    .then((movies) => displayMovies(movies));

  //filter the movie titles and push the elements to an empty array
  let movieTitles = [];
  function displayMovies(movies) {
    movies.filter(function (movie) {
      movieTitles.push(movie.title);
    });

    //using dom manipulation methods create an element li and append it to ul element
    //place the movieTitles array in a for to iterate to get a display of one at a time instead of a cluster of movies
    //then render the movie_title to the webpage

    for (let i = 0; i < movieTitles.length; i++) {
      //create a list element and append it in the ul element then add a class of film-item
      let li = document.createElement("li");
      ul.appendChild(li);
      li.classList.add("film-item");
      li.innerHTML = movieTitles[i].toUpperCase();
      //create delete button element after every movie in the list
      //append the delete button as a child of list element
      let del = document.createElement("button");
      del.classList.add("deleteBtn");
      del.innerHTML = "DELETE";
      li.appendChild(del);
    }

    //select the delete buttons and the film items list
    let deleteBtns = document.querySelectorAll(".deleteBtn");
    let filmItems = document.querySelectorAll(".film-item");
    //add a click event listener to the delete button so that when the button is clicked it deletes the movie item
    //use a for each method to target every movie item
    deleteBtns.forEach((deleteBtn, i) => {
      deleteBtn.addEventListener("click", deleteMovies);
      function deleteMovies() {
        filmItems[i].remove();
        deleteMovie();
      }
    });
  }

  //update the server so that when a ticket is bought the no. of tickets sold are updated on the server
  //use a patch method

  function updateTickets() {
    let ticketsSold = {
      tickets_sold: 13,
    };

    //let buyTicket = buyTicket();
    const update = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketsSold),
    };

    fetch("http://localhost:3000/films/1")
      .then((response) => response.json())
      .then((updateTickets) => buyTicket(updateTickets))
      .catch((error) => {
        console.log(error);
      });

    return ticketsSold;
  }
  updateTickets();

  //deletes movie items on the server
  function deleteMovie() {
    const url = `http://localhost:3000/films`;
    const deletes = {
      method: "DELETE",
    };
    fetch(`${url}?id={3}`).then((response) => console.log(response.json));
  }
  //deleteMovie();
});
