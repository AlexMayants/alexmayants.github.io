function readCookie(a) 
{
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}
// getCookieValue


function maxOuterHeight(elems)
{
  return Math.max.apply( null, elems.map( function()
  {
    return $(this).outerHeight();
  }).get());
}
// maxOuterHeight 

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
// getUrlVars

function initGoBig()
{

  $("img.img_gobig").each( function(index)
  {
    $(this).css( 'cursor', '' ) ;
    $(this).wrap( '<a class="goBig" rel="'+$(this).attr( 'rel' )+'" href=' + $(this).attr( 'src' ) + '>' ) ;
  }) ;

  $("a[rel=goBig]").fancybox();

  $(".goBig").fancybox(); 
}

function addBookmark() 
{
    if (document.all) window.external.addFavorite( document.title, document.URL );
    return false ;
}

function openPopup( popupID, videoLink)
{

  if(typeof popupID == "undefined") {
    return false;
  }

  $('.popup__wrapper').removeClass('is-visible');

  var popup = $('.popup__wrapper .popup[data-popup-id="' + popupID + '"]');

  // ADD iframe into popup from data-attrs
  var videoFrame = popup.find('.js-video-frame');
  videoFrame.html('<iframe class="js-video-frame" src="' + videoLink + '?rel=0&autoplay=1' + '" frameborder="0" allowfullscreen></iframe>');

  if(popup.length) {

    if ($(window).width() <= 1024) {
      $('body').css('overflow','hidden');
    }
    // $('body').css('overflow','hidden').addClass('hey-popup');
    $('body').addClass('hey-popup');
    popup.closest('.popup__wrapper').addClass('is-visible');
    popup.find('.js_focus_on_show').each(function(){
      if($(this).val().length == 0){
        $(this).focus();
        return false;
      }
    });
  }
};
// openPopup


function closePopups()
{
  $('.popup__wrapper').removeClass('is-visible');
  // $('body').css('overflow','auto');
  if ($(window).width() <= 1024) {
    $('body').css('overflow','');
  }
  $('.popup').find('.js-video-frame').attr('src', '');
};
// closePopups


///////////////////////////////////////////////////////////////
function initPopups()
{
  $('.js-watch-video').click( function(e)
  {
    e.preventDefault() ;
    e.stopPropagation() ;

    var videoLink = $(this).data( 'video' ) || $(this).attr('href') ;
    openPopup( 'play-teaser', videoLink ) ;
  }) ;
  // js-watch-video.click

  $('.popup__close').click( function( e )
  {
    e.preventDefault() ;
    e.stopPropagation() ;
    closePopups() ;
  }) ;
  // popup__close.click

  $(document).keyup(function(e) 
  {
    if (e.keyCode == 27) closePopups();
  });  
}
// initPopups

///////////////////////////////////////////////////////////////
// Скролл декстопного меню
function scrollDescktopMenu ()
{
  var lastScrollTop = 2;
  $(window).scroll(function (event){
    var st = $(this).scrollTop();
    var open_nav = $('#js-show-mobile-menu').hasClass('open');
    if (st > lastScrollTop && (st != 0 || st > 0) && (open_nav == false)) {
      $('.menu-container').css('top','-80px');
      $('.mobile-header').css('top','-80px');
    } else {
      $('.menu-container').css('top','0px');
      $('.mobile-header').css('top','0px');
    }
    lastScrollTop = st;
  });
}

///////////////////////////////////////////////////////////////
// Мобильное меню
function initMobileMenu()
{
  ///////////////////////////////////////////////////////////////
  // Мобильное меню свернуть-развернуть
  $('#js-show-mobile-menu').click( function( e )
  {
    e.stopPropagation() ;

    if( $('#js-show-mobile-menu').hasClass('open') )
    {
      // $('#js-mobile-menu').slideUp(100) ;
      $('#js-mobile-menu').css({'top':'-120%','bottom':'auto'}) ;
      $('#js-show-mobile-menu,#js-from-top').removeClass('open') ;
    }
    else
    {
      // $('#js-mobile-menu').slideDown(100) ;
      $('#js-mobile-menu').css({'top':'0px','bottom':'20px'}) ;

      $('#js-show-mobile-menu,#js-from-top').addClass('open') ;
    }
  }) ;
  // js-show-mobile-menu.click


  ///////////////////////////////////////////////////////////////
  // При клике по ссылке закрываем меню
  // $('#js-mobile-menu a').click( function()
  // {
  //     $('#js-mobile-menu').slideUp() ;
  //     $(this).removeClass('open') ;
  // }) ;
  // selectMobileMenu li a


  ///////////////////////////////////////////////////////////////
  // При клике по ссылке закрываем меню
  // $( window ).scroll(function() 
  // {
  //   var screenWidth = $(window).width() ;
  //   var scroll = $(window).scrollTop() ;

  //   if( scroll > 70 )
  //   {
  //     $('.mobile-header').addClass( 'scrolled' ) ;
  //   }
  //   else
  //   {
  //     $('.mobile-header').removeClass( 'scrolled' ) ;
  //   }


  // });
  // scroll

}
// initMobileMenu


