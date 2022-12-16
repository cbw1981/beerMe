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

window.initMap = initMap;
