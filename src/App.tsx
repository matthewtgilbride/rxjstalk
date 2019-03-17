import React, { FunctionComponent, useEffect, useState } from 'react';
import './App.css';
import { debounce, getClickObservable } from "./observables";
import styles from './App.module.css'

const App: FunctionComponent<{}> = () => {

  const [clicked, setClicked] = useState(0);
  const [debounced, setDebounced] = useState(0);

  debugger;

  const handleClicked = () => {
    const foo = clicked;
    debugger;
    setClicked(clicked + 1)
  }
  const handleDebounced = () => setDebounced(debounced + 1)
  const logIt = (msg: string) => () => console.log(msg)

  useEffect(
    () => {
      const rawObservable = getClickObservable('first')
      const sub1 = rawObservable.subscribe(handleClicked, logIt('click error'), logIt('click complete'))
      const sub2 = debounce(rawObservable, 2000).subscribe(handleDebounced, logIt('debounce error'), logIt('debounce complete'))
      return () => {
        sub1.unsubscribe()
        sub2.unsubscribe()
      }
    },
    []
  )

  return (
    <div className={styles["flex-grid"]}>
      <div className={styles.col}>
        <button id='first'>Baby's First Observable</button>
      </div>
      <div className={styles.col}>{`button has been clicked ${clicked} times`}</div>
      <div className={styles.col}>{`debounced: ${debounced} times`}</div>
    </div>
  );

}

export default App;
