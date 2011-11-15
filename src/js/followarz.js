var Followarz = {};

Followarz.showLoadingPage = function () {
	var loadingPage = '<table id="loading_layout"><tr><td><img src="img/Logo72.png"><p>Loading...</p></td></tr></table>';
	$(document.body).html(loadingPage);
};