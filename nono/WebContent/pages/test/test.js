
require(['dojo/dom','dojo/_base/config','dojo/query','dojo/dom-attr',
         'nost/Page',
         'dojo/domReady!'],
	function(dom,config,query,domAttr,Page) {
		query(".binding-unit").forEach(function(node) {
			console.log(domAttr.get(node, "binding"));
			var binding = JSON.parse(domAttr.get(node, "binding"));
			console.log(JSON.stringify(binding));
		});
		
		for (var x in [0,1,2,3,4]) {
			console.log(x);
		}
		
		alert(window.x);
});
