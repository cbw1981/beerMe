let searchQuery = document.getElementById("search-bar");
let locationsGrabbed = document.getElementById("locations-grabbed");
let locationContainer = "";
let stateValue = '';
let capitalizedType = '';

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
  locationsGrabbed.innerHTML = "";
  let cityReplaced = searchValue.replace(/ /g, '+');
  convertToFullState();
  if (document.getElementById("state-search-bar").value !== '') {
    stateValue = "&by_state=" + document.getElementById("state-search-bar").value.replace(/ /g, '+');
  }
  fetch('https://api.openbrewerydb.org/breweries?by_city=' + cityReplaced + "&per_page=10" + stateValue)
  .then((response) => response.json())
  .then((data) => {
    for (i = 0; i < data.length; i++) {
      locationContainer = document.createElement('section');
      locationContainer.setAttribute("id", "inner-location-container");
      locationContainer.setAttribute("class", "bg-orange-400 relative");
      if (data[i].street != null) {
        let spacedStreet = data[i].street.replace(/ /g, '+');;
        locationContainer.innerHTML = locationContainer.innerHTML + (`<iframe
        class="w-full mt-4 rounded-lg"
        width="1800"
        height="250"
        frameborder="0" style="border:0"
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAHXC5hqdUUZf7FwQ_DnsfJ09qlk3xbick&q=${spacedStreet},${data[i].city},${stateValue}">
      </iframe>`)
      }
      locationContainer.innerHTML = locationContainer.innerHTML + ("<h1 class='text-2xl'>" + data[i].name + "</h1>");
      locationContainer.innerHTML = locationContainer.innerHTML + ("<h3 class='text-sm text-gray-600 mb-10'>" + data[i].street + "<h3>");
      let capitalizedState = data[i].state[0].toUpperCase() + data[i].state.substring(1);
      locationContainer.innerHTML = locationContainer.innerHTML + (`<div id='bar-tag' class='text-left inline md:absolute mr-2 md:left-2 md:top-[10px] border-solid rounded-[20px] border-2 p-2 mb-4 w-fit'><span class="material-symbols-outlined text-sm">
      sell
      </span> ${capitalizedState}</div>`);
      if (data[i].brewery_type !== null) {
        capitalizedType = data[i].brewery_type[0].toUpperCase() + data[i].brewery_type.substring(1);
        locationContainer.innerHTML = locationContainer.innerHTML + (`<div id='bar-tag' class='text-left inline md:absolute md:left-2 md:top-[60px] border-solid rounded-[20px] border-2 p-2 mb-4 w-fit'><span class="material-symbols-outlined text-sm">
        sell
        </span> ${capitalizedType}</div>`);
        }
      if (data[i].website_url !== null) {
        locationContainer.innerHTML = locationContainer.innerHTML + (`<br><button class='border-solid mt-10 rounded-lg border-2 p-2'><a href='${data[i].website_url}' target="_blank" rel="noopener noreferrer">Website</button>`);
        }
        if (data[i].website_url !== null && data[i].phone !== null) {
          locationContainer.innerHTML = locationContainer.innerHTML + (`<div id='button-divider' class='inline ml-2 mr-2'></div>`);
        }
        if (data[i].phone == null) {
          locationContainer.innerHTML = locationContainer.innerHTML + "<br>";
        }
        if (data[i].phone !== null) {
          locationContainer.innerHTML = locationContainer.innerHTML + (`<button class='border-solid rounded-lg border-2 p-2'><a href='tel:${data[i].phone}'>Call</button><br>`);
        }
      locationsGrabbed.appendChild(locationContainer);
      console.log(data[i].name);
    }
    if (data.length == 0) {
      document.getElementById("locations-grabbed").innerHTML = "<p class='text-center mt-10'>No locations found! Please try again.</p>";
    }
  })
}


function convertToFullState() {
  if (document.getElementById("state-search-bar").value == "AL" || document.getElementById("state-search-bar").value == "al") {
    document.getElementById("state-search-bar").value = "Alabama";
  }
  if (document.getElementById("state-search-bar").value == "AK" || document.getElementById("state-search-bar").value == "ak") {
    document.getElementById("state-search-bar").value = "Alaska";
  }
  if (document.getElementById("state-search-bar").value == "AZ" || document.getElementById("state-search-bar").value == "az") {
    document.getElementById("state-search-bar").value = "Arizona";
  }
  if (document.getElementById("state-search-bar").value == "AR" || document.getElementById("state-search-bar").value == "ar") {
    document.getElementById("state-search-bar").value = "Arkansas";
  }
  if (document.getElementById("state-search-bar").value == "CA" || document.getElementById("state-search-bar").value == "ca") {
    document.getElementById("state-search-bar").value = "California";
  }
  if (document.getElementById("state-search-bar").value == "CO" || document.getElementById("state-search-bar").value == "co") {
    document.getElementById("state-search-bar").value = "Colorado";
  }
  if (document.getElementById("state-search-bar").value == "CT" || document.getElementById("state-search-bar").value == "ct") {
    document.getElementById("state-search-bar").value = "Connecticut";
  }
  if (document.getElementById("state-search-bar").value == "DE" || document.getElementById("state-search-bar").value == "de") {
    document.getElementById("state-search-bar").value = "Delaware";
  }
  if (document.getElementById("state-search-bar").value == "FL" || document.getElementById("state-search-bar").value == "fl") {
    document.getElementById("state-search-bar").value = "Florida";
  }
  if (document.getElementById("state-search-bar").value == "GA" || document.getElementById("state-search-bar").value == "ga") {
    document.getElementById("state-search-bar").value = "Georgia";
  }
  if (document.getElementById("state-search-bar").value == "HI" || document.getElementById("state-search-bar").value == "hi") {
    document.getElementById("state-search-bar").value = "Hawaii";
  }
  if (document.getElementById("state-search-bar").value == "ID" || document.getElementById("state-search-bar").value == "id") {
    document.getElementById("state-search-bar").value = "Idaho";
  }
  if (document.getElementById("state-search-bar").value == "IL" || document.getElementById("state-search-bar").value == "il") {
    document.getElementById("state-search-bar").value = "Illinois";
  }
  if (document.getElementById("state-search-bar").value == "IN" || document.getElementById("state-search-bar").value == "in") {
    document.getElementById("state-search-bar").value = "Indiana";
  }
  if (document.getElementById("state-search-bar").value == "IA" || document.getElementById("state-search-bar").value == "ia") {
    document.getElementById("state-search-bar").value = "Iowa";
  }
  if (document.getElementById("state-search-bar").value == "KS" || document.getElementById("state-search-bar").value == "ks") {
    document.getElementById("state-search-bar").value = "Kansas";
  }
  if (document.getElementById("state-search-bar").value == "KY" || document.getElementById("state-search-bar").value == "ky") {
    document.getElementById("state-search-bar").value = "Kentucky";
  }
  if (document.getElementById("state-search-bar").value == "LA" || document.getElementById("state-search-bar").value == "la") {
    document.getElementById("state-search-bar").value = "Lousiana";
  }
  if (document.getElementById("state-search-bar").value == "ME" || document.getElementById("state-search-bar").value == "me") {
    document.getElementById("state-search-bar").value = "Maine";
  }
  if (document.getElementById("state-search-bar").value == "MD" || document.getElementById("state-search-bar").value == "md") {
    document.getElementById("state-search-bar").value = "Maryland";
  }
  if (document.getElementById("state-search-bar").value == "MA" || document.getElementById("state-search-bar").value == "ma") {
    document.getElementById("state-search-bar").value = "Massachusetts";
  }
  if (document.getElementById("state-search-bar").value == "MI" || document.getElementById("state-search-bar").value == "mi") {
    document.getElementById("state-search-bar").value = "Michigan";
  }
  if (document.getElementById("state-search-bar").value == "MN" || document.getElementById("state-search-bar").value == "mn") {
    document.getElementById("state-search-bar").value = "Minnesota";
  }
  if (document.getElementById("state-search-bar").value == "MS" || document.getElementById("state-search-bar").value == "ms") {
    document.getElementById("state-search-bar").value = "Mississippi";
  }
  if (document.getElementById("state-search-bar").value == "MT" || document.getElementById("state-search-bar").value == "mt") {
    document.getElementById("state-search-bar").value = "Montana";
  }
  if (document.getElementById("state-search-bar").value == "NE" || document.getElementById("state-search-bar").value == "ne") {
    document.getElementById("state-search-bar").value = "Nevada";
  }
  if (document.getElementById("state-search-bar").value == "NH" || document.getElementById("state-search-bar").value == "nh") {
    document.getElementById("state-search-bar").value = "New Hampshire";
  }
  if (document.getElementById("state-search-bar").value == "NJ" || document.getElementById("state-search-bar").value == "nj") {
    document.getElementById("state-search-bar").value = "New Jersey";
  }
  if (document.getElementById("state-search-bar").value == "NM" || document.getElementById("state-search-bar").value == "nm") {
    document.getElementById("state-search-bar").value = "New Mexico";
  }
  if (document.getElementById("state-search-bar").value == "NY" || document.getElementById("state-search-bar").value == "ny") {
    document.getElementById("state-search-bar").value = "New York";
  }
  if (document.getElementById("state-search-bar").value == "NC" || document.getElementById("state-search-bar").value == "nc") {
    document.getElementById("state-search-bar").value = "North Carolina";
  }
  if (document.getElementById("state-search-bar").value == "ND" || document.getElementById("state-search-bar").value == "nd") {
    document.getElementById("state-search-bar").value = "North Dakota";
  }
  if (document.getElementById("state-search-bar").value == "OH" || document.getElementById("state-search-bar").value == "oh") {
    document.getElementById("state-search-bar").value = "Ohio";
  }
  if (document.getElementById("state-search-bar").value == "OK" || document.getElementById("state-search-bar").value == "ok") {
    document.getElementById("state-search-bar").value = "Oklahoma";
  }
  if (document.getElementById("state-search-bar").value == "OR" || document.getElementById("state-search-bar").value == "or") {
    document.getElementById("state-search-bar").value = "Oregon";
  }
  if (document.getElementById("state-search-bar").value == "PA" || document.getElementById("state-search-bar").value == "pa") {
    document.getElementById("state-search-bar").value = "Pennsylvania";
  }
  if (document.getElementById("state-search-bar").value == "RI" || document.getElementById("state-search-bar").value == "ri") {
    document.getElementById("state-search-bar").value = "Rhode Island";
  }
  if (document.getElementById("state-search-bar").value == "SC" || document.getElementById("state-search-bar").value == "sc") {
    document.getElementById("state-search-bar").value = "South Carolina";
  }
  if (document.getElementById("state-search-bar").value == "SD" || document.getElementById("state-search-bar").value == "sd") {
    document.getElementById("state-search-bar").value = "South Dakota";
  }
  if (document.getElementById("state-search-bar").value == "TN" || document.getElementById("state-search-bar").value == "tn") {
    document.getElementById("state-search-bar").value = "Tennessee";
  }
  if (document.getElementById("state-search-bar").value == "TX" || document.getElementById("state-search-bar").value == "tx") {
    document.getElementById("state-search-bar").value = "Texas";
  }
  if (document.getElementById("state-search-bar").value == "UT" || document.getElementById("state-search-bar").value == "ut") {
    document.getElementById("state-search-bar").value = "Utah";
  }
  if (document.getElementById("state-search-bar").value == "VT" || document.getElementById("state-search-bar").value == "vt") {
    document.getElementById("state-search-bar").value = "Vermont";
  }
  if (document.getElementById("state-search-bar").value == "VA" || document.getElementById("state-search-bar").value == "va") {
    document.getElementById("state-search-bar").value = "Virginia";
  }
  if (document.getElementById("state-search-bar").value == "WA" || document.getElementById("state-search-bar").value == "wa") {
    document.getElementById("state-search-bar").value = "Washington";
  }
  if (document.getElementById("state-search-bar").value == "WV" || document.getElementById("state-search-bar").value == "wv") {
    document.getElementById("state-search-bar").value = "West Virginia";
  }
  if (document.getElementById("state-search-bar").value == "WI" || document.getElementById("state-search-bar").value == "wi") {
    document.getElementById("state-search-bar").value = "Wisconsin";
  }
  if (document.getElementById("state-search-bar").value == "WY" || document.getElementById("state-search-bar").value == "wy") {
    document.getElementById("state-search-bar").value = "Wyoming";
  }
}