function initMoreTextButton()
{
  $('.js-more-text').click( function(e)
  {
    e.preventDefault() ;
    $(this).hide() ;
    $('.js-hidden-text').css('display','block');
    $(this).next('.text-hidden').slideDown() ;
    $('.button-hidden').show() ;
  }) ;

  $('.js-hidden-text').click( function(e)
  {
    e.preventDefault() ;
    $(this).hide() ;
    $('.js-more-text').css('display','block');
    $('.text-hidden').slideUp() ;
    $('.button-hidden').show() ;
  }) ;
  // js-more-text.click
}
// initMoreTextButton


function initAnchor()
{
  $("a[href^=#]").click(function(e) 
  {
    e.preventDefault() ;
    var anchor = $(this).attr('href') ;
    var offset = $(anchor).offset().top - 50 ;
    $('html, body').stop().animate({ scrollTop: offset }, 500 ) ;
  });  
}
// initAnchor


///////////////////////////////////////////////////////////////
// Когда пользователь хочет подписаться
function initSubscribtion()
{
 $('#js-do-subscribe').click( function(e)
 {
    e.preventDefault() ;

    var email = $('#js-subscribe-email').val() ;
    var lang = $('#js-subscribe-email').data('lang') ;
    var request = 'feedback.php?action=subscribe' ;

    $('#js-subscribe-error').hide().text('') ;
    $('#js-do-subscribe').addClass('waiting') ;

    $.getJSON( request, { email : email, lang : lang }, function( data )
    {
      $('#js-do-subscribe').removeClass('waiting') ;
      if( data.result == 'ok' )
      {
        $('#js-subscribe-step1').hide() ;
        $('#js-subscribe-error').hide() ;
        $('#js-subscribe-done').show() ;
      }
      else
      {
        $('#js-subscribe-error').show().text( data.result ) ;
        $('#js-subscribe-email').focus() ;
      }
    })
    .error( function( data )
    {
      alert( data.responseText ) ;
      console.log( data.responseText ) ;
    }) ;
  }) ;
  // js-do-subscribe.click
}
// initSubscribtion

var chocolatInstablce = null ;

///////////////////////////////////////////////////////////////
// Показать картинку с картой
function initShowMapImg()
{
  $( function()
  {
    $('#js-show-map,.js-show-map').click( function(e)
    {
      e.preventDefault() ;
      var href = $(this).attr('href') ;

      if( chocolatInstablce )
      {
        chocolatInstablce.api().destroy() ;
      }

      chocolatInstablce = $('body').Chocolat(
      { 
        container : window, 
        images : [{ src : href }],
        imageSize : 'contain',
        loop : false,
        enableZoom : false
      }).data('chocolat') ;
     
      chocolatInstablce.api().open() ;
    }) ;
  }) ;    
}
// initShowMapImg

function selectStep( step )
{
  $('.step-container .active').removeClass('active') ;
  $('.step-container .step' + step + ' .circle').addClass('active') ;
}
// selectStep


function initScrollGame()
{
  $(document).scroll( function() 
  {
    var top1 = $(document).scrollTop() ;
    var top2 = $('#js-scroll-step1').offset().top ;

    if( top1 > top2 - 180 )
    {
      $('#js-scroll-step2').addClass('show') ;
    }
    else
    {
      $('#js-scroll-step2').removeClass('show') ;
    }
  }) ;
  // scroll  

  $('.step-container .step1').click( function(e)
  {
    e.preventDefault() ;
    $('.step-container .active').removeClass('active') ;
    $('.step-container .step1 .circle').addClass('active') ;

  }) ;
  // step1.click

  $('.step-container .step2').click( function(e)
  {
    e.preventDefault() ;
    if( $('#time-top').length )
    {
      $('.step-container .active').removeClass('active') ;
      $('.step-container .step2 .circle').addClass('active') ;
    }
  }) ;
  // step2.click

  $('.step-container .step3').click( function(e)
  {
    e.preventDefault() ;
    if( $('#js-step3').length )
    {
      $('.step-container .active').removeClass('active') ;
      $('.step-container .step3 .circle').addClass('active') ;
    }
  }) ;
  // step3.click

  $('.step-container .step4').click( function(e)
  {
    e.preventDefault() ;
    if( $('#js-step3').length )
    {
      $('.step-container .active').removeClass('active') ;
      $('.step-container .step4 .circle').addClass('active') ;
    }
    else
    {
      e.stopPropagation() ;
    }
  }) ;
  // step4.click

  $('.step-container .step5').click( function(e)
  {
    e.preventDefault() ;
    if( $('#js-start-payment').length )
    {
      $('.step-container .active').removeClass('active') ;
      $('.step-container .step5 .circle').addClass('active') ;
    }
  }) ;
  // step4.click
}
// initScrollGame


