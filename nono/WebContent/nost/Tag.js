//define tag module

define(
		["dojo/_base/declare"],
		function(declare) {
			return declare(null, {
				tagname:"",
				refexp:null,		//[0,1,2]
				
				constructor:function(pTagName, pRefExpArr) {
					this.tagname = pTagName;
					this.refexp = pRefExpArr;
				}
			});
		}
);