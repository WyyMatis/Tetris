function getScores() {
  let url = "http://localhost:3000/bestPlayers";

  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {

      displayScore(value);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function displayScore(score) {
  let bestscore = document.getElementById("bestScores");

  while (bestscore.firstChild) {
    bestscore.removeChild(bestscore.firstChild);
  }

  score
    .sort(function (a, b) {
      return b.score - a.score;
    })
    .slice(0, NB_BESTSCORE_DISPLAYED)
    .forEach(function (element) {
      //ad li element with score to the dom
      let li = document.createElement("li");
      li.innerHTML = element.nom + " : " + element.score;
      bestscore.appendChild(li);
    });
}

function saveScore(myName, myScore) {

  $.post(
    "http://localhost:3000/newScore",
    {
      nom: myName,
      score: myScore,
    },
    function (data) {
      alert(
        "Dommage " +
          myName +
          ", vous avez perdu. Votre score est de " +
          myScore +
          " points et a bien été enregistré !"
      );
    }
  );

  
}
