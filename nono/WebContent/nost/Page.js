//define the Page module

define(["dojo/_base/declare","dojo/request","dojo/_base/array","dojo/store/Memory","dojo/store/Observable",
        "dojo/query","dojo/dom-attr",
        "nost/common","nost/Tag"],
	function(declare, request, array, Memory, Observable, 
			query, domAttr,
			common, Tag) {
		return declare(null, {
			
			/****************** fields *****************************/
			name:"",
			tags:null,		//avoid reference error use null
			cus:null,		//control units {field:exp}
			
			refreshRate:0,
			refreshFlag:0,
			
			intervalHandle:null,
			
			/******************* methods *************************/
			
			init:function(){
				var thisPage = this;
				//resolve the page content
				query(".binding-unit").forEach(function(node, index, nodelist) {
					var cusContent = domAttr.get(node,"cus");
					cus = JSON.parse(cusContent);
					for(var field in cus) {
						console.log("key " + field + " field " + cus[field]);
						var cuExp = cus[field];
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
					tagsReg.tags.push(tag);
				}
				console.log(JSON.stringify(tagsReg));
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
							console.log(response);
						},
						function(error) {
							console.log(error);
						}
				);
				
				//resolve the data respond
				//refresh the elements and scripts
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
				return JSON.stringify(this);
			},
			constructor:function(pName, pRate) {
				this.name = pName;
				this.refreshRate = pRate;
				this.tags = {};
				this.exps = [];
				this.elems = [];
				//declare.safeMixin(this,args);
			}
		});
});