import React from 'react';
import Question from './Question';

const API_URL = window.location.hostname === "localhost" ? "http://localhost:3003" : "now.sh";
console.log(API_URL)

export default class Game extends React.Component{


    constructor(props){
        super(props)

        this.state = {
            playing: false,
            score: 0,
            question: {
                authors: [],
                answer: 0,
                quote: ""
            }
        }

        this.playButtonClicked = this.playButtonClicked.bind(this)
        this.getNextQuestion = this.getNextQuestion.bind(this)
        this.pass = this.pass.bind(this)
        this.fail = this.fail.bind(this)

    }
    
    componentWillMount(){
        this.getNextQuestion()
    }

    playButtonClicked(){
        this.getNextQuestion();

        this.setState({
            playing: true,
            score: 0,
        })
    }

    getNextQuestion(){
        const question =
            fetch(`${API_URL}/question`)
            .then(res => res.json())
            .then(q => this.setState({question: q}))
            .catch(err => console.log('error ' + err))
    }
    
    pass(){
        this.setState({
            score: this.state.score +1
        })

        this.getNextQuestion();
    }
    
    fail(){
        this.setState({
            score: this.state.score -1
        })

        this.getNextQuestion();
    }

    render(){
        let game = <div className='start'>
            <h1>Mzanzi Trivia</h1>
            <h3>Match the author to the quote</h3>
            <button onClick={this.playButtonClicked}>Play</button>
        </div>

        if(this.state.playing){
            game = <div>
                <h2>Score: {this.state.score}</h2>
                <Question question={this.state.question} pass={this.pass} fail={this.fail} />
            </div>
        }

        return (
            <div className="game">
                {game}
            </div>
        );
    }
}
