Followarz.Views.Page = Backbone.View.extend({
	className: "page",
	
	initialize: function () {
		this.render();
	},
	show: function () {
		forge.logging.log("Showing page");
		var el = this.el;
		if ($('.page').length) {
			// TODO: reuse pages.
			$('.page').not(el).remove();
			$(el).appendTo('body').hide();
			$(el).show();
		} else {
			$(el).appendTo('body').hide();
			$(el).show();
		}
	}
});

Followarz.Views.Loading = Followarz.Views.Page.extend({
	render: function () {
		forge.logging.log('Rendering loading view.');

		$(this.el).html(Mustache.to_html(Followarz.Templates.loading, {msg: this.options.msg || 'Loading...'}));
		return this;
	}
});

Followarz.Views.Welcome = Followarz.Views.Page.extend({
	events: {
		"tap .pick_team": "pickTeam",
		"tap .login": "login",
		"tap .pick_opponent": "pickOpponent"
	},

	pickOpponent: function () {
		forge.logging.log('Pick opponent button clicked.');
		if (this.model.get('team')) {
			Followarz.router.navigate('pick_opponent', true);
		}
	},

	pickTeam: function () {
		forge.logging.log('Pick team button clicked.');

		Followarz.router.navigate('pick_team', true);
	},

	login: function () {
		forge.logging.log("Login button clicked.");

		forge.tabs.open(
			'http://followarz.com/login.php'
		);

		return false;
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


Followarz.Views.LargeCard = Backbone.View.extend({
	tagName: 'div',
	className: 'card',
	initialize: function () {
		this.render();
	},
	render: function () {
		var html = Mustache.to_html(Followarz.Templates.largeCard, this.model);
		$(this.el).html(html);
	}
});

Followarz.Views.SmallCard = Backbone.View.extend({
	tagName: 'span',
	className: 'smallcard',
	initialize: function () {
		this.render();
	},
	render: function () {
		var html = Mustache.to_html(Followarz.Templates.smallCard, this.model);
		$(this.el).html(html).css({width: '40px', height: '40px'});
	}
});

Followarz.Views.PickTeam = Followarz.Views.Page.extend({
	atCard: 0,
	
	initialize: function () {
		this.team = new Followarz.Collections.Team();
		this.render();
	},

	events: {
		"tap .left": "goLeft",
		"tap .right": "goRight",
		"swipeLeft": "goRight",
		"swipeRight": "goLeft",
		"tap #save": "saveTeam"
	},
	
	goLeft: function () {
		this.atCard--;
		this.renderCard();
	},
	
	goRight: function () {
		this.atCard++;
		this.renderCard();
	},
	
	saveTeam: function () {
		if (this.team.length == 5) {
			var loading = new Followarz.Views.Loading({msg: "Saving selected team..."});
			loading.show();
			var team = [];
			this.team.forEach(function (m) {
				team.push(m.get('id_str'));
			});
			forge.request.ajax({
				url: 'http://followarz.com/saveteam.php',
				data: {
					team: JSON.stringify(team)
				},
				dataType: 'json',
				success: function(data) {
					Followarz.router.navigate("", true);
				}
			})
		}
	},
	
	renderTeam: function () {
		var div = this.$('.team');
		var self = this;
		if (this.team.length == 0) {
			div.text('Tap 5 cards to choose your team members.');
		} else {
			div.html('');
			this.team.forEach(function (card) {
				var cardView = new Followarz.Views.SmallCard({
					model: new Followarz.Models.Card(card)
				});
				$(cardView.el).bind('tap', function () {
					self.collection.add(card);
					self.team.remove(card);
					self.renderCard();
					self.renderTeam();
				});
				div.append(cardView.el);
			});
		}
		if (this.team.length == 5) {
			$('#save').removeClass('disabled');
		} else {
			$('#save').addClass('disabled');
		}
	},
	
	renderCard: function () {
		if (this.atCard < 0) {
			this.atCard = 0;
		}
		if (this.atCard >= this.collection.length) {
			this.atCard = this.collection.length - 1;
		}
		var follower = this.collection.at(this.atCard);
		var card = new Followarz.Views.LargeCard({
			model: new Followarz.Models.Card(follower)
		});
		var self = this;
		$(card.el).bind('tap', function () {
			if (self.team.length < 5) {
				self.collection.remove(follower);
				self.team.add(follower);
				self.renderCard();
				self.renderTeam();
			}
		});
		if (this.atCard > 0) {
			$('.left').removeClass('disabled');
		} else {
			$('.left').addClass('disabled');
		}
		if (this.atCard < this.collection.length - 1) {
			$('.right').removeClass('disabled');
		} else {
			$('.right').addClass('disabled');
		}
		if (this.team.length == 5) {
			$(card.el).addClass('disabled');
		}
		$(this.el).find('#follower').html(card.el)
	},
	
	render: function () {
		forge.logging.log('Rendering PickTeam view.');

		var page = Mustache.to_html(Followarz.Templates.pickTeam);
		
		$(this.el).html(page);
		
		this.renderCard();

		return this;
	}
});

Followarz.Views.Opponent = Backbone.View.extend({
	className: 'opponent',

	initialize: function () {
		this.render();
	},

	render: function () {
		var html = Mustache.to_html(Followarz.Templates.opponent, this.model);
		$(this.el).html(html);
	}
});

Followarz.Views.PickOpponent = Followarz.Views.Page.extend({
	initialize: function () {
		forge.logging.log('Creating PickOpponent view.');

		this.render();
	},

	render: function () {
		var opponents = $('<div style="padding-bottom: 20px;"></div>');
		this.collection.forEach(function (opponent) {
			var view = new Followarz.Views.Opponent({
				model: opponent
			});
			$(view.el).bind('tap', function () {
				Followarz.router.navigate("battle/"+opponent.name, true);
			});
			opponents.append(view.el);
		});
		$(this.el).html(Followarz.Templates.pickOpponent);
		$(this.el).append(opponents);
	}
});

Followarz.Views.Battle = Followarz.Views.Page.extend({
	render: function () {
		var page = Followarz.Templates.battle;
		
		$(this.el).html(page);
		
		var own_team = $('#own_team', this.el);
		
		var model = this.model;
		
		var inFight = false;
		var fightCount = 0;
		var winCount = 0;
		
		model.get('ownTeam').forEach(function (card) {
			var cardView = new Followarz.Views.SmallCard({
				model: new Followarz.Models.Card(card)
			});
			$(cardView.el).bind('tap', function () {
				if (!inFight && !card.used) {
					var cardView = new Followarz.Views.LargeCard({
						model: new Followarz.Models.Card(card)
					});
					$('#own_card').html(cardView.el);
					
					var opponent;
					
					while (!opponent) {
						var rand = Math.floor(Math.random()*5);
						var opp = model.get('opposingTeam').at(rand);
						if (!opp.get('used')) {
							opponent = opp;
						}
					}
					
					cardView = new Followarz.Views.LargeCard({
						model: new Followarz.Models.Card(opponent)
					});
					$('#opposing_card').html(cardView.el);
					$('#messagetext').text("Fighting...");
					inFight = true;
					setTimeout(function () {
						fightCount++;
						var win = Math.round(Math.random());
						if (win) {
							winCount++;
						}
						inFight = false;
						card.used = true;
						$(card.el).find('div').css({background: win ? 'green' : 'red'}).find('img').css({opacity: 0.4});
						opponent.set({used: true});
						$(opponent.el).find('div').css({background: win ? 'red' : 'green'}).find('img').css({opacity: 0.4});
						if (fightCount < 5) {
							if (win) {
								$('#messagetext').html("You win!<br>Select your next fighter");
							} else {
								$('#messagetext').html("You lose!<br>Select your next fighter");
							}
						} else {
							if (winCount > 2) {
								$('#messagetext').html("Battle over! You win!<br>Tap here to tell your opponent.");
							} else {
								$('#messagetext').html("Battle over! You lose!<br>Tap here to tell your opponent.");
							}
							$('#message').one('tap', function () {
								forge.tabs.open("https://twitter.com/share?url=" + encodeURIComponent("http://followarz.com/") +
										"&text=" + encodeURIComponent("@" + model.get('opponent') + " I just "+(win ? 'beat' : 'lost to')+" you at Followarz! Check it out.") +
										"&related=" + encodeURIComponent(model.get('opponent')));
								Followarz.router.navigate("", true);
							});
						}
					}, 1500);
				}
			});
			card.el = cardView.el;
			own_team.append(cardView.el);
		});
		
		var opposing_team = $('#opposing_team', this.el);
		
		model.get('opposingTeam').forEach(function (card) {
			var cardView = new Followarz.Views.SmallCard({
				model: new Followarz.Models.Card(card)
			});
			card.el = cardView.el;
			opposing_team.append(cardView.el);
		});
	}
});