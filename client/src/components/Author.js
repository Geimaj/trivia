import React from 'react';

export default class Author extends React.Component {

    render() {
        return (
            <div className='author' onClick={this.props.onClick}>
                <img src={this.props.src} />
                <h2>{this.props.name}</h2>
                
            </div>
        )
    }
}