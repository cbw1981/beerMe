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
let outputState = '';

function convertToAbbreviation(stateName) {
  var states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
];

stateName = stateName.toUpperCase();
for(i = 0; i < states.length; i++) {
    if(states[i][1] == stateName) {
      let storedState = states[i][0];
      console.log(storedState);
    }
  }
}

if (localStorage.getItem('previousSearches') !== undefined) {
  for (i = 0; i < storedSearches.length; i++) {
    searchContainer.innerHTML = searchContainer.innerHTML + `<button class='search-button m-2 p-1' onclick='replaceSearch("${storedSearches[i][0]}", "${storedSearches[i][1]}");'>${storedSearches[i][0] + ", " + storedSearches[i][1]}</button>`;
  }
}

function getTotalBreweries() {
  fetch('https://api.openbrewerydb.org/breweries' + storedLocation + `&page=${totalBreweries}&per_page=10`)
  .then((response) => response.json())
  .then((data) => {
    totalBreweries = totalBreweries + 1;
    console.log(totalBreweries);
    if (data.length > 0) {
      getTotalBreweries();
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
      searchBreweries(document.getElementById('city-search-bar').value, currentPage, false);
    }
  }
  if (amount == 1) {
    if (currentPage !== totalPages) {
      currentPage = currentPage + amount;
      searchBreweries(document.getElementById('city-search-bar').value, currentPage, false);
    }
  }
}

function replaceSearch(city, state) {
  document.getElementById("city-search-bar").value = city;
  document.getElementById("state-search-bar").value = state;
  searchBreweries(document.getElementById('city-search-bar').value, 1, false)
}

function searchBreweries(searchValue, page, store) {
  
  
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
    if (store == true) {
      if (currentSearchLog < searchLogLimit) {
          previousSearchesArray.push([cityName = searchValue, stateName = document.getElementById("state-search-bar").value])
          currentSearchLog = currentSearchLog + 1;
        }
        else {
          previousSearchesArray.shift();
          previousSearchesArray.push([cityName = searchValue, stateName = document.getElementById("state-search-bar").value])
          currentSearchLog = currentSearchLog + 1;
        }
        
      localStorage.setItem('previousSearches', JSON.stringify(previousSearchesArray));
      console.log("previoussearchesarray " + previousSearchesArray);
      storedSearches = JSON.parse(localStorage.getItem("previousSearches"));
      console.log(storedSearches + "storedsearches");
      console.log(currentSearchLog + "log1");

      if (localStorage.getItem('previousSearches') !== undefined) {
        if (!(storedSearches.length == searchLogLimit)) {
            if (stateValue !== undefined) {
              searchContainer.innerHTML = searchContainer.innerHTML + `<button class='search-button m-2 p-1' onclick='replaceSearch("${storedSearches[currentSearchLog][0]}", "${storedSearches[currentSearchLog][1]}");'>${storedSearches[currentSearchLog][0] + ", " + storedSearches[currentSearchLog][1]}</button>`;
            } 
        }
        console.log(currentSearchLog);
      }
    }

    for (i = 0; i < data.length; i++) {
      locationContainer = document.createElement('section');
      locationContainer.setAttribute("id", "inner-location-container");
      locationContainer.setAttribute("class", "bg-zinc-800 relative grid grid-cols-7 p-0 mt-10 rounded-lg grid-rows-1");
      leftColumn = document.createElement('section');
      leftColumn.setAttribute("id", "left-column");
      leftColumn.setAttribute("class", "md:col-span-2 col-span-7");
      rightColumn = document.createElement('section');
      rightColumn.setAttribute("id", "right-column");
      rightColumn.setAttribute("class", "md:col-span-4 col-span-7 pt-[10px]");

      if (data[i].street !== undefined) {
        let spacedStreet = data[i].street.replace(/ /g, '+');;
        leftColumn.innerHTML = leftColumn.innerHTML + (`<iframe
        class="rounded-lg md:rounded-r-none md:rounded-b-none max-md:rounded-b-none w-full h-full"
        id="google-map min-h-[250px]"
        width="200"
        height="250"
        frameborder="0" style="border:0"
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAHXC5hqdUUZf7FwQ_DnsfJ09qlk3xbick&q=${spacedStreet},${data[i].city},${data[i].state}">
      </iframe>`)
      } else {
        leftColumn.innerHTML = leftColumn.innerHTML + `<div class="h-[250px] w-full bg-gray-700 max-md:rounded-t-lg md:rounded-l-lg rounded-r-none relative"><p class="absolute top-1/2 left-1/2 text-center -translate-x-1/2 -translate-y-1/2">No map available.</p></div>`
      }
      rightColumn.innerHTML = rightColumn.innerHTML + ("<h1 class='text-2xl text-left pl-4'>" + data[i].name + "</h1>");
      if (data[i].street !== null) {
        rightColumn.innerHTML = rightColumn.innerHTML + ("<h3 class='text-left text-sm text-gray-600 pl-4'>" + data[i].street + "<h3>");
      } else {
        rightColumn.innerHTML = rightColumn.innerHTML + ("<h3 class='text-left text-sm text-gray-600 pl-4'>No street found.</h3>");
      }
      rightColumn.innerHTML = rightColumn.innerHTML + ("<h3 class='text-left text-sm text-gray-600 mb-10 pl-4'>" + data[i].city + "<h3>");
      let capitalizedState = data[i].state[0].toUpperCase() + data[i].state.substring(1);
      rightColumn.innerHTML = rightColumn.innerHTML + (`<div id='bar-tag' class='text-left inline md:absolute md:right-2 md:top-[10px] border-solid rounded-[20px] border-2 p-2 max-md:mr-2 ml-2 w-fit'><span class="material-symbols-outlined text-sm">
      sell
      </span> ${capitalizedState}</div>`);
      if (data[i].brewery_type !== null) {
        capitalizedType = data[i].brewery_type[0].toUpperCase() + data[i].brewery_type.substring(1);
        rightColumn.innerHTML = rightColumn.innerHTML + (`<div id='bar-tag' class='text-left inline md:absolute md:right-2 md:top-[60px] border-solid rounded-[20px] border-2 p-2 w-fit'><span class="material-symbols-outlined text-sm">
        sell
        </span> ${capitalizedType}</div>`);
        }

      
        

      document.getElementById("previous-searches-container").appendChild(searchContainer);
      locationsGrabbed.appendChild(locationContainer);
      locationContainer.appendChild(leftColumn);
      locationContainer.appendChild(rightColumn);
      locationContainer.innerHTML = locationContainer.innerHTML + `<br class='max-md:hidden'><button id="more-info" class="w-[700%] ml-0 max-md:mt-8 p-4 bg-red-600 rounded-b-lg" onclick="showMoreInfo('${data[i].name}', '${data[i].street}', '${data[i].city}', '${data[i].state}', '${data[i].country}', '${data[i].phone}', '${data[i].website_url}');">More Info</div>`;
      
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

function showMoreInfo(name, street, city, state, country, phone, website) {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer sp-mvayoOWfVv8Xu3Z9Pk_07izScmov58heqpF3fg7BCd2KfaxNVzbe4whtbzvzTbJnmzL2XNBrvM9xvcGGD2Ko1HJBvRlLdq2UXtS84-IrvGGfPvY68aFqzXkSsY3Yx'
    }
  };

  modalBackgroundShader = document.createElement("div");
  modalBackgroundShader.setAttribute("class", "w-full h-full bg-black opacity-30 fixed top-0 left-0");
  moreInfoModal = document.createElement("div");
  moreInfoModal.setAttribute("class", "rounded-lg max-md:w-[300px] max-md:h-auto pb-8 md:w-[600px] md:h-[500px] bg-zinc-800 fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]");
  moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<button class="absolute top-2 right-2"><span class="material-symbols-outlined text-white" onclick="closeInfo();">close</span></button>`
  moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<h1 class="text-2xl text-left text-white pl-4 pt-8">${name}</h1>`
  moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<h3 class="text-md text-left text-gray-600 pl-4 pt-1">${street}</h3>`
  moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<h3 class="text-md text-left text-gray-600 pl-4">${city}, ${state}</h3>`
  fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/matches?name=${name}&address1=${street}&city=${city}&state=va&country=US&limit=3&match_threshold=default`, options)
  .then(searchresponse => searchresponse.json())
  .then(searchresponse => {
    console.log(searchresponse.businesses[0].id)
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${searchresponse.businesses[0].id}`, options)
  .then(response => response.json())
  .then(response => {
    console.log(response)
    moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<h3 class="text-md text-left text-white pl-4 pt-2 align-middle"><span class="material-symbols-outlined align-middle text-white text-sm">star</span><div class="inline vertical-align">${response.rating}/5, ${response.price}</h3>`;
    if (response.is_closed == false) {
      moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<h3 class="text-md text-left text-green-600 pl-4 pt-2 align-middle">Now Open</h3>`;
    }
    else {
      moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<h3 class="text-md text-left text-red-600 pl-4 pt-2 align-middle">Closed</h3>`;
    }
    moreInfoModal.innerHTML = moreInfoModal.innerHTML + (`<iframe
  class="rounded-lg p-4 max-md:w-full md:w-[400px] h-200"
  id="google-map min-h-[250px]"
  width="200"
  height="250"
  frameborder="0" style="border:0"
  referrerpolicy="no-referrer-when-downgrade"
  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAHXC5hqdUUZf7FwQ_DnsfJ09qlk3xbick&q=${street},${city},United States">
</iframe>`)
  if (website !== undefined) {
    moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<a href="${website}" target="_blank" rel="noopener noreferrer" class="text-white pl-4"><button class="rounded-full bg-red-600 p-2">Website</button></a>`;
  }
  if (phone !== undefined) {
    moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<a href="tel:${phone}" class="text-white pl-4"><button class="rounded-full bg-red-600 p-2">Call</button></a>`;
  }
  moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<a href="${response.url}" target="_blank" rel="noopener noreferrer" class="text-white pl-4"><button class="rounded-full bg-red-600 p-2">Open on Yelp</button></a>`
  })
  .catch(err => console.error(err));
  })
  .catch(err => {
    console.error(err)
    moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<h3 class="text-md text-left text-white pl-4 pt-2 align-middle">No Yelp information available.</h3>`;
    moreInfoModal.innerHTML = moreInfoModal.innerHTML + (`<iframe
    class="rounded-lg p-4 max-md:w-full md:w-[400px] h-200"
    id="google-map min-h-[250px]"
    width="200"
    height="250"
    frameborder="0" style="border:0"
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAHXC5hqdUUZf7FwQ_DnsfJ09qlk3xbick&q=${street},${city},United States">
  </iframe>`)
    if (website !== undefined) {
      moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<a href="${website}" target="_blank" rel="noopener noreferrer" class="text-white pl-4"><button class="rounded-full bg-red-600 p-2">Website</button></a>`;
    }
    if (phone !== undefined) {
      moreInfoModal.innerHTML = moreInfoModal.innerHTML + `<a href="tel:${phone}" class="text-white pl-4"><button class="rounded-full bg-red-600 p-2">Call</button></a>`;
    }
    }
  );
  document.body.appendChild(modalBackgroundShader);
  document.body.appendChild(moreInfoModal);
  convertToAbbreviation(state);
}

function closeInfo() {
  modalBackgroundShader.remove();
  moreInfoModal.remove();
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

    
}