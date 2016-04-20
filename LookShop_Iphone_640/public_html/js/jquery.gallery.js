function step(direct,shag,speed,easing){
	var marginLeft = parseInt($carusel.css('marginLeft'));// ������� ��������� ��������
	var wdth = caruselWidth() - galleryWidth; // ������������ ��������� �����
	if( direct > 0 ){
		// ��������� �����
		// ���� ������� ��������� + shag �� ��������� ����������� ����������
		if( wdth >= Math.abs(marginLeft)+shag ){
			// �� ������ ������������ �� shag
			$carusel.stop().animate({'marginLeft':'-='+shag+'px'},speed,easing)
		// ����� ����������� �� ����, � ���
		}else $carusel.stop().animate({'marginLeft':'-'+wdth+'px'},speed,easing)
	}else{
		// ���������� ��� ��������� ������, �� ��� ������ �� ����
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
var galleryWidth = 0; // ������ ����� ��������
var shag = 200; // ��� ������ ���� ����� ������� �������� �� 100 ������
var speed = 200; // ����� � �������������, �� ������� ������� ������� 1 ���, �.�. ��������� �� shag ��� 200px
var $gallery  = 0; // ��������������� ����������, ��� ����������, ����� �� ����� ������ ������
var $carusel = 0; // ������� ��� �������� ������� ��������, � ����� ������������ ������ �� ����
var $items = 0;
$(function(){
	// ��������� ������� ���� ������ ����� ����, ��� DOM ��������� ��������
	$gallery = $('.gallery'); // ������� ���� �������
	$carusel = $gallery.find('.carusel');// ������� � ��� ��������
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
		evnt.stopPropagation&&evnt.stopPropagation(); // ���� ��������������, ���������
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