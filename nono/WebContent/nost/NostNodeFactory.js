//define the NostNodeFactory module

define(["nost/common","nost/NSwitch","nost/NText",
        "dojo/dom-attr"],
	function(common,NSwitch,NText,domAttr) {
		return {
			
			/****************** fields *****************************/
			basichmi:{
				"switch":function(pNode,pNType,pNodeName,pNodeID) {
					var switchObj = new NSwitch(pNode, pNType, pNodeName,pNodeID);
					//config the switch
					switchObj.handleEvent();
					switchObj.handleMatchTable();
					switchObj.registerSelf();
					return switchObj;
				},
				"text":function(pNode,pNType,pNodeName,pNodeID) {
					return new NText(pNode, pNType, pNodeName,pNodeID);
				}
			},
			/******************* methods *************************/
			
			getNostNodeByType:function(pNType,pNode) {
				var firstType = pNType.split(common.NAME_SEP)[0];
				var secType = pNType.split(common.NAME_SEP)[1];
				var nodeName = domAttr.get(pNode,"name");
				var nodeID = domAttr.get(pNode,"id");
				
				return this[firstType][secType](pNode,pNType,nodeName,nodeID);
			}
		};
});