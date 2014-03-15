$(function() {
	$("#container").layout();
	$("#showpane").layout();
	$("#barpane").layout();
	$("#editpane").layout();
	$("#buttonpane").layout();
	$("#expgridpane").layout();
	
	$("#tagsbar").accordion();
	$(".opbuttons").button();
	
	var compiled;
	
	$("#plusbtn").click(function(evt) {
		var oldText = $("#exp").val();
		$("#exp").val(oldText + "+");
		console.log($("#exp").val());
	});
	
	$("#prebtn").on("click",function(evt) {
		var expr = $("#exp").val();
		compiled = Parser.parse(expr);
		var tagsResolved = compiled.variables();
		var rowArrs = [];
		var $tagsGrid = $("#tagsgrid");
		$tagsGrid.empty();
		rowArrs.push("<tr><th>Tag</th><th>Value</th></tr>");
		$.each(tagsResolved,function(idx, val) {
			console.log(idx + ":" + val);
			rowArrs.push("<tr class='valrow'><td>" + val + "</td><td><input type='text' size='10'/></td></tr>");
		});
		$tagsGrid.append(rowArrs.join(""));
	});
	
	$(".drag").draggable();
	$("#exp").droppable();
	
	$("#gobtn").click(function() {
		var expr = $("#exp").val();
		compiled = Parser.parse(expr);
		var varsObj = getValues();
		var result = compiled.evaluate(varsObj);
		console.log("result " + result);
		$("#buttonpane #results").text(result);
	});
});

//get the user set values and variables in the grid
function getValues() {
	var values = {};
	$("table .valrow").each(function (idx, ele) {
		var $tagTD = $($(ele).find("td").get(0));
		var $valTD = $($(ele).find("td").get(1)).find("input");
		values[$tagTD.text()] = $valTD.val();
	});
	console.log(JSON.stringify(values));
	return values;
}