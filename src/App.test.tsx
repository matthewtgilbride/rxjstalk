import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TestScheduler } from 'rxjs/testing';
import { map, mergeMap } from 'rxjs/operators';
import { merge, zip } from 'rxjs';

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
  it('map alone', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = cold('a---bc')
      const in2 = cold('d-----e--f')

      const outputStream = merge(in1, in2)

      expectObservable(outputStream).toBe('(ad)bce--f')

    })
  })

  it('mergeMap map', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = cold('abc---------|')
      const in2 = cold('1--2--3|')

      const outputStream = in1.pipe(
        mergeMap((x) => in2.pipe(map(y => x + y))),
        mergeMap(() => in2, (x, y) => "" + x + y, 2)
      )

      expectObservable(outputStream).toBe('abcdefghi---|', { a: 'a1', b: 'b1', c: 'c1', d: 'a2', e: 'b2', f: 'c2', g: 'a3', h: 'b3', i: 'c3' })

    })
  })

  fit('mergeMap diagram', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = cold('abc---|')
      const in2 = cold('1--2|')

      const outputStream = in1.pipe(
        mergeMap(() => in2, (x, y) => "" + x + y, 2)
      )

      expectObservable(outputStream).toBe('abcde---(fg)-h-----------i---|', { a: 'a1', b: 'b1', c: 'a2', d: 'b2', e: 'a3', f: 'b3', g: 'c1', h: 'c2', i: 'c3' })

    })
  })
})
