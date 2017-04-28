/*
TODO: add hovering arrow between the returned report div.
*/
import React, { Component } from 'react';

class Report extends Component {
  render() {
    let report = this.props.userReports.map((element, index) => {
      //facilitate pulling information off of req and res object
      let reqObj = element['req'];
      let resObj = element['res'];
      //console.log("element in the loop", element)

      return <div key={index} className="report">
        <div className="currentState">
          <h2> State #{index + 1} </h2> <hr />
          <b>request:</b> <br />
          <span>cookie:</span> {reqObj.socket._httpMessage._headers['set-cookie']} <br />
          host: {reqObj.headers.host} <br />
          complete: {reqObj.complete.toString()} <br />

          <br />

          <b>response:</b> <br />
          cookie: {resObj._headers['set-cookie']} <br />
          finished: {resObj.finished.toString()} <br />
          <br />
        </div>
        {/*below are information for arrows*/}
        <div className="stateChanges state-container">
          <div className = "arrow state-item">
            <img src = "http://placekitten.com/g/175/175" />
          </div>
          <div className="changeLogs state-item">
            <b>State Changes:</b> <br />
            duration of Request and Response: {this.props.json[this.props.userRoutes].duration} ms<br />
            Status Code: {this.props.json[this.props.userRoutes].statusCode}<br />
            Status Message: {this.props.json[this.props.userRoutes].statusMessage}<br />
            Request Summaries: {this.props.requestSummaries(this.props.stateChangeLogs)} <br />
            Response Summaries: {this.props.responseSummaries(this.props.stateChangeLogs)} <br />
          </div>
        </div>

        <br />
      </div>
    });

    return (
      <div id="reportColumn" className="flex-item">
        {report}
      </div>
    );
  }
}

export default Report;