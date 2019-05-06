



////////////////////////////////////////////////////////////////////////////////////////////////////
// Прокручивает экран до следующего маркера .js-next-step-end
function scrollToNextEnd()
{
  var marker = $('.js-next-step-end').last() ;
  var vpHeight = $(window).height() ;

  if( marker )
  {
    var destination = $(marker).offset().top + 50 - vpHeight ;
    $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination }, 400 );
  }
}
// scrollToNextEnd


////////////////////////////////////////////////////////////////////////////////////////////////////
// Прокручивает экран до следующего маркера .js-next-step-start
function scrollToNextStart()
{
  var marker = $('.js-next-step-start').last() ;

  if( marker )
  {
    var destination = $(marker).offset().top - 200 ;
    $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination }, 400 );
  }
}
// scrollToNextStart


////////////////////////////////////////////////////////////////////////////////////////////////////
// Крутим экран до указанного маркера
$(document).on( 'click', '.js-scroll', function(e )
{
  e.preventDefault() ;
  var marker = $($(this).data('target')) ;

  if( marker )
  {
    var destination = $(marker).offset().top - 200 ;
    $("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination }, 400 );
  }
}) ;
// js-scroll').click






////////////////////////////////////////////////////////////////////////////////////////////////////
// Выполнить смену пароля
function initPasswordRecover()
{
	// Смена пароля 
 	$('#js-change-password-do').click( function( e )
	{
		e.preventDefault() ;
		$('#js-change-password-error').hide() ;

		var request = 'index.php?action=dorecoverpassword' ;
		var code = $('#code').val() ;
		var p1 = $('#p1').val() ;
		var p2 = $('#p2').val() ;
		var data = { code : code, password : p1 } ;

		if( p1.length < 6 ) 
		{
			$('#js-change-password-error').text('Слишком короткий пароль, надо не меньше 6 символов').show() ;
      $('#p1').focus() ;
			return ;
		}	

		if( p1 != p2 )
		{
			$('#js-change-password-error').text('Ощибка. Пароли не совпадают').show() ;
      $('#p1').focus() ;
			return ;
		}


		$.getJSON( request, data, function( data )
		{
			if( data.error )
			{
				$('#js-change-password-error').text( data.error ).show() ;
			}				
			else
			{
				$('#js-change-password-error').hide() ;
				$('#js-change-password-done').show() ;
				$('#js-change-password-step1').hide() ;
			}
		})
		.error( function( e )
		{
			alert( e.responseText ) ;
			console.log( e.responseText ) ;
		}) ;
		// getJSON
	}) ;
}	
// initPasswordRecover


////////////////////////////////////////////////////////////////////////////////////////////////////
// Отдельная процедура для регистрации
// В качестве параметра передается функция, которая отработает после того, как регистрация успешна
function initRegister( callbackFunction )
{
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Регистрация
  $('#js-register-do').click( function( e )
  {
    e.preventDefault() ;

    $('#js-register-error').hide() ;
    $('#js-register-do').addClass('waiting') ;

    var request = 'index.php?action=registerpromo' ;
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
        callbackFunction() ;
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
}
// initRegister


////////////////////////////////////////////////////////////////////////////////////////////////////
// Вход в кабинет
function initLogin()
{
  $('#js-login-phone').focus() ;

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

    var request = 'index.php?action=cabinetlogin' ;
    var objectID = $('#js-object-id').val() ;
    var optionID = $('#js-option-id').val() ;
    var date = $('#js-date').val() ;
    var start = $('#js-start').val() ;
    var login = $('#js-login-phone').val() ;
    var password = $('#js-login-password').val() ;

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
        // Просто перезагружаем страницу
        location.reload() ;

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


}
// initLogin


////////////////////////////////////////////////////////////////////////////////////////////////////
// Операции на главной странице кабинета
function initCabinetMain()
{

  $('#js-logout').click( function(e)
  {
    e.preventDefault() ;
    $.getJSON( 'index.php?action=logout', function( data )
    {
      location.reload() ;
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON

  }) ;
  // js-logout.click


  /////////////////////////////////////////////////////////////////////////////
  // Хотим сменить email
  $('#js-change-email').click( function(e)
  {
    e.preventDefault() ;
    var oldEmail = $('#js-customer-email').val() ;

    $('#js-customer-email').data( 'old', oldEmail ) ;
    $('#js-change-email-cancel').show() ;
    $('#js-change-email-do').show() ;
    $('#js-change-email').hide() ;
    $('#js-customer-email').attr( 'disabled', false ).val('').css('width', 'calc(100% - 225px)').focus() ;
  }) ;
  // js-change-phone.click


  /////////////////////////////////////////////////////////////////////////////
  // Отмена смены email
  $('#js-change-email-cancel').click( function(e)
  {
    e.preventDefault() ;
    var oldEmail = $('#js-customer-email').data('old') ;
    $('#js-customer-email').attr( 'disabled', true ).val(oldEmail).css('width', 'calc(100% - 140px)').focus() ;

    $('#js-change-email-cancel').hide() ;
    $('#js-change-email-do').hide() ;
    $('#js-change-email').show() ;
  }) ;
  // js-phone-edit-cancel.click


  /////////////////////////////////////////////////////////////////////////////
  // Начали смену email
  $('#js-change-email-do').click( function(e)
  {
    e.preventDefault() ;
    var email = $('#js-customer-email').val() ;
    var request = '?action=emailchange' ;

    $('#js-change-email-do').addClass('waiting') ;

    $.getJSON( request, { email : email }, function( data )
    {
      $('#js-change-email-do').removeClass('waiting') ;

      if( data.error )
      {
        $('#js-emeil-error').text( data.error ).show() ;
      }       
      else
      {
        $('#js-customer-email').hide() ;
        $('#js-email-error').hide();
        $('#js-change-email-cancel').hide() ;
        $('#js-change-email-do').hide() ;
        $('#js-change-email').hide() ;
        $('#js-email-done').show() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON

  }) ;
  // js-phone-edit-cancel.click




  /////////////////////////////////////////////////////////////////////////////
  // Хотим сменить номер
  $('#js-change-phone').click( function(e)
  {
    e.preventDefault() ;
    $('#js-phone-show').hide() ;
    $('#js-phone-edit').show() ;
    $('#js-phone-code').hide() ;
    $('#js-new-phone').focus() ;
  }) ;
  // js-change-phone.click


  /////////////////////////////////////////////////////////////////////////////
  // Отмена смены номера
  $('#js-phone-edit-cancel,#js-phone-code-cancel').click( function(e)
  {
    e.preventDefault() ;
    $('#js-phone-show').show() ;
    $('#js-phone-edit').hide() ;
    $('#js-phone-code').hide() ;
  }) ;
  // js-phone-edit-cancel.click


  /////////////////////////////////////////////////////////////////////////////
  // Начинаем редактирование
  $('#js-edit-mode').click( function(e)
  {
    e.preventDefault() ;

    $(this).hide() ;
    $('.js-edit-customer').attr( 'disabled', false ) ;
    $('#js-edit-ok').css('display','inline-block') ;
    $('#js-edit-cancel').css('display','inline-block') ;
    $('#js-customer-name').focus() ;
  }) ;
  // js-edit-mode.click


  /////////////////////////////////////////////////////////////////////////////
  // Отменить редактирование
  $('#js-edit-cancel').click( function(e)
  {
    e.preventDefault() ;
    location.reload() ;
  }) ;
  // js-edit-cancel.click


  /////////////////////////////////////////////////////////////////////////////
  // Сохранить данные клиента
  $('#js-edit-ok').click( function(e)
  {
    e.preventDefault() ;
    $(this).addClass('waiting') ;

    var request = 'index.php?action=updatecustomer' ;
    var name = $('#js-customer-name').val() ;
    var nickname = $('#js-customer-nickname').val() ;
    var ccode = $('#js-new-country-code').val() ;
    var phone = $('#js-new-phone').val() ;
    var sex = $('#js-customer-sex').val() ;
    var lang = $('#js-customer-lang').val() ;
    var born = $('#js-customer-born').val() ;

    $.getJSON( request, { name : name, nickname : nickname, phone : phone, ccode : ccode, sex : sex, lang : lang, born : born }, function( data )
    {
      $('.waiting').removeClass('waiting') ;

      if( data.error )
      {
        $('#error').text( data.error ).show() ;
        $( data.id ).focus() ;
      }       
      else
      {
        location.reload() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON    
  }) ;
  // js-edit-ok.click


  /////////////////////////////////////////////////////////////////////////////
  // Отправить код на смену телефона
  $('#js-send-code').click( function(e)
  {
    e.preventDefault() ;
    var country = $('#js-new-country-code').val() ;
    var phone = $('#js-new-phone').val() ;

    var request = 'index.php?action=phonechangesendcode' ;
    $(this).addClass('waiting') ;

    $.getJSON( request, { country : country, phone : phone }, function( data )
    {
      $('.waiting').removeClass('waiting') ;

      if( data.error )
      {
        $('#error').text( data.error ).show() ;
      }       
      else
      {
        $('#js-phone-edit').hide() ;
        $('#js-phone-show').hide() ;
        $('#js-phone-code').show() ;
        $('#js-code-from-sms').focus() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON    
  }) ;
  // js-cancel-set-yes.click


  /////////////////////////////////////////////////////////////////////////////
  // Проверяем код и меняем номер в случае успеха
  $('#js-check-sms-code').click( function(e)
  {
    e.preventDefault() ;
    var country = $('#js-new-country-code').val() ;
    var phone = $('#js-new-phone').val() ;
    var code = $('#js-code-from-sms').val() ;

    var request = 'index.php?action=phonechange' ;
    $(this).addClass('waiting') ;

    $.getJSON( request, { country : country, phone : phone, code : code }, function( data )
    {
      $('.waiting').removeClass('waiting') ;

      if( data.error )
      {
        $('#error').text( data.error ).show() ;
      }       
      else
      {
        location.reload() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON    
  }) ;
  // js-cancel-set-yes.click


  /////////////////////////////////////////////////////////////////////////////
  // Начать смену пароля
  $('#js-change-password').click( function(e)
  {
    e.preventDefault() ;
    $('#js-change-password').hide() ;
    $('#js-change-password-container').show() ;
    $('#js-block1').hide() ;
    $("html, body").animate({ scrollTop: 0 }, "slow") ;
  }) ;
  // #js-change-password.click


  /////////////////////////////////////////////////////////////////////////////
  // Отменить смену пароля
  $('#js-change-password-cancel').click( function(e)
  {
    e.preventDefault() ;
    $('#js-change-password').show() ;
    $('#js-change-password-container').hide() ;
    $('#js-block1').show() ;
  }) ;
  // #js-change-password-cancel.click


  /////////////////////////////////////////////////////////////////////////////
  // Смена пароля
  $('#js-change-password-do').click( function(e)
  {
    e.preventDefault() ;
    var old = $('#js-old-password').val() ;
    var new1 = $('#js-new-password-1').val() ;
    var new2 = $('#js-new-password-1').val() ;

    var request = 'index.php?action=changepassword' ;
    $(this).addClass('waiting') ;

    $.getJSON( request, { old : old, new1 : new1, new2 : new2 }, function( data )
    {
      $('.waiting').removeClass('waiting') ;

      if( data.error )
      {
        $('#js-change-passsword-error').text( data.error ).show() ;
      }       
      else
      {
        $('#js-change-password-container').hide() ;
        $('#js-change-passoword-done').show() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON    
  }) ;
  // js-change-password-do.click



  /////////////////////////////////////////////////////////////////////////////
  // Начать отмену
  $('.js-cancel-set').click( function(e)
  {
    e.preventDefault() ;
    var id = $(this).data('id') ;

    $('.js-cancel-set').show() ;
    $('.js-cancel-set-yes').hide() ;
    $('.js-cancel-set-no').hide() ;
    $('.error').hide() ;

    $(this).hide() ;
    $('#set-' + id + ' .js-cancel-set-yes').css( 'display', 'inline-block' ) ;
    $('#set-' + id + ' .js-cancel-set-no').css( 'display', 'inline-block' ) ;
  })
  // js-cancel-set.click


  /////////////////////////////////////////////////////////////////////////////
  // Отменить отмену
  $('.js-cancel-set-no').click( function(e)
  {
    e.preventDefault() ;
    var id = $(this).data('id') ;

    $(this).hide() ;
    $('.error').hide() ;
    $('#set-' + id + ' .js-cancel-set').css( 'display', 'inline-block' ) ;
    $('.js-cancel-set-yes').hide() ;
    $('.js-cancel-set-no').hide() ;
  })
  // js-cancel-set.click


  /////////////////////////////////////////////////////////////////////////////
  // Отменить бронирование
  $('.js-cancel-set-yes').click( function(e)
  {
    e.preventDefault() ;
    var id = $(this).data('id') ;
    var request = 'index.php?action=cancelbooking' ;
    $(this).addClass('waiting') ;

    $.getJSON( request, { id : id }, function( data )
    {
      $('.waiting').removeClass('waiting') ;

      if( data.error )
      {
        $('#set-' + id + ' .error').text( data.error ).show() ;
      }       
      else
      {
        location.reload() ;
      }
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON    
  }) ;
  // js-cancel-set-yes.click

  $('#js-archive').click( function(e)
  {
    e.preventDefault() ;


    $('#js-cabinet-set-container .cabinet-set-container').html('').addClass('waiting') ;

    $('#js-cabinet-set-container').load( 'index.php?action=getarchive', function()
    {
      $('#js-cabinet-set-container .cabinet-set-container').removeClass('waiting') ;
    }) ;

  }) ;
  // js-archive.click


} 
// initCabinetMain



function initReplay()
{
	/////////////////////////////////////////////////////////////////////////////
	// Начать процедуру удаления отзыва
	$('.deleteReplay').click( function( e )
	{
		e.preventDefault() ;
		$('.confirmDeleteReplay').hide() ;
		$('.deleteReplay').show() ;
		$(this).hide() ;
		var el = $(this).data('el') ;
		$('#'+el).show() ;
	}) ;
	// deleteReplay.click


	/////////////////////////////////////////////////////////////////////////////
	// Удаляем отзыв
	$('.confirmDeleteReplay').click( function( e )
	{
		var id = $(this).data('id') ;
		var request = 'index.php?action=deletereplay&id=' + id ;
		$(this).addClass('waiting') ;

		$.getJSON( request, function( data )
		{
			location.reload() ;
		})
		.error( function( e )
		{
			alert( e.responseText ) ;
			console.log( e.responseText ) ;
		}) ;
		// getJSON
	}) ;
	// confirmDeleteReplay.click
}
// initReplay


////////////////////////////////////////////////////////////////////////////////////////////////////
// История заказов - детализация
function cabinetHistoryItems()
{	
	$('#showReplayDialogue').click( function( e )
	{
		e.preventDefault() ;
		$(this).hide() ;
		$('#replayContainer').show() ;
		$('#text').val('').focus() ;
	}) ;
	// showReplayDialogue.click


	// Оценка
	$('.starIcon').click( function()
	{
		var id = parseInt( $(this).data('id') ) || 0 ;

		for( i = 1 ; i <= id ; i++ )
		{ 
			$('#rate'+i).removeClass( 'starEmpty' ) ;
		}

		for( i = i ; i <= 5 ; i++ )
		{ 
			$('#rate'+i).addClass( 'starEmpty' ) ;
		}

		$('#rate').val( id ) ;
	}) ;
	// starIcon


	// Отправляем отзыв
	$('#form').submit( function( e )
	{
		e.preventDefault() ;
		var data = new FormData(this) ;
		var request = $(this).attr('action') ;

		$('#do').addClass('waiting') ;
		$('#error').hide() ;

        $.ajax({
            type:'POST',
            url: request,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json', 
            success:function(data)
            {
				$('#do').removeClass('waiting') ;
            	if( data.error )
            	{
            		$('#error').text( data.error ).show() ;
            		return ;
            	}

            	$('#replayDone').show() ;
				$('#replayContainer').hide() ;

            },
            error: function(data)
            {
            	console.log(data) ;
            }
        });
        // ajax		
	}) ;
	// form.submit
}
// cabinetHistoryItems() ;


////////////////////////////////////////////////////////////////////////////////////////////////////
// Кабинет - персональные данные
function initCabinetData()
{
	// Изменить персональные данные
	$('#do').click( function( e )
	{
		e.preventDefault() ;
		var request = 'index.php?action=personaldata' ;
		var data = { f : $('#f').val(), i : $('#i').val(), o : $('#o').val(), phone : $('#phone').val(), email : $('#email').val(), address : $('#address').val() } ;

		$('#error').hide() ;
		$('#do').addClass('waiting') ;

		$.getJSON( request, data, function( data )
		{
			$('#do').removeClass('waiting') ;

			if( data.error )
			{
				$('#error').text( data.error ).show() ;
				$( '#' + data.id ).focus() ;
				return ;
			}

			$('#personalData').hide() ;
			$('#done').show() ;
		})
		.error( function( e )
		{
			alert( e.responseText ) ;
			console.log( e.responseText ) ;
		}) ;
		// getJSON

	}) ;
	// do.click 


	$('#changepassword').click( function( e )
	{
		e.preventDefault() ;
		var request = 'index.php?action=changepassword' ;
		var data = { password : $('#password').val(), p1 : $('#p1').val(), p2 : $('#p2').val() } ;

		$('#error2').hide() ;
		$('#changepassword').addClass('waiting') ;

		$.getJSON( request, data, function( data )
		{
			$('#changepassword').removeClass('waiting') ;

			if( data.error )
			{
				$('#error2').text( data.error ).show() ;
				$( '#' + data.id ).focus() ;
				return ;
			}

			$('#personalData').hide() ;
			$('#done2').show() ;
		})
		.error( function( e )
		{
			alert( e.responseText ) ;
			console.log( e.responseText ) ;
		}) ;
		// getJSON

	}) ;
	// do.click 
}
// initCabinetData


function initFBVKshare()
{
  $('#js-start-share').click( function(e)
  {
    e.preventDefault() ;
    $(this).hide() ;
    $('#js-share-now').slideDown() ;
    $('#js-fb-share').focus() ;

  }) ;
  // js-start-share.click

  $('#js-do-share').click( function(e)
  {
    e.preventDefault() ;
    $('#js-do-share').addClass('waiting') ;

    var request = '?action=updatesociallinks' ;
    var fbLink = $('#js-fb-share').val() ;
    var vkLink = $('#js-vk-share').val() ;

    $.getJSON( request, { fb : fbLink, vk : vkLink }, function( data )
    {
      $('#js-do-share').removeClass('waiting') ;

      $('#js-share-now').hide() ;
      $('#js-share-done').show() ;
    })
    .error( function( e )
    {
      alert( e.responseText ) ;
      console.log( e.responseText ) ;
    }) ;
    // getJSON
  }) ;
  // js-do-share.click
}
// initFBVKshare()








////////////////////////////////////////////////////////////////////////////////////////////////////
// Покупка дополнительных мест
function initPlus()
{
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Переключание между разным количеством мест 
  $('.js-select-qty-option').off().click( function( e )
  {
    e.preventDefault() ;
    e.stopPropagation() ;
    var href = '#' + $(this).attr('href') ;
    $('.js-select-qty-option').removeClass('hide') ;
    $(this).addClass('hide') ;

    $('.js-capacity-action').addClass('hide') ;
    $(href).removeClass('hide') ;
  }) ;
  // js-select-qty-option.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Управление чекбоксами
    $('.js-select-payment-option').click( function( e )
  {
    var code = $(this).data('code') ;
    var qty = $(this).data('qty') ;
    var buttonText = $(this).data('button-text') ;

    // Снимаем чекбоксы
    $('input.js-qty-'+qty).prop( 'checked', false ) ;
    // Ставим текущий
    $(this).prev('input').prop( 'checked', true ) ;

    // Настраиваем кнопку
    $('.button-qty-'+qty).text( buttonText ).data( 'code', code ) ;
  }) ;
  // js-select-payment-option.click


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Кнопка оплаты
  $('.js-payment-button').off().click( function( e )
  {
    e.preventDefault() ;
    e.stopPropagation() ;

    var id = $('#id').val() ;
    var code = $(this).data('code') ;
    var qty = $(this).data('qty') ;
    var request = '?action=bookplus' ;

    $(this).addClass( 'waiting' ) ;

    $.getJSON( request, { id : id, code : code, qty : qty }, function( data )
    {
      $('.waiting').removeClass( 'waiting' ) ;

      if( data.error )
      {
        $('#js-plus-error').text( data.error ).show() ;
      }
      else
      {
        if( data.goto )
        {
          document.location.href = data.goto ;
          return ;          
        }
        else
        {
          $('#js-additional-place-container').hide() ;
          $('#js-add-done').show() ;
        }
      }
    })
  })
  .error( function( e )
  {
    alert( e.responseText ) ;
    console.log( e.responseText ) ;
  }) ;
  // getJSON

  // js-payment-button.click

}
// initPlus




