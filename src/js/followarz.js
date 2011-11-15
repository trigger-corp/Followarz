var Followarz = {
	Views: {},
	Router: {},
	Templates: {},

	init: function () {
		new Followarz.Router();
		Backbone.history.start();

		Followarz.Templates.loggedOut = $('#template_loggedout').html();
		Followarz.Templates.haveTeam = $('#template_haveteam').html();
		Followarz.Templates.noTeam = $('#template_noteam').html();
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
		$.ajax({
			url: 'http://followarz.com/hello.php',
			dataType: 'json',

			success: function (data) {
				var pickopponent_url, page;

				forge.logging.log('Got response from /hello.php');
				forge.logging.log(data);

				if (data.status == 'loggedin') {
					forge.logging.log('Logged in.');

					if (data.team) {
						page = Followarz.Templates.haveTeam;
					} else {
						page = Followarz.Templates.noTeam;
					}
				} else {
					forge.logging.log("Not logged in.");
					page = Followarz.Templates.loggedOut;
				}
				
				$(document.body).html(page);
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
	},

	pickteam: function () {
	}
});

Followarz.showLoadingPage = function () {
	var loadingPage = '<table id="loading_layout"><tr><td><img src="img/Logo72.png"><p>Loading...</p></td></tr></table>';
	$(document.body).html(loadingPage);
};