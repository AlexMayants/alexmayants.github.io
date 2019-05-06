/////////////////////////////////////////////////////////////////////////////////
// Вызов всех событий, которые необходимо зарегистрировать
function commonEventExecutor( eventName, eventObject )
{
  try
  {
    if( typeof gtag === "function" ) gtag('event', eventName, eventObject ) ;
    if( typeof yaCounter49915489 === "object" ) yaCounter49915489.reachGoal( eventName ) ;
  }
  catch( error )
  {
    console.log( 'commonEventExecutor', error ) ;    
  }
}
// commonEventExecutor


/////////////////////////////////////////////////////////////////////////////////
// Регистрируем точки вызова событий
// Тут мы собираем нажатия на ссылки, у которых есть атрибут data-event
$( function()
{
  $('a[data-event]').click( function( e )
  {
    var eventName = $(this).data('event') ;
    var eventCategory = $(this).data('event-category') ;

    commonEventExecutor( eventName, { 'event_category' : eventCategory }) ;
  }) ;
}) ;
// $
