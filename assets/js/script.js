fetch('https://api.openbrewerydb.org/breweries?by_city=Richmond')
  .then((response) => response.json())
  .then((data) => console.log(data));