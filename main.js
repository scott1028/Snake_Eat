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
	}).attr({
		id:'snake'
	});

	// 蛇的常規行為
	span.appendTo(main);
	span.current_move=['+','-'];
	span.direction=new Object;
	span.moveFunc=function(e){
		span.current_move.to=span.current_move.to || span.current_move[0];
		span.direction.x=span.direction.x || 'left';
		span.direction.y=span.direction.y || 'width';
		var c={};c[span.direction.x]=span.current_move.to+'=1';
		span.css(c);
		if( parseInt(span.css(span.direction.x))+parseInt(span.css(span.direction.y)) >= parseInt(span.parent().css(span.direction.y)) )
		{
			span.current_move.to=span.current_move[1];
			span.snakeActive=setTimeout(span.moveFunc, 10);
		}
		else if( parseInt(span.css(span.direction.x))<=0 ){
			span.current_move.to=span.current_move[0];
			span.snakeActive=setTimeout(span.moveFunc, 10);
		}
		else{
			setTimeout(span.moveFunc, 10);
		}
	};span.snakeActive=setTimeout(span.moveFunc, 10);

	// 監聽鍵盤操作
	$(document).keydown(function(e){
		switch(e.keyCode){
			case 87:
				span.direction.x='top';
				span.direction.y='height';
				span.current_move.to=span.current_move[1];
				break;
			case 83:
				span.direction.x='top';
				span.direction.y='height';
				span.current_move.to=span.current_move[0];
				break;
			case 65:
				span.direction.x='left';
				span.direction.y='width';
				span.current_move.to=span.current_move[1];
				break;
			case 68:
				span.direction.x='left';
				span.direction.y='width';
				span.current_move.to=span.current_move[0];
				break;
		}
	});
});