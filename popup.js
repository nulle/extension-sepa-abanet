
var listCt,
	paymentOrders = [];

function log(text) {
	chrome.tabs.query({active: true}, function (tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {action: 'log', text: text});
	});
}

function fillPaymentOrder(orderIndex) {
	var order = paymentOrders[orderIndex];
	if (order) {
		chrome.tabs.query({active: true}, function (tabs){
			var activeTab = tabs[0];
			chrome.tabs.sendMessage(activeTab.id, {action: 'fillOrder', order: order});
		});
	}
}

function handleXML(string) {
	var xmlParsed = $.parseXML(string);

	paymentOrders = [];
	$('PmtInf', xmlParsed).each(function(k, order){
		paymentOrders.push({
			amount: $('Amt InstdAmt', order).text(),
			iban: $('CdtrAcct IBAN', order).text(),
			bic: $('CdtrAgt BIC', order).text(),
			code: $('Purp Cd', order).text(),
			purpose: $('RmtInf AddtlRmtInf', order).text(),
			reference: $('RmtInf Ref', order).text()
		});
	});

	listCt.empty();
	$.each(paymentOrders, function(k, order) {
		$('<li><a href="#">' + order.purpose + ' (' + order.amount  + ')</a></li>').appendTo(listCt);
	});
}

$(function(){

	$('#parseButton').click(function(){
		handleXML($('#xml').val());
		return false;
	});

	listCt = $('#orders ul');

	listCt.on('click', 'a', function(){
		var index = $('li', listCt).index($(this).closest('li'));
		fillPaymentOrder(index);
	});
});

