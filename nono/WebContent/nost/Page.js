//define the Page module

define(["dojo/_base/declare","dojo/request","dojo/_base/array","dojo/store/Memory","dojo/store/Observable",
        "dojo/query","dojo/dom-attr",
        "nost/common","nost/Tag"],
	function(declare, request, array, Memory, Observable, 
			query, domAttr,
			common, Tag) {
		return declare(null, {
			
			/****************** fields *****************************/
			tenantID:"",
			name:"",
			tags:null,		//avoid reference error use null 
					//"ds1_tag2":{"tagname":"ds1_tag2","refexps":["ds1_tag1+ds1_tag2","ds1_tag2*3"],"tagval":""},
					//"ds2_tag3":{"tagname":"ds2_tag3","refexps":["ds2_tag3+ds1_tag1"],"tagval":""}},
			cus:null,		//control units 
					//"cus":{"ds1_tag1+ds1_tag2":[{"node":node,"field":field},{"node":node,"field":field}],
					//		 "ds1_tag2*3":[{"node":node,"filed":field}],
					//		 "ds2_tag3+ds1_tag1":[{"node":node,"field":field}]}
			
			refreshRate:0,
			refreshFlag:0,
			
			intervalHandle:null,
			
			/******************* methods *************************/
			
			init:function(){
				var thisPage = this;
				//resolve the page content
				query(".binding-unit").forEach(function(node, index, nodelist) {
					var cusContent = domAttr.get(node,"cus");	//{x:tag1+tag2,y:tag2-tag3,fill:tag3*3}
					var cusJson = JSON.parse(cusContent); 
					
					for(var field in cusJson) {
						console.log("field " + field + " expr " + cusJson[field]);
						var cuExp = cusJson[field];
						var cuObj = {};
						cuObj["node"] = node;
						cuObj["field"] = field;
						
						if (cuExp in thisPage.cus) {
							thisPage.cus[cuExp].push(cuObj);
						} else {
							thisPage.cus[cuExp] = [];
							thisPage.cus[cuExp].push(cuObj);
						}
						
						var compiled = Parser.parse(cuExp);
						var arrTags = compiled.variables();
						for(var i in arrTags) {
							var tagName = arrTags[i];
							if (tagName in thisPage.tags) {
								//already in the list
								thisPage.tags[tagName].refexps.push(cuExp);
								continue;
							}
							
							var tagObject = new Tag(tagName);
							tagObject.refexps.push(cuExp);
							tagObject.tagval = "";
							
							thisPage.tags[tagName] = tagObject;
							console.log("ctags " + tagName);
						}
					}
					console.log(cusContent);
				});
				
				//register the page for server
				var requestURL = common.getContextPath() + "nost";
				var tagsReg = {"tags":[]};
				for(var tag in this.tags) {
					tagsReg.tags.push(this.tenantID + common.NAME_SEP + tag);
				}
				var tagsRegJson = JSON.stringify(tagsReg);
				console.log(tagsRegJson);
				request.post(requestURL, {
					data:{
						"action":"register",
						"pageName":thisPage.name,
						"tags":tagsRegJson
					},
					handleAs:"json"
				}).then(
						function(response) {
							console.log(response);
						},
						function(error) {
							console.log(error);
						}
				);
			},
			refreshPage:function() {
				//ask the server for newest value
				var thisPage = this;
				var requestURL = common.getContextPath() + "nost";
				console.log("page " + thisPage.name + " flag " + thisPage.refreshFlag);
				request.post(requestURL, {
					data:{
						"action":"refresh",
						"pageName":thisPage.name,
						"refreshFlag":thisPage.refreshFlag
					},
					handleAs:"json"
				}).then(
						function(response) {
							//got the new values then update the store
							console.log(response);		//{tags:{tag1:20,tag2:30,tag3:40},updateFlag:20}
							var needExpsArr = {};		//{exp1:1,exp2:1,exp3:1}
							var tagArr = response.tags;	//updated tags array
							//set the refresh flag
							thisPage.refreshFlag = response.updateFlag;
							var pageTags = thisPage.tags;		//cached tags object
							var pageCUS = thisPage.cus;			//cached cus object
							//iterate all the changed tags
							console.log("lenght " + tagArr.length);
							for(var k in tagArr) {
								var tagValue = tagArr[k];
								//set value first
								pageTags[k].tagval = tagValue;
								//get the refexprs
								var refExpsArr = pageTags[k].refexps;
								array.forEach(refExpsArr,function(item) {
									needExpsArr[item] = 1;		//placetaken just show the existence
								});
							}
							
							//already got all exps need to update
							for(var l in needExpsArr) {
								var nowExp = l;
								//compute the new value
								var newValue = thisPage.computeExpValue(nowExp);
								//animate the elements
								var aniArr = pageCUS[l];		//get the animate arrays
								for(var m = 0; m < aniArr.length; m++) {
									var aniObj = aniArr[m];		//{"node":node, "field":field}
									//animateIT
									var aniType = aniObj["field"];
									if (aniType == "x") {
										console.log("animate " + aniObj["node"].nodeName + " at " + aniType + " with " + newValue);
										continue;
									}
									if (aniType == "y") {
										console.log("animate " + aniObj["node"].nodeName + " at " + aniType);
										continue;
									}
									if (aniType == "fill") {
										console.log("animate " + aniObj["node"].nodeName + " at " + aniType);
										continue;
									}
								}
							}
						},
						function(error) {
							console.log(error);
						}
				);
				
				//resolve the data respond
				//refresh the elements
			},
			
			computeExpValue:function(expr) {
				console.log("compute the exp value");
				console.log("expr = " + expr);
				var compiled = Parser.parse(expr);
				var vars = compiled.variables();
				var valueObject = {};
				for(var i = 0; i < vars.length; i++) {
					valueObject[vars[i]] = this.tags[vars[i]].tagval;
				}
				console.log("value object = " + JSON.stringify(valueObject));
				var result = compiled.evaluate(valueObject);
				return result;
			},
			
			start:function() {
				console.log("start refreshing ");
				var thisPage = this;
				this.intervalHandle = setInterval(function() {
					thisPage.refreshPage();
				}, this.refreshRate);
			},
			destroy:function() {
				//stop the refresh
				clearInterval(this.intervalHandle);
			},
			toString:function() {
				return JSON.stringify(this.tags);
			},
			constructor:function(pName, pRate, pTenant) {
				this.name = pName;
				this.refreshRate = pRate;
				this.tenantID = pTenant;
				this.tags = {};	//{tag1:{value,[exp1,exp2]}, tags:{value, exp3}}
				this.cus = {};	//{exp1:x,exp2:y,exp3:width}
				//declare.safeMixin(this,args);
			}
		});
});