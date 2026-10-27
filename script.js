"use strict";
// 1行目に記載している 'use strict' は削除しないでください

//cardの要素をelementsに取得
const cards = document.querySelectorAll(".card");

//すべてのカードにクリックしたらflipCardを実行するというイベントを設定
for (const card of cards) {
  card.addEventListener("click", function () {
    flipCard(card);
  });
}

let firstCard = null; //1枚目にめくるカード
let secondCard = null; //2枚目にめくるカード
let isChecking = false; //カードを二枚めくったときに判定中（true）になり、カードをめくれない処理にする。

let playerCount = 0; //プレイヤーの人数
let currentPlayer = 1; //現在のプレイヤーの番号
let scores = []; //プレイヤーの獲得枚数を格納する配列

//スタートボタンを押した後に起こす処理
function startGame() {
  // 人数が選択されているか確認
  if (document.querySelector('input[name="person"]:checked') === null) {
    document.getElementById("personError").innerText = "人数を選択してください";
    return;
  }
  // エラーメッセージを消す
  document.getElementById("personError").innerText = "";

  //トランプのカードを作成
  const cards = makeCards();
  //カードをシャッフルする
  const shuffledCards = shuffleCards(cards);
  //カードに値を割り当てる
  setCards(shuffledCards);
  //プレイヤーの人数を取得する
  setPlayerCount();
  //ゲームの初期設定をする
  resetGame();
  //ゲーム開始時の画面表示を変更する
  changeDisplay();
  // 順番と獲得枚数を更新する
  updateDisplay();
}

//カード配列作成
function makeCards() {
  const suits = ["♠️", "♥️", "♣️", "♦️"];
  const numbers = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  const cards = [];

  for (const suit of suits) {
    for (const number of numbers) {
      cards.push(suit + number);
    }
  }

  return cards;
}

//カードをシャッフルさせる
function shuffleCards(cards) {
  const shuffledCards = [];

  while (cards.length > 0) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    const card = cards.splice(randomIndex, 1)[0];

    shuffledCards.push(card);
  }

  return shuffledCards;
}

//カードに値を割り当てる
function setCards(shuffledCards) {
  for (let i = 0; i < cards.length; i++) {
    //カードの柄を<div class="card" data-card="♠A"></div>のように割り当てる
    cards[i].dataset.card = shuffledCards[i];
  }
}

//プレイヤーの人数を取得する関数
function setPlayerCount() {
  // 選択した人数を取得し、数値に変換してplayerCountに代入
  playerCount = Number(
    // name="person"のラジオボタンの中でチェックされているもののvalueを取得
    document.querySelector('input[name="person"]:checked').value,
  );
}

//ゲームの初期設定をする関数
function resetGame() {
  currentPlayer = 1;
  scores = Array(playerCount).fill(0);

  firstCard = null;
  secondCard = null;
  isChecking = false;
}

//ゲーム開始時の画面表示を変更する関数
function changeDisplay() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("order").style.display = "flex";
  document.getElementById("personSelect").style.display = "none";
  document.getElementById("score").style.display = "flex";

  for (const card of cards) {
    card.style.display = "flex";
  }
}

//順番と獲得枚数を更新する関数
function updateDisplay() {
  document.getElementById("order").innerText = currentPlayer + "人目の番です";

  let scoreText = "";

  for (let i = 0; i < playerCount; i++) {
    scoreText += i + 1 + "人目：" + scores[i] + "枚　";
  }

  document.getElementById("score").innerText = "SCORE:　" + scoreText;
}

//２枚のカードを比較する関数
function checkCards() {
  if (firstCard.dataset.card.slice(1) === secondCard.dataset.card.slice(1)) {
    setTimeout(matchCards, 1500);
  } else {
    setTimeout(unmatchCards, 1500);
  }
}

// 2枚のカードが一致した場合の処理
function matchCards() {
  firstCard.style.visibility = "hidden";
  secondCard.style.visibility = "hidden";

  // 獲得枚数を2枚増やす
  scores[currentPlayer - 1] += 2;

  // 獲得枚数の表示を更新する
  updateDisplay();

  resetCards();
}

// 2枚のカードが一致しなかった場合の処理
function unmatchCards() {
  firstCard.classList.remove("flipped");
  secondCard.classList.remove("flipped");

  firstCard.innerText = "";
  secondCard.innerText = "";

  // 次のプレイヤーに交代
  changePlayer();

  updateDisplay();

  resetCards();
}

// プレイやーの交代処理
function changePlayer() {
  currentPlayer++;

  // 最後のプレイヤーまで進んだら1人目に戻る
  if (currentPlayer > playerCount) {
    currentPlayer = 1;
  }
}

// カードの状態をリセットする関数
function resetCards() {
  firstCard = null;
  secondCard = null;
  isChecking = false;
}

// カードをめくる
function flipCard(card) {
  // スタート前・判定中はめくれない(クリックしても何もせずにreturnする)
  if (!card.dataset.card || isChecking) {
    return;
  }
  //すでに表向きのカードはめくれない(クリックしても何もせずにreturnする)
  if (card.classList.contains("flipped")) {
    return;
  }

  //カードを表向きにする
  card.classList.add("flipped");
  card.innerText = card.dataset.card;

  //１枚目のカードがめくられていない場合は、firstCardに代入してreturnする
  if (firstCard === null) {
    firstCard = card;
    return;
  }
  //２枚目のカードがめくられた場合は、secondCardに代入して判定中にする
  secondCard = card;
  isChecking = true;

  //２枚のカードを比較する
  checkCards();
}

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", startGame);
