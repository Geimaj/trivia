import React from 'react';
import Author from './Author';

export default class Question extends React.Component{

    constructor(props){
        super(props)
    }

    authorClicked(i){
        if(i === this.props.question.answer){
            this.props.pass();
        } else {
            this.props.fail();
        }
    }

    render(){
        let authors = this.props.question.authors.map((author, i) => {
            return (<Author key={author.name} 
                    name={author.name} 
                    src={author.src}
                    onClick={() => this.authorClicked(i)}/>)
        })
        return (
            <div className="question">
                <div className="authors" >
                    {authors}
                </div>
                <div>
                    <p>"{this.props.question.quote}"</p>
                </div>
            </div>
        );


    }
}
