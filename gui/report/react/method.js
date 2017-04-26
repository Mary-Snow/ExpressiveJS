import React, { Component } from 'react';
import Route from './route';

class Method extends Component {
  render() {
    let userMethods = {};
    //gather all route methods with no repeats of same method
    Object.keys(this.props.watchData).map((element) => {
      if(!userMethods.hasOwnProperty(this.props.watchData['method'])) {
        userMethods[this.props.watchData['method']] = this.props.watchData['method']
      }
    })

    //create method button
    let methodButtons = Object.keys(userMethods)
    .map((element, index) => {
      //element is GET and POST for our example.
      return <button key={index} id={element} onClick={() => this.props.displayRoute(element)}> {element} </button>
    });

    return (
      <div id="methodColumn" className="flex-item">
        {methodButtons}
      </div>
    );
  }
}

export default Method;