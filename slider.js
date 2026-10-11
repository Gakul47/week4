class ImageSlider {

    constructor(
        track,
        dotsContainer,
        previousButton,
        nextButton
    ) {

        // Store the main slider elements
        this.track = track;
        this.dotsContainer = dotsContainer;
        this.previousButton = previousButton;
        this.nextButton = nextButton;

        // Get the original slides
        this.originalSlides = Array.from(
            this.track.querySelectorAll(".slide")
        );

        // Number of original slides
        this.slideCount = this.originalSlides.length;

        /*
         * We use cloned slides to create
         * a smoother infinite loop.
         */
        this.cloneSlides();

        /*
         * Because we add a clone before the
         * first slide, the real first slide
         * starts at index 1.
         */
        this.currentIndex = 1;

        /*
         * Keeps track of whether the slider
         * is currently moving.
         */
        this.isMoving = false;

        // Create navigation dots
        this.createDots();

        // Connect buttons and events
        this.bindEvents();

        // Show the first real slide
        this.updateSlider(false);
    }


    /* --------------------------------
       Clone First and Last Slides
    -------------------------------- */

    cloneSlides() {

        // Clone the last original slide
        const lastSlide =
            this.originalSlides[
                this.originalSlides.length - 1
            ].cloneNode(true);

        // Clone the first original slide
        const firstSlide =
            this.originalSlides[0].cloneNode(true);

        /*
         * Add a clone of the last slide
         * before the first slide.
         */
        this.track.prepend(lastSlide);

        /*
         * Add a clone of the first slide
         * after the last slide.
         */
        this.track.append(firstSlide);
    }


    /* --------------------------------
       Create Navigation Dots
    -------------------------------- */

    createDots() {

        // Clear the dots container
        this.dotsContainer.innerHTML = "";

        /*
         * Create one dot for every
         * original slide.
         */
        for (
            let index = 0;
            index < this.slideCount;
            index++
        ) {

            const dot =
                document.createElement("button");

            dot.type = "button";

            dot.className = "dot";

            dot.setAttribute(
                "aria-label",
                `Go to image ${index + 1}`
            );

            /*
             * When a dot is clicked,
             * go to that image.
             */
            dot.addEventListener("click", () => {

                this.goTo(index + 1);

            });

            this.dotsContainer.appendChild(dot);
        }

        this.updateDots();
    }


    /* --------------------------------
       Event Listeners
    -------------------------------- */

    bindEvents() {

        /*
         * Next button
         */
        this.nextButton.addEventListener(
            "click",
            () => {
                this.next();
            }
        );


        /*
         * Previous button
         */
        this.previousButton.addEventListener(
            "click",
            () => {
                this.previous();
            }
        );


        /*
         * After the CSS transition ends,
         * check whether we are on a clone.
         */
        this.track.addEventListener(
            "transitionend",
            () => {

                this.handleLoop();

                this.isMoving = false;

            }
        );


        /*
         * Recalculate the position
         * when the browser is resized.
         */
        window.addEventListener(
            "resize",
            () => {
                this.updateSlider(false);
            }
        );
    }


    /* --------------------------------
       Next Slide
    -------------------------------- */

    next() {

        /*
         * Prevent multiple clicks while
         * an animation is running.
         */
        if (this.isMoving) {
            return;
        }

        this.currentIndex++;

        this.updateSlider(true);

        this.isMoving = true;
    }


    /* --------------------------------
       Previous Slide
    -------------------------------- */

    previous() {

        if (this.isMoving) {
            return;
        }

        this.currentIndex--;

        this.updateSlider(true);

        this.isMoving = true;
    }


    /* --------------------------------
       Go To Specific Slide
    -------------------------------- */

    goTo(index) {

        if (this.isMoving) {
            return;
        }

        this.currentIndex = index;

        this.updateSlider(true);

        this.isMoving = true;
    }


    /* --------------------------------
       Update Slider Position
    -------------------------------- */

    updateSlider(animate = true) {

        /*
         * Get the actual width of one slide.
         *
         * This makes the calculation responsive.
         */
        const slideWidth =
            this.originalSlides[0]
                .getBoundingClientRect()
                .width;


        /*
         * Calculate how far the track
         * should move.
         */
        const distance =
            this.currentIndex * slideWidth;


        /*
         * Turn animation on or off.
         */
        this.track.style.transition =
            animate
                ? "transform 0.45s ease"
                : "none";


        /*
         * Move the track horizontally.
         */
        this.track.style.transform =
            `translateX(-${distance}px)`;


        /*
         * Update the navigation dots.
         */
        this.updateDots();
    }


    /* --------------------------------
       Handle Infinite Loop
    -------------------------------- */

    handleLoop() {

        /*
         * If we moved to the clone after
         * the last real slide...
         */
        if (
            this.currentIndex ===
            this.slideCount + 1
        ) {

            /*
             * Temporarily remove the animation.
             */
            this.track.style.transition = "none";

            /*
             * Move to the real first slide.
             */
            this.currentIndex = 1;

            /*
             * Recalculate position.
             */
            this.updateSlider(false);
        }


        /*
         * If we moved to the clone before
         * the first real slide...
         */
        else if (this.currentIndex === 0) {

            /*
             * Temporarily remove animation.
             */
            this.track.style.transition = "none";

            /*
             * Move to the real last slide.
             */
            this.currentIndex =
                this.slideCount;

            /*
             * Recalculate position.
             */
            this.updateSlider(false);
        }


        /*
         * Update the active dot.
         */
        this.updateDots();
    }


    /* --------------------------------
       Update Active Dot
    -------------------------------- */

    updateDots() {

        const dots =
            this.dotsContainer
                .querySelectorAll(".dot");


        /*
         * Convert the internal slide index
         * into the original slide index.
         */
        let activeIndex =
            this.currentIndex - 1;


        /*
         * If we are on the clone at the end,
         * show the first dot.
         */
        if (
            this.currentIndex ===
            this.slideCount + 1
        ) {
            activeIndex = 0;
        }


        /*
         * If we are on the clone at the beginning,
         * show the last dot.
         */
        if (this.currentIndex === 0) {
            activeIndex =
                this.slideCount - 1;
        }


        /*
         * Update every dot.
         */
        dots.forEach(
            (dot, index) => {

                const isActive =
                    index === activeIndex;

                dot.classList.toggle(
                    "active",
                    isActive
                );

                dot.setAttribute(
                    "aria-current",
                    isActive
                        ? "true"
                        : "false"
                );
            }
        );
    }
}


/* --------------------------------
   Start Slider After HTML Loads
-------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Get required HTML elements.
         */
        const track =
            document.getElementById(
                "sliderTrack"
            );

        const dots =
            document.getElementById(
                "dots"
            );

        const previousButton =
            document.getElementById(
                "prevBtn"
            );

        const nextButton =
            document.getElementById(
                "nextBtn"
            );


        /*
         * Create the ImageSlider object.
         */
        new ImageSlider(
            track,
            dots,
            previousButton,
            nextButton
        );
    }
);