function initGameAlt()
{
  $('.js-alt-show').click( function(e)
  {
    e.preventDefault() ;
    $(this).hide() ;
    $(this).parent().prev('.text').addClass('max-height-150') ;

    //$(this).prev('.js-devmode-text').slideDown() ;
    $(this).prev('.js-devmode-text').show() ;
    $slider.stopAuto() ;      
  }) ;
  // js-alt-show').click

  $('.js-alt-show-cancel').click( function(e)
  {
    e.preventDefault() ;
    $(this).parent().parent().prev('.text').removeClass('max-height-150') ;

    $(this).parent().hide() ;
    $(this).parent().next('.js-alt-show').show() ;
    
  }) ;
  // js-alt-show-cancel.click
}
// initGameAlt


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Поддержка шторки по спец.предложением
function initOffer()
{
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //$('#js-open-offer,.js-open-offer').click( function(e)
  $(document).on( 'click', '#js-open-offer,.js-open-offer',function(e)
  {
    e.preventDefault() ;

    if( $(window).width() < 950 )
    {
      $('.js-show-mobile-offer').trigger('click') ;
      return ;
    }

    $('.js-when-offer-hide').hide() ;
    $('#js-offer-container').show() ;

    // Если есть видео, останавливаем видео и прячем его
    if( $('#js-main-video').length )
    {
      $('#js-main-video').get(0).pause() ;
      $('#js-main-video').get(0).currentTime = 0 ;
      $('#js-main-video-container').hide() ;
    }

    $('#js-page-container').addClass('js-page-moved-to-right').addClass('page-container-ready') ;
    $('body').addClass('js-body-moved-to-right') ;
    $('#js-offer-container').show() ;
    $('#js-offer-right-clicker').show() ;

    commonEventExecutor( 'side_button_sale', { 'event_category' : 'side_button' }) ;
  }) ;
  // js-open-offer.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  $('#js-offer-close,.js-offer-close').click( function(e)
  {
    e.preventDefault() ;

    $('#js-page-container').removeClass('js-page-moved-to-right') ;
    $('#js-offer-right-clicker').hide() ;

    // Ждем окончания анимации
    $('#js-page-container').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e){
      console.log('one') ;
      $('#js-offer-container').hide() ;
      $('#js-page-container').removeClass('page-container-ready') ;
      
      // Снова запускаем видео
      if( $('#js-main-video').length )
      {
        $('#js-main-video-container').show() ;
        $('#js-main-video').get(0).load() ;
      }

      $('.js-when-offer-hide').show() ;
      $('body').removeClass('js-body-moved-to-right') ;
    }) ; 
    // js-page-container.end

    //$('#js-offer-close').hide() ;
  }) ;
  // js-offer-close.click


  $('.js-show-mobile-offer').click( function(e)
  {
    e.preventDefault() ;
    $('#js-mobile-offer-container').show().addClass('show') ;
  }) ;
  // js-show-mobile-offer.click


  $('#js-mobile-offer-close').click( function(e)
  {
    e.preventDefault() ;
    $('#js-mobile-offer-container').removeClass('show') ;
  }) ;
  // js-mobile-offer-close.click
}
// initOffer



///////////////////////////////////////////////////////////////
// Инициализируем базовое поведение
$( function() 
{
  initPopups() ;
  initMobileMenu() ;
  initAnchor() ;
  initSubscribtion() ;
  initMoreTextButton() ;
  initShowMapImg() ; 
  initOffer() ;
  scrollDescktopMenu() ;

  //initGoBig() ;

  $('.same-height').matchHeight();
  $('.same-height-2').matchHeight();

});
// $
