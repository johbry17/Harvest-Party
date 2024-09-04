// what it says on the tin. display one image
function displaySingleImage(imagePath) {
    const carouselDiv = document.querySelector('.carousel-images');
    // clear previous images
    carouselDiv.innerHTML = '';

    // add image
    const img = document.createElement('img');
    img.src = imagePath;
    carouselDiv.appendChild(img);
}

// carousel for multiple images, auto-changing
function displayMultipleImages(imageSet) {
    const carouselDiv = document.querySelector('.carousel-images');
    // clear previous images
    carouselDiv.innerHTML = '';

    // get image array
    const images = getImages(imageSet);

    // add images
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('carousel-image');
        img.style.display = index === 0 ? 'block' : 'none';
        carouselDiv.appendChild(img);
    });

    // rotate through images
    let index = 0;
    const imgElements = carouselDiv.querySelectorAll('.carousel-image');
    setInterval(() => {
        imgElements[index].style.display = 'none';
        index = (index + 1) % images.length;
        imgElements[index].style.display = 'block';
    }, 5000);
}

// image sets for home and total page
function getImages(imageSet) {
    const imageSets = {
        home: [
            './resources/images/welcome.jpg',
        ],
        total: [
            './resources/images/hp_pics/1.jpg',
            './resources/images/hp_pics/2.jpg',
            './resources/images/hp_pics/3.jpg',
            './resources/images/hp_pics/4.jpg',
            './resources/images/hp_pics/5.jpg',
            './resources/images/hp_pics/6.jpg',
        ]
    };

    return imageSets[imageSet] || [];
}