var main;
$(document).ready(function(){
	// 場景
	createWorld=function(world_handles){
		world_handles = world_handles || [];
		var ta=$('<table></table>').css({border:'5px ridge #303030',backgroundColor:'lightgreen',borderCollpase:'collpase',transform:'perspective(600px) rotateX(45deg)',marginLeft:'auto',marginRight:'auto'});
		var tr=$('<tr></tr>').css({margin:0,padding:0,borderWidth:0,border:'none'});
		var td=$('<td></td>').css({width:30,height:30,display:'inline-block',margin:0,padding:0,borderWidth:0});

		for(var i=0;i<25;i++){
			var _tr=tr.clone();
			for(var j=0;j<25;j++){
				_tr.append(td.clone().attr({x:j,y:i,title:j+','+i}));
			};
			ta.append(_tr);
		};

		// 場景大小邊界
		ta.min_x=0;
		ta.max_x=ta.find('tbody>tr').first().find('td').length-1;
		ta.min_y=0;
		ta.max_y=ta.find('tbody>tr').length-1;

		$('div#main').append(ta);
		ta.do_somethings=world_handles;
		return ta;
	};

	// 蛇
	snake=function(world){
		var start_pos=[12,14];
		var start_len=1;
		var default_dir=['x','+'];
		var this_snake=this;	// 要做好 handle
		this.len=start_len;
		this.body_=[start_pos];
		this.dir=default_dir;

		// 畫面更新的時候要 call
		this_snake.draw_to_scene=function(){
			ta.find('td:not([who=food])').css({backgroundColor:'transparent'});
			for(var i in this_snake.body_){
				ta.find('td:not([who=food])[x='+this_snake.body_[i][0]+'][y='+this_snake.body_[i][1]+']').css({backgroundColor:'#303030'})
			}
		}

		// 慣性運動
		this_snake.always_do=function(){

			var pos_last=$(this_snake.body_);

			switch(this_snake.dir.toString()){
				case 'x,+':
					(this_snake.body_[0][0]+1<=ta.max_x) ? this_snake.body_[0][0]+=1 : this_snake.dir=['y','+'];
					break;
				case 'x,-':
					(this_snake.body_[0][0]-1>=ta.min_x) ? this_snake.body_[0][0]-=1 : this_snake.dir=['y','-'];
					break;
				case 'y,+':
					(this_snake.body_[0][1]+1<=ta.max_y) ? this_snake.body_[0][1]+=1 : this_snake.dir=['x','-'];
					break;
				case 'y,-':
					(this_snake.body_[0][1]-1>=ta.min_y) ? this_snake.body_[0][1]-=1 : this_snake.dir=['x','+'];
					break;
			}

			this_snake.draw_to_scene();

			// do world handle
			for(var i in world.do_somethings){world.do_somethings[i]();}
			setTimeout(this_snake.always_do, 80); // timer 的 this 不是 snake
		}

		this_snake.setup_keyboard_event=function(){
			$(document).keydown(function(e){
				switch(e.keyCode){
					case 87:
						this_snake.dir=['y','-'];
						break;
					case 83:
						this_snake.dir=['y','+'];
						break;
					case 65:
						this_snake.dir=['x','-'];
						break;
					case 68:
						this_snake.dir=['x','+'];
						break;
				}
			});
		};
	}

	// 蘋果
	var food=function(){
		// 起始位置
		var start_pos=[5,14];
		// 定義 Handle
		var food=this;
		food.pos=start_pos;

		// 畫面更新的時候要 call
		food.draw_to_scene=function(){
			ta.find('td[who=food]').css({backgroundColor:'transparent'});
			ta.find('td[x='+food.pos[0]+'][y='+food.pos[1]+']').css({backgroundColor:'red'}).attr({who:'food'});
		};

		// 隨機位置
		food.randomize_pos=function(){
			food.pos=[Math.round(Math.random()*24),Math.round(Math.random()*24)];
			food.draw_to_scene();
		};
	};


	var second,main,score;
	score=0
	// create world
	ta=createWorld([
		function(){
			if(second && second.pos.toString()==main.body_[0].toString()){
				second.randomize_pos();
				score+=1;
				ta.find('td[x=0][y=24]').text(score);
			};

			second ? console.log(second.pos.toString()==main.body_[0].toString()) : undefined;
		}
	]);

	// create player, into the ta of world
	main=new snake(ta);
	main.draw_to_scene();
	main.always_do();
	main.setup_keyboard_event();

	// create food
	second=new food;
	second.draw_to_scene();
});