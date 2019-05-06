  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Ошибка при применении промо кода
  function showPromoText( promoText )
  {
    if( promoText )
    {
      $('.js-promo-check-result').text( promoText ).show() ;
    }
    else
    {
      $('.js-promo-check-result').hide() ;
    }
  }
  // showPromoText


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Заполняется .js-weekday-date текстом типа СРЕДА 7 ЯНВАРЯ
  // Заполняет .js-date-month текстом типа 7 ЯНВАРЯ
  function fillAllDates( date )
  {
    var day = date.substr(0,2) ;
    var month0 = parseInt( date.substr(3,2) ) - 1 ;
    var year = date.substr(6,4) ;
    var d = new Date( year, month0, day ) ;
    var weekDay = d.getDay() ;
    var weekDayName = globalWeekDayName[weekDay] ;
    var dateMonth = parseInt( day ) + ' ' + globalMonthNameGen[month0] ;


    $('.js-weekday-date').text( weekDayName + ' ' + dateMonth ) ;
    $('.js-date-month').text( dateMonth ) ;
  }
  //fillAllDates


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Дата грегато
  function dataGregato( data )
  {
    $('.js-price').text( data.price ) ;
    $('.js-customer-price').text( data.customerTotal ) ;
    $('.js-promo-text').text( data.promoText ) ;
    $('#js-payment-options').html( data.paymentHTML ) ;
    $('.js-date').text( data.date ) ;
    $('.js-time').text( data.time ) ;

    // Формируем текст типа СРЕДА 7 ЯНВАРЯ
    fillAllDates( data.date ) ;

    if( data.buttonText ) $('#js-payment-button').text( data.buttonText ) ;

    paymentCode = data.paymentCode ;

    if( data.discountText )
    {
      $('.js-discount-container').show() ;
      $('.js-discount').text( data.discountText ) ;
      $('.js-old-price').show() ;
    }
    else
    {
      $('.js-discount-container').hide() ;
      $('.js-old-price').hide() ;
    }

    // if( data.error )
    // {
    //   $('.js-error').text( data.error ).addClass('error') ;
    // }
    // else
    // {
    //   $('.js-error').removeClass('error') ;
    // }
    //debugger ;

    if( !data.time )
    {
      $('.hide-when-no-time').hide() ;
      selectedTime = null ;
    }
    else
    {
      $('.hide-when-no-time').show() ;
      selectedTime = data.start ;
    }

    // Если у нас пришел текст, значит у нас проблема с применением промо кода
    showPromoText( data.promoText ) ;

    if( data.numerals ) ticketNumerals = data.numerals ;
  }
  // dataGregato


var calndarSlider  ;

