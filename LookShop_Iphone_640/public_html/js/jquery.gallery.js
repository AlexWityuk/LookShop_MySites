function step(direct,shag,speed,easing){
	var marginLeft = parseInt($carusel.css('marginLeft'));// текущее положение карусели
	var wdth = caruselWidth() - galleryWidth; // максимальная прокрутка влево
	if( direct > 0 ){
		// прокрутка влево
		// если текущая прокрутка + shag не превышает максимально допустимую
		if( wdth >= Math.abs(marginLeft)+shag ){
			// то просто прокручиваем на shag
			$carusel.stop().animate({'marginLeft':'-='+shag+'px'},speed,easing)
		// иначе докручиваем до края, и все
		}else $carusel.stop().animate({'marginLeft':'-'+wdth+'px'},speed,easing)
	}else{
		// аналогично для прокрутки вправо, но тут крутим до нуля
		if( 0 <= Math.abs(marginLeft)-shag ){
			$carusel.stop().animate({'marginLeft':'+='+shag+'px'},speed,easing)
		}else $carusel.stop().animate({'marginLeft':'0px'},speed,easing)
	}
}
var caruselWidth = function(){
	var w = 0;
	$items.each(function(){
		w+=$(this).find('img').width()+0;
	})
	return w;
}
var galleryWidth = 0; // ширина самой галлереи
var shag = 200; // при каждом шаге будем двигать карусель на 100 пиксел
var speed = 200; // время в миллисекундах, за которое галерея пройдет 1 шаг, т.е. сдвинется на shag или 200px
var $gallery  = 0; // вспомогательные переменные, они пригодятся, когда мы будем делать плагин
var $carusel = 0; // хороший тон находить элемент единожды, а потом использовать ссылку на него
var $items = 0;
$(function(){
	// запускать функцию надо только после того, как DOM полностью загружен
	$gallery = $('.gallery'); // находим нашу галерею
	$carusel = $gallery.find('.carusel');// находим в ней карусель
	$items = $carusel.find('div.owl-item');
	galleryWidth = $gallery.width()
	$('#next,#prev').click(function(){
		step($(this).attr("id")=='next'?1:-1,shag,speed,'linear');
	})
	var oldx =0 ,oldy = 0;
	var startDrag = false;
	var oldMargin = 0; 
	$items.mousedown(function(event){
		var evnt = event || window.event;
		if (evnt.preventDefault) evnt.preventDefault()
	}).click(function(){
		return false;
	})
	var oldmovex = 1;
	var oldmovetime = 1;
	var carWidth = 0;
	var curSpeedObj = {'x':0,'t':0};
	function measureSpeed(clientX){
		var curtime  = new Date().getTime();
		curSpeedObj.x = Math.abs(clientX-oldmovex);
		curSpeedObj.t = curtime-oldmovetime;
		oldmovex = clientX;
		oldmovetime = curtime;
	}
	$carusel.mousedown(function(event){
		var evnt = event || window.event;
		oldx = evnt.clientX;
		carWidth = caruselWidth();
		oldMargin =  parseInt($carusel.css('marginLeft'))
		startDrag = true;
	}).mousemove(function(event){
		if( startDrag ){
			var evnt = event || window.event;
			measureSpeed(evnt.clientX);
			var shg = evnt.clientX-oldx;
			if(  Math.abs(oldMargin) - shg <= carWidth - galleryWidth &&  Math.abs(oldMargin) - shg >= 0)
				$carusel.css('marginLeft',oldMargin+shg)
			else{
				if(Math.abs(oldMargin) - shg<=0)$carusel.css('marginLeft','0px');else $carusel.css('marginLeft','-'+(carWidth-galleryWidth)+'px');
			}
		}
	})
	var wheel = 0;
	$gallery.mousewheel(function(event,delta){
		var evnt = event || window.event;
		step(-delta,shag,speed,'swing');
		evnt.stopPropagation&&evnt.stopPropagation(); // если поддерживается, выполняем
		evnt.preventDefault&&evnt.preventDefault();
	})
	var _mouseup = function(event){
		if(startDrag){
			var evnt = event || window.event;
			startDrag = false;
			if(curSpeedObj.x/curSpeedObj.t>0.5){
				step(-(evnt.clientX-oldx),curSpeedObj.x*20,curSpeedObj.t*20,'linear');
				curSpeedObj.x = curSpeedObj.t = 0;
			}
		}
	}
	$(document).mouseup(_mouseup)
	$(window).mouseup(_mouseup)
})