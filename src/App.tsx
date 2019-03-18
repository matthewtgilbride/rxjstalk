import React, { Component } from 'react';
import './App.css';
import { debounce, getClickObservable } from "./observables";
import styles from './App.module.css'

export class App extends Component<{}, { clicked: number, debounced: number }>  {

  public state = {
    clicked: 0,
    debounced: 0,
  }

  public handleClicked = () => this.setState({ clicked: this.state.clicked + 1 })
  public handleDebounced = () => this.setState({ debounced: this.state.debounced + 1 })

  public componentDidMount = () => {
    const rawObservable = getClickObservable('debounce')
    rawObservable.subscribe({ next: this.handleClicked })
    debounce(rawObservable, 2000).subscribe({ next: this.handleDebounced })
  }

  public render = () => {
    return (
      <>
        <div className={styles["flex-grid"]}>
          <div className={styles.col}>Click Me</div>
          <div className={styles.col}>Click Count</div>
          <div className={styles.col}>Operator Count</div>
        </div>
        <div className={styles["flex-grid"]}>
          <div className={styles.col}>
            <button id='debounce'>Debounce 2 Seconds</button>
          </div>
          <div className={styles.col}>{this.state.clicked}</div>
          <div className={styles.col}>{this.state.debounced}</div>
        </div>
      </>
    );
  }

}

export default App;
