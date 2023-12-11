const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// Initially Variable needed
let currentTab = userTab; //current-tab means oldTab
const API_key =  "7335fbcf674faa7cb262f742f730c570";
currentTab.classList.add("current-tab");
getfromSessionStrorage();

function switchTab(clickedTab){ //clicked tab means new tab
  if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab; //oldTab = newTab
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
    else{
      //main pahle search wale tab me tha , ab your weather wale tab visible karna h
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first
      //for coordinates, if we have saved them there.
      getfromSessionStrorage();

    }
  }
}

userTab.addEventListener("click", ()=>{
  //pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
  //pass clicked tab as input parameter
  switchTab(searchTab);
});


//check if coordinates are already present in session storage
function getfromSessionStrorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates) {
    //agar local coordinates nahi mile tab
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const {lat, lon} = coordinates;
  //make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loder visible
  loadingScreen.classList.add("active");


  //API CALL
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
      );
      const data = await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
  }
  catch(err){
    loadingScreen.classList.remove("active");
    handleWeatherFetchError();
  }

}


function renderWeatherInfo(weatherInfo) {
  //firstly, we have to fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherInfo object and put in UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    //HW -Show an alert for no geolocation support available
  }
}


function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coodinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if(cityName === "") 
    return;
  else
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
    handleWeatherFetchError();
  }
}


// function handleWeatherFetchError() {
//   loadingScreen.classList.remove("active");
//   userInfoContainer.classList.remove("active");
//   grantAccessContainer.classList.remove("active");

//   const errorContainer = document.querySelector(".error-container");
//   const errorImage = errorContainer.querySelector("[data-errorImage]");
//   const errorMessage = errorContainer.querySelector("[data-errorMessage]");

//   errorImage.src = "./assets/not-found.png";
//   errorMessage.innerText = "City not found";

//   errorContainer.classList.add("active");
// };

