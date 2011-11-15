var Followarz = {
	Models: {},
	Views: {},
	Templates: {},

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
		"loggedin": "loggedIn",
		"loggedout": "loggedOut",
		"login": "login",
		"pickteam": "pickTeam",
		"pickopponent": "pickOpponent",
		"battle/:opponent": "battle"
	},

	hello: function () {
		forge.logging.log("Checking whether logged in already...");
		new Followarz.Views.Loading();
		
		$.ajax({
			url: 'http://followarz.com/hello.php',
			dataType: 'json',

			success: function (data) {
				var pickopponent_url, page;

				forge.logging.log('Got response from /hello.php');
				forge.logging.log(data);

				new Followarz.Views.Welcome({
					model: new Followarz.Models.UserInfo(data)
				});
			},

			error: function (e) {
				forge.logging.log("Call to /hello.php failed");
				forge.logging.log(e);
			}
		});
	},

	loggedOut: function () {
		
	},

	loggedIn: function () {
		if (data.team) {
			pickopponent_url = base_url + 'pickopponent.html';
		} else {
			pickopponent_url = '';
		}

		var page = $('#loggedin_template').mustache({
			pickteam_url: base_url + 'pickteam.html',
			pickopponent_url: pickopponent_url
		});

		$('#pickopponent').live('click', function () {
			$(this).text("Loading...");
		});

		$(document.body).html(page);
	},

	login: function () {
		forge.tabs.open('http://followarz.com/login.php');
	}
});


Followarz.Models.UserInfo = Backbone.Model.extend();

Followarz.Views.Welcome = Backbone.View.extend({
	el: 'body',

	events: {
		"touchend .pick_team": "pickTeam"
	},

	pickTeam: function () {
		forge.logging.log("Pick team button clicked.");
		new Followarz.Views.Loading();
		
		return false;
	},

	initialize: function () {
		forge.logging.log('Creating welcome view.');
		this.render();
	},

	render: function () {
		forge.logging.log("Rendering welcome view.");

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
		forge.logging.log("Rendering loading view.");
		$(this.el).html(Followarz.Templates.loading);
		return this;
	}
});