var Followarz = {
	Models: {},
	Views: {},
	Templates: {},
	Collections: {},

	_loadTemplates: function () {
		$('script[type="x-templ-mustache"]').each(function () {
			var templateName = this.id.replace(/^template_/, '');
			forge.logging.log('Loading template: ' + templateName);
			Followarz.Templates[templateName] = this.innerHTML;
		});
	},

	init: function () {
		forge.logging.log('Followarz init.');

		this._loadTemplates();
		Followarz.router = new Followarz.Router();
		Backbone.history.start();
	}
};
