//define the NostText module

define(["dojo/_base/declare","dojo/dom-attr",
        "nost/NostNode"],
	function(declare, domAttr, NostNode) {
		return declare(NostNode, {
			/****************** fields *****************************/
			/******************* methods *************************/
			x:function(newVal) {
				domAttr.set(this.rawNode, "x", newVal);
				console.log('set x new ' + newVal);
			},
			y:function() {
				domAttr.set(this.rawNode, "y", newVal);
				console.log('set y new ' + newVal);
			},
			
			set:function(field, newValue) {
				this[field](newValue);
			}
		});
});