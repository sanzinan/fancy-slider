const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");

// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
  loadingVisibility();
  
};


 const getImages = (query) => {
   loadingVisibility();
   fetch(
      `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
    )
      .then((response) => response.json())

     .then((data) => {
      if (data.total === 0) {
    const showError = document.getElementById("show-error");
    let error = "";
    error = `<h2 class="error-part">Sorry! We didn't find any picture... <br> Please enter meaningful name what you are looking for... </h2> `;
    showError.innerHTML = error;
  } else {
    showImages(data.hits);
  }
})

   .catch((err) => console.log(err));
};




let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);

  if (item === -1) {
    sliders.push(img);
    element.classList.add("added");
  } else {
    sliders.splice(item, 1);
    element.classList.remove("added");
  }

  // Updating Badge
  const badge = document.getElementById("imageSelected");
  badge.innerText = "" + sliders.length;
};
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    showError("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  document.getElementById("imageSelected").innerHTML = "" + 0;
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  let duration = document.getElementById("duration").value || 1;
  duration = Math.abs(duration);
  duration == 0 ? (duration = 1000) : (duration = duration * 1000);

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image area
  imagesArea.style.display = "none";

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

// Listen 'Enter' Key press Event
const searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }

});

searchBtn.addEventListener("click", function () {

  
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
  

});

sliderBtn.addEventListener("click", function () {
  createSlider();
});

const showError = (text) => {
  const errorDialog = document.getElementById("alert-dialog");
  errorDialog.innerHTML = text;
  errorDialog.style.transition = "all 1s ease";
  errorDialog.style.display = "block";
  errorDialog.style.height = "100%";

  setTimeout(() => {
    errorDialog.style.height = "0%";
    errorDialog.style.display = "none";
  }, 2500);
};

 function loadingVisibility(visible) {
  const spinner = document.getElementById("loading");
  spinner.classList.toggle("d-none");
}

const validateData = (e) => {
  const data = e.value;
  if (data < 0) {
    showError(`${data} will be converted into ${Math.abs(data)} seconds`);
  }
};




