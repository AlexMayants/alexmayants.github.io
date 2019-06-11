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

  function updatePlaceholder($input) {
    var $placeholder = $('.sh-form__placeholder').filter('[for="' + $input.prop('id') + '"]'),
        val = $input.val(),
        placeholder = $input.data('placeholder'),
        html = val.replace(/x+/g, function (found, pos) {
          return '</span><span class="sh-form__placeholder-remaining">' +
            placeholder.substr(pos, found.length) +
          '</span><span class="sh-form__placeholder-entered">';
        });

    $placeholder.html('<span class="sh-form__placeholder-entered">' + html + '</span>');
  }

  function sendPhoneNumber(number, callback) {
    // TODO
    setTimeout(function () {
      callback(true);
    });
  }

  function submitPhoneForm() {
    var number = $('.sh-get-code').serializeArray()[0].value;

    sendPhoneNumber(number, function (result) {
      if (result) {
        $('.sh-login__phone-result').removeClass('sh-result--error').html('👍 На ваш номер отправлен код подтверждения').show();
        $('.sh-enter-code .sh-form__text').first().focus();
      } else {
        $('.sh-login__phone-result').addClass('sh-result--error').html('👎 Что-то пошло не так').show();
      }
    });
  }

  function sendSmsCode(code, callback) {
    // TODO
    setTimeout(function () {
      callback(true);
    });
  }

  function submitCodeForm() {
    var code = $('.sh-enter-code').serializeArray().map(function (item) { return item.value; }).join('');

    sendSmsCode(code, function (result) {
      if (result) {
        $('.sh-login__or-get-code-header').hide();
        $('.sh-login__get-code-header').hide();
        $('.sh-get-code').hide();
        $('.sh-login__enter-code-header').hide();
        $('.sh-enter-code').hide();
        $('.sh-login__phone-result').hide();
        $('.sh-login__code-result').removeClass('sh-result--error').html('👍 Номер телефона добавлен').show();
      } else {
        $('.sh-login__code-result').addClass('sh-result--error').html('👎 Что-то пошло не так').show();
      }
    });
  }

  function maybeSubmitCodeForm() {
    var values = $('.sh-enter-code').serializeArray();

    if (values.every(function (item) {
      return item.value;
    })) {
      submitCodeForm();
    }
  }

  function initForm() {
    $(document).on('input', '.sh-form__text', function () {
      var $this = $(this);

      $this.toggleClass('sh-form__text--filled', !!$this.val());
    });

    $(document).on({
      input: function () {
        updatePlaceholder($(this));
      },
      focus: function () {
        var $placeholder = $('.sh-form__placeholder').filter('[for="' + $(this).prop('id') + '"]');

        $placeholder.addClass('sh-form__placeholder--active');
      },
      blur: function () {
        var $placeholder = $('.sh-form__placeholder').filter('[for="' + $(this).prop('id') + '"]');

        $placeholder.removeClass('sh-form__placeholder--active');
      }
    }, '.sh-form__text--with-placeholder');

    $('.sh-form [data-inputmask]').inputmask({
      placeholder: 'x',
      showMaskOnHover: false
    });

    $('.sh-get-code').on('submit', function (evt) {
      evt.preventDefault();
      submitPhoneForm();
    });

    $('.sh-enter-code').on('keydown', '.sh-form__text', function (evt) {
      var $this = $(this);

      if (['0','1','2','3','4','5','6','7','8','9','ArrowLeft','ArrowRight','Backspace','Delete','Enter','Tab','Home','End'].indexOf(evt.key) < 0) {
        evt.preventDefault();
      }

      if (evt.key === 'ArrowLeft' && this.selectionStart === 0) {
        $this.prev().focus();
      }

      if (evt.key === 'ArrowRight' && this.selectionStart === this.value.length) {
        $this.next().focus();
      }

      if (['0','1','2','3','4','5','6','7','8','9'].indexOf(evt.key) >= 0) {
        if (this.value.length) {
          evt.preventDefault();
        }

        setTimeout(function () {
          $this.next().focus();
        });
      }

      if (evt.key === 'Backspace') {
        setTimeout(function () {
          $this.prev().focus();
        });
      }
    });

    $('.sh-enter-code').on('input', '.sh-form__text', function (evt) {
      if (!this.value.match(/^[0-9]+$/g)) {
        this.value = this.value.replace(/[^0-9]/g, '')[0] || '';
      }

      maybeSubmitCodeForm();
    });

    $('.sh-enter-code').on('submit', function (evt) {
      evt.preventDefault();
      submitCodeForm();
    });
  }

  function loginViaSocnet(code, callback) {
    // TODO
    setTimeout(function () {
      callback('Александр');
    });
  }

  function initSocial() {
    $('.sh-login-social').on('click', '.sh-login-social__button', function () {
      loginViaSocnet($(this).data('socnet-code'), function (name) {
        $('.sh-login-social').hide();
        $('.sh-login__social-header').hide();
        $('.sh-login__social-result').html('👍 ' + name + ', Вы вошли!').show();

        $('.sh-login__or-get-code-header').hide();
        $('.sh-login__get-code-header').show();

        $('.sh-order__button').prop('disabled', false);
        $('.sh-order__error').hide();
      });
    });
  }

  window.sh = {
    initMenu: initMenu,
    initFeatures: initFeatures,
    highlightFeature: highlightFeature,
    initSliders: initSliders,
    initSocial: initSocial,
    initForm: initForm
  };
})(document, window);
