let searchQuery = document.getElementById("search-bar");

fetch('https://api.openbrewerydb.org/breweries?by_city=Richmond')
  .then((response) => response.json())
  .then((data) => console.log(data));

  let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

function searchBreweries(searchValue) {
  document.getElementById("locations-grabbed").innerHTML = "";
  fetch('https://api.openbrewerydb.org/breweries?by_city=' + searchValue + "&per_page=10")
  .then((response) => response.json())
  .then((data) => {
    for (i = 0; i < data.length; i++) {
      document.getElementById("locations-grabbed").innerHTML = document.getElementById("locations-grabbed").innerHTML + ("<br>" + data[i].name + "<br>" + data[i].street + "<br>");
      console.log(data[i].name);
    }
  })
}

window.initMap = initMap;
