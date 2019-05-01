import React from 'react';
import Question from './Question';

const API_URL = "http://localhost:3003";


export default class Game extends React.Component{


    constructor(props){
        super(props)

        this.state = {
            playing: false,
            score: 0,
            question: null
        }

        this.playButtonClicked = this.playButtonClicked.bind(this)
        this.getNextQuestion = this.getNextQuestion.bind(this)
        this.pass = this.pass.bind(this)
        this.fail = this.fail.bind(this)

    }

    playButtonClicked(){
        this.getNextQuestion();

        this.setState({
            playing: true,
            score: 0,
        })
    }

    getNextQuestion(){
        this.setState({
            question: {
                authors: [
                    {
                        name: "Mandela",
                        src: require("../assets/mandela.jpg")
                    },
                    {
                        name: "Thabo",
                        src: require("../assets/mandela.jpg")
                    },
                    {
                        name: "Zuma",
                        src: require("../assets/mandela.jpg")
                    },
                ],
                answer: 1,
                quote: "Who said this"
            }
        })
    }
    
    pass(){
        this.setState({
            score: this.state.score +1
        })

        this.confetti();
    }

    confetti(){
        let confetti = []
        let x = Math.random() * 1000
        // for(let i = 0; i < x; i++){
        //     let c = document.createElement('div')
        //     c.className = 'confetti'

            
        // }
    }
    
    fail(){
        this.setState({
            score: this.state.score -1
        })

        console.log('ney')
    }

    render(){

        let quote = fetch(API_URL)
            .then((res) => res.text())
            .then((text)=> console.log(text))
        // console.log(quote)
        
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
