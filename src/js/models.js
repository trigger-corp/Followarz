Followarz.Models.Card = Backbone.Model.extend({
	_calculateStats: function () {
		this.health = Math.floor(Math.random() * 100);
		this.strength = Math.floor(Math.random() * 100);
		this.agility = Math.floor(Math.random() * 100);

		this.img = this.get('profile_image_url_https');
		this.name = this.get('screen_name');
	},

	initialize: function () {
		this._calculateStats();
	}
});

Followarz.Models.Opponent = Backbone.Model.extend({
	initialize: function () {
		this.name = this.get('screen_name');
		this.img = this.get('profile_image_url_https');
	}
});

Followarz.Models.UserInfo = Backbone.Model.extend();

Followarz.Models.Battle = Backbone.Model.extend();