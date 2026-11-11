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
   SLIDESHOW SETTINGS
========================================= */

const DISPLAY_TIME = 7000;

const FADE_TIME = 1400;

const WHITE_PAUSE = 450;



/* =========================================
   INTRO TIMING
========================================= */

/*
RYTK
*/

const INTRO_RYTK_TIME = 1000;


/*
RY + TK
*/

const INTRO_SHORT_TIME = 1000;


/*
Time for initials to physically spread
into their full-name positions.
*/

const INTRO_SPREAD_TIME = 1000;


/*
Time for missing characters to fade in.
*/

const INTRO_REVEAL_TIME = 1000;


/*
Hold complete names briefly in centre.
*/

const INTRO_FULL_HOLD = 750;


/*
Diagonal movement into header.
Must roughly match CSS 1.35s transition.
*/

const INTRO_HEADER_MOVE = 1400;


/*
Small hold once aligned.
*/

const INTRO_HEADER_HOLD = 250;



/* =========================================
   ELEMENTS
========================================= */

const intro =
    document.getElementById("intro");


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

let activeSlide =
    slideA;

let hiddenSlide =
    slideB;

let timer =
    null;

let isTransitioning =
    false;

let imageQueue =
    [];



/* =========================================
   WAIT
========================================= */

function wait(ms) {

    return new Promise(
        (resolve) => {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}



/* =========================================
   PRELOAD ALL IMAGES
========================================= */

function preloadImages() {

    const tasks =
        images.map(
            (src) => {

                return new Promise(
                    (resolve) => {

                        const img =
                            new Image();


                        img.onload =
                            resolve;


                        img.onerror =
                            resolve;


                        img.src =
                            src;

                    }
                );

            }
        );


    return Promise.allSettled(
        tasks
    );

}



/* =========================================
   RANDOM SHUFFLE
========================================= */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        const temp =
            array[i];


        array[i] =
            array[j];


        array[j] =
            temp;

    }


    return array;

}



/* =========================================
   CREATE RANDOM QUEUE
========================================= */

function createImageQueue() {

    const availableImages =
        [];


    for (
        let i = 0;
        i < images.length;
        i++
    ) {

        if (
            i !== currentIndex
        ) {

            availableImages.push(
                i
            );

        }

    }


    imageQueue =
        shuffle(
            availableImages
        );

}



/* =========================================
   GET NEXT RANDOM IMAGE
========================================= */

function getNextImageIndex() {

    if (
        imageQueue.length === 0
    ) {

        createImageQueue();

    }


    return imageQueue.shift();

}



/* =========================================
   PREPARE IMAGE
========================================= */

async function prepareImage(
    element,
    src
) {

    element.src =
        src;


    try {

        await element.decode();

    }

    catch (error) {

        /*
        Continue normally if
        decode() is unsupported.
        */

    }

}



/* =========================================
   CHANGE IMAGE
========================================= */

async function showNextImage() {

    if (
        isTransitioning
    ) {

        return;

    }


    isTransitioning =
        true;


    const nextIndex =
        getNextImageIndex();



    /*
    Prepare next image first.
    */

    await prepareImage(
        hiddenSlide,
        images[nextIndex]
    );



    /*
    Fade current image away.
    */

    activeSlide.classList.remove(
        "active"
    );


    await wait(
        FADE_TIME
    );



    /*
    White pause.
    */

    await wait(
        WHITE_PAUSE
    );



    /*
    Fade next image in.
    */

    hiddenSlide.classList.add(
        "active"
    );


    await wait(
        FADE_TIME
    );



    currentIndex =
        nextIndex;



    /*
    Swap layers.
    */

    const previousSlide =
        activeSlide;


    activeSlide =
        hiddenSlide;


    hiddenSlide =
        previousSlide;



    hiddenSlide.src =
        "";


    isTransitioning =
        false;

}



/* =========================================
   AUTOMATIC SLIDESHOW
========================================= */

function scheduleNextImage() {

    clearTimeout(
        timer
    );


    timer =
        setTimeout(

            async () => {

                await showNextImage();


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

        if (
            isTransitioning
        ) {

            return;

        }


        clearTimeout(
            timer
        );


        await showNextImage();


        scheduleNextImage();

    }
);



/* =========================================
   INTRO
========================================= */

async function runIntro() {

    /*
    Start loading all photographs
    immediately behind the intro.
    */

    const imageLoading =
        preloadImages();



    /*
    -----------------------------------------
    STAGE 1

    RYTK
    -----------------------------------------
    */

    await wait(
        INTRO_RYTK_TIME
    );



    /*
    -----------------------------------------
    STAGE 2

    RY + TK

    RY moves left.
    TK moves right.
    Plus fades into centre.
    -----------------------------------------
    */

    intro.classList.add(
        "stage-2"
    );


    await wait(
        INTRO_SHORT_TIME
    );



    /*
    -----------------------------------------
    STAGE 3A

    Invisible missing letters acquire
    their full widths.

    This physically moves R, Y, T and K
    into the positions they occupy in:

    Riichiro Yamamoto
    Thomas Kerr Bell

    The missing characters are still
    invisible at this moment.
    -----------------------------------------
    */

    intro.classList.add(
        "stage-spread"
    );


    await wait(
        INTRO_SPREAD_TIME
    );



    /*
    -----------------------------------------
    STAGE 3B

    Missing characters fade in.

    Initials remain exactly where
    they already moved to.
    -----------------------------------------
    */

    intro.classList.add(
        "stage-reveal"
    );


    await wait(
        INTRO_REVEAL_TIME
    );



    /*
    Hold complete names briefly.
    */

    await wait(
        INTRO_FULL_HOLD
    );



    /*
    -----------------------------------------
    STAGE 4

    Each element travels independently.

    Riichiro:
    centre → diagonally top-left

    +:
    centre → straight upward

    Thomas:
    centre → diagonally top-right
    -----------------------------------------
    */

    intro.classList.add(
        "stage-header"
    );


    await wait(
        INTRO_HEADER_MOVE
    );



    /*
    At this point the intro text is
    sitting directly over the real header.
    */

    await wait(
        INTRO_HEADER_HOLD
    );



    /*
    Wait for photographs before
    revealing the website.
    */

    await imageLoading;



    /*
    Reveal actual website underneath.
    */

    document.body.classList.add(
        "site-ready"
    );



    /*
    Remove intro overlay gently.
    */

    intro.classList.add(
        "exit"
    );


    await wait(
        750
    );


    intro.remove();



    /*
    Start random slideshow.
    */

    createImageQueue();


    scheduleNextImage();

}



/* =========================================
   START
========================================= */

runIntro();