let searchQuery = document.getElementById("search-bar");
let locationsGrabbed = document.getElementById("locations-grabbed");
let pageCountLocation = document.getElementById("page-count-location");
let rawStateValue = document.getElementById("state-search-bar");
let locationContainer = "";
let stateValue = '';
let cityReplaced = '';
let capitalizedType = '';
let totalBreweries = 0;
let totalPages = 0;
let currentPage = 1;
let storedLocation = "";
var storedSearches = [];
let previousSearchesArray = [];
let currentSearchLog = -1;
let searchLogLimit = 5;

if (localStorage.getItem('previousSearches') !== undefined) {
  if (!(storedSearches.length >= searchLogLimit)) { 
    searchContainer.innerHTML = searchContainer.innerHTML + storedSearches[currentSearchLog]; 
  }
  console.log(storedSearches.length);
}

function getTotalBreweries() {
  fetch('https://api.openbrewerydb.org/breweries' + storedLocation + `&page=${totalBreweries}&per_page=10`)
  .then((response) => response.json())
  .then((data) => {
    totalBreweries = totalBreweries + 1;
    console.log(totalBreweries);
    if (data.length > 0) {
      getTotalBreweries();
      pageCountLocation.innerHTML = "Page count loading...";
    } else {
      totalPages = totalBreweries - 2;
      console.log(totalPages);
      pageCountLocation.innerHTML = pageCountLocation.innerHTML + (`<button class='inline' onclick='incrementPage(-1)'><span class='material-symbols-outlined inline align-middle'>chevron_left</span></button><div class='inline align-middle'>${currentPage} of ${totalPages}</div><button class='inline' onclick='incrementPage(1)'><span class='material-symbols-outlined inline align-middle'>chevron_right</span></button>`);
    }
    
  })
}

function incrementPage(amount) {
  if (amount == -1) {
    if (currentPage !== 1) {
      currentPage = currentPage + amount;
      searchBreweries(document.getElementById('city-search-bar').value, currentPage);
    }
  }
  if (amount == 1) {
    if (currentPage !== totalPages) {
      currentPage = currentPage + amount;
      searchBreweries(document.getElementById('city-search-bar').value, currentPage);
    }
  }
}

