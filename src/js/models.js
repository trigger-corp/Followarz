Followarz.Models.Card = Backbone.Model.extend({
	_calculateStats: function () {
		this.img = this.get('profile_image_url_https').replace(/_normal/, '_reasonably_small');
		this.name = this.get('screen_name');
		
		Math.seedrandom(this.name);
		var totalPoints = Math.floor(Math.random() * 40) + 80;
		this.agility = Math.floor(Math.random() * totalPoints/3 + totalPoints/6);
		totalPoints = totalPoints - this.agility;
		this.strength = Math.floor(Math.random() * totalPoints/3 + totalPoints/6);
		this.health = totalPoints - this.strength;
	},

	initialize: function () {
		this._calculateStats();
	}
});

Followarz.Models.Opponent = Backbone.Model.extend({
	initialize: function () {
		this.name = this.get('screen_name');
		this.img = this.get('profile_image_url_https').replace(/_normal/, '_reasonably_small');
	}
});

Followarz.Models.UserInfo = Backbone.Model.extend();

Followarz.Models.Battle = Backbone.Model.extend();