import React, { Component } from 'react';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators'
import './App.css';

const rawObservable = fromEvent(document.getElementById('first') || window, 'click')

class App extends Component<{}, { clicked: number, debounced: number }> {
  public state = {
    clicked: 0,
    debounced: 0,
  }

  public componentDidMount = () => {
    rawObservable
      .subscribe(
        () => this.setState({ clicked: this.state.clicked + 1 })
      )
    rawObservable.pipe(
      debounceTime(2000)
    )
      .subscribe(
        () => this.setState({ debounced: this.state.debounced + 1 })
      )
  }

  render() {
    return (
      <div style={{ textAlign: 'center', verticalAlign: 'center' }}>
        <button id='first'>Baby's First Observable</button>
        <div>{`button has been clicked ${this.state.clicked} times`}</div>
        <div>{`debounced: ${this.state.debounced} times`}</div>
      </div>
    );
  }
}

export default App;
