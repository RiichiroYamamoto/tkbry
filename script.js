/* =========================================
   IMAGES
========================================= */

const images = [
    "images/LL2026_01.jpg",
    "images/LL2026_02.jpg",
    "images/LL2026_03.jpg",
    "images/LL2026_04.jpg",
    "images/LL2026_05.jpg",
    "images/LL2026_06.jpg",
    "images/LL2026_07.jpg",
    "images/LL2026_08.jpg",
    "images/LL2026_09.jpg",
    "images/LL2026_10.jpg",
    "images/LL2026_11.jpg",
    "images/LL2026_12.jpg",
    "images/LL2026_13.jpg",
    "images/LL2026_14.jpg"
];



/* =========================================
   SETTINGS
========================================= */

/*
How long each image stays fully visible.

5000  = 5 seconds
7000  = 7 seconds
10000 = 10 seconds
*/

const DISPLAY_TIME = 5000;


/*
Fade-out and fade-in duration.

Must match the CSS transition duration.
*/

const FADE_TIME = 1500;


/*
White pause between images.

250 = subtle
450 = recommended
700 = stronger pause
*/

const WHITE_PAUSE = 100;



/* =========================================
   ELEMENTS
========================================= */

const frame =
    document.querySelector(".slideshow-frame");


const slideA =
    document.getElementById("slide-a");


const slideB =
    document.getElementById("slide-b");



/* =========================================
   STATE
========================================= */

let currentIndex = 0;


let activeSlide = slideA;


let hiddenSlide = slideB;


let timer = null;


let isTransitioning = false;


/*
Stores the upcoming random sequence.
*/

let imageQueue = [];



/* =========================================
   PRELOAD ALL IMAGES
========================================= */

const preloadedImages = [];


images.forEach((src) => {

    const img = new Image();

    img.src = src;

    preloadedImages.push(img);

});



/* =========================================
   RANDOM SHUFFLE
========================================= */

function shuffle(array) {

    /*
    Fisher-Yates shuffle.
    */

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        const temp = array[i];

        array[i] = array[j];

        array[j] = temp;

    }


    return array;

}



/* =========================================
   CREATE RANDOM IMAGE QUEUE
========================================= */

function createImageQueue() {

    /*
    Generate index numbers for every image
    except the image currently visible.

    This prevents the same image appearing
    twice in a row.
    */

    const availableImages = [];


    for (
        let i = 0;
        i < images.length;
        i++
    ) {

        if (i !== currentIndex) {

            availableImages.push(i);

        }

    }


    /*
    Randomise their order.
    */

    imageQueue =
        shuffle(availableImages);

}



/* =========================================
   GET NEXT RANDOM IMAGE
========================================= */

function getNextImageIndex() {

    /*
    When the queue is empty,
    create another random sequence.
    */

    if (imageQueue.length === 0) {

        createImageQueue();

    }


    /*
    Remove and return the first
    item from the random queue.
    */

    return imageQueue.shift();

}



/* =========================================
   WAIT
========================================= */

function wait(ms) {

    return new Promise((resolve) => {

        setTimeout(resolve, ms);

    });

}



/* =========================================
   PREPARE NEXT IMAGE
========================================= */

async function prepareImage(
    element,
    src
) {

    element.src = src;


    try {

        /*
        Ensure the browser has decoded
        the image before the transition.
        */

        await element.decode();

    }

    catch (error) {

        /*
        Continue normally if decode()
        isn't supported by the browser.
        */

    }

}



/* =========================================
   SHOW NEXT RANDOM IMAGE
========================================= */

async function showNextImage() {

    /*
    Prevent multiple transitions
    happening simultaneously.
    */

    if (isTransitioning) {

        return;

    }


    isTransitioning = true;



    /*
    Pick next image randomly.
    */

    const nextIndex =
        getNextImageIndex();



    /*
    Load the image completely before
    beginning the visible transition.
    */

    await prepareImage(
        hiddenSlide,
        images[nextIndex]
    );



    /*
    STEP 1
    Fade current image to white.
    */

    activeSlide.classList.remove(
        "active"
    );


    await wait(FADE_TIME);



    /*
    STEP 2
    Stay white briefly.
    */

    await wait(WHITE_PAUSE);



    /*
    STEP 3
    Fade new image in.
    */

    hiddenSlide.classList.add(
        "active"
    );


    await wait(FADE_TIME);



    /*
    Update current image index.
    */

    currentIndex = nextIndex;



    /*
    Swap visible and hidden layers.
    */

    const previousSlide =
        activeSlide;


    activeSlide =
        hiddenSlide;


    hiddenSlide =
        previousSlide;



    /*
    Clear old hidden image.
    */

    hiddenSlide.src = "";


    isTransitioning = false;

}



/* =========================================
   AUTOMATIC TIMER
========================================= */

function scheduleNextImage() {

    clearTimeout(timer);


    timer = setTimeout(

        async () => {

            await showNextImage();


            /*
            Start another full display period
            after the new image has appeared.
            */

            scheduleNextImage();

        },

        DISPLAY_TIME

    );

}



/* =========================================
   CLICK → NEXT RANDOM IMAGE
========================================= */

frame.addEventListener(
    "click",

    async () => {

        /*
        Ignore clicks during transition.
        */

        if (isTransitioning) {

            return;

        }


        /*
        Stop automatic timer.
        */

        clearTimeout(timer);



        /*
        Immediately show the next
        random image.
        */

        await showNextImage();



        /*
        Restart automatic timer.
        */

        scheduleNextImage();

    }
);



/* =========================================
   INITIAL RANDOM SEQUENCE
========================================= */

createImageQueue();



/* =========================================
   START
========================================= */

scheduleNextImage();