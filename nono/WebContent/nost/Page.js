//define the Page module

define(["dojo/_base/declare","dojo/request","dojo/_base/array","dojo/store/Memory","dojo/store/Observable",
        "dojo/query","dojo/dom-attr",
        "nost/common","nost/Tag", "nost/ContUnit", "nost/Expr", "nost/NostNode", "nost/NText", 
        "nost/NostNodeFactory"],
	function(declare, request, array, Memory, Observable, 
			query, domAttr,
			common, Tag, ContUnit, Expr, NostNode, NText, NostNodeFactory) {
		var clsPage = declare(null, {
			
			/****************** fields *****************************/
			tenantID:"",	//tenant id
			name:"",		//page name
			tags:null,		//avoid reference error use null 
					/**
					 *{
					 * "ds1_tag2":{"tagname":"ds1_tag2","refexps":["ds1_tag1+ds1_tag2","ds1_tag2*3"],"tagval":""},
					 * "ds2_tag3":{"tagname":"ds2_tag3","refexps":["ds2_tag3+ds1_tag1"],"tagval":""}
					 *}
					 */
			exps:null,		//expresstions for control units 
			/**
			 * {[
			 * 	{"exp":"ds1_tag1+ds1_tag2",
			 * 		"cus":[{"node":node1,"field":field1},{"node":node2,"field":"field2"}],
			 * 		"val":100,
			 * 		"comp":compiled}
			 *	{"exp":"ds1_tag2*3",
			 *		"cus":[],
			 *		"val":1,
			 *		"comp":compiled}	
			 * ]}
			 */
			expStore:null,	//the observable store
			refreshRate:0,	//update interval in MS
			refreshFlag:0,	//update time flag
			
			intervalHandle:null,		// page interval handle
			observeHandle:null,			// observeHandle.cancel() will finish the observing
			
			/******************* methods *************************/
			
			init:function(){
				var thisPage = this;
				//resolve the page content
				query(".binding-unit").forEach(function(node, index, nodelist) {
					var cusContent = domAttr.get(node,"cus");	//{x:tag1+tag2,y:tag2-tag3,fill:tag3*3}
//					var nodeName = domAttr.get(node, "name");
//					var nodeID = domAttr.get(node, "id");
					//get the ntype property from the node
					var nodeType = domAttr.get(node,"ntype");
					//create the NostNode from the factory
					var nostNode = NostNodeFactory.getNostNodeByType(nodeType, node);
//					var nostNode = new NText(node, node.nodeName,nodeName,nodeID);
					var cusJson = JSON.parse(cusContent); 
					
					for(var field in cusJson) {
						console.log("field " + field + " expr " + cusJson[field]);
						var cuExp = cusJson[field];			//current expression
						var compiled = Parser.parse(cuExp);
						
						/********* add the cus ***********************/
						
						var cuObj = new ContUnit(nostNode, field);		//create new control unit
						var exprObj = thisPage.expStore.get(cuExp);
						if (exprObj == null || exprObj == undefined) {
							var expObj = new Expr(cuExp);
							expObj.comp = compiled;
							expObj.cus.push(cuObj);
							//thisPage.exps.push(expObj);
							thisPage.expStore.put(expObj);
						} else {
							exprObj.cus.push(cuObj);
						}
						
						/************* resolve the tags **********************/
						
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
							console.log("resolve tag : " + tagName);
						}
					}
					console.log(cusContent);
				});
				
				//register the page for server
				var requestURL = common.getContextPath() + "nost";
				var tagsReg = {"tags":[]};
				for(var tag in this.tags) {
					//tagsReg.tags.push(this.tenantID + common.NAME_SEP + tag);
					tagsReg.tags.push(tag);
				}
				var tagsRegJson = JSON.stringify(tagsReg);
				console.log("register page : " + tagsRegJson);
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
			
			/**
			 * refresh the page
			 */
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
							console.log("refresh response : " + JSON.stringify(response));		//{tags:{tag1:20,tag2:30,tag3:40},updateFlag:20}
							//{tags:[{"dsName":"","tagName":"","value":"","quality":"","timestamp":"","name":""},
							//{},{}],updateFlag:10}
							var needExpsArr = {};		//{exp1:1,exp2:1,exp3:1}
							var tagArr = response.tags;	//updated tags array
							//set the refresh flag
							thisPage.refreshFlag = response.updateFlag;
							var pageTags = thisPage.tags;		//cached tags object
							//iterate all the changed tags
							//console.log("length " + tagArr.length);
							for(var i = 0; i < tagArr.length; i++) {
								var tagValObj = tagArr[i];
								var tagValue = tagValObj["value"];
								var tagName = tagValObj["name"];
								console.log("got new values name = " + tagName + " value = " + tagValue);
								pageTags[tagName].tagval = tagValue;
								var refExpsArr = pageTags[tagName].refexps;
								array.forEach(refExpsArr, function(item) {
									needExpsArr[item] = 1;		//placetoken just show the existence
								});
							}
//							for(var k in tagArr) {
//								var tagValue = tagArr[k];
//								//set value first
//								pageTags[k].tagval = tagValue;
//								//get the refexprs
//								var refExpsArr = pageTags[k].refexps;
//								array.forEach(refExpsArr,function(item) {
//									needExpsArr[item] = 1;		//placetaken just show the existence
//								});
//							}
							
							//already got all exps need to update
							for(var l in needExpsArr) {
								var nowExp = l;
								//compute the new value
								//get the Expr object
								var exprObj = thisPage.expStore.get(nowExp);
								
								var newValue = thisPage.computeExpValue(nowExp, exprObj);
								
								exprObj.val = newValue;
								thisPage.expStore.put(exprObj);
								
								//animate the elements
//								var aniArr = pageCUS[l];		//get the animate arrays
//								for(var m = 0; m < aniArr.length; m++) {
//									var aniObj = aniArr[m];		//{"node":node, "field":field}
//									//animateIT
//									var aniType = aniObj["field"];
//									if (aniType == "x") {
//										console.log("animate " + aniObj["node"].nodeName + " at " + aniType + " with " + newValue);
//										continue;
//									}
//									if (aniType == "y") {
//										console.log("animate " + aniObj["node"].nodeName + " at " + aniType);
//										continue;
//									}
//									if (aniType == "fill") {
//										console.log("animate " + aniObj["node"].nodeName + " at " + aniType);
//										continue;
//									}
//								}
							}
						},
						function(error) {
							console.log(error);
						}
				);
			},
			
			computeExpValue:function(expr, exprObj) {
				console.log("compute the exp value");
				console.log("expr = " + expr);
				
				var compiled = exprObj.comp;
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
				//start observing
				this.startObserve();
				//start refreshing
				this.intervalHandle = setInterval(function() {
					thisPage.refreshPage();
				}, this.refreshRate);
			},
			
			startObserve:function() {
			    //get all the store elements
			    var results = this.expStore.query({});

			    // now listen for every change
			    this.observeHandle = results.observe(function(expObj, removedFrom, insertedInto){
			    	//update change
			    	console.log("observing");
			    	console.log(expObj);
			    	var newVal = expObj.val;
			    	array.forEach(expObj.cus, function(contunit) {
			    		contunit.set(newVal);
			    	});
			    }, true);
			},
			
			destroy:function() {
				//stop the refresh
				clearInterval(this.intervalHandle);
				//stop the observe
				this.observeHandle.cancel();
			},
			
			toString:function() {
				return JSON.stringify(this.tags);
			},
			
			constructor:function(pName, pRate, pTenant) {
				this.name = pName;
				this.refreshRate = pRate;
				this.tenantID = pTenant;
				this.tags = {};
				this.exps = [];
			    // create the initial Observable store
			    this.expStore = new Observable(new Memory({data: this.exps, idProperty:"exp"}));
			}
		});
		
		return clsPage;
});