import React from "react";
import Question from "./Question";
import HighScore from "./Highscore";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3003"
    : "https://mzanzi-trivia-api.now.sh";
console.log(API_URL);

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.emptyQuestion = null;

    this.state = {
      playing: false,
      gameOver: false,
      score: 0,
      question: this.emptyQuestion,
      round: 0,
      highScore: {
        score: 0,
        name: "noone"
      }
    };

    this.playButtonClicked = this.playButtonClicked.bind(this);
    this.getNextQuestion = this.getNextQuestion.bind(this);
    this.authorClicked = this.authorClicked.bind(this);

    this.maxRounds = this.props.rounds || 3;
  }

  componentWillMount() {
    this.getNextQuestion().then(q => {
      q.authors.forEach(author => {
        let img = new Image();
        img.src = author.image;
      });
      this.setState({ question: q });
    });
  }

  componentDidMount() {
    this.loader = document.querySelector(".loader");
  }

  async playButtonClicked() {
    this.loader.style.display = "";

    if (!this.state.question) {
      this.getNextQuestion().then(question =>
        this.setState({ question: question })
      );
    }

    fetch(API_URL + "/highscore")
      .then(res => res.json())
      .then(json => this.setState({ highscore: json }));

    this.setState({
      playing: true,
      gameOver: false,
      round: 0,
      score: 0
    });
  }

  async getNextQuestion() {
    let json = await fetch(`${API_URL}/question`);
    let question = await json.json();

    return question;
  }

  async authorClicked(correct) {
    let points = 0;
    if (correct) {
      points = 1;
    } else {
      points = -1;
    }

    let round = this.state.round + 1;

    this.setState({
      score: this.state.score + points,
      round: round,
      question:
        round >= this.maxRounds
          ? this.emptyQuestion
          : await this.getNextQuestion(),
      gameOver: round >= this.maxRounds
    });
  }

  render() {
    let game = (
      <div className="start">
        <h1>Mzanzi Trivia</h1>
        <h3>Match the author to the quote</h3>
        <button onClick={this.playButtonClicked}>Play</button>
      </div>
    );

    if (this.state.playing) {
      if (this.state.gameOver) {
        game = (
          <HighScore
            playButtonClicked={this.playButtonClicked}
            score={this.state.score}
            highscore={this.state.highscore}
          />
        );
      } else {
        game = (
          <div>
            <h2>Score: {this.state.score}</h2>
            <span>
              High score: {this.state.highscore && this.state.highscore.score}{" "}
              by &nbsp;
              <b>{this.state.highscore && this.state.highscore.name}</b>
            </span>
            <h3>Round {this.state.round}</h3>

            <Question
              question={this.state.question}
              authorClicked={this.authorClicked}
            />
          </div>
        );
      }
    }

    return (
      <div className="game">
        {game}
        <img
          className="loader"
          src={require("../assets/loader.gif")}
          alt="spinner"
        />
      </div>
    );
  }
}

export { Game, API_URL };
