Followarz.Views.LargeCard = Backbone.View.extend({
	tagName: 'li',

	initialize: function () {
		this.model.bind('change', this.render, this);
		this.render();
	},

	render: function () {
		var html = Mustache.to_html(Followarz.Templates.largeCard, this.model);

		// TODO: put card class into template, bit fiddly
		$(this.el).addClass('card').html(html);
	}
});

Followarz.Views.PickTeam = Backbone.View.extend({
	el: 'body',

	initialize: function () {
		forge.logging.log('Creating view for ' + this.options.followers.length + ' cards.');

		this._deck = new Followarz.Collections.Deck(this.options.followers);
		this._deck.bind('add', this._add, this);
		this._deck.bind('reset', this._addAll, this);

		this.render();
		this._addAll();
	},

	_add: function (card) {
		var view = new Followarz.Views.LargeCard({
			model: card
		});

		$('#followers', this.el).append(view.el);
	},

	_addAll: function () {
		this._deck.each(this._add);
	},

	render: function () {
		forge.logging.log('Rendering PickTeam view.');

		var page = Mustache.to_html(Followarz.Templates.pickTeamScroller);
		$(this.el).html(page);

		// TODO: not hardcode card width of 250 everywhere
		$('#scroller').css('width', 3 * 250);

		setTimeout(function () {
			new iScroll('iscroll_wrapper');
		});

		return this;
	}
});

Followarz.Views.Opponent = Backbone.View.extend({
	tagName: 'li',

	events: {
		'click': 'pickOpponent'
	},

	pickOpponent: function () {
		forge.logging.log('Got click on Opponent view.');
		if (this.container.pickedOpponent) {
			return;
		}

		forge.logging.log('Selecting opponent ' + this.model.name);
		$(this.el).children('.name').text('Loading...');
		this.container.pickedOpponent = this.model;
		window.location.hash = 'battle/' + encodeURIComponent(this.model.name);
	},

	initialize: function () {
		this.container = this.options.container;
		this.render();
	},

	render: function () {
		var html = Mustache.to_html(Followarz.Templates.opponent, this.model);
		// TODO: put opponent class into template, bit fiddly
		$(this.el).addClass('opponent').html(html);
	}
});

Followarz.Views.PickOpponent = Backbone.View.extend({
	el: 'body',

	initialize: function () {
		forge.logging.log('Creating PickOpponent view.');
		this._opponents = new Followarz.Collections.Opponents(this.options.following);

		// TODO: this is a bit fail, _addAll hits the active page lots, would be nice to addAll before the PickOpponent view is in the page.
		this.render();
		this._addAll();
	},

	_add: function (opponent) {
		var view = new Followarz.Views.Opponent({
			model: opponent,
			container: this
		});

		$('#opponents', this.el).append(view.el);
	},

	_addAll: function () {
		$('#message').text('Loading opponents...')
		this._opponents.each(this._add);
		$('#message').text('Tap an opponent to start battle.');
	},

	render: function () {
		var page = Mustache.to_html(Followarz.Templates.pickOpponent);

		// TODO: don't use el: body, have class in template
		$(this.el).attr('class', 'pick_opponent').html(page);

		setTimeout(function () {
			new iScroll('wrapper');
		});
	}
});

Followarz.Views.BattleTeam = Backbone.View.extend({
	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html();
		return this;
	}
});

Followarz.Views.BattleTeamCard = Backbone.View.extend({
	events: {
		'touchend': 'pickCard'
	},

	initialize: function () {
		this.battle = this.options.battle;
		this.render();
	},

	render: function () {
		$(this.el).attr('class', 'choice');

		return this;
	}
});

Followarz.Views.BattleFightCard = Backbone.View.extend({

});

Followarz.Views.Battle = Backbone.View.extend({
	el: 'body',

	initialize: function () {
		this.render();

		this._ownTeamView = new Followarz.Views.BattleTeam({
			el: '#own_team',
			team: this.model.ownTeam
		});

		this._opponentTeamView = new Followarz.Views.BattleTeam({
			el: '#opposing_team',
			team: this.model.opposingTeam
		});
	},

	render: function () {
		var page = Mustache.to_html(Followarz.Templates.battle);
		$(this.el).attr('class', 'battle').html(page);
	}
});


Followarz.Views.Welcome = Backbone.View.extend({
	el: 'body',

	events: {
		"touchend .pick_team": "pickTeam",
		"touchend .login": "login",
		"touchend .pick_opponent": "pickOpponent"
	},

	pickOpponent: function () {
		forge.logging.log('Pick opponent button clicked.');

		window.location.hash = 'pick_opponent';
		return false;
	},

	pickTeam: function () {
		forge.logging.log('Pick team button clicked.');

		window.location.hash = 'pick_team';
		return false;
	},

	_loginSuccess: function () {
		forge.logging.log('Login to followarz.com succeeded.');
		forge.logging.log(this);
	},

	_loginError: function () {
		forge.logging.log('Login to followarz.com succeeded.');
	},

	login: function () {
		forge.logging.log("Login button clicked.");

		forge.tabs.open(
				'http://followarz.com/login.php',
				this._loginSuccess,
				this._loginError
		);

		return false;
	},

	initialize: function () {
		forge.logging.log('Creating welcome view.');
		this.render();
	},

	render: function () {
		forge.logging.log('Rendering welcome view.');

		if (this.model.get('status') == 'loggedin') {
			forge.logging.log('Logged in.');
			if (this.model.get('team')) {
				page = Followarz.Templates.haveTeam;
			} else {
				page = Followarz.Templates.noTeam;
			}
		} else {
			forge.logging.log("Not logged in.");
			page = Followarz.Templates.loggedOut;
		}

		$(this.el).html(page);

		return this;
	}
});

Followarz.Views.Loading = Backbone.View.extend({
	el: 'body',

	initialize: function () {
		this.render();
	},

	render: function () {
		forge.logging.log('Rendering loading view.');

		$(this.el).html(Followarz.Templates.loading);
		return this;
	}
});