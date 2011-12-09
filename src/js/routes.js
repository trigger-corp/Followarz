Followarz.Router = Backbone.Router.extend({
	routes: {
		"": "hello",
		"pick_team": "pickTeam",
		"pick_opponent": "pickOpponent",
		"battle/:opponent": "battle"
	},

	hello: function () {
		forge.logging.log('Checking whether logged in already...');

		var loading = new Followarz.Views.Loading({msg: "Loading account details..."});
		loading.show();

		forge.request.ajax({
			url: 'http://followarz.com/hello.php',
			dataType: 'json',

			success: function (data) {
				forge.logging.log('Got response from /hello.php');
				forge.logging.log(data);
				(new Followarz.Views.Welcome({
					model: new Followarz.Models.UserInfo(data)
				})).show();
			},

			error: function (e) {
				forge.logging.log('Call to /hello.php failed');
				forge.logging.log(e);
			}
		});
	},

	pickTeam: function () {
		forge.logging.log('Fetching followers for our user...');

		var loading = new Followarz.Views.Loading({msg: "Loading followers..."});
		loading.show();
		
		forge.request.ajax({
			url: 'http://followarz.com/followers.php',
			dataType: 'json',

			success: function (data) {
				forge.logging.log('Loaded ' + data.length + ' followers.');
				var deck = new Followarz.Collections.Deck(data);
				(new Followarz.Views.PickTeam({
					collection: deck
				})).show();
			},

			error: function (data) {
				// TODO: Views.Error to display something to the user?
				forge.logging.log('Failed to load followers.');
			}
		});
	},

	pickOpponent: function () {
		forge.logging.log('Fetching opponents for our user...');

		var loading = new Followarz.Views.Loading({msg: "Loading people you follow..."});
		loading.show();

		forge.request.ajax({
			url: 'http://followarz.com/following.php',
			dataType: 'json',

			success: function (data) {
				forge.logging.log('Loaded ' + data.length + ' opponents');
				(new Followarz.Views.PickOpponent({
					collection: new Followarz.Collections.Opponents(data)
				})).show();
			},

			error: function (data) {
				// TODO: Views.Error to display something to the user?
				forge.logging.log('Failed to load opponents.');
			}
		});
	},

	battle: function (opponentName) {
		forge.logging.log('Fetching team for opponent ' + opponentName);
		
		var loading = new Followarz.Views.Loading({msg: "Loading teams, get ready!"});
		loading.show();
		
		var battle = new Followarz.Models.Battle({
			ownTeam: undefined,
			opposingTeam: undefined,
			opponent: opponentName
		});

		battle.bind('change', function () {
			if (battle.get('ownTeam') && battle.get('opposingTeam')) {
				battle.unbind('change');

				(new Followarz.Views.Battle({
					model: battle
				})).show();
			}
		});

		forge.logging.log('Requesting own and opposing teams...');
		
		forge.request.ajax({
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

		forge.request.ajax({
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