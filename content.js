
function fillOrder(order) {
	var changeEvent,
		idPrefix = '#ctl00_ctl00_ctl00_cphbody_cphbody_cphbody_tabcontrol_';

	$(idPrefix + 'txtTrkDobro').val(order.iban);
	$(idPrefix + 'txtZnesek').val(order.amount.replace('.', ','));

	$(idPrefix + 'txtNamenKoda').val(order.code);
	$(idPrefix + 'txtNamen').val(order.purpose);

	$(idPrefix + 'txtReferencaDobro1').val(order.reference.substr(2,2));
	$(idPrefix + 'txtReferencaDobro2').val(order.reference.substr(4));

	//triggers filling bic and address fields from iban
	changeEvent = document.createEvent("HTMLEvents");
	changeEvent.initEvent('change', true, true);
	$(idPrefix + 'txtTrkDobro')[0].dispatchEvent(changeEvent);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.action) {
		case 'fillOrder':
			fillOrder(request.order);
			break;
		default:
			console.log(request.text);
	}
});
