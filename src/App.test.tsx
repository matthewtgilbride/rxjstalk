import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TestScheduler } from 'rxjs/testing';
import { map, mergeMap } from 'rxjs/operators';
import { zip, merge } from 'rxjs';

const objectEqualityTestScheduler = () => new TestScheduler((actual, expected) => {
  // asserting the two objects are equal
  expect(actual).toEqual(expected);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should double source value', () => {

  objectEqualityTestScheduler().run(helpers => {
    const { cold, expectObservable } = helpers;

    const inputStream = cold('-a', { a: 5 });

    const outputStream = inputStream.pipe(
      map(v => v * 2)
    );

    expectObservable(outputStream).toBe('-b', { b: 10 });
  });

});

describe('zip emits the most recently emitted item from each source observable, after all observables emit', () => {
  it('no 3rd item will be emitted here', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable} ) => {
      const in1 = cold('--a--b--c')
      const in2 = cold('d--e-----')

      const outputStream = zip(in1, in2)

      expectObservable(outputStream).toBe('--a--b---', { a: ['a','d'], b: ['b','e']})
    })
  })

  it('also of note, order matters', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable} ) => {
      const in1 = cold('--a--b--c')
      const in2 = cold('d--e-----')

      const outputStream = zip(in2, in1)

      expectObservable(outputStream).toBe('--a--b---', { a: ['d','a'], b: ['e','b']})
    })
  })

  it('here is an interesting one with 3', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable} ) => {
      const in1 = cold('--a--b--c--')
      const in2 = cold('d--e-------')
      const in3 = cold('--------fgh')

      const outputStream = zip(in1, in2, in3)

      expectObservable(outputStream).toBe('--------fg-', { f: ['a','d', 'f'], g: ['b', 'e', 'g']})
    })
  })

})

describe('mergeMap', () => {
  it('basic', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = cold('a---bc------')
      const in2 = cold('d-----e--f--')

      const outputStream = in1.pipe(
        mergeMap(() => in2)
      )

      expectObservable(outputStream).toBe('(ad)bce--f--')

    })
  })
})
