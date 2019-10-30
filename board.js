const boardSize = 99,
  blockedBoard = 10;
let playerActive,
  tiles = [],
  possibleMoves = 5,
  activePlayer = 1,
  currentWeapon = 1,
  turn = 0,
  playerDefend = null,
  player1Active = !0,
  move = !0,
  attacked = !1,
  hover = !1;
const Board = function(e) {
  (this.create = function() {
    for (let a = 0; a <= e; a += 1) {
      $(".board-container").append(
        '<li class="box" data-index="' + a + '"></li>'
      );
      let e = $(".box").length;
      tiles.push(e);
    }
  }),
    (this.obstacles = function(e) {
      addItems(e);
    });
};
let game = new Board(boardSize);
const CreatePlayer = function(e, a, t, n, o, l, r) {
  (this.name = e),
    (this.lifeScore = a),
    (this.itemClass = t),
    (this.player = n),
    (this.weapon = o),
    (this.power = l),
    (this.activePath = r),
    (this.add = function() {
      addItems(this.itemClass, this.player);
    }),
    (this.setData = function() {
      $(".name-" + this.player).text(this.name),
        $("#life-" + this.player).text(this.lifeScore),
        $('<img src="image/wp-1.png" alt="image/wp-1.png">').appendTo(
          ".weapon-" + this.player
        ),
        $(".damage-" + this.player).text(this.power);
    }),
    (this.attack = function(e) {
      1 === playerDefend
        ? ((e.lifeScore -= this.power / 2), (playerDefend = 0))
        : (e.lifeScore -= this.power),
        $("#life-" + e.player).text(e.lifeScore),
        e.lifeScore <= 0 && gameOverBoard();
    });
};
let player1 = new CreatePlayer(
    "Player 1",
    100,
    "player1",
    1,
    "wp-1",
    10,
    "image/path.jpeg"
  ),
  player2 = new CreatePlayer(
    "Player 2",
    100,
    "player2",
    2,
    "wp-1",
    10,
    "image/path.jpeg"
  ),
  defaultWeapon = new CreateWeapon("DefaultWeapon", 10, "wp-1 weapon"),
  weapon2 = new CreateWeapon("weapon2", 30, "wp-2 weapon"),
  weapon3 = new CreateWeapon("weapon3", 40, "wp-3 weapon"),
  weapon4 = new CreateWeapon("weapon4", 50, "wp-4 weapon"),
  weapon5 = new CreateWeapon("weapon5", 60, "wp-5 weapon");
