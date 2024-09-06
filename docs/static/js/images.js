// set home logo randomly
function setHomeLogo(data) {
  // get unique years, chose a random year, set the path
  const uniqueYears = [...new Set(data.map((d) => parseInt(d.Year)))];
  const randomYear =
    uniqueYears[Math.floor(Math.random() * uniqueYears.length)];
  const logoPath = `./static/images/hp_logos/hp_${randomYear}.jpg`;

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

    // set random height between 10% and 80% of viewport height
    const randomHeight = Math.random() * 70 + 10;
    mask.style.top = `${randomHeight}vh`;

    // stagger start times and animate each mask
    const delay = index * 0.6;
    mask.style.animation = `roll-across 7s ease-in-out forwards ${delay}s`;
    // cubic-bezier css function - cubic-bezier(time1, speed1, time2, speed2)
    // ease: cubic-bezier(0.25, 0.1, 0.25, 1) // Starts slowly, speeds up, and then slows down towards the end.
    // linear: cubic-bezier(0, 0, 1, 1) // Progresses at a constant speed (a straight line).
    // ease-in: cubic-bezier(0.42, 0, 1, 1) // Starts slowly and then speeds up. 
    // ease-out: cubic-bezier(0, 0, 0.58, 1) // Starts quickly and then slows down. 
    // ease-in-out: cubic-bezier(0.42, 0, 0.58, 1) // Combines both ease-in and ease-out; starts slowly, speeds up, then slows down.

    // hide the mask once the animation ends
    mask.addEventListener(
      "animationend",
      function () {
        mask.style.display = "none";
      },
      { once: true }
    ); // ensure the event listener is removed after it runs
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
    home: [
      "./static/images/hp_pics/hp11.jpg",
      "./static/images/hp_pics/hp5.jpg",
      "./static/images/hp_pics/hp60.jpg",
      "./static/images/hp_pics/hp9.jpg",
      "./static/images/hp_pics/hp10.jpg",
      "./static/images/hp_pics/hp7.jpg",
      "./static/images/hp_pics/hp101.jpg",
      "./static/images/hp_pics/hp13.jpg",
      "./static/images/hp_pics/hp17.jpg",
      "./static/images/hp_pics/hp85.jpg",
      "./static/images/hp_pics/hp16.jpg",
      "./static/images/hp_pics/hp6.jpg",
      "./static/images/hp_pics/hp18.jpg",
      "./static/images/hp_pics/hp8.jpg",
      "./static/images/hp_pics/hp4.jpg",
      "./static/images/hp_pics/hp12.jpg",
      "./static/images/hp_pics/hp14.jpg",
      "./static/images/hp_pics/hp15.jpg",
      "./static/images/hp_pics/hp19.jpg",
      "./static/images/hp_pics/hp79.jpg",
      "./static/images/hp_pics/hp3.jpg",
      "./static/images/hp_pics/hp1.jpg",
      "./static/images/hp_pics/hp84.jpg",
      "./static/images/hp_pics/hp106.jpg",
      "./static/images/hp_pics/hp49.jpg",
      "./static/images/hp_pics/hp29.jpg",
      "./static/images/hp_pics/hp64.jpg",
      "./static/images/hp_pics/hp20.jpg",
      "./static/images/hp_pics/hp31.jpg",
      "./static/images/hp_pics/hp46.jpg",
      "./static/images/hp_pics/hp109.jpg",
      "./static/images/hp_pics/hp87.jpg",
      "./static/images/hp_pics/hp34.jpg",
      "./static/images/hp_pics/hp44.jpg",
      "./static/images/hp_pics/hp104.jpg",
      "./static/images/hp_pics/hp45.jpg",
      "./static/images/hp_pics/hp58.jpg",
      "./static/images/hp_pics/hp51.jpg",
      "./static/images/hp_pics/hp83.jpg",
      "./static/images/hp_pics/hp105.jpg",
      "./static/images/hp_pics/hp53.jpg",
      "./static/images/hp_pics/hp50.jpg",
      "./static/images/hp_pics/hp68.jpg",
      "./static/images/hp_pics/hp70.jpg",
      "./static/images/hp_pics/hp38.jpg",
      "./static/images/hp_pics/hp67.jpg",
      "./static/images/hp_pics/hp36.jpg",
      "./static/images/hp_pics/hp2.jpg",
      "./static/images/hp_pics/hp91.jpg",
      "./static/images/hp_pics/hp33.jpg",
      "./static/images/hp_pics/hp48.jpg",
      "./static/images/hp_pics/hp102.jpg",
      "./static/images/hp_pics/hp32.jpg",
      "./static/images/hp_pics/hp99.jpg",
      "./static/images/hp_pics/hp97.jpg",
      "./static/images/hp_pics/hp80.jpg",
      "./static/images/hp_pics/hp76.jpg",
      "./static/images/hp_pics/hp59.jpg",
      "./static/images/hp_pics/hp42.jpg",
      "./static/images/hp_pics/hp39.jpg",
      "./static/images/hp_pics/hp62.jpg",
      "./static/images/hp_pics/hp22.jpg",
      "./static/images/hp_pics/hp66.jpg",
      "./static/images/hp_pics/hp61.jpg",
      "./static/images/hp_pics/hp73.jpg",
      "./static/images/hp_pics/hp86.jpg",
      "./static/images/hp_pics/hp89.jpg",
      "./static/images/hp_pics/hp77.jpg",
      "./static/images/hp_pics/hp35.jpg",
      "./static/images/hp_pics/hp40.jpg",
      "./static/images/hp_pics/hp24.jpg",
      "./static/images/hp_pics/hp30.jpg",
      "./static/images/hp_pics/hp28.jpg",
      "./static/images/hp_pics/hp78.jpg",
      "./static/images/hp_pics/hp100.jpg",
      "./static/images/hp_pics/hp103.jpg",
      "./static/images/hp_pics/hp98.jpg",
      "./static/images/hp_pics/hp96.jpg",
      "./static/images/hp_pics/hp94.jpg",
      "./static/images/hp_pics/hp93.jpg",
      "./static/images/hp_pics/hp92.jpg",
      "./static/images/hp_pics/hp25.jpg",
      "./static/images/hp_pics/hp26.jpg",
      "./static/images/hp_pics/hp23.jpg",
      "./static/images/hp_pics/hp63.jpg",
      "./static/images/hp_pics/hp47.jpg",
      "./static/images/hp_pics/hp65.jpg",
      "./static/images/hp_pics/hp108.jpg",
      "./static/images/hp_pics/hp110.jpg",
      "./static/images/hp_pics/hp111.jpg",
      "./static/images/hp_pics/hp107.jpg",
      "./static/images/hp_pics/hp82.jpg",
      "./static/images/hp_pics/hp90.jpg",
      "./static/images/hp_pics/hp75.jpg",
      "./static/images/hp_pics/hp69.jpg",
      "./static/images/hp_pics/hp71.jpg",
      "./static/images/hp_pics/hp72.jpg",
      "./static/images/hp_pics/hp56.jpg",
      "./static/images/hp_pics/hp41.jpg",
      "./static/images/hp_pics/hp55.jpg",
      "./static/images/hp_pics/hp37.jpg",
      "./static/images/hp_pics/hp27.jpg",
      "./static/images/hp_pics/hp57.jpg",
      "./static/images/hp_pics/hp54.jpg",
      "./static/images/hp_pics/hp81.jpg",
      "./static/images/hp_pics/hp88.jpg",
      "./static/images/hp_pics/hp43.jpg",
      "./static/images/hp_pics/hp74.jpg",
      "./static/images/hp_pics/hp52.jpg",
    ],
    total: [
      "./static/images/hp_pics/1.jpg",
      "./static/images/hp_pics/2.jpg",
      "./static/images/hp_pics/3.jpg",
      "./static/images/hp_pics/4.jpg",
      "./static/images/hp_pics/5.jpg",
      "./static/images/hp_pics/6.jpg",
      "./static/images/hp_pics/hp29.jpg",
      "./static/images/hp_pics/hp22.jpg",
      "./static/images/hp_pics/hp59.jpg",
      "./static/images/hp_pics/hp10.jpg",
      "./static/images/hp_pics/hp33.jpg",
      "./static/images/hp_pics/hp80.jpg",
      "./static/images/hp_pics/hp102.jpg",
      "./static/images/hp_pics/hp106.jpg",
      "./static/images/hp_pics/hp70.jpg",
      "./static/images/hp_pics/hp51.jpg",
      "./static/images/hp_pics/hp45.jpg",
      "./static/images/hp_pics/hp12.jpg",
      "./static/images/hp_pics/hp46.jpg",
      "./static/images/hp_pics/hp16.jpg",
      "./static/images/hp_pics/hp8.jpg",
      "./static/images/hp_pics/hp5.jpg",
      "./static/images/hp_pics/hp13.jpg",
      "./static/images/hp_pics/hp19.jpg",
      "./static/images/hp_pics/hp36.jpg",
      "./static/images/hp_pics/hp39.jpg",
      "./static/images/hp_pics/hp34.jpg",
      "./static/images/hp_pics/hp49.jpg",
      "./static/images/hp_pics/hp48.jpg",
      "./static/images/hp_pics/hp42.jpg",
      "./static/images/hp_pics/hp46.jpg",
      "./static/images/hp_pics/hp44.jpg",
      "./static/images/hp_pics/hp79.jpg",
      "./static/images/hp_pics/hp59.jpg",
      "./static/images/hp_pics/hp58.jpg",
      "./static/images/hp_pics/hp31.jpg",
      "./static/images/hp_pics/hp50.jpg",
      "./static/images/hp_pics/hp60.jpg",
      "./static/images/hp_pics/hp67.jpg",
      "./static/images/hp_pics/hp61.jpg",
      "./static/images/hp_pics/hp62.jpg",
      "./static/images/hp_pics/hp83.jpg",
      "./static/images/hp_pics/hp84.jpg",
      "./static/images/hp_pics/hp76.jpg",
      "./static/images/hp_pics/hp73.jpg",
      "./static/images/hp_pics/hp77.jpg",
      "./static/images/hp_pics/hp105.jpg",
      "./static/images/hp_pics/hp87.jpg",
      "./static/images/hp_pics/hp86.jpg",
      "./static/images/hp_pics/hp99.jpg",
      "./static/images/hp_pics/hp104.jpg",
      "./static/images/hp_pics/hp32.jpg",
      "./static/images/hp_pics/hp109.jpg",
      "./static/images/hp_pics/hp106.jpg",
      "./static/images/hp_pics/hp74.jpg",
      "./static/images/hp_pics/hp37.jpg",
      "./static/images/hp_pics/hp52.jpg",
    ],
  };

  return imageSets[imageSet] || [];
}
