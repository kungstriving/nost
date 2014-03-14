
require(['dojo/dom',
         'nost/Page',
         'dojo/domReady!'],
	function(dom,Page) {
		//get the page info
		var pageEle = dom.byId("pagemetas");
//		alert(JSON.stringify(pageEle));
		var pageName = pageEle.getAttribute("name");
//		alert(pageName);
		var page = new Page(pageName);
		page.init();
		console.log("after init page = " + page.toString());
		//page.start();
});
