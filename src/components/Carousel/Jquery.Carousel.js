// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

(function ($) {
  $.fn.Carousel = function () {
    /** Go through each Carousel we've been given. */
      return this.each(function () {
        var $thisCarousel = $(this);
        var $slides = $thisCarousel.find('.ms-Carousel-slide');
        var $pagination = $(this).find('.ms-Carousel-pagination');
        var $paginationButton = $pagination.find('.ms-Carousel-paginationButton').clone(); // Clone a copy of the example pagination
        var $rightButton = $thisCarousel.find('.ms-Carousel-rightArrow');
        var $leftButton = $thisCarousel.find('.ms-Carousel-leftArrow');
        var $slideWidth = 830;
        var currentSlideNum;
        var prevSlideNum;
        var nextSlideNum;
        var timeoutId;
        var slideTiming = 1000;
        var cSlideLeftPos;
        var pSlideLeftPos;
        var nSlideLeftPos;

        var slideLeftOut40 = 'ms-u-slideLeftOut40';
        var slideLeftIn40 = 'ms-u-slideLeftIn40';
        var slideRightOut40 = 'ms-u-slideRightOut40';
        var slideRightIn40 = 'ms-u-slideRightIn40';

        var slideLeftOut80 = 'ms-u-slideLeftOut80';
        var slideLeftIn80 = 'ms-u-slideLeftIn80';
        var slideRightOut80 = 'ms-u-slideRightOut80';
        var slideRightIn80 = 'ms-u-slideRightIn80';

        var isHiddenClass = 'is-hidden';

        var animationLayerOneClass = "ms-Carousel-animationLayerOne";
        var animationLayerTwoClass = "ms-Carousel-animationLayerTwo";

        // Find all slides and store them
        function prepare() {
          //Empty the pagination div
          $pagination.html('');
        }

        function buildControls() {
          $rightButton.unbind();
          $rightButton.click(function() {
            moveSlide("next");
            clearInterval(timeoutId);
          });

          $leftButton.unbind();
          $leftButton.click(function() {
            moveSlide("previous");
            clearInterval(timeoutId); // Maybe the user will want to control it themselves. 
          });
        }

        function startAutoSlide() {
          timeoutId = setInterval(function() {
            moveSlide("right");
          }, slideTiming);
        }

        function addPaginationButton(slideNumber) {
          var $paginationButtonClone = $paginationButton.clone();
          var $paginationClass = "ms-Carousel-paginationButton-" + slideNumber;
          // Setup pagination
          $paginationButtonClone.click(function() {
            moveSlideTo(slideNumber);
          });

          //Add pagination button for the current slide
          $pagination.append($paginationButtonClone.addClass($paginationClass).attr('data-slide', slideNumber));
        }

        function setActivePagination(slideNumber) {
          // Remove all Active classes
          var $pButtons = $thisCarousel.find('.ms-Carousel-paginationButton');
          var $pButton = $pButtons.eq(slideNumber);

          $pButtons.removeClass('is-active');
          $pButton.addClass('is-active');
        }

        function buildSlides() {
          // Make sure slides exist
          if($slides.length > 0) {
            // Go through each slide
            $slides.each(function( sIndex ) {
              var $currentSlide = $(this);
              addPaginationButton(sIndex);

              if(sIndex !== 0) {
                // Hide all slides
                $currentSlide.hide();
              }
            });

            setCurrentSlide(0);
            setActivePagination(0);
            settupPrevNextSlides();
          }
        }

        function setCurrentSlide(slideNumber) {
          currentSlideNum = slideNumber;
        }

        function moveSlideTo(slideNumber) {
          if(currentSlideNum !== slideNumber) {
            
            if (slideNumber > currentSlideNum) {
              // Make the next slide the new one and move them
              setNextSlide(slideNumber);
              animateAllSlides("right");
            } else {
              // Make the next slide the new one and move them
              setPreviousSlide(slideNumber);
              animateAllSlides("left");
            }

            setCurrentSlide(slideNumber);
            setActivePagination(slideNumber);
            settupPrevNextSlides();
          }

        }

        function moveSlide(directionAction) {
          // Check for the direction
          if(directionAction === "next") {
            // If the next slide doesn't exist
            if ((currentSlideNum + 1) > ($slides.length - 1)) {
              animateAllSlides("right");
              setCurrentSlide(0);
            } else {
              animateAllSlides("right");
              setCurrentSlide(currentSlideNum + 1);
            }
            setActivePagination(currentSlideNum);
            settupPrevNextSlides();

          } else if(directionAction === "previous") {

            if((currentSlideNum - 1) < 0) {
              animateAllSlides("left");
              setCurrentSlide($slides.length - 1);
            } else {
              animateAllSlides("left");
              setCurrentSlide(currentSlideNum - 1);
            }
            setActivePagination(currentSlideNum);
            settupPrevNextSlides();
          }
        }

        // Animation Functions
        function animateAllSlides(direction) {

          var $cSlide = $slides.eq(currentSlideNum);
          var $cSlideI = ($cSlide.index() - 1);
          var $nSlide = $slides.eq(nextSlideNum);
          var $pSlide = $slides.eq(prevSlideNum);

          if(direction === "right") {

            // Fade out Current Slides LayerOne
            $cSlide.find('.' + animationLayerOneClass).addClass(slideLeftOut80);
            $cSlide.find('.' + animationLayerTwoClass).addClass(slideLeftOut40);

            // Add new Background color
            $thisCarousel.css({
            'background-color': $nSlide.data('bgcolor')
            });

            setTimeout(function() {
            // Clean out the current styles
            clearSlideStyles($cSlideI);

            // Add Classes to next slide
            $nSlide.show();

            $nSlide.find('.' + animationLayerOneClass).addClass(slideLeftIn80);
            $nSlide.find('.' + animationLayerTwoClass).addClass(slideLeftIn40);
            }, 300);
            
          } else if(direction === "left") {

            $cSlide.find('.' + animationLayerOneClass).addClass(slideRightOut80);
            $cSlide.find('.' + animationLayerTwoClass).addClass(slideRightOut40);

            // Add new Background color
            $thisCarousel.css({
              'background-color': $pSlide.data('bgcolor')
            });

            setTimeout(function() {
              // Clean out the current styles
              clearSlideStyles($cSlideI);

              // Add Classes to next slide
              $pSlide.show();

              $pSlide.find('.' + animationLayerOneClass).addClass(slideRightIn80);
              $pSlide.find('.' + animationLayerTwoClass).addClass(slideRightIn40);

            }, 300);

          }
        }

        // Clear positions
        function clearSlideStyles(slideNumber) {
          $slides.eq(slideNumber).find('.' + animationLayerOneClass)
            .removeClass(slideLeftOut80)
            .removeClass(slideLeftIn80)
            .removeClass(slideRightIn80) 
            .removeClass(slideRightOut80)
            .addClass(isHiddenClass);

          $slides.eq(slideNumber).find('.' + animationLayerTwoClass)
            .removeClass(slideLeftOut40)
            .removeClass(slideLeftIn40)
            .removeClass(slideRightIn40) 
            .removeClass(slideRightOut40)
            .addClass(isHiddenClass);

          $slides.eq(slideNumber).hide();
        }

        function calcSlidePositions() {
          // Calculate left position
          var parentCenterWidth = $thisCarousel.width() / 2;
          var slideCenterWidth = $slideWidth / 2;

          // Set static positions
          cSlideLeftPos = parentCenterWidth - slideCenterWidth;
          pSlideLeftPos = -(cSlideLeftPos + $slideWidth);
          nSlideLeftPos = cSlideLeftPos + $slideWidth + cSlideLeftPos;
        }

        function setPreviousSlide(slideNumber) {
          prevSlideNum = slideNumber;
        }

        function setNextSlide(slideNumber) {
          nextSlideNum = slideNumber;
        }

        function settupPrevNextSlides() {
          // Setup The Next Slide Index
          if(currentSlideNum + 1 > ($slides.length - 1)) {
            setNextSlide(0);
          } else {
            setNextSlide(currentSlideNum + 1);
          }

          // Setup the Previous Slide Index
          if(currentSlideNum - 1 < 0) {
            setPreviousSlide($slides.length - 1);
          } else {
            setPreviousSlide(currentSlideNum - 1);
          }
        }

        function start() {
          prepare();
          buildSlides();
          currentSlideNum = 0;
          calcSlidePositions(currentSlideNum);
          buildControls();
          startAutoSlide();
        }

        start();
      });
    };
})(jQuery);