//define the basichmi-pump module

define(["dojo/_base/declare","dojo/dom-attr","dojo/query","dojo/on",
        "nost/NostNode","nost/MatchTable","nost/NSystem",
        "./js/snap.svg.js"],
	function(declare, domAttr, query,on,
			NostNode,MatchTable,NSystem) {
		return declare(NostNode, {
			
			/****************** fields *****************************/
			pumpon:false,		//默认开关是关的
			eventMap:null,		//事件map
			matchTable:null,	//匹配表
			pumpLeaf:null,		//叶片控制单元
			
			/******************* methods *************************/

			/////////////////////////////// 元素配置方法///////////////////////////
			handleEvent:function() {
				this.eventMap = {};
				var eventConfigJson = domAttr.get(this.rawNode,"ec");
				this.eventMap = JSON.parse(eventConfigJson);
			},
			
			handleMatchTable:function() {
				var matchTableJson = domAttr.get(this.rawNode, "mt");
				this.matchTable = new MatchTable(matchTableJson);
				
			},
			
			handleAnimateObjs:function() {
				//获取所要操作的动画对象
				this.pumpLeaf = query("#" + this.id + "_f9f69de0-c1f3-49a0-863f-15ac0573dba5", this.rawNode)[0];
			},
			
			////////////////////////////元素属性////////////////////////////////
			x:function(newVal) {
				domAttr.set(this.rawNode, "x", newVal);
				console.log('set x new ' + newVal);
			},
			
			y:function(newVal) {
				domAttr.set(this.rawNode, "y", newVal);
				console.log('set y new ' + newVal);
			},
			
			//转速属性
			pumpSpeed:function(newVal) {
				//转速值应该是每分钟多少转，换算为相应的tranform值后设置动画
				if(this.pumpon == true) {
					//当前开关打开状态
					var snPumpLeaf = Snap(this.pumpLeaf);
					snPumpLeaf.animate({transform:'r180,50,45'},2000,mina.bounce);
					console.log('got new pump speed ' + newVal);
				}
			},
			//开关属性
			pumpSwitch:function(newVal) {
				//离散变量
				console.log('got new pump switch ' + newVal);
				this.pumpon = !this.pumpon;
			},
			
			///////////////////////////元素动画////////////////////////////////
			openSwitch:function() {
				//打开开关
				if (this.switchon == true) {
					return;
				}
//				var sanpNode = Snap(this.rawNode);
				if (this.switchBlock == null || this.switchBlock == undefined) {
					this.switchBlock = query("#" + this.id + "_a6e58d51-9592-4c03-bc31-b747713f092f", this.rawNode)[0];
				}
				var thisSwitch = this;
				Snap.animate(0,45,function(val){
					domAttr.set(thisSwitch.switchBlock,{transform:"translate(" + val + ")"});
				},1000);
				
				this.switchon = true;
			},
			closeSwitch:function() {
				//关闭开关
				if (this.switchon == false) {
					return;
				}
				if (this.switchBlock == null || this.switchBlock == undefined) {
					this.switchBlock = query("#" + this.id + "_a6e58d51-9592-4c03-bc31-b747713f092f", this.rawNode)[0];
				}
				var thisSwitch = this;
				Snap.animate(45,0,function(val){
					domAttr.set(thisSwitch.switchBlock,{transform:"translate(" + val + ")"});
				},1000);
				this.switchon = false;
			},
			
			//////////////////////////////////// 设置属性值方法///////////////
			set:function(field, newValue) {
				this[field](newValue);
			}
		});
});