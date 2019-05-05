import React from "react";
import { API_URL } from "./Game";

export default class highscore extends React.Component {
  constructor() {
    super();
    this.HIGHSCORE_URL = API_URL + "/highscore";

    this.state = {
      highscore: -80,
      name: ""
    };

    this.saveScoreClicked = this.saveScoreClicked.bind(this);
  }

  async componentWillMount() {
    console.log(this.HIGHSCORE_URL);
    let json = await fetch(this.HIGHSCORE_URL)
      .then(res => res.json())
      .then(json => {
        return json;
      });

    this.setState({
      highscore: json.score,
      name: json.name
    });
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
    if (this.props.score > this.state.highscore) {
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
          {this.state.name}'s score: {this.state.highscore}
        </h3>
        {form}
        <button onClick={this.props.playButtonClicked}>Play Again</button>
      </div>
    );
  }
}