////////////////////////////////////////////////////////////////////////////////////////////////////
//
function initBookGameAllStep()
{

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Если мы сразу знаем, какая дата должна быть выбрана
  if( selectedDate )
  {
    var selector = '.js-one-day[data-date="'+selectedDate+'"]' ;
    $(selector).addClass('active') ;
    selectDate( selectedDate ) ;
  }
  // selectedDate

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Выбрали дату в календаре
  function selectDate( date )
  {
    var request = '?action=getschedule2' ;
    var request = '/action.json?action=getschedule2' ;
    var promoCode = $('#js-promo-code').val() ;
    var data = { object : objectID, date : date, option : optionID, capacity : selectedCapacity, promo : promoCode } ;

    if( typeof gtag === "function" ) gtag('event', 'select_date', { 'event_category' : 'step_1', 'event_label' : date } );
    if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal('select_date') ;

    $('.js-date').text( date ) ;
    fillAllDates( date ) ;

    var isoDate = date.substr(6,4) + '-' + date.substr(3,2) + '-' + date.substr(0,2) ;
    $('#js-date-mobile').val( isoDate ) ;

    $.getJSON( request, data, function( data )
    {
      $('.item-day').removeClass('waiting') ;

      $('#js-time-container').html( data.html ) ;

      // Показываем спрятанные ранее блоки
      $('.hide-before-date-selected').removeClass('hide-before-date-selected') ;

      // Помечаем выбранную дату
      selectedDate = date ;

      prepareMan( data ) ;
      dataGregato( data ) ;
      selectCapacity( selectedCapacity, false ) ;
    })
    .error(function( data )
    {
      console.log( data.responseText ) ;
      alert( data.responseText ) ;
    } )
    // getJSON
  }
  // selectDate


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Выбрали время
  function selectTime( start, time, promoCode )
  {
    var request = '?action=selecttime' ;
    var data = { date : selectedDate, object : objectID, start : start, option : optionID, lang : langPrefix, capacity : selectedCapacity, promo : promoCode } ;

    if( typeof gtag === "function" ) gtag('event', 'select_time', { 'event_category' : 'step_2', 'event_label' : time } );
    if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal('select_time') ;

    // Глобально
    selectedTime = start ;

    $('.js-time').text( time ) ;

    $.getJSON( request, data, function( data )
    {
      $('.waiting').removeClass('waiting') ;

      prepareMan( data ) ;
      // 0. Данные
      // timePriceCombo = data.combo ;
      // timeOccupied = data.occupied ;
      // timeDiscount = data.discount ;
      // timeFree = timeMaxCapacity - timeOccupied ;

      // 1. Создаем нужное количество человечков
      // $('.js-man').remove() ;
      // timeMaxCapacity = data.maxCapacity
      // for( var i = 1 ; i <= timeMaxCapacity ; i++ )
      // {
      //   $('.js-man-container').append('<span class="man js-man" data-capacity="' + i + '"></span>') ;
      // }

      // 2. Дизейблим занятое
      // $('.js-man').removeClass('disabled') ;
      // if( data.occupied ) $('.js-man').slice( -data.occupied ).addClass('disabled') ;

      // 3. Занимаем места
      dataGregato( data ) ;
      selectCapacity( selectedCapacity, false ) ;


    })
    .error(function( data )
    {
      console.log( data.responseText ) ;
      alert( data.responseText ) ;
    } )
    // getJSON
  }
  // selectTime


  //////////////////////////////////////////////////////////////////////////////////////////////
  // Готовим селектор с человечками
  function prepareMan( data )
  {
    // 1. Показываем данные для первого выбранного времени
    timePriceCombo = data.combo ;
    timeMaxCapacity = data.maxCapacity ;
    timeOccupied = data.occupied ;
    timeDiscount = data.discount ;
    timeFree = timeMaxCapacity - timeOccupied ;
    selectedCapacity = data.capacity ;
    $('.js-man').remove() ;
    timeMaxCapacity = data.maxCapacity

    // 2. Создаем нужное количество человечков
    for( var i = 1 ; i <= timeMaxCapacity ; i++ )
    {
      $('.js-man-container').append('<span class="man js-man" data-capacity="' + i + '"></span>') ;
    }

    // 3. Дизейблим занятое
    $('.js-man').removeClass('disabled') ;
    if( data.occupied )
    {
      $('.js-man-container').each( function()
      {
        $(this).find('.js-man').slice( -data.occupied ).addClass('disabled') ;
      }) ;
    }
  }
  // prepareMan


  //////////////////////////////////////////////////////////////////////////////////////////////
  // Выбрать заданное количество мест
  function selectCapacity( capacity, doPriceUpdate = true )
  {
    var possibleToBook = 0 ;

    $.each( timePriceCombo, function( i, val )
    {
      if( i <= timeMaxCapacity - timeOccupied ) possibleToBook = i  ;
      if( i >= capacity ) return false ;
    }) ;


    $('#js-register-result').hide() ;


    $('.js-man').each( function()
    {
      var oneCapacity = parseInt( $(this).data('capacity') ) || 0 ;

      if( oneCapacity <= possibleToBook )
      {
        if( !$(this).hasClass('disabled'))
        {
          $(this).addClass('active') ;
          selectedCapacity = oneCapacity ;
          //var cumulativeDiscount = $('#js-special-discount').is(":checked") ? discount + specialDiscount : discount ;

          //$('#js-final-price').text( timePriceCombo[possibleToBook] + ' ' + currencyName ) ;
          //$('#js-final-capacity').text( possibleToBook) ;
          //$('#js-discount').text( cumulativeDiscount + '%' ) ;
          //$('#js-final-price-discount').text( comboDiscount[possibleToBook] + ' ' + currencyName ) ;
          //$('#js-final-price-container').show() ;

          //finalCapacity = possibleToBook ;
          //finalPrice = timePriceCombo[possibleToBook] ;
          //finalPriceDiscount = comboDiscount[possibleToBook] ;

        }
      }
      else
      {
        $(this).removeClass('active')
      }
    }) ;
    // each


    // Информируем всех, сколько заказано сетов
    $('#js-final-capacity').text( possibleToBook ) ;

    // Обновим человек, человека, человек
    $('.js-ticket-numerals').text( ticketNumerals[possibleToBook] ) ;

    // Примечания к игре показывает только в том случае, если не выбрано максимальное количество мест и выбран выходной день
    if(( capacity <= defaultCapacity ) && (( selectedWeekDayType == 'SAT' ) || ( selectedWeekDayType == 'SUN' )))
    {
      $('.js-game-footnote').show() ;
      $('.js-footnote-link').text('*') ;
    }
    else
    {
     $('.js-game-footnote').hide() ;
      $('.js-footnote-link').text('') ;
    }

    // Установим везде
    $('.js-capacity').text( selectedCapacity ) ;

    // Если места выбраны, надо обновить цену у клиента
    if( doPriceUpdate ) updateCustomerBookingPrice() ;
  }
  // selectCapacity


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Стартуем календарь с месяцами и неделями
  calndarSlider = $('#js-month-slider').bxSlider(
  {
    mode: 'horizontal',
    speed: 300,
    touchEnabled: false,
    captions: false,
    auto: false,
    pager: false,
    preloadImages: 'all',
    nextText: null,
    prevText: null
  }) ;
  console.log( 'touch disabled') ;


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Обход проблем с touch
  // calndarSlider.closest('.bx-viewport').on( 'touchstart', function(ev)
  // {
  //   const $div = $( ev.target ) ;
  //   $div.closest('.js-one-day').trigger( "click" ) ;
  //   console.log('click') ;
  // }) ;
  // calndarSlider.closest


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Показать подробнее
  $('#js-header-mobile-link').click( function( e )
  {
    e.preventDefault() ;
    e.stopPropagation() ;
    //$('video-mobile-header').add
    $('#js-video-mobile-block').show() ;
  }) ;
  // #js-header-mobile-link.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Убрать подробнее
  $('#js-close-video-mobile,.js-close-video-mobile').click( function( e )
  {
    e.preventDefault() ;
    $('#js-video-mobile-block').hide() ;
  }) ;
  // #js-close-video-mobile.click

  $('body').click( function( e )
  {
    $('#js-video-mobile-block').hide() ;
  }) ;

  $('#js-video-mobile-block').click( function( e )
  {
    e.stopPropagation() ;
  }) ;
  // #js-video-mobile-block.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Запоминание значений полей
  $('input:not([data-consta=""])').bind('input', function()
  {
    var name = $(this).data('consta') ;
    if( !name ) return ;
    var val = $(this).val() ;
    //console.log('data-consta',name,val) ;

    document.cookie = name + "=" + val ;
  }) ;
  // data-consta on input


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Восстановить значения полей
  $('input:not([data-consta=""])').each( function()
  {
    if( $(this).val() ) return ;
    var name = $(this).data('consta') ;
    if( !name ) return ;
    var val = readCookie( name ) ;
    if( val ) $(this).val( val ) ;
    //console.log('read-data-consta',name,val) ;
  }) ;


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Следующий месяц
  $('.js-next-month').click( function()
  {
    var thisMonth = parseInt( $(this).data('this-month')) ;
    var thisYear = parseInt( $(this).data('this-year')) ;
    var nextMonth, nextYear ;
    var slideClass, slideIndex ;

    if( thisMonth == 12 )
    {
      nextMonth = 1 ;
      nextYear = thisYear + 1 ;
    }
    else
    {
      nextMonth = thisMonth + 1 ;
      nextYear = thisYear ;
    }

    slideClass = nextYear + '-' + nextMonth ;
    slideIndex = calendarWeekIndex.indexOf( slideClass ) ;

    calndarSlider.goToSlide( slideIndex ) ;

    $('.js-prev-week').removeClass('hide-week-navigation') ;
    if( calndarSlider.getCurrentSlide() == calndarSlider.getSlideCount() - 1 )
    {
      $('.js-next-week').addClass('hide-week-navigation') ;
    }
  }) ;
  // .js-next-week.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Предыдущий месяц
  $('.js-prev-month').click( function()
  {
    var thisMonth = parseInt( $(this).data('this-month')) ;
    var thisYear = parseInt( $(this).data('this-year')) ;
    var prevMonth, prevYear ;
    var slideClass, slideIndex ;

    if( thisMonth == 1 )
    {
      prevMonth = 12 ;
      prevYear = thisYear - 1 ;
    }
    else
    {
      prevMonth = thisMonth - 1 ;
      prevYear = thisYear ;
    }

    slideClass = prevYear + '-' + prevMonth ;
    slideIndex = calendarWeekIndex.indexOf( slideClass ) ;

    calndarSlider.goToSlide( slideIndex ) ;

    $('.js-next-week').removeClass('hide-week-navigation') ;
    if( calndarSlider.getCurrentSlide() == 0 )
    {
      $('.js-prev-week').addClass('hide-week-navigation') ;
    }
  }) ;
  // .js-prev-month.click



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Следующая неделя
  $('.js-next-week').click( function()
  {
    calndarSlider.goToNextSlide() ;
    $('.js-prev-week').removeClass('hide-week-navigation') ;

    if( calndarSlider.getCurrentSlide() == calndarSlider.getSlideCount() - 1 )
    {
      $(this).addClass('hide-week-navigation') ;
    }
  }) ;
  // .js-next-week.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Предыдущая неделя
  $('.js-prev-week').click( function()
  {
    calndarSlider.goToPrevSlide() ;
    $('.js-next-week').removeClass('hide-week-navigation') ;

    if( calndarSlider.getCurrentSlide() == 0 )
    {
      $(this).addClass('hide-week-navigation') ;
    }
  }) ;
  // .js-prev-week.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //$('.js-one-day').click( function( e )
  $('body').on( 'click', '.js-one-day', function(e)
  {
    if( $(this).hasClass('no-booking')) return ;

    var date = $(this).data('date') ;

    $('.js-one-day.active').removeClass('active') ;
    $(this).addClass('active').addClass('waiting') ;

    if( date ) selectDate( date ) ;
  }) ;
  // .js-one-day.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Выбрано время на мобильном контроллере
  $('body').on( 'change', '#js-date-mobile', function(e)
  {
    var isoDate = $(this).val() ;
    var year = isoDate.substr( 0, 4 ) ;
    var month = isoDate.substr( 5, 2 ) ;
    var day = isoDate.substr( 8, 2 ) ;
    var date = day+'.'+month+'.'+year  ;

    if( date ) selectDate( date ) ;
  }) ;
  // change#js-date-mobile


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Выбрано время
  $('body').on( 'change', '#js-time-selector', function(e)
  {
    $(this).addClass('selected').addClass('waiting') ;
    var start = $(this).find(":selected").data('start') ;
    var time = $(this).find(":selected").data('time') ;
    var promoCode = $('#js-promo-code').val() ;

    selectTime( start, time, promoCode ) ;
  }) ;
  // js-time-selector.change

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // A6: Выбрано время
  $('body').on( 'click', '.one-set', function(e)
  {
    e.preventDefault() ;

    $('.one-set.selected').removeClass('selected') ;
    $(this).addClass('selected').addClass('waiting') ;
    var start = $(this).data('start') ;
    var time = $(this).data('time') ;
    var promoCode = $('#js-promo-code').val() ;

    selectTime( start, time, promoCode ) ;
  }) ;
  // js-time-selector.change



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Выбрано мест
  $('body').on( 'click', '.js-man', function(e)
  {
    var capacity = $(this).data('capacity') ;

    if( typeof gtag === "function" ) gtag('event', 'select_people', { 'event_category' : 'step_3', 'event_label' : capacity } );
    if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal('select_people') ;

    selectCapacity( capacity ) ;
    customerPrefferedCapacity = capacity ;
  }) ;
  // .js-man.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Переключатель режимов оплаты, при клике настраивает платежную кнопку data-code
  $('body').on( 'change', '.js-payment-option', function(e)
  {
    e.preventDefault() ;
    paymentCode = $(this).data('code') ;

    $('.js-payment-option').prop('checked', false ) ;
    $('.js-payment-option-' + paymentCode ).prop('checked', true ) ;
    $('.js-payment-button').data('code', paymentCode ) ;
    $('#js-payment-button').text( $(this).data('button-text')) ;
  }) ;
  // js-select-payment-option.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Проверка промо кода
  $('#js-check-promo').click( function( e )
  {
    e.preventDefault() ;
    $(this).addClass('waiting') ;
    updateCustomerBookingPrice() ;
  }) ;
  // js-check-promo.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Выйти
  $('#js-logout').click( function( e )
  {
    e.preventDefault() ;
    $(this).addClass('waiting') ;
    var request = 'index.php?action=logout' ;

    $.getJSON( request, function( data )
    {
      $('.waiting').removeClass('waiting') ;
      $('input[disabled]').prop( 'disabled', false ) ;
      $('.agreement.disabled').removeClass('disabled') ;
      $('.cabinet-button-container.disabled').removeClass('disabled') ;

    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON
  }) ;
  // js-customer-logout.click



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Бронировать
  // Есть два варинта, которые определяются simpleMode:
  // 1. false: пользователь вошел в систему
  // 2. true: пользователь без регистрации
  $('body').on( 'click', '#js-payment-button', function( e )
  {
    e.preventDefault() ;
    e.stopPropagation() ;
    $(this).addClass('waiting') ;

    var request = 'index.php?action=book' ;

    var simple = simpleMode ? 'Y' : '' ;
    var name = $('#js-name').val() ;
    var email = $('#js-email').val() ;
    var phone = $('#js-phone').val() ;
    var agreement = $('#js-agreement').prop('checked') ? 'Y' : '' ;

    var promoCode = $('#js-promo-code').val() ;

    var data = { code : paymentCode, object : objectID, option : optionID, date : selectedDate, start : selectedTime, capacity : selectedCapacity, promo : promoCode, specialDiscount : null,
                 name : name, phone : phone, email : email, agreement : agreement } ;

    if( $('#js-password-container').hasClass('and-pass') && $('#js-password').val() )
    {
      data.password = $('#js-password').val() ;
    }

    console.log( 'action=book', data ) ;
    //debugger ;

    $(this).addClass('waiting') ;
    $('.error').removeClass('error') ;
    $('.js-error').removeClass('error') ;
    $('#js-password-container').removeClass('and-pass') ;


    $.getJSON( request, data, function( data )
    {
      $('.waiting').removeClass('waiting') ;
      if( data.error )
      {
        if( typeof gtag === "function" ) gtag('event', data.gtag_action, { 'event_category' : data.gtag_categoty, 'event_label' : data.gtag_label }) ;
        if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal( data.gtag_action ) ;

        $('.js-error').addClass('error').text( data.error ) ;
        $( data.id ).prev('label').addClass('error') ;
        $( data.id ).addClass('error') ;

        if( data.showPassword )
        {
          $('#js-password-container').addClass('and-pass') ;
        }
        else
        {
          $('#js-password-container').removeClass('and-pass') ;
        }

      }
      else
      {
        $('#js-book-error').hide() ;

        // FB PIXEL трекинг
        if( typeof fbq === "function" ) fbq('track', 'Purchase') ;
        if( typeof roistatGoal === "object" ) roistatGoal.reach({name: data.name, phone: data.phone, email: data.email, leadName: 'Бронирование' }) ;
        if( typeof gtag === "function" ) gtag('event', 'do_payment', { 'event_category' : 'step_4' } );
        if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal('do_payment') ;

        // Нам передали spyID, надо перенести его на userid для GA и YM
        console.log( 'spyid', data.spyid ) ;
        if( typeof gtag === "function" ) gtag('config', 'UA-77114722-2', { 'user_id': data.spyid, 'send_page_view': false }) ;
        if( typeof yaCounter49915489 === "object" ) yaCounter49915489.setUserID( data.spyid ) ;

        if( data.goto )
        {
          //document.location.href = data.goto ;

          // Отсрочка перехода в 400 мс
          setTimeout( function(){ delayedGoto( data.goto ); }, 400 ) ;
          return ;
        }
        else
        {
          $('#js-book-completed').show() ;
          $('.hide-when-booked').hide() ;
        }
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON
  }) ;
  // click.js-payment-button

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Переход на платежный сервер должен выполняться с задержкой
  function delayedGoto( href )
  {
    document.location.href = href ;
  }
  //


}
// initBookGameAllStep






















// Режим бронирования без регистрации.
// Используется только при бронировании
var simpleMode = true ;

// Находится ли пользователь в системе
var logged = false ;


////////////////////////////////////////////////////////////////////////////////////////////////////
//
function initBookingLogin()
{
  // Запоминание значений полей
  $('input:not([data-consta=""])').bind('input', function()
  {
    var name = $(this).data('consta') ;
    if( !name ) return ;
    var val = $(this).val() ;
    //console.log('data-consta',name,val) ;

    document.cookie = name + "=" + val ;
  }) ;
  // data-consta on input


  // Восстановить значения полей
  $('input:not([data-consta=""])').each( function()
  {
    var name = $(this).data('consta') ;
    if( !name ) return ;
    var val = readCookie( name ) ;
    if( val ) $(this).val( val ) ;
    //console.log('read-data-consta',name,val) ;
  }) ;

  // Нужно решить, какой диалог бронирования показываем по умолчанию
  if( simpleMode )
  {
    $('#js-simple-result').hide() ;
    $('#js-login-container').hide() ;
    $('#js-simple-container').show() ;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //  Хотим восстановить пароль
  $('#js-recover-password').click( function( e )
  {
    e.preventDefault() ;

    $('#js-register-result').hide() ;
    $('#js-login-container').hide() ;
    $('#js-register-container').hide() ;
    $('#js-recover-container').show() ;
    $('#js-recover-phone').focus() ;
  }) ;
  //

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Не хотим восстанавливаться
  $('#js-recover-cancel').click( function( e )
  {
    e.preventDefault() ;

    $('#js-recover-container').hide() ;
    $('#js-login-container').show() ;
    $('#js-login-phone').focus() ;
  }) ;
  //



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Закончили восстанавливаться
  $('#js-recover-after').click( function( e )
  {
    e.preventDefault() ;

    $('#js-recover-container-done').hide() ;
    $('#js-login-container').show() ;
    $('#js-register-name').focus() ;
  }) ;
  //

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Хотим зарегистрироваться
  $('#js-register').click( function( e )
  {
    e.preventDefault() ;

    $('#js-register-result').hide() ;
    $('#js-login-container').hide() ;
    $('#js-register-container').show() ;
    $('#js-register-name').focus() ;
  }) ;
  //




  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Не хотим зарегистрироваться
  $('#js-register-cancel').click( function( e )
  {
    e.preventDefault() ;

    $('#js-register-result').hide() ;
    $('#js-login-container').show() ;
    $('#js-register-container').hide() ;
    $('#js-login-phone').focus() ;
  }) ;
  //

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Регистрация
  $('#js-register-do').click( function( e )
  {
    e.preventDefault() ;

    $('#js-register-error').hide() ;
    $('#js-register-do').addClass('waiting') ;

    var request = 'index.php?action=register' ;
    var name = $('#js-register-name').val() ;
    var email = $('#js-register-email').val() ;
    var ccode = $('#js-register-country-code').val() ;
    var phone = $('#js-register-phone').val() ;
    var personal = $('#js-register-personal').prop('checked') ? 'Y' : '' ;
    var agreement = $('#js-register-agreement').prop('checked') ? 'Y' : '' ;

    $.getJSON( request, { name : name, ccode : ccode, phone : phone, email : email, personal : personal, agreement : agreement }, function( data )
    {
      $('#js-register-do').removeClass('waiting') ;

      if( data.error )
      {
        $('#js-register-error').text( data.error ).show() ;
        $(data.id).focus() ;
      }
      else
      {
        $('#js-register-error').hide() ;
        $('#js-register-container').hide() ;
        $('#js-register-message').text( data.text ) ;
        $('#js-register-result').show() ;
        $('#js-login-container').show() ;
        $('#js-login-error').hide() ;
        $('#js-login-phone').val( email ) ;
        $('#js-login-password').focus() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON

  }) ;
  // js-register-do.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Войти
  $('#js-login-do').click( function( e )
  {
    e.preventDefault() ;

    $('#js-register-result').hide() ;
    $('#js-login-error').hide() ;
    $('#js-login-do').addClass('waiting') ;

    var request = 'index.php?action=bookinglogin' ;
    var objectID = $('#js-object-id').val() ;
    var optionID = $('#js-option-id').val() ;
    var date = $('#js-date').val() ;
    var start = $('#js-start').val() ;
    var login = $('#js-login-phone').val() ;
    var password = $('#js-login-password').val() ;

    if( typeof gtag === "function" ) gtag('event', 'login', { 'event_category' : 'step_4' } );
    if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal('login') ;

    $.getJSON( request, { login : login, password : password, object : objectID, option : optionID, date : date, start : start }, function( data )
    {
      $('#js-login-do').removeClass('waiting') ;

      if( data.error )
      {
        $('#js-login-error').text( data.error ).show() ;
        $('#js-login-password').focus() ;
      }
      else
      {
        $('#js-login-error').hide() ;

        // Получилось войти, значит, нам пришли данные о пользователе, заполняем их
        $('#js-customer-name').text( data.customerName ) ;
        $('#js-customer-discount').text( data.customerDiscount ) ;
        $('#js-customer-price').text( data.price + ' ' + data.currecnyName ) ;
        $('#js-customer-total').text( data.customerTotal + ' ' + data.currecnyName ) ;

        $('#js-customer-container').show() ;
        $('#js-login-container').hide() ;

        // Помечаем как вошедшего в систему
        logged = true ;

        // Запрашиваем суммы по клиенту
        updateCustomerBookingPrice() ;

      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON

  }) ;
  // js-login-do.click




  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Восстановить пароль
  $('#js-recover-do').click( function( e )
  {
    e.preventDefault() ;

    $('#js-login-error').hide() ;
    $('#js-recover-do').addClass('waiting') ;

    var request = 'index.php?action=recover' ;
    var login = $('#js-recover-phone').val() ;

    $.getJSON( request, { login : login }, function( data )
    {
      $('#js-recover-do').removeClass('waiting') ;

      if( data.error )
      {
        $('#js-login-error').text( data.error ).show() ;
        $('#js-login-password').focus() ;
      }
      else
      {
        $('#js-recover-container').hide() ;
        $('#js-recover-container-done').show() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON

  }) ;
  // js-login-do.click



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Выйти
  $('#js-customer-logout').click( function( e )
  {
    e.preventDefault() ;
    var request = 'index.php?action=logout' ;

    $.getJSON( request, function( data )
    {
      $('#js-customer-price').text('') ;
      $('#js-customer-total').text('') ;
      $('#js-login-error').text( data.error ).show() ;
      $('#js-customer-container').hide() ;
      $('#js-login-container').show() ;
      $('#js-login-phone').focus() ;

      // Помечаем как вошедшего в систему
      logged = false ;

    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON
  }) ;
  // js-customer-logout.click



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Вдруг нас загружают уже второй раз
  $(document).off( 'click', 'js-select-payment-option' ) ;



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Вдруг нас загружают уже второй раз
  $(document).off( 'click', '#js-payment-button' ) ;

  function fbk( a, b )
  {
    console.log( 'fbk is here') ;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Бронировать
  // Есть два варинта, которые определяются simpleMode:
  // 1. false: пользователь вошел в систему
  // 2. true: пользователь без регистрации
  $('body').on( 'click', '#js-payment-button', function( e )
  {
    e.preventDefault() ;
    e.stopPropagation() ;
    $(this).addClass('waiting') ;

    var request = 'index.php?action=book' ;

    var simple = simpleMode ? 'Y' : '' ;
    var name = $('#js-simple-name').val() ;
    var email = $('#js-simple-email').val() ;
    var ccode = $('#js-simple-country-code').val() ;
    var phone = $('#js-simple-phone').val() ;
    var personal = $('#js-simple-personal').prop('checked') ? 'Y' : '' ;
    var agreement = $('#js-simple-agreement').prop('checked') ? 'Y' : '' ;
    var specialDiscount = $('#js-special-discount').is(":checked") ? 'Y' : '' ;

    var code = $(this).data('code') ;
    var objectID = $('#js-object-id').val() ;
    var optionID = $('#js-option-id').val() ;
    var date = $('#js-date').val() ;
    var start = $('#js-start').val() ;
    var capacity = parseInt( $('#js-final-capacity').text() ) || 0 ;
    var promo = $('#js-promo-code').val() ;

    var data = { code : code, object : objectID, option : optionID, date : date, start : start, capacity : capacity, promo : promo, specialDiscount : specialDiscount,
                 simple : simple, name : name, ccode : ccode, phone : phone, email : email, personal : personal, agreement : agreement } ;


    console.log( 'action=book', data ) ;

    $(this).addClass('waiting') ;
    $('#js-book-error').hide() ;

    //debugger ;

    $.getJSON( request, data, function( data )
    {
      $('.waiting').removeClass('waiting') ;

      if( data.error )
      {
        if( typeof gtag === "function" ) gtag('event', data.gtag_action, { 'event_category' : data.gtag_categoty, 'event_label' : data.gtag_label }) ;
        if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal( data.gtag_action ) ;

        if( simpleMode )
        {
          $('.js-simple-error').show().text( data.error ) ;
          $( data.id ).focus() ;
        }
        else
        {
          $('#js-book-error').show().text( data.error ) ;
          $( data.id ).focus() ;

          // Пользователь умудрился вывалиться из системы
          if( data.relogin )
          {
            $('#js-login-error').text( data.error ).show() ;
            $('#js-customer-container').hide() ;
            $('#js-login-container').show() ;
            $('#js-login-phone').focus() ;
          }
        }
        // simpleMode

      }
      else
      {
        $('#js-book-error').hide() ;

        // FB PIXEL трекинг
        if( typeof fbq === "function" ) fbq('track', 'Purchase') ;
        if( typeof roistatGoal === "object" ) roistatGoal.reach({name: data.name, phone: data.phone, email: data.email, leadName: 'Бронирование' }) ;
        if( typeof gtag === "function" ) gtag('event', 'do_payment', { 'event_category' : 'step_4' } );
        if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal('do_payment') ;
        //if( typeof ga === "function" ) ga('send', 'event', 'book', 'dopayment' );

        // Нам передали spyID, надо перенести его на userid для GA и YM
        console.log( 'spyid', data.spyid ) ;
        if( typeof gtag === "function" ) gtag('config', 'UA-77114722-2', { 'user_id': data.spyid, 'send_page_view': false }) ;
        if( typeof yaCounter49915489 === "object" ) yaCounter49915489.setUserID( data.spyid ) ;

        if( data.goto )
        {
          //document.location.href = data.goto ;

          // Отсрочка перехода в 100 мс
          setTimeout( function(){ delayedGoto( data.goto ); }, 100 ) ;
          return ;
        }
        else
        {
          $('#js-book-completed').show() ;
          $('#js-customer-container').hide() ;
          $('#js-simple-container').hide() ;
        }
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON
  }) ;
  // click.js-payment-button


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Переход на платежный сервер должен выполняться с задержкой
  function delayedGoto( href )
  {
    console.log( 'delayed goto' ) ;
    document.location.href = href ;
  }
  //


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Бронирование без регистрацииs
  $('#js-simple').click( function( e )
  {
    e.preventDefault() ;

    simpleMode = true ;
    $('#js-simple-result').hide() ;
    $('#js-login-container').hide() ;
    $('#js-simple-container').show() ;

    // Нельзя показывать суммы, если не выбрано количество
    if( finalCapacity )
    {
      $('#js-simple-step2').show() ;
    }
    else
    {
      $('#js-simple-step2').hide() ;
    }


    $('#js-simple-name').focus() ;
  }) ;
  //




  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Вдруг нас загружают уже второй раз
  $(document).off( 'click', '#js-simple-cancel,.js-simple-cancel' ) ;

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Не хотим без регистрации
  $(document).on( 'click', '#js-simple-cancel,.js-simple-cancel', function(e)
  {
    e.preventDefault() ;

    simpleMode = false ;
    $('#js-simple-result').hide() ;
    $('#js-login-container').show() ;
    $('#js-simple-container').hide() ;
    $('#js-login-phone').focus() ;
  }) ;
  // js-simple-cancel.click

}
// js-simple-cancel.click



////////////////////////////////////////////////////////////////////////////////////////////////////
// Рисует платежные кнопки
function updatePaymentOptions( paymentHTML )
{
  $('#js-payment-options').html( paymentHTML ) ;
}
// updatePaymentOptions


////////////////////////////////////////////////////////////////////////////////////////////////////
// При бронировании выбрано количество сетов - необходимо обновить суммыу клиента
function updateCustomerBookingPrice()
{
  var request = '?action=esimatebookingamount' ;
  var start = selectedTime ;
  var promo = $('#js-promo-code').val()  ;
  var specialDiscount = 0 ;
  var data = { object : objectID, option : optionID, date : selectedDate, start : selectedTime, capacity : selectedCapacity, promo : promo, specialDiscount : specialDiscount } ;

  console.log('update',data) ;

  // Не выбрано количество, нельзя показывать ничего
  if( selectedCapacity == 0 )
  {
    $('#js-customer-price').text('') ;
    $('#js-customer-total').text('') ;
  }

  $.getJSON( request, data, function( data )
  {
    $('.waiting').removeClass('waiting') ;

    if( data.error )
    {
      // На всякий случай прячем суммы
      $('#js-customer-price,#js-simple-customer-price').text('') ;
      $('#js-customer-total,#js-simple-customer-total').text('') ;

      // Пользователь умудрился вывалиться из системы
      if( data.relogin )
      {
        $('#js-login-error').text( data.error ).show() ;
        $('#js-customer-container').hide() ;
        $('#js-login-container').show() ;
        $('#js-login-phone').focus() ;
      }
    }
    else
    {
      dataGregato( data ) ;
    }
  })
  .error( function( e )
  {
    alert( e.responseText ) ;
    console.log( e.responseText ) ;
  }) ;
  // getJSON
}
// updateCustomerBookingPrice


