//define the Page module

define(["dojo/_base/declare","dojo/request","dojo/_base/array","dojo/store/Memory","dojo/store/Observable",
        "nost/common","nost/Tag"],
	function(declare, request, array, Memory, Observable, 
			common, Tag) {
		return declare(null, {
			
			/****************** fields *****************************/
			name:"",
			tags:null,		//avoid reference error use null
			cus:null,
			
			refreshRate:0,
			refreshFlag:0,
			
			intervalHandle:null,
			
			/******************* methods *************************/
			
			init:function(){
				
				var contextPath = common.getContextPath();
				var requestJsonPath = contextPath + "pages/" + this.name + "/index.json";
				var thisPage = this;
				//request for the server side json file
				request.get(requestJsonPath,
						{
							handleAs:"json",
							sync:true
						}).then(
						function(serverPage) {
							console.log("server json = " + JSON.stringify(serverPage));
							//refresh rate
							thisPage.refreshRate = serverPage.refreshrate;
							//tag arrays
							var tagsArr = serverPage.tags;	//{tagname:"db0#ds0#tag1",refexp:[0]}
							array.forEach(tagsArr, function(item, i) {
								var tmpTag = new Tag(item.tagname, item.refexp);
								thisPage.tags.push(tmpTag);
							});
							thisPage.exps = serverPage.expressions;
							thisPage.elems = serverPage.elements;
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
				this.tags = [];
				this.exps = [];
				this.elems = [];
				//declare.safeMixin(this,args);
			}
		});
});