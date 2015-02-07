	//mvc 
			var model = {
				boardSize: 7,
				numShips: 3,
				shipLength: 3,
				shipsSunk: 0,
				guesses:0,
				start: function () {
					this.resetGame();
					this.updateView(6);
					this.setShips();
					this.isPlaying = true;
					this.updateView(4);
				},
				isPlaying: false,
				updateView: function (updateCode, location){
					switch(updateCode){
						case -1: view.displayMiss(location); view.displayMsg("MISS", "error", 1000); break;//MISS
						case  0: view.displayMsg("Repeat yourself", "error", 1000); break;//REPEAT HIT
						case  1: view.displayHit(location); view.displayMsg("HIT", "success", 1000); break;//HIT
						case  2: view.displayHit(location); view.displayMsg("You sunk the battle ship!", "success", 1000); break;//SUNK BATTLE SHIP
						case  4: view.displayMsg("Game started", "success", 1000); break;//GAME STARTED
						case  5: view.markSunkBattleship(location); break;
						case  6: view.clearBoard(); break;
					}
				},
				convertNumberToCharacter: function (num) {
					switch (num) {
						case 0: return "A";
						case 1: return "B";
						case 2: return "C";
						case 3: return "D";
						case 4: return "E";
						case 5: return "F";
						case 6: return "G";
					}
				},
				setShip: function (ship){
					var horOrVer = Math.floor(Math.random() * 2);
					var startHorLocation = Math.floor(Math.random() * (this.boardSize - this.shipLength - 1));
					var startVerLocation = Math.floor(Math.random() * (this.boardSize - this.shipLength - 1));
					if (horOrVer) {
						ship.locations[0] = this.convertNumberToCharacter(startHorLocation) + startVerLocation;
						ship.locations[1] = this.convertNumberToCharacter(startHorLocation) + (startVerLocation + 1);
						ship.locations[2] = this.convertNumberToCharacter(startHorLocation) + (startVerLocation + 2);
					}
					else{
						ship.locations[0] = this.convertNumberToCharacter(startHorLocation) + startVerLocation;
						ship.locations[1] = this.convertNumberToCharacter(startHorLocation + 1) + startVerLocation;
						ship.locations[2] = this.convertNumberToCharacter(startHorLocation + 2) + startVerLocation;
					}
				},
				isEqualLocations: function (ship1, ship2) {
					if (ship1.locations[0] == ship2.locations[0] || ship1.locations[0] == ship2.locations[1] || ship1.locations[0] == ship2.locations[2]) {
						return true;
					}
					if (ship1.locations[1] == ship2.locations[0] || ship1.locations[1] == ship2.locations[1] || ship1.locations[1] == ship2.locations[2]) {
						return true;
					}
					if (ship1.locations[2] == ship2.locations[0] || ship1.locations[2] == ship2.locations[1] || ship1.locations[2] == ship2.locations[2]) {
						return true;
					}
					return false;
				},
				hasEqualLocations: function (ship1, ship2, ship3) {
					return this.isEqualLocations(ship1, ship2) || this.isEqualLocations(ship1, ship3) || this.isEqualLocations(ship2, ship3);
				},
				setShips: function () {
					do {
						this.setShip(this.ships[0]);
						this.setShip(this.ships[1]);
						this.setShip(this.ships[2]);
					}
					while (this.hasEqualLocations(this.ships[0], this.ships[1], this.ships[2]));
				},
				ships: [
							{locations: ["", "", ""], hits: ["", "", ""]},
							{locations: ["", "", ""], hits: ["", "", ""]},
							{locations: ["", "", ""], hits: ["", "", ""]},
						],
				fire: function  (guess) {
					this.guesses++;
					for (var i = 0; i < this.numShips; i++) {
						var ship = this.ships[i];
						var index = ship.locations.indexOf(guess);
						if (index >= 0) {
							//got a hit
							this.updateView(1,guess);
							this.hits++;
							ship.hits[index] = "hit";
							if (this.isSunk(ship)) {
								this.updateView(2, guess);
								this.updateView(5, ship.locations);
								this.shipsSunk++;
							}
							if (this.shipsSunk == this.numShips) {
								this.isPlaying  = false;
								var wantPlayAgain = confirm("You won the game with rate: "  + this.getRate() + "\n" + "      Do you wanna play again?");
								if (wantPlayAgain) {
									this.start();
								}
							}
							return;
						}
						else{
							this.updateView(-1, guess);
						}
					}
				},
				isSunk: function(ship){
					return ship.hits[0] == "hit" && ship.hits[1] == "hit" && ship.hits[2] == "hit";
				},
				resetShip: function (ship) {
					for (var i = 0; i < ship.hits.length; i++) {
						ship.hits[i] = "";
						ship.locations[i] = "";
					}
				},
				getRate: function () {
					var rate = ((this.numShips * 3) / this.guesses).toFixed(1);
					if (rate < 0.5) {
						return rate + " bad";
					}
					if (rate > 0.5 && rate < 0.8) {
						return rate + " newby";
					}
					return rate + " perfect";
				},
				resetGame: function () {
					this.hits = 0;
					this.guesses = 0;
					this.shipsSunk = 0;
					for (var i = 0; i < this.ships.length; i++) {
						this.resetShip(this.ships[i]);
					}
				}				
			};
			var view = {
				displayMsg: function (msg, type, disappearTime){
					var area = document.getElementById("abs-msg-area");
					area.innerHTML = msg;
					if (type == "success") {
						area.style.background = "#00CC00";
					}
					if (type == "error"){
						area.style.background = "#FF0000";
					} 
					area.style.opacity = 1.0;
					window.setTimeout(function () {
						area.style.opacity = 0.0;	
					},disappearTime);
				},
				displayHit: function  (location) {
					var hitPlace = document.getElementById(location);
					hitPlace.innerHTML = "HIT";
				},
				displayMiss: function  (location) {
					var hitPlace = document.getElementById(location);
					hitPlace.innerHTML = "MISS";
				},
				markSunkBattleship: function (location){
					document.getElementById(location[0]).setAttribute("class", "sunk");
					document.getElementById(location[1]).setAttribute("class", "sunk");
					document.getElementById(location[2]).setAttribute("class", "sunk");;
				},
				clearBoard: function () {
					var boardItems = document.getElementsByTagName("td");
					for (var i = 0; i < boardItems.length; i++) {
						var id = boardItems[i].getAttribute("id");
						if (id) {
							boardItems[i].innerHTML = "";
							boardItems[i].setAttribute("class", "fireable");
						}
					}
				}
			};
			var controller = {
				setSettings: function () {
					var boardItems = document.getElementsByTagName("td");
					for (var i = 0; i < boardItems.length; i++) {
						if (boardItems[i].getAttribute("id")) {
							boardItems[i].onclick = handleClick;
						}
					}
				},
				processInput: function (target) {
					if (!target.innerHTML){
						model.fire(target.getAttribute("id"));
					}
					else{
						model.updateView(0);
					}					
				},
				init: function (){
					if (model.isPlaying) {
						if (confirm("Do you really wanna start a new game?")) {
							model.start();
						}
						return;
					}
					model.start();
				}
			}
			function handleClick (e) {
				var event = e || window.event;
				var target = event.target || event.srcElement;
				controller.processInput(target);
			}
			window.onload = function () {
				controller.setSettings();
				controller.init();
			}
			