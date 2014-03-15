
require(['dojo/dom',
         'nost/Page',
         'dojo/domReady!'],
	function(dom,Page) {
		//get the page info
		var pageEle = dom.byId("pagemetas");
//		alert(JSON.stringify(pageEle));
		var pageName = pageEle.getAttribute("name");
		var rate = pageEle.getAttribute("refreshRate");
		var tenant = pageEle.getAttribute("tenant");
//		alert(pageName);
		var page = new Page(pageName, rate, tenant);
		page.init();
		console.log("after init page = " + page.toString());
		//page.start();
});
