Followarz.Collections.Deck = Backbone.Collection.extend({
	model: Followarz.Models.Card,
	comparator: function (follower) {
		return follower.get('screen_name').toLowerCase();
	}
});

Followarz.Collections.Opponents = Backbone.Collection.extend({
	model: Followarz.Models.Opponent,
	comparator: function (follower) {
		return follower.get('screen_name').toLowerCase();
	}
});

Followarz.Collections.Team = Backbone.Collection.extend({
	model: Followarz.Models.Card,
	comparator: function (follower) {
		return follower.get('screen_name').toLowerCase();
	}
});