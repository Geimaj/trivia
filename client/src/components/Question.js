import React from "react";
import Author from "./Author";

export default class Question extends React.Component {
  authorClicked(i) {
    console.log(`clicked ${i} correct: ${this.props.question.answer}`);
    this.props.authorClicked(i === this.props.question.answer);
  }

  render() {
    let authors = this.props.question.authors.map((author, i) => {
      return (
        <Author
          key={author.name}
          name={author.name}
          src={author.image}
          onClick={() => this.authorClicked(i)}
        />
      );
    });
    return (
      <div className="question">
        <div className="authors">{authors}</div>
        <div>
          <p>"{this.props.question.quote}"</p>
        </div>
      </div>
    );
  }
}
