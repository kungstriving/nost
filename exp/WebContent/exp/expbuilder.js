$(function() {
	$("#container").layout();
	$("#showpane").layout();
	$("#barpane").layout();
	$("#editpane").layout();
	$("#buttonpane").layout();
	
	$("#tagsbar").accordion();
	$(".opbuttons").button();
	
	$("#plusbtn").click(function(evt) {
		var oldText = $("#exp").val();
		$("#exp").val(oldText + "+");
		console.log($("#exp").val());
	});
	
	$(".drag").draggable();
	$("#exp").droppable();
	
	$("#gobtn").click(function() {
		var expr = $("#exp").val();
		var compExpr = Parser.parse(expr);
		var vars = $("#vars").val();
		var varsObj = {};
		var part1 = vars.split("#")[0];
		var part2 = vars.split("#")[1];
		var op1 = part1.split(":")[0];
		var op1val = part1.split(":")[1];
		var op2 = part2.split(":")[0];
		var op2val = part2.split(":")[1];
		varsObj[op1] = op1val;
		varsObj[op2] = op2val;
		var result = compExpr.evaluate(varsObj);
		$("#results").text(result);
	});
});