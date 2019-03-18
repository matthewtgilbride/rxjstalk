import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TestScheduler } from 'rxjs/testing';
import { map } from 'rxjs/operators';

const scheduler = new TestScheduler((actual, expected) => {
  // asserting the two objects are equal
  expect(actual).toEqual(expected);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should double source value', () => {

  scheduler.run(helpers => {
    const { cold, expectObservable } = helpers;

    const inputStream = cold('-a', { a: 5 });

    const outputStream = inputStream.pipe(
      map(v => v * 2)
    );

    expectObservable(outputStream).toBe('-b', { b: 10 });
  });

});
