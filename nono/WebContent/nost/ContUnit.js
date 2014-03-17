//define the Page module

define(["dojo/_base/declare","dojo/store/Memory","dojo/store/Observable",
        "nost/common"],
	function(declare, Memory, Observable, 
			common) {
		return declare(null, {
			
			/****************** fields *****************************/
			node:null,		//document element
			field:"",		//avoid reference error use null
			
			/******************* methods *************************/
			
			constructor:function(pNode, pField) {
				this.node = pNode;
				this.field = pField;
			}
		});
});