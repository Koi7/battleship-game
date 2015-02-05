	//mvc 
			var model = {
				boardSize: 7,
				numShips: 3,
				shipLength: 3,
				shipsSunk: 0,
				guesses:0,
				updateView: function (updateCode, location){
					switch(updateCode){
						case -1: view.displayMiss(location); view.displayMsg("MISS", "error", 1000); break;//MISS
						case  0: view.displayMsg("Place you are hit was alredy been hit", "error", 1000); break;//REPEAT HIT
						case  1: view.displayHit(location); view.displayMsg("HIT", "success", 1000); break;//HIT
						case  2: view.displayHit(location); view.displayMsg("You sunk the battle ship!", "success", 1000); break;//SUNK BATTLE SHIP
						case  3: view.displayHit(location); view.displayMsg("You won the game with rate: ", "success", 1000); break;//GAME OVER
						case  4: view.displayMsg("Game started", "success", 1000); break;//GAME STARTED
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
					this.updateView(4);
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
							if (ship.hits[index] == "") {
								this.updateView(1,guess);
								this.hits++;
								ship.hits[index] = "hit";
							}
							else{
								this.updateView(0, guess);
							}
							if (this.isSunk(ship)) {
								this.updateView(2, guess);
								this.shipsSunk++;
							}
							if (this.shipsSunk == this.numShips) {
								this.updateView(3, guess);
								//this.reset();
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
					for (var i = 0; i < ship.hits; i++) {
						ship.hits[i] = ship.locations[i] = "";
					}
				},
				getRate: function () {
					return ((this.numShips * 3) / this.guesses).toFixed(1);
				},
				reset: function () {
					this.hits = 0;
					this.guesses = 0;
					for (var i = 0; i < this.ships.length; i++) {
						this.resetShip(this.ships[i]);
					}
					this.setShips();
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
				}
			};
			var controller = {
				setController: function (event) {
					var e = event || window.event;
					if (e.keyCode === 13){
						var input = document.getElementById("location").value;
						var location = this.validInput(input);
						if (location) {
							this.processInput(location);
						}
					}
				},
				validInput: function (location) {
					var location = location.toUpperCase();
					var alpha = ["A", "B", "C", "D", "E", "F", "G"];
					if (location == null || location.length != 2) {
						view.displayMsg("Invalid input", "error");
						return false;
					}
					var index = alpha.indexOf(location[0]);
					if (index < 0) {
						view.displayMsg("Invalid input: there is no such row", "error");
						return false;
					}
					if ((location[1] < 0) || (location[1] >= model.boardSize)) {
						view.displayMsg("Invalid input: there is no such column", "error");
						return false;
					}
					return location[0] + location[1];
				},
				processInput: function (location) {
					model.fire(location);
				},
				init: function () {
					model.setShips();
				}
			}
			window.onload = function () {
				document.getElementById("location").onkeypress = function (e) {
					controller.setController(e);
				};
				controller.init();
			}
			