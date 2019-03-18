import React, { Component } from 'react';
import './App.css';
import { debounce, getClickObservable, subscribeNext } from "./observables";
import styles from './App.module.css'
import { forkJoin, timer, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export class App extends Component<{}, {
  clicked: number,
  debounced: number,
  clicked2: number,
  zipped: number,
  clicked3: number,
  forked: number
}>  {

  public state = {
    clicked: 0,
    debounced: 0,
    clicked2: 0,
    zipped: 0,
    clicked3: 0,
    forked: 0,
  }

  public handleClicked = () => this.setState({ clicked: this.state.clicked + 1 })
  public handleDebounced = () => this.setState({ debounced: this.state.debounced + 1 })
  public handleClicked2 = () => this.setState({ clicked2: this.state.clicked2 + 1 })
  public handleZipped = () => this.setState({ zipped: this.state.zipped + 1 })
  public handleClicked3 = () => this.setState({ clicked3: this.state.clicked3 + 1 })
  public handleForked = () => this.setState({ forked: this.state.forked + 1 })

  public componentDidMount = () => {
    const rawObservable = getClickObservable('debounce')
    const raw2 = getClickObservable('zip')
    subscribeNext(raw2, this.handleClicked2)
    zip(rawObservable, raw2).subscribe({ next: this.handleZipped})
    rawObservable.subscribe({ next: this.handleClicked })
    debounce(rawObservable, 2000).subscribe({ next: this.handleDebounced })
    const raw3 = getClickObservable('fork')
    raw3.subscribe({ next: this.handleClicked3 })
    raw3
      .pipe(
        mergeMap(() => forkJoin(timer(1000), timer(3000)))
      ).subscribe({ next: this.handleForked })
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
            <button id='debounce'>Debounce</button>
          </div>
          <div className={styles.col}>{this.state.clicked}</div>
          <div className={styles.col}>{this.state.debounced}</div>
        </div>
        <div className={styles["flex-grid"]}>
          <div className={styles.col}>
            <button id='zip'>Zip</button>
          </div>
          <div className={styles.col}>{this.state.clicked2}</div>
          <div className={styles.col}>{this.state.zipped}</div>
        </div>
        <div className={styles["flex-grid"]}>
          <div className={styles.col}>
            <button id='fork'>Merge/ForkJoin</button>
          </div>
          <div className={styles.col}>{this.state.clicked3}</div>
          <div className={styles.col}>{this.state.forked}</div>
        </div>
      </>
    );
  }

}

export default App;