function searchBreweries(searchValue, page) {
  
  
  console.log(previousSearchesArray);
  pageCountLocation.innerHTML = "";
  currentPage = page;
  totalBreweries = 0;
  totalPages = 0;
  locationsGrabbed.innerHTML = "";
  cityReplaced = "?by_city=" + searchValue.replace(/ /g, '+');
  convertToFullState();
  if (document.getElementById("state-search-bar").value !== null) {
    stateValue = "&by_state=" + document.getElementById("state-search-bar").value.replace(/ /g, '+');
  }
  storedLocation = cityReplaced + stateValue;
  fetch('https://api.openbrewerydb.org/breweries' + cityReplaced + "&per_page=10" + stateValue + `&page=${page}`)
  .then((response) => response.json())
  .then((data) => {
    for (i = 0; i < data.length; i++) {
      locationContainer = document.createElement('section');
      locationContainer.setAttribute("id", "inner-location-container");
      locationContainer.setAttribute("class", "bg-orange-400 relative grid grid-cols-7 p-0 mt-10 rounded-lg grid-rows-1");
      leftColumn = document.createElement('section');
      leftColumn.setAttribute("id", "left-column");
      leftColumn.setAttribute("class", "col-span-2");
      rightColumn = document.createElement('section');
      rightColumn.setAttribute("id", "right-column");
      rightColumn.setAttribute("class", "col-span-4 pl-4 pt-[10px]");
      if (data[i].street != null) {
        let spacedStreet = data[i].street.replace(/ /g, '+');;
        leftColumn.innerHTML = leftColumn.innerHTML + (`<iframe
        class="rounded-lg rounded-r-none w-full h-full"
        id="google-map min-h-[250px]"
        width="200"
        height="250"
        frameborder="0" style="border:0"
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAHXC5hqdUUZf7FwQ_DnsfJ09qlk3xbick&q=${spacedStreet},${data[i].city},${data[i].state}">
      </iframe>`)
      } else {
        leftColumn.innerHTML = leftColumn.innerHTML + `<div class="h-[250px] w-full bg-gray-700 rounded-lg rounded-r-none relative"><p class="absolute top-1/2 left-1/2 text-center -translate-x-1/2 -translate-y-1/2">No map available.</p></div>`
      }
      rightColumn.innerHTML = rightColumn.innerHTML + ("<h1 class='text-2xl text-left'>" + data[i].name + "</h1>");
      if (data[i].street !== null) {
        rightColumn.innerHTML = rightColumn.innerHTML + ("<h3 class='text-left text-sm text-gray-600'>" + data[i].street + "<h3>");
      } else {
        rightColumn.innerHTML = rightColumn.innerHTML + ("<h3 class='text-left text-sm text-gray-600'>No street found.</h3>");
      }
      rightColumn.innerHTML = rightColumn.innerHTML + ("<h3 class='text-left text-sm text-gray-600 mb-10'>" + data[i].city + "<h3>");
      let capitalizedState = data[i].state[0].toUpperCase() + data[i].state.substring(1);
      rightColumn.innerHTML = rightColumn.innerHTML + (`<div id='bar-tag' class='text-left inline md:absolute md:right-2 md:top-[10px] border-solid rounded-[20px] border-2 p-2 mb-4 w-fit'><span class="material-symbols-outlined text-sm">
      sell
      </span> ${capitalizedState}</div>`);
      if (data[i].brewery_type !== null) {
        capitalizedType = data[i].brewery_type[0].toUpperCase() + data[i].brewery_type.substring(1);
        rightColumn.innerHTML = rightColumn.innerHTML + (`<div id='bar-tag' class='text-left inline md:absolute md:right-2 md:top-[60px] border-solid rounded-[20px] border-2 p-2 mb-4 w-fit'><span class="material-symbols-outlined text-sm">
        sell
        </span> ${capitalizedType}</div>`);
        }
        if (data[i].website_url !== null) {
        rightColumn.innerHTML = rightColumn.innerHTML + (`<br><button class='align-bottom border-solid rounded-lg border-2 p-2'><a href='${data[i].website_url}' target="_blank" rel="noopener noreferrer">Website</button>`);
        }
        if (data[i].website_url !== null && data[i].phone !== null) {
          rightColumn.innerHTML = rightColumn.innerHTML + (`<div id='button-divider' class='inline ml-2 mr-2'></div>`);
        }
        if (data[i].phone == null) {
          rightColumn.innerHTML = rightColumn.innerHTML + "";
        }
        if (data[i].phone !== null && data[i].website_url !== null) {
          rightColumn.innerHTML = rightColumn.innerHTML + (`<button class='align-bottom border-solid rounded-lg border-2 p-2'><a href='tel:${data[i].phone}'>Call</button><br>`);
        }
        if (data[i].phone !== null && data[i].website_url == null) {
          rightColumn.innerHTML = rightColumn.innerHTML + (`<button class='align-bottom border-solid rounded-lg border-2 p-2'><a href='tel:${data[i].phone}'>Call</button><br>`);
        }

      document.getElementById("previous-searches-container").appendChild(searchContainer);
      locationsGrabbed.appendChild(locationContainer);
      locationContainer.appendChild(leftColumn);
      locationContainer.appendChild(rightColumn);
      
      console.log(data[i].name);
    }

    if (data.length !== 0) {
      getTotalBreweries();
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
  
  searchContainer = document.createElement('section');
  searchContainer.setAttribute("id", "inner-search-container");
  if (currentSearchLog < searchLogLimit) {
  previousSearchesArray.push([cityName = document.getElementById('city-search-bar').value, stateName = rawStateValue.value])
  currentSearchLog = currentSearchLog + 1;
  }
    
  localStorage.setItem('previousSearches', JSON.stringify(previousSearchesArray));
  console.log("previoussearchesarray " + previousSearchesArray);
  storedSearches = JSON.parse(localStorage.getItem("previousSearches"));
  console.log(storedSearches + "storedsearches");
  console.log(currentSearchLog + "log1");

  if (localStorage.getItem('previousSearches') !== undefined) {
    searchContainer.innerHTML = searchContainer.innerHTML + storedSearches[currentSearchLog];
    console.log(storedSearches + "log1");
  }
}