function moveMechanism() {
  let e = $(".box");
  e.hover(
    function() {
      hover = !0;
      let e = getCoordinates($(this).data("index"));
      for (let a = Math.min(positionOld.x, e.x); a <= Math.max(positionOld.x, e.x); a++) {
        let e = getTileIndex(a, positionOld.y),
          t = $('.box[data-index="' + e + '"]');
        if (t.hasClass("obstacle")) return;
        if (player1Active) {
          if (t.hasClass("player2")) return;
        } else if (t.hasClass("player1")) return;
      }
      for (let a = Math.min(positionOld.y, e.y); a <= Math.max(positionOld.y, e.y); a++) {
        let e = getTileIndex(positionOld.x, a),
          t = $('.box[data-index="' + e + '"]');
        if (t.hasClass("obstacle")) return;
        if (player1Active) {
          if (t.hasClass("player2")) return;
        } else if (t.hasClass("player1")) return;
      }
      attacked ||
        (((e.y === positionOld.y &&
          e.x <= positionOld.x + possibleMoves &&
          e.x >= positionOld.x - possibleMoves) ||
          (e.x === positionOld.x &&
            e.y <= positionOld.y + possibleMoves &&
            e.y >= positionOld.y - possibleMoves)) &&
          (player1Active
            ? $(this).css("backgroundImage", "url(" + player1.activePath + ")")
            : $(this).css(
                "backgroundImage",
                "url(" + player2.activePath + ")"
              )));
    },
    function() {
      (hover = !1), $(this).css("backgroundImage", "");
    }
  ),
    e.on("click", function() {
      hover = !1;
      let e = $(this).data("index");
      positionNew = getCoordinates(e);
      for (
        let e = Math.min(positionOld.x, positionNew.x);
        e <= Math.max(positionOld.x, positionNew.x);
        e++
      ) {
        let a = getTileIndex(e, positionOld.y),
          t = $('.box[data-index="' + a + '"]');
        if (t.hasClass("obstacle"))
          return void $(this).css("cursor", "not-allowed");
        if (player1Active) {
          if (t.hasClass("player2")) return;
        } else if (t.hasClass("player1")) return;
      }
      for (
        let e = Math.min(positionOld.y, positionNew.y);
        e <= Math.max(positionOld.y, positionNew.y);
        e++
      ) {
        let a = getTileIndex(positionOld.x, e),
          t = $('.box[data-index="' + a + '"]');
        if (t.hasClass("obstacle"))
          return void $(this).css("cursor", "not-allowed");
        if (player1Active) {
          if (t.hasClass("player2")) return;
        } else if (t.hasClass("player1")) return;
      }
      if (player1Active) {
        if ($(this).hasClass("player1")) return;
      } else if ($(this).hasClass("player2")) return;
      if (
        move &&
        ((positionNew.y === positionOld.y &&
          positionNew.x <= positionOld.x + possibleMoves &&
          positionNew.x >= positionOld.x - possibleMoves) ||
          (positionNew.x === positionOld.x &&
            positionNew.y <= positionOld.y + possibleMoves &&
            positionNew.y >= positionOld.y - possibleMoves))
      ) {
        for (
          let e = Math.min(positionOld.x, positionNew.x);
          e <= Math.max(positionOld.x, positionNew.x);
          e++
        ) {
          checkWeapon(getTileIndex(e, positionOld.y));
        }
        for (
          let e = Math.min(positionOld.y, positionNew.y);
          e <= Math.max(positionOld.y, positionNew.y);
          e++
        ) {
          checkWeapon(getTileIndex(positionOld.x, e));
        }
        determineActivePlayer(),
          player1Active
            ? ((playerPosition = determinePlayerPosition(".player2")),
              (positionOld = getCoordinates(playerPosition)),
              $(".player1")
                .removeClass("player1")
                .removeClass("active"),
              $(this).addClass("player1"),
              $(".player2").addClass("active"),
              fight(positionNew, positionOld),
              (player1Active = !1))
            : ((playerPosition = determinePlayerPosition(".player1")),
              (positionOld = getCoordinates(playerPosition)),
              $(".player2")
                .removeClass("player2")
                .removeClass("active"),
              $(this).addClass("player2"),
              $(".player1").addClass("active"),
              fight(positionNew, positionOld),
              (player1Active = !0));
      }
    });
}
function CreateWeapon(e, a, t) {
  (this.type = e),
    (this.value = a),
    (this.itemClass = t),
    (this.add = function() {
      addItems(this.itemClass);
    });
}
function replaceWeaponOnMap(e, a, t) {
  let n = $('.box[data-index="' + t + '"]');
  determineActivePlayer(),
    n.removeClass(a).addClass(playerActive.weapon),
    (playerActive.weapon = a),
    (playerNotActive.power = e);
}
function checkWeapon(e) {
  let a = $('.box[data-index="' + e + '"]');
  if (a.hasClass("weapon")) {
    if (a.hasClass("wp-1"))
      return (
        (currentWeapon = 1),
        replaceWeaponOnMap(defaultWeapon.value, "wp-1", e),
        void replaceWeaponOnBoard(defaultWeapon.value)
      );
    if (a.hasClass("wp-2"))
      return (
        (currentWeapon = 2),
        replaceWeaponOnMap(weapon2.value, "wp-2", e),
        void replaceWeaponOnBoard(weapon2.value)
      );
    if (a.hasClass("wp-3"))
      return (
        (currentWeapon = 3),
        replaceWeaponOnMap(weapon3.value, "wp-3", e),
        void replaceWeaponOnBoard(weapon3.value)
      );
    if (a.hasClass("wp-4"))
      return (
        (currentWeapon = 4),
        replaceWeaponOnMap(weapon4.value, "wp-4", e),
        void replaceWeaponOnBoard(weapon4.value)
      );
    a.hasClass("wp-5") &&
      ((currentWeapon = 5),
      replaceWeaponOnMap(weapon5.value, "wp-5", e),
      replaceWeaponOnBoard(weapon5.value));
  }
}
function fight(e, a) {
  if (
    (e.x === a.x && e.y <= a.y + 1 && e.y >= a.y - 1) ||
    (e.y === a.y && e.x <= a.x + 1 && e.x >= a.x - 1)
  ) {
    (move = !1), (hover = !1), fightingArea();
    fightPlayerOne(), fightPlayerTwo();
  }
}
function initGame() {
  game.create();
  for (let e = 0; e < blockedBoard; e += 1) game.obstacles("obstacle");
  $(".gameOver-content").css("display", "none"),
    weapon2.add(),
    weapon3.add(),
    weapon4.add(),
    weapon5.add(),
    player1.add(),
    player2.add(),
    player1.setData(),
    player2.setData(),
    $(".player1").addClass("active");
}
function determineActivePlayer() {
  player1Active
    ? ((activePlayer = 2),
      (notActivePlayer = 1),
      setActivePlayer(player2, player1, $(".damage")),
      displayTurnPlayerMessage(activePlayer))
    : ((activePlayer = 1),
      (notActivePlayer = 2),
      setActivePlayer(player1, player2, $(".damage-1")),
      displayTurnPlayerMessage(activePlayer));
}
function getCoordinates(e) {
  return { x: e % 10, y: Math.floor(e / 10) };
}
initGame(), moveMechanism();
const determinePlayerPosition = e => $(e).data("index");
let playerPosition = determinePlayerPosition(".player1"),
  positionOld = getCoordinates(playerPosition);
