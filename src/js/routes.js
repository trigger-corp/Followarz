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
				forge.logging.log('Loaded ' + data.length + ' followers.');
				Followarz.pageTransition(Followarz.Views.PickTeam, {
					followers: data
				});
			},

			error: function (data) {
				// TODO: Views.Error to display something to the user?
				forge.logging.log('Failed to load followers.');
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
				forge.logging.log('Loaded ' + data.length + ' opponents');
				Followarz.pageTransition(Followarz.Views.PickOpponent, {
					following: data
				});
			},

			error: function (data) {
				// TODO: Views.Error to display something to the user?
				forge.logging.log('Failed to load opponents.');
			}
		});
	},

	battle: function (opponentName) {
		forge.logging.log('Fetching team for opponent ' + opponentName);

		var battle = new Followarz.Models.Battle({
			ownTeam: undefined,
			opposingTeam: undefined
		});

		battle.bind('change', function () {
			if (battle.get('ownTeam') && battle.get('opposingTeam')) {
				battle.unbind('change');

				Followarz.pageTransition(Followarz.Views.Battle, {
					model: battle
				});
			}
		});

		forge.logging.log('Requesting own and opposing teams...');
		
		$.ajax({
			url: "http://followarz.com/team.php",
			dataType: "json",

			success: function (team) {
				forge.logging.log("Got own team");
				forge.logging.log("Team size is " + team.length);

				battle.set({
					ownTeam: new Followarz.Collections.Team(team)
				});
			},

			error: function (e) {
				forge.logging.log("Failed to get our own team");
				forge.logging.log(e);
			}
		});

		$.ajax({
			url: "http://followarz.com/team.php?for=" + encodeURIComponent(opponentName),
			dataType: "json",
			success: function (team) {
				forge.logging.log("Got opposing team");
				forge.logging.log("Team size is " + team.length);

				battle.set({
					opposingTeam: new Followarz.Collections.Team(team)
				});
			},

			error: function (e) {
				forge.logging.log("Failed to get team for opposition");
				forge.logging.log(e);
			}
		});
	}
});