var main;
$(document).ready(function(){
	main=$('body > div#main');

	main.css({
		position:'relative'
	});

	var span=$('<span></span>').css({
		display: 'inline-block',
		width: 20,
		height: 20,
		position: 'absolute',
		left: 0,
		top: 0,
		backgroundColor: 'grey',
	});

	// 蛇的行為
	span.appendTo(main);
	span.current_move=['+','-'];
	span.direction=['left','top'];
	span.moveFunc=function(e){
		span.current_move.to=span.current_move.to || span.current_move[0];
		span.direction.to=span.direction.to || span.direction[0];
		var c={};c[span.direction.to]=span.current_move.to+'=1';
		span.css(c);
		if( parseInt(span.css(span.direction.to))+parseInt(span.css('width')) >= parseInt(span.parent().css('width')) )
		{
			span.current_move.to=span.current_move[1];
			clearInterval(span.snakeActive);
			span.snakeActive=setInterval(span.moveFunc, 10);
		}
		else if( parseInt(span.css(span.direction.to))<=0 ){
			span.current_move.to=span.current_move[0];
			clearInterval(span.snakeActive);
			span.snakeActive=setInterval(span.moveFunc, 10);
		}
	}

	span.snakeActive=setInterval(span.moveFunc, 10);
});