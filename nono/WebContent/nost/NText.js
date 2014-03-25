//define the NostText module

define(["dojo/_base/declare","dojo/dom-attr","dojo/html",
        "nost/NostNode"],
	function(declare, domAttr, html, 
			NostNode) {
		return declare(NostNode, {
			/****************** fields *****************************/
			/******************* methods *************************/
			x:function(newVal) {
				domAttr.set(this.rawNode, "x", newVal);
				console.log('set x new ' + newVal);
			},
			y:function(newVal) {
				domAttr.set(this.rawNode, "y", newVal);
				console.log('set y new ' + newVal);
			},
			fill:function(newVal) {
				var newColor = "orange";
				if (newVal > 0 && newVal < 100) {
					newColor = "brown";
				} else if (newVal >= 100 && newVal < 1000) {
					newColor = "DeepPink";
				}
				domAttr.set(this.rawNode,"fill",newColor);
				console.log('set fill new ' + newVal);
			},
			text:function(newVal) {
				html.set(this.rawNode,newVal);
//				domAttr.set(this.rawNode,"text",newVal);
				console.log('set text new ' + newVal);
			},
			
			set:function(field, newValue) {
				this[field](newValue);
			}
		});
});