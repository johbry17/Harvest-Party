function displaySingleImage(imagePath) {
    const carouselDiv = document.querySelector('.carousel-images');
    // clear previous images
    carouselDiv.innerHTML = '';

    const img = document.createElement('img');
    img.src = imagePath;
    carouselDiv.appendChild(img);
}

function displayMultipleImages(imagePaths) {
    const carouselDiv = document.querySelector('.carousel-images');
    // clear previous images
    carouselDiv.innerHTML = '';

    const images = [
        '../resources/images/hp_pics/1.jpg',
        '../resources/images/hp_pics/2.jpg',
        '../resources/images/hp_pics/3.jpg',
        '../resources/images/hp_pics/4.jpg',
        '../resources/images/hp_pics/5.jpg',
        '../resources/images/hp_pics/6.jpg',
    ]

    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('carousel-image');
        img.style.display = index === 0 ? 'block' : 'none';
        carouselDiv.appendChild(img);
    });

    let index = 0;
    const imgElements = carouselDiv.querySelectorAll('.carousel-image');
    setInterval(() => {
        imgElements[index].style.display = 'none';
        index = (index + 1) % images.length;
        imgElements[index].style.display = 'block';
    }, 5000);

}