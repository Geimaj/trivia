import React from "react";
import { API_URL } from "./Game";

export default class highscore extends React.Component {
  constructor() {
    super();
    this.HIGHSCORE_URL = API_URL + "/highscore";

    this.saveScoreClicked = this.saveScoreClicked.bind(this);
  }

  saveScoreClicked(e) {
    e.preventDefault();
    const form = document.querySelector("form");
    const formData = new FormData(form);
    const name = formData.get("name");

    let newHighscore = {
      name: name,
      score: this.props.score
    };

    fetch(this.HIGHSCORE_URL, {
      method: "POST",
      body: JSON.stringify(newHighscore),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => console.log(json));

    form.style.display = "none";
  }

  render() {
    let form;
    if (this.props.score > this.props.highscore.score) {
      form = (
        <form>
          <h1>Well Done!</h1>
          <h2>You beat the high score!</h2>
          <label htmlFor="name">Enter your name</label>
          <input id="name" name="name" />
          <button onClick={this.saveScoreClicked}>Save your score!</button>
        </form>
      );
    }

    return (
      <div className="highscore">
        <h1>Game Over</h1>
        <h2>You scored {this.props.score}</h2>
        <h3>
          {this.props.highscore.name}'s score: {this.props.highscore.score}
        </h3>
        {form}
        <button onClick={this.props.playButtonClicked}>Play Again</button>
      </div>
    );
  }
}
