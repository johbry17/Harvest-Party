// set home logo randomly
function setHomeLogo(data) {
  // get unique years, chose a random year, set the path
  const years = [...new Set(data.map((d) => parseInt(d.Year)))];
  const randomYear = years[Math.floor(Math.random() * years.length)];
  const logoPath = `./resources/images/hp_logos/hp_${randomYear}.jpg`;

  const homeLink = document.getElementById("home-link");
  const logoImage = document.createElement("img");

  // set logo image
  logoImage.src = logoPath;
  logoImage.alt = `Harvest Party ${randomYear} Logo`;
  logoImage.classList.add("home-logo");

  // clear previous logo and add new one
  homeLink.innerHTML = "";
  homeLink.appendChild(logoImage);
}

// roll mask across 2020 view
function rollMask() {
    const masks = document.querySelectorAll("#mask-container .mask");
  
    // reset and run animations for all masks
    masks.forEach(mask => {
        mask.style.display = "block"; // show mask
        mask.style.animation = "none"; // remove any existing animation
        mask.offsetHeight; // trigger reflow, so animation starts from the beginning
    });

    // set random heights for each mask, between 10% and 80% of viewport height
    const randomHeight1 = Math.random() * 70 + 10;
    const randomHeight2 = Math.random() * 70 + 10;
    const randomHeight3 = Math.random() * 70 + 10;

    // apply heights to each mask
    masks[0].style.top = `${randomHeight1}vh`;
    masks[1].style.top = `${randomHeight2}vh`;
    masks[2].style.top = `${randomHeight3}vh`;

    // reapply animation
    masks.forEach(mask => {
        mask.style.animation = `roll-across 5s linear forwards`; // apply animation
    });
}

// what it says on the tin. display one image
function displaySingleImage(imagePath) {
  const carouselDiv = document.querySelector(".carousel-images");
  // clear previous images
  carouselDiv.innerHTML = "";

  // add image
  const img = document.createElement("img");
  img.src = imagePath;
  carouselDiv.appendChild(img);
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
