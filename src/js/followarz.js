var Followarz = {
	Models: {},
	Views: {},
	Templates: {},
	Collections: {},

	pageTransition: function (ViewType, options) {
		options = options || {};

		// classes are used to differentiate between different page views in our stylesheet
		// always remove them just incase a page view doesn't set the class
		// TODO: switch to using different divs for different views, can then get rid of this
		$('body').attr('class', '');

		// important! if we don't call undelegate here then a reference
		// to any event callbacks set by the previous view will always be kept, nomming memory D:
		$('body').undelegate();
		new ViewType(options);
	},

	_loadTemplates: function () {
		$('script[type="x-templ-mustache"]').each(function () {
			var templateName = this.id.replace(/^template_/, '');
			forge.logging.log('Loading template: ' + templateName);
			Followarz.Templates[templateName] = this.innerHTML;
		});
	},

	init: function () {
		forge.logging.log('Followarz init.');

		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		this._loadTemplates();
		new Followarz.Router();
		Backbone.history.start();
	}
};
