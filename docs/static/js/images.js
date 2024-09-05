// set home logo randomly
function setHomeLogo(data) {
  // get unique years, chose a random year, set the path
  const uniqueYears = [...new Set(data.map((d) => parseInt(d.Year)))];
  const randomYear =
    uniqueYears[Math.floor(Math.random() * uniqueYears.length)];
  const logoPath = `./resources/images/hp_logos/hp_${randomYear}.jpg`;

  // insert logo
  const homeLink = document.getElementById("home-link");
  homeLink.innerHTML = `<img src="${logoPath}" alt="Harvest Party ${randomYear} Logo" class="home-logo">`;
}

// roll mask across 2020 view
function rollMask() {
  const masks = document.querySelectorAll("#mask-container .mask");

  // reset and run animations for all masks
  masks.forEach((mask, index) => {
    mask.style.display = "block"; // show mask
    mask.style.animation = "none"; // reset animation
    mask.offsetHeight; // trigger reflow, restart animation

    // set random height between 10% and 60% of viewport height
    const randomHeight = Math.random() * 50 + 10;
    mask.style.top = `${randomHeight}vh`;

    // stagger start times and animate each mask
    const delay = index * 0.6;
    mask.style.animation = `roll-across 7s linear forwards ${delay}s`;
  });
}

// what it says on the tin. display one image
function displaySingleImage(imagePath) {
  const carouselDiv = document.querySelector(".carousel-images");
  carouselDiv.innerHTML = `<img src="${imagePath}">`;
}

// carousel for multiple images, auto-changing
function displayMultipleImages(imageSet) {
  const carouselDiv = document.querySelector(".carousel-images");
  // clear previous images
  carouselDiv.innerHTML = "";

  // get image array
  const images = getImages(imageSet);

  // add images
  images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("carousel-image");
    img.style.display = index === 0 ? "block" : "none";
    carouselDiv.appendChild(img);
  });

  // rotate through images
  let index = 0;
  const imgElements = carouselDiv.querySelectorAll(".carousel-image");
  setInterval(() => {
    imgElements[index].style.display = "none";
    index = (index + 1) % images.length;
    imgElements[index].style.display = "block";
  }, 5000);
}

// image sets for home and total page
function getImages(imageSet) {
  const imageSets = {
    home: ["./resources/images/welcome.jpg"],
    total: [
      "./resources/images/hp_pics/1.jpg",
      "./resources/images/hp_pics/2.jpg",
      "./resources/images/hp_pics/3.jpg",
      "./resources/images/hp_pics/4.jpg",
      "./resources/images/hp_pics/5.jpg",
      "./resources/images/hp_pics/6.jpg",
    ],
  };

  return imageSets[imageSet] || [];
}
