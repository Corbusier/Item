class Gobang{
	constructor(options){
		this.options = options;
		this.gobang = document.getElementById(options.canvas || 'gobang');
		this.chessboard = this.gobang.children[0];
		this.chessmans = this.gobang.children[1];
		this.gobangStyle = Object.assign({
			padding : 30,
			count   : 15
		},options.gobangStyle || {});
		//定义棋盘元素的宽高
		this.lattice = {
			width : (this.gobang.clientWidth - this.gobangStyle.padding
				    *2 ) / this.gobangStyle.count,
			height : (this.gobang.clientHeight - this.gobangStyle.padding
				    *2 ) / this.gobangStyle.count
		};
		this.resetInit();
	}
	resetInit(){
		const {options} = this;
		this.role = options.role;
		this.win = false;
		this.history = [];
		this.currentStep = 0;
		this.chessmans.onclick = null;
		this.chessmans.innerHTML = "";
		this.drawChessboard();
		this.initChessboardMatrix();
		this.listenDownChessman();
	}
	drawChessboard(){
		const { gobangStyle,gobang } = this;
		const lattices = Array.from({
			length : Math.floor(gobangStyle.count * gobangStyle.count)
		},() => `<span class="lattice"></span>`).join("");
		this.chessboard.className = `chessboard lattice-${
									gobangStyle.count}`;
		this.gobang.style.border  = `${gobangStyle.padding}px 
									solid #ddd`;
		this.chessboard.innerHTML = lattices;
	}
	//棋盘矩阵,判断输赢规则时的依据基础
	initChessboardMatrix(){
		const checkerboard = [];
		for(let x = 0;x < this.gobangStyle.count + 1;x++){
			checkerboard[x] = [];
			for(let y = 0;y < this.gobangStyle.count + 1;y++){
				checkerboard[x][y] = 0;
			}
		}
		this.checkerboard = checkerboard;
	}
	//落子
	/*
		空位才可以落子，并且记录当次在哪一行落子，role
		落子后更新矩阵，切换角色，并记录
		落子完毕后，有可能是悔棋之后落子的，这种情况下就该重置历史记录
	*/
	listenDownChessman(isBlack = false){
		this.chessmans.onclick = event => {
			if(event.target.className.includes('chessman ')){
				return false;
			}
			let {offsetX : x,offsetY : y} = event;
			x = Math.round(x / this.lattice.width);
			y = Math.round(y / this.lattice.height);
			const effectiveBoard = !!this.checkerboard[x];
			if(effectiveBoard && this.checkerboard[x][y] !== undefined
							  && this.checkerboard[x][y] === 0){
				this.checkerboard[x][y] = this.role;
				this.drawChessman(x, y, Object.is(this.role,1));
				this.history.length = this.currentStep;
				this.history.push({ x,y,role:this.role });
				this.currentStep++;
				this.role = this.role == 1? 2 : 1;
			} 
		};
	}
	drawChessman(x,y,isBlack){
		const { gobangStyle,lattice,gobang } = this;
		const newChessman = document.createElement("div");
		newChessman.setAttribute("id",`x${x}-y${y}-r${isBlack ? 1 : 2}`);
		newChessman.className    = isBlack ? "chessman black" : "chessman white";
		newChessman.style.width  = lattice.width * 0.6;
		newChessman.style.height = lattice.height * 0.6;
		newChessman.style.left   = (x * lattice.width) - lattice.width * 0.3;
		newChessman.style.top    = (y * lattice.height) - lattice.height * 0.3;
		this.chessmans.appendChild(newChessman);
		setTimeout(() => {
			this.checkReferee(x,y,isBlack? 1 :2);
		},0);
	}
	//判断胜负
	checkReferee(x,y,role){
		if((x === undefined) || (y === undefined) || (role === 
			undefined)) return;
		let countContinuous = 0;
		const XContinuous   = this.checkerboard.map(x => x[y]);
		const YContinuous   = this.checkerboard[x];
		const S1Continuous  = [];
		const S2Continuous  = [];
		this.checkerboard.forEach((value,index) => {
			const S1Item = value [y - (x - index)];
			if(S1Item !== undefined){
				S1Continuous.push(S1Item);
			}
			const S2Item = value[y + (x -index)];
			if(S2Item !== undefined){
				S2Continuous.push(S2Item);
			}
		});
		[XContinuous,YContinuous,S1Continuous,S2Continuous].
			forEach(axis => {
				if(axis.some((value,index) => axis[index] !== 0 &&
				   axis[index - 2] === axis[index - 1] &&
				   axis[index - 1] === axis[index] && 
				   axis[index] === axis[index + 1] &&
				   axis[index + 1] === axis[index + 2])){
				   countContinuous ++;
				}
			}
		);
		//if win,解绑事件
		if(countContinuous){
			this.chessmans.onclick = null;
			this.win = true;
			alert((role == 1?'黑' : '白') + '子胜,' +
				 countContinuous + '杀!');
		}
	}
	//悔棋
	//找到最后一次的记录,更新矩阵及移除这一步
	regretChess(){
		if (this.history.length && !this.win) {
			const prev = this.history[this.currentStep - 1];
			if(prev){
				const { x, y, role } = prev;
				const targetChessman = document.getElementById(`x${x}-y${y}-r${role}`);
				targetChessman.parentNode.removeChild(targetChessman);
				this.checkerboard[prev.x][prev.y] = 0;
				this.currentStep--;
			}
		}
	}
	//撤销悔棋
	revokedRegretChess() {
		const next = this.history[this.currentStep];
		console.log(this.history);
		if (next) {
			this.drawChessman(next.x, next.y, next.role === 1);
			this.checkerboard[next.x][next.y] = next.role;
			this.currentStep++;
		}
	}
}