# README

## 五子棋
使用ES6语法编写，运用其中"类"的概念，创建出游戏构造函数，实现简单的五子棋功能：

 - 定义棋盘
 - 判断胜负
 - 悔棋功能
 - 撤销悔棋
 - 重置

判断胜负的依据是：在定义棋盘的矩阵，对应四条轴的棋子数组，判断四条轴中是否有任一一条轴出现了连续且相同的五位数字(1"黑"或2"白")，如果出现，则游戏中止，出现胜者。

## JQuery插件
利用面向对象的思想，封装出可定制参数的JQuery插件。思路大致相同，在构造函数中传入默认参数，再复制传入的参数(如果有)，然后执行在构造函数原型对象上的函数，实现预设的功能。

### 使用方法
因为是静态方法，所以必须是JQuery类才能调用方法，例如其中的`jQuery.dialog.js`弹框插件。

```js
    <button type=""id="btn">Click Me!</button>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
	<script src="jQuery.dialog.js"></script>
	<script>
		$("#btn").bind("click",function(){
			$.dialog({
                //可自定义参数
			})
		})
	</script>
```