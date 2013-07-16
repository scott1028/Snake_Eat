$(document).ready(function(){
	// 場景
	createWorld=function(world_handles){
		world_handles = world_handles || [];
		var ta=$('<table></table>').css({border:'5px ridge #303030',backgroundColor:'lightgreen',borderCollpase:'collpase',transform:'perspective(600px) rotateX(45deg)',marginLeft:'auto',marginRight:'auto'});
		//var ta=$('<table></table>').css({border:'5px ridge #303030',backgroundColor:'lightgreen',borderCollpase:'collpase',marginLeft:'auto',marginRight:'auto'});
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
		var start_body=[[12,14],[11,14],[10,14],[9,14],[8,14],[7,14]];
		var start_len=1;
		var default_dir=['x','+'];
		var this_snake=this;	// 要做好 handle
		this.len=start_len;
		this.body_=start_body;
		this.dir=default_dir;

		// 畫面更新的時候要 call
		this_snake.draw_to_scene=function(){
			ta.find('td:not([who=food])').css({backgroundColor:'transparent'});
			for(var i in this_snake.body_){
				if(this_snake.body_[i][0]!=undefined && this_snake.body_[i][1]!=undefined){	// 排除虛增的身體長度
					ta.find('td:not([who=food])[x='+this_snake.body_[i][0]+'][y='+this_snake.body_[i][1]+']').css({backgroundColor:'#303030'});
				}
			}
		}

		// 慣性運動
		this_snake.always_do=function(){

			var pos_last=$(this_snake.body_);

			var head=$(this_snake.body_[0]);  		// 複製蛇頭坐標,因為 Array 的指向會是參考所以要用複製的
			var tail=this_snake.body_.pop();		// 拿掉尾巴坐標

			switch(this_snake.dir.toString()){
				case 'x,+':
					(head[0]+1<=ta.max_x) ? head[0]+=1 : this_snake.dir=['y','+'];
					break;
				case 'x,-':
					(head[0]-1>=ta.min_x) ? head[0]-=1 : this_snake.dir=['y','-'];
					break;
				case 'y,+':
					(head[1]+1<=ta.max_y) ? head[1]+=1 : this_snake.dir=['x','-'];
					break;
				case 'y,-':
					(head[1]-1>=ta.min_y) ? head[1]-=1 : this_snake.dir=['x','+'];
					break;
			}

			// 把新的蛇頭接上
			this_snake.body_.unshift(head);			//this_snake.body_.forEach(function(r,i,s){console.log(r,i,s)});

			// update screen
			this_snake.draw_to_scene();

			// do world handle
			for(var i in world.do_somethings){
				world.do_somethings[i]();
			}
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
			ta.find('td[who=food]').css({backgroundColor:'transparent'}).attr({who:''});
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
			if(second && second.pos.toString()==main.body_[0].toArray().toString()){
				second.randomize_pos();
				score+=1;
				ta.find('td[x=0][y=24]').text(score);
				main.body_.push([undefined,undefined]); // 畫圖的時候只要排除 [undefine,undefined] 即可！
			};
		}
	]);
	
	// create player, into the ta of world
	main=new snake(ta);
	main.draw_to_scene();
	//setTimeout(main.always_do,100);
	setInterval(main.always_do,100);
	main.setup_keyboard_event();

	// create food
	second=new food;
	second.draw_to_scene();
	a=main;
	
});
