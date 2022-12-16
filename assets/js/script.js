let searchQuery = document.getElementById("search-bar");
let stateValue = '';

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

console.log(searchQuery.value)

function searchBreweries(searchValue) {
  document.getElementById("locations-grabbed").innerHTML = "";
  if (document.getElementById("state-search-bar").value !== '') {
    stateValue = "&by_state=" + document.getElementById("state-search-bar").value;
  }
  fetch('https://api.openbrewerydb.org/breweries?by_city=' + searchValue + "&per_page=10" + stateValue)
  .then((response) => response.json())
  .then((data) => {
    for (i = 0; i < data.length; i++) {
      locationSection = document.createElement('section');
      document.getElementById("locations-grabbed").innerHTML = document.getElementById("locations-grabbed").innerHTML + ("<br>" + data[i].name + "<br>" + data[i].street + "<br>");
      if (data[i].website_url !== null) {
      document.getElementById("locations-grabbed").innerHTML = document.getElementById("locations-grabbed").innerHTML + (`<button class='border-solid rounded-lg border-2 p-2'><a href='${data[i].website_url}'>Website</button>`)
      }
      if (data[i].phone == null) {
        document.getElementById("locations-grabbed").innerHTML = document.getElementById("locations-grabbed").innerHTML + "<br>";
      }
      if (data[i].phone !== null) {
        document.getElementById("locations-grabbed").innerHTML = document.getElementById("locations-grabbed").innerHTML + (`<button class='border-solid rounded-lg border-2 p-2'><a href='tel:${data[i].phone}'>Call</button><br>`)
        }
      console.log(data[i].name);
    }
  })
}

window.initMap = initMap;