function getTileIndex(e, a) {
  return 10 * a + e;
}
function addItems(e, a) {
  let t = tiles,
    n = $(".box"),
    o = !0;
  for (; o; ) {
    let l = random(boardSize);
    if (
      ((positionRules =
        1 === a
          ? l % 10 == 0
          : 2 === a
          ? l % 10 == 9
          : l % 10 != 0 && l % 10 != 9),
      positionRules && t.includes(l))
    ) {
      n.eq(l).addClass(e);
      let a = t.indexOf(l);
      t.splice(a, 1), (o = !1);
    }
  }
}
function random(e) {
  return Math.floor(Math.random() * e);
}
function setActivePlayer(e, a, t) {
  (playerActive = e), (playerNotActive = a), (activePlayerPowerDiv = t);
}
function displayTurnPlayerMessage(e) {
  $(".turn-" + e)
    .text("Your turn")
    .addClass("turn-active"),
    $(".turn-" + notActivePlayer)
      .text("Wait your Opponent")
      .removeClass("turn-active");
}
function replaceWeaponOnBoard(e) {
  determineActivePlayer(),
    $(".weapon-" + notActivePlayer).empty(),
    $('<img src="image/wp-' + currentWeapon + '.png">').appendTo(
      ".weapon-" + notActivePlayer
    ),
    $(".damage-" + notActivePlayer).text(e);
}
function combat() {
  0 == turn
    ? ($(".btn-attack-1").hide(),
      $(".btn-defend-1").hide(),
      $(".btn-attack-2").hide(),
      $(".btn-defend-2").hide())
    : 1 == turn
    ? ($(".btn-attack-2").hide(),
      $(".btn-defend-2").hide(),
      $(".btn-attack-1").show(),
      $(".btn-defend-1").show())
    : 2 == turn &&
      ($(".btn-attack-1").hide(),
      $(".btn-defend-1").hide(),
      $(".btn-attack-2").show(),
      $(".btn-defend-2").show());
}
function fightingArea() {
  $(".board-container").hide(),
    $("#player-1").css("margin-left", "300px"),
    $("#player-2").css("margin-right", "300px"),
    $("div.turn-1").empty(),
    $("div.turn-2").empty(),
    $("#player-" + activePlayer).removeClass("active-board"),
    $(".btn-attack-1").show(),
    $(".btn-defend-1").show();
}
function gameOverBoard() {
  $(".player-container").hide(),
    $("header").hide(),
    $(".gameOver-content").show();
}
function startGame() {
  $(".landing-page").css("display", "none"),
    $(".player-container").show(),
    $(".board-container").show(),
    $(".btn-attack-1").hide(),
    $(".btn-attack-2").hide(),
    $(".btn-defend-1").hide(),
    $(".btn-defend-2").hide(),
    $("#player-1").addClass("active-board");
}
function fightPlayerOne() {
  $(".turn-1").addClass("hide"),
    $(".turn-2").addClass("hide"),
    $(".btn-attack-1").click(function() {
      player1.attack(player2),
        (pleyerDefend = 0),
        (turn = 2),
        (activePlayer = 2),
        combat();
    }),
    $(".btn-defend-1").click(function() {
      (playerDefend = 1), (turn = 2), (activePlayer = 2), combat();
    });
}
function fightPlayerTwo() {
  $(".btn-attack-2").click(function() {
    player2.attack(player1),
      (pleyerDefend = 0),
      (turn = 1),
      (activePlayer = 1),
      combat();
  }),
    $(".btn-defend-2").click(function() {
      (turn = 1), (playerDefend = 1), (activePlayer = 1), combat();
    });
}
