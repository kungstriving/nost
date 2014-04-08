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
		page.start();
});

function pump1switch_open() {
	alert('pump1switch-open');
}

function pump1switch_close() {
	alert('pump1switch-close');
}

function pump2switch_open() {
	alert('pump2switch-open');
}

function pump2switch_close() {
	alert('pump2switch-close');
}