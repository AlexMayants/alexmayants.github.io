(function (document, window) {
  function toggleMenu(open) {
    var $button = $('.sh-top-menu__button');

    $button.attr('src', $button.data('src-' + open));
    $('.sh-menu').toggleClass('sh-menu--active', open);
    $('body').toggleClass('sh-body--no-scroll', open);
  }

  function initMenu() {
    $('.sh-top-menu__button').on('click', function () {
      toggleMenu(!$('.sh-menu').hasClass('sh-menu--active'));
    });
    $('.sh-menu__features').on('click', '.sh-menu__feature-link', function (evt) {
      toggleMenu(false);
    });
    $('.sh-menu__items').on('click', '.sh-menu__link', function () {
      toggleMenu(false);
    });
    $('.sh-menu__social').on('click', 'a', function () {
      toggleMenu(false);
    });
  }

  var selectedFeature = null;

  function highlightFeature(feature) {
    var selectedItem, selectedText;

    $('.sh-boat-features__item--active').removeClass('sh-boat-features__item--active');
    $('.sh-boat-feature-text--active').removeClass('sh-boat-feature-text--active');
    $('.sh-menu__feature--active').removeClass('sh-menu__feature--active');

    selectedFeature = feature;

    $('.sh-boat-features__item[data-feature-name="' + selectedFeature + '"]').addClass('sh-boat-features__item--active');
    $('.sh-boat-feature-text[data-feature-name="' + selectedFeature + '"]').addClass('sh-boat-feature-text--active');
    $('.sh-menu__feature[data-feature-name="' + selectedFeature + '"]').addClass('sh-menu__feature--active');
  }

  function initFeatures() {
    $('.sh-boat-features').on('click', '.sh-boat-features__item', function (evt) {
      highlightFeature($(this).data('feature-name'));
    });
    $('.sh-menu__features').on('click', '.sh-menu__feature-link', function (evt) {
      highlightFeature($(this).data('feature-name'));
    });
  }

  function initSliders() {
    var $photoSlider = $('.sh-team-slider__photo-slider'),
        $textSlider = $('.sh-team-slider__text-slider');

    $photoSlider.owlCarousel({
      center: true,
      items: 1.85,
      loop: true,
      margin: 50,
      dots: false
    });
    $textSlider.owlCarousel({
      center: true,
      items: 1,
      loop: true,
      dots: false
    });

    var transitioning = false;

    $photoSlider.on('changed.owl.carousel', function (evt) {
      var prop = evt.property;

      if (prop && prop.name === 'position' && !transitioning) {
        transitioning = true;
        $textSlider.trigger('to.owl.carousel', [prop.value - 2, undefined, true])
        transitioning = false;
      }
    });

    $textSlider.on('changed.owl.carousel', function (evt) {
      var prop = evt.property;

      if (prop && prop.name === 'position' && !transitioning) {
        transitioning = true;
        $photoSlider.trigger('to.owl.carousel', [prop.value - 2, undefined, true])
        transitioning = false;
      }
    })
  }

  function initForm() {
    $(document).on('input', '.sh-form__text', function () {
      var $this = $(this);

      $this.toggleClass('sh-form__text--filled', !!$this.val());
    });
  }

  window.sh = {
    initMenu: initMenu,
    initFeatures: initFeatures,
    highlightFeature: highlightFeature,
    initSliders: initSliders,
    initForm: initForm
  };
})(document, window);
