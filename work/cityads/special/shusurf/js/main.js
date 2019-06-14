(function (document, window, $) {
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
        $textSlider.trigger('to.owl.carousel', [prop.value - 2, undefined, true]);
        transitioning = false;
      }
    });

    $textSlider.on('changed.owl.carousel', function (evt) {
      var prop = evt.property;

      if (prop && prop.name === 'position' && !transitioning) {
        transitioning = true;
        $photoSlider.trigger('to.owl.carousel', [prop.value - 2, undefined, true]);
        transitioning = false;
      }
    });
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
        $('.sh-login__phone-result').removeClass('sh-result--error').text('👍 На ваш номер отправлен код подтверждения').show();
        $('.sh-enter-code .sh-form__text').first().focus();
      } else {
        $('.sh-login__phone-result').addClass('sh-result--error').text('👎 Что-то пошло не так').show();
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
        $('.sh-login__get-code-header').hide();
        $('.sh-get-code').hide();
        $('.sh-login__enter-code-header').hide();
        $('.sh-enter-code').hide();
        $('.sh-login__phone-result').hide();
        $('.sh-login__code-result').removeClass('sh-result--error').text('👍 Номер телефона добавлен').show();
      } else {
        $('.sh-login__code-result').addClass('sh-result--error').text('👎 Что-то пошло не так').show();
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

  function sendName(name, callback) {
    // TODO
    setTimeout(function () {
      callback(name);
    });
  }

  function submitNameForm() {
    var name = $('.sh-enter-name').serializeArray()[0].value;

    sendName(name, function (name) {
      displayUserName(name);
    });
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

    $('.sh-enter-name').on('submit', function (evt) {
      evt.preventDefault();
      submitNameForm();
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
        $this.prev().focus().select();
      }

      if (evt.key === 'ArrowRight' && this.selectionStart === this.value.length) {
        $this.next().focus().select();
      }

      if (['0','1','2','3','4','5','6','7','8','9'].indexOf(evt.key) >= 0) {
        if (this.value.length) {
          evt.preventDefault();
        }

        setTimeout(function () {
          $this.next().focus().select();
        });
      }

      if (evt.key === 'Backspace') {
        setTimeout(function () {
          $this.prev().focus().select();
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

  function getMonthData(callback) {
    // TODO
    setTimeout(function () {
      callback({
        dates: [
          "2019-05-27",
          "2019-05-28",
          "2019-05-29",
          "2019-05-30",
          "2019-05-31",
          "2019-06-01",
          "2019-06-02",
          "2019-06-03",
          "2019-06-04",
          "2019-06-05",
          "2019-06-06",
          "2019-06-07",
          "2019-06-08",
          "2019-06-09"
        ],
        selected: {
          "2019-05-29": ['23:30']
        },
        unavailable: [
          "2019-05-28",
          "2019-06-01"
        ]
      });
    }, 500);
  }

  var MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var WEEKEND_DAYS = [6,0];
  var WEEK_LENGTH = 7;

  var MAX_SETS = 4;
  var selectedSets = [];
  var currentDate = null;

  function displayMonthData(monthData) {
    var firstDate = new Date(monthData.dates[0]),
        lastDate = new Date(monthData.dates[monthData.dates.length - 1]);

    $('.sh-book__month-header').text(firstDate.getMonth() === lastDate.getMonth() ?
      MONTHS[firstDate.getMonth()] + ' ' + firstDate.getFullYear() :
      MONTHS[firstDate.getMonth()] + '-' + MONTHS[lastDate.getMonth()].toLowerCase() + ' ' + firstDate.getFullYear()
    );

    var dateChunks = [];

    for (var i = 0; i < monthData.dates.length; i += WEEK_LENGTH) {
      dateChunks.push(monthData.dates.slice(i, i + WEEK_LENGTH));
    }

    var html = dateChunks.map(function (dates) {
      return '<tr>' +
        dates.map(function (date) {
          var d = new Date(date);

          return '<td' +
            ' data-date="' + date + '"' +
            ' class="sh-calendar__cell ' +
              ((monthData.selected[date] && monthData.selected[date].length) ? ' sh-calendar__cell--selected sh-calendar__cell--current' : '') +
              (monthData.unavailable.indexOf(date) >= 0 ? ' sh-calendar__cell--unavailable' : '') +
              (WEEKEND_DAYS.indexOf(d.getDay()) >= 0 ? ' sh-calendar__cell--weekend' : '') +
            '"' +
          '>' + d.getDate() + '</td>';
        }).join('') +
      '</tr>';
    });

    $('.sh-book__month-table tbody').html(html);
    $('.sh-book__month').show();
  }

  function getDayData(date, callback) {
    setTimeout(function () {
      callback([
        {
          name: 'Утро',
          price: 'Стандарт: 4500 ₽, Абонемент: 4000 ₽',
          dates: ["9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"],
          selected: [],
          unavailable: ["22:00"]
        },
        {
          name: 'Вечер',
          price: 'Стандарт: 5500 ₽, Абонемент: 5000 ₽',
          isNight: true,
          dates: ["23:30", "00:00", "00:30", "01:00", "01:30", "02:00"],
          selected: date === '2019-05-29' ? ["23:30"] : [],
          unavailable: []
        }
      ]);
    }, 500);
  }

  var HOUR_ROW_WIDTH = 6;
  var MONTHS_OF_YEAR = ['января','Февраля','Марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var DAYS_OF_WEEK = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

  function displayDayData(date, dayData) {
    var html = dayData.map(function (dayPart) {
          var dateChunks = [];

          for (var i = 0; i < dayPart.dates.length; i += HOUR_ROW_WIDTH) {
            dateChunks.push(dayPart.dates.slice(i, i + HOUR_ROW_WIDTH));
          }

          return '<tbody>' +
            '<tr><td colspan="6" class="sh-calendar__daytime"><div class="ca-daytime-header">' +
              '<span class="ca-daytime-header__name">' + dayPart.name + '</span>' +
              '<span class="ca-daytime-header__price">' + dayPart.price + '</span>' +
            '</div></td></tr>' +
            dateChunks.map(function (hours) {
              var hoursRow = hours.map(function (hour) {
                    return '<td' +
                      ' data-time="' + hour + '"' +
                      ' class="sh-calendar__cell' +
                        (dayPart.isNight ? ' sh-calendar__cell--night' : '') +
                        (dayPart.unavailable.indexOf(hour) >= 0 ? ' sh-calendar__cell--unavailable' : '') +
                        (dayPart.selected.indexOf(hour) >= 0 ? ' sh-calendar__cell--current' : '') +
                        (selectedSets.filter(function (set) { return set.date === date && set.time === hour; }).length > 0 ? ' sh-calendar__cell--selected' : '') +
                      '"' +
                    '>' + hour + '</td>';
                  }).join('');

              for (var i = hours.length; i < HOUR_ROW_WIDTH; i++) {
                hoursRow += '<td class="sh-calendar__cell' + (dayPart.isNight ? ' sh-calendar__cell--night' : '') + '"></td>';
              }

              return '<tr>' +
                hoursRow +
              '</tr>';
            }).join('') +
          '</tbody>';
        });

    var d = new Date(date);

    $('.sh-book__day-header').text(d.getDate() + ' ' + MONTHS_OF_YEAR[d.getMonth()] + ', ' + DAYS_OF_WEEK[d.getDay()]);
    $('.sh-book__day-table').html(html);
    $('.sh-book__day').show();
  }

  function displaySelectedSets() {
    var dates = [],
        times = [];

    selectedSets.sort(function (a, b) {
      if (a.date > b.date) { return 1; }
      if (a.date < b.date) { return -1; }

      if (a.time > b.time) { return 1; }
      if (a.time < b.time) { return -1; }

      return 0;
    });

    selectedSets.forEach(function (set) {
      if (dates.indexOf(set.date) < 0) {
        dates.push(set.date);
      }

      times.push(set.time);
    });

    $('.sh-order-summary__item--date .sh-order-summary__item-value').text(dates.map(function (date) {
      var d = new Date(date);
      return d.getDate() + ' ' + MONTHS_OF_YEAR[d.getMonth()];
    }).join(', '));

    $('.sh-order-summary__item--time .sh-order-summary__item-value').text(times.join(', '));
  }

  function initCalendar() {
    getMonthData(function (monthData) {
      for (var date in monthData.selected) {
        if (monthData.selected.hasOwnProperty(date)) {
          var selectedTimes = monthData.selected[date];

          selectedTimes.forEach(function (time) {
            selectedSets = selectedSets.filter(function (set) { return !(set.date === date && set.time === time); });
            selectedSets.push({
              date: date, 
              time: time
            });
          });
        }
      }

      displayMonthData(monthData);
      displaySelectedSets();
    });

    $('.sh-book__month-table').on('click', '.sh-calendar__cell', function () {
      var $this = $(this),
          date = $this.data('date');

      if ($this.hasClass('sh-calendar__cell--unavailable') || $this.is(':empty')) {
        return;
      }

      currentDate = date;

      $('.sh-book__month-table').find('.sh-calendar__cell.sh-calendar__cell--selected').not('.sh-calendar__cell--current').each(function () {
        var date = $(this).data('date'),
            thisDateSets = selectedSets.filter(function (set) { return set.date === date; });

        if (thisDateSets.length === 0) {
          $(this).removeClass('sh-calendar__cell--selected');
        }
      });

      $this.addClass('sh-calendar__cell--selected sh-calendar__cell--in-progress');

      getDayData(date, function (dayData) {
        if (currentDate !== date) { return; }

        $this.removeClass('sh-calendar__cell--in-progress');

        dayData.forEach(function (dayPart) {
          dayPart.selected.forEach(function (time) {
            selectedSets = selectedSets.filter(function (set) { return !(set.date === date && set.time === time); });
            selectedSets.push({
              date: date, 
              time: time
            });
          });
        });

        displayDayData(date, dayData);
        displaySelectedSets();
      });
    });

    $('.sh-book__day-table').on('click', '.sh-calendar__cell', function () {
      var $this = $(this),
          time = $this.data('time');

      if ($this.hasClass('sh-calendar__cell--unavailable') || $this.is(':empty')) {
        return;
      }

      if ($this.hasClass('sh-calendar__cell--selected')) {
        $this.removeClass('sh-calendar__cell--selected sh-calendar__cell--current');
        selectedSets = selectedSets.filter(function (set) { return !(set.date === currentDate && set.time === time); });
        displaySelectedSets();
        return;
      }

      if (selectedSets.length >= MAX_SETS) {
        return;
      }

      $this.addClass('sh-calendar__cell--selected');
      selectedSets = selectedSets.filter(function (set) { return !(set.date === currentDate && set.time === time); });
      selectedSets.push({
        date: currentDate, 
        time: time
      });

      displaySelectedSets();
    });
  }

  function loginViaSocnet(code, callback) {
    // TODO
    setTimeout(function () {
      callback('Александр');
    });
  }

  function displayUserName(name) {
      $('.sh-login-social').hide();
      $('.sh-login__social-header').hide();
      $('.sh-login__social-result').text('👍 ' + name + ', Вы вошли!').show();

      $('.sh-login__or-name-header').hide();
      $('.sh-login__name-header').hide();
      $('.sh-enter-name').hide();
      $('.sh-enter-name .sh-form__text').val(name);
  }

  function initSocial() {
    $('.sh-login-social').on('click', '.sh-login-social__button', function () {
      loginViaSocnet($(this).data('socnet-code'), function (name) {
        displayUserName(name);

        $('.sh-order__button').prop('disabled', false);
        $('.sh-order__error').hide();
      });
    });

    $('.sh-login__social-result').on('click', function () {
      $('.sh-login__name-header').show();
      $('.sh-enter-name').show();
    });
  }

  window.sh = {
    initMenu: initMenu,
    initFeatures: initFeatures,
    highlightFeature: highlightFeature,
    initSliders: initSliders,
    initSocial: initSocial,
    initCalendar: initCalendar,
    initForm: initForm
  };
})(document, window, jQuery);
