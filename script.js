document.querySelector(".hit").addEventListener("click", blackjackhit);
document.querySelector(".stand").addEventListener("click", blackjackstand);
document.querySelector(".deal").addEventListener("click", blackjackdeal);

let game = {
  you: { spanscore: ".yourscore", div: ".yourboard", score: 0 },
  bot: { spanscore: ".botscore", div: ".botboard", score: 0 },
  cards: ["2", "4", "5", "7", "8", "6", "a1", "k"],
  cardsvalue: { 2: 2, 4: 4, 5: 5, 7: 7, 8: 8, 6: 6, a1: [1, 11], k: 10 },
  wins: 0,
  losses: 0,
  drews: 0,
  isHit: true,
  isStand: true,
};
const you = game["you"];
const bot = game["bot"];
const cardsound = new Audio("./static/cardsound.wav");

// let random = [
//   "./images/2.png",
//   "./images/6.png",
//   "./images/4.png",
//   "./images/5.png",
//   "./images/7.png",
//   "./images/8.png",
//   "./images/a1.png",
//   "./images/k.png",
// ];

function random() {
  let rando = game["cards"][Math.floor(Math.random() * 7)];
  return rando;
}

function blackjackhit() {
  if (game["isHit"] === true) {
    let rando = random();
    showcard(rando, you);
    update(rando, you);
    showscore(you);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function blackjackstand() {
  while (game["isStand"] === true) {
    let rando = random();
    showcard(rando, bot);
    update(rando, bot);
    showscore(bot);
    game["isHit"] = false;
    await sleep(1000);
    if (bot["score"] >= you["score"]) {
      game["isStand"] = false;
      showwinner(winner());
    } else if (you["score"] > 21) {
      game["isStand"] = false;
      showwinner(winner());
    }
    // if (bot["score"] >= 15) {
    //   showwinner(winner());
    // }
  }
}

function showscore(player) {
  if (player["score"] > 21) {
    document.querySelector(player["spanscore"]).textContent = "Bust..!";
    document.querySelector(player["spanscore"]).style.color = "red";
  } else {
    document.querySelector(player["spanscore"]).textContent = player["score"];
  }
}

function showcard(rando, board) {
  if (board["score"] <= 21) {
    cardsound.play();
    let cardimg = document.createElement("img");
    cardimg.src = `./images/${rando}.png`;
    document.querySelector(board["div"]).appendChild(cardimg);
  }
}

function update(rando, board) {
  if (board["score"] <= 21) {
    let value = game["cardsvalue"][rando];
    if (rando === "a1") {
      if (board["score"] + value[1] <= 21) {
        board["score"] += value[1];
        console.log(value[1]);
      } else {
        board["score"] += value[0];
        console.log(value[0]);
      }
    } else {
      board["score"] += value;
    }
  }
}

function blackjackdeal() {
  if (game["isStand"] === false) {
    // showwinner(winner());
    let yourside = document.querySelector(".yourboard").querySelectorAll("img");
    let botside = document.querySelector(".botboard").querySelectorAll("img");
    for (let i = 0; i < yourside.length; i++) {
      yourside[i].remove();
    }
    for (let i = 0; i < botside.length; i++) {
      botside[i].remove();
    }
    you["score"] = 0;
    bot["score"] = 0;
    document.querySelector(you["spanscore"]).style.color = "blue";
    document.querySelector(bot["spanscore"]).style.color = "blue";
    showscore(you);
    showscore(bot);
    document.querySelector("#result").textContent = "Let's play";
    document.querySelector("#result").style.color = "black";
    game["isHit"] = true;
    game["isStand"] = true;
  }
}

function winner() {
  let winner;
  if (you["score"] <= 21) {
    if (you["score"] > bot["score"] || bot["score"] > 21) {
      // console.log("you won");
      game["wins"]++;
      winner = you;
    } else if (you["score"] < bot["score"]) {
      // console.log("you lost");
      game["losses"]++;

      winner = bot;
    } else if (you["score"] === bot["score"]) {
      // console.log("you drawed");
      game["drews"]++;
    }
  } else if (you["score"] > 21 && bot["score"] > 21) {
    // console.log("you drawn");
    game["drews"]++;
  } else if (you["score"] > 21 && bot["score"] < 21) {
    // console.log("you lost");
    game["losses"]++;

    winner = bot;
  }
  game["isStand"] = false;
  return winner;
}
function showwinner(winner) {
  let message, messagecolor;
  if (winner === you) {
    document.querySelector(".yourtable").textContent = game["wins"];
    message = "you won";
    messagecolor = "green";
    console.log("winnershow");
  } else if (winner === bot) {
    document.querySelector(".bottable").textContent = game["losses"];
    message = "you lost";
    messagecolor = "red";
    console.log("winnershow");
  } else {
    document.querySelector(".drawstable").textContent = game["drews"];
    message = "you drew";
    messagecolor = "yellow";
    console.log("winnershow");
  }
  document.querySelector("#result").textContent = message;
  document.querySelector("#result").style.color = messagecolor;
}
