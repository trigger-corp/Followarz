var Followarz = {
	Models: {},
	Views: {},
	Templates: {},
	Collections: {},
	pageTransition: function (ViewType, options) {
		options = options || {};

		// important! if we don't call undelegate here then a reference
		// to any event callbacks set by the previous view will always be kept, nomming memory D:
		$('body').undelegate();
		new ViewType(options);
	},

	init: function () {
		forge.logging.log("Followarz init");
		Followarz.Templates.loggedOut = $('#template_loggedout').html();
		Followarz.Templates.haveTeam = $('#template_haveteam').html();
		Followarz.Templates.noTeam = $('#template_noteam').html();
		Followarz.Templates.loading = $('#template_loading').html();

		new Followarz.Router();
		Backbone.history.start();
	}
};

Followarz.Router = Backbone.Router.extend({
	routes: {
		"": "hello",
		"pick_team": "pickTeam",
		"pick_opponent": "pickOpponent",
		"battle/:opponent": "battle"
	},

	hello: function () {
		forge.logging.log('Checking whether logged in already...');

		new Followarz.Views.Loading();

		$.ajax({
			url: 'http://followarz.com/hello.php',
			dataType: 'json',

			success: function (data) {
				forge.logging.log('Got response from /hello.php');
				forge.logging.log(data);
				Followarz.pageTransition(Followarz.Views.Welcome, {
					model: new Followarz.Models.UserInfo(data)
				});
			},

			error: function (e) {
				forge.logging.log('Call to /hello.php failed');
				forge.logging.log(e);
			}
		});
	},

	pickTeam: function () {
		forge.logging.log('Fetching followers for our user...');

		new Followarz.Views.Loading();

		$.ajax({
			url: 'http://followarz.com/followers.php',
			dataType: 'json',

			success: function (data) {
				Followarz.pageTransition(Followarz.Views.PickTeam, {
					followers: data
				});
			},

			error: function (data) {
				// TODO: Views.Error to display something to the user?
				forge.logging.log("Failed to load followers.");
			}
		});
	},

	pickOpponent: function () {
		forge.logging.log('Fetching opponents for our user...');

		new Followarz.Views.Loading();

		$.ajax({
			url: 'http://followarz.com/following.php',
			dataType: 'json',

			success: function (data) {
				Followarz.pageTransition(Followarz.Views.PickOpponent);
			},

			error: function (data) {
				// TODO: Views.Error to display something to the user?
				forge.logging.log("Failed to load opponents.");
			}
		});
	}
});

Followarz.Views.PickTeam = Backbone.View.extend({
	el: 'body',

	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html('PICK TEAM');
	}
});

Followarz.Views.PickOpponent = Backbone.View.extend({
	el: 'body',

	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html('CHOOSE OPPONENT');
	}
});

Followarz.Views.Battle = Backbone.View.extend({
	el: 'body',

	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html('BATTLE');
	}
});

Followarz.Models.UserInfo = Backbone.Model.extend();

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

	login: function () {
		forge.logging.log("Login button clicked.");

		forge.tabs.open('http://followarz.com/login.php');
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