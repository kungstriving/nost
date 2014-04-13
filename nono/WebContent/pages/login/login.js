//$(document).ready(function() {
//	$("#loginpanel").animate({"margin-top":"120px","opacity":"1"},2000);
//});

require(["dojo/dom","dojo/_base/fx","dojo/fx/easing","dojo/on","dojo/request","dojo/dom-form",
         "nost/common",
         "../../js/jquery-2.0.3.js","../../js/jquery.mobile-1.4.2.js","dojo/domReady!"],
	function(dom, baseFx, easingType, on, request, domForm,
			common) {
	var loginPanel = dom.byId("loginpanel"),
		loginButton = dom.byId("loginbtn");
	
	on(loginButton,"click",login);
	
	baseFx.animateProperty({
		node:loginPanel,
		properties:{
			marginTop:120,
			opacity:1
		},
		easing:easingType.bounceOut,
		duration:2000
	}).play();
	
	///////////user events//////////////////
	function login(evt) {
		console.log('user login');
		var username = domForm.fieldToObject("un"),
			password = domForm.fieldToObject("pwd");
		//encrypt the password
		
		//post data to server
		var requestURL = common.getContextPath() + "nost";
		request.post(requestURL, {
			data:{
				"action":"pageLogin",
				"lessee":"A",
				"username":username,
				"secretPwd":password
			},
			handleAs:"json"
		}).then(
				function(response) {
					//resolve the response and access to the init page
					
					var msgObj = JSON.parse(response.msg);
					var pageName = msgObj.initPage;
					
					window.location.href = requestURL + "?action=loadPage&pageName=" + pageName;
//					request.get(requestURL + "?action=loadPage&pageName=" + pageName);
//					request(requestURL + "?action=loadPage&pageName=" + pageName).then(
//							function(text) {
//								window.location.href = "/nono/pages/tom/";
////								console.log(text);
//					});
				},
				function(error) {
					//alert the error message
					console.log(error);
				}
		);
	}
});
