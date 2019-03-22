import React from 'react';
import { TestScheduler } from 'rxjs/testing';
import { map, mergeMap, debounceTime, take } from 'rxjs/operators';
import { concat, merge, zip, forkJoin } from 'rxjs';

const objectEqualityTestScheduler = () => new TestScheduler((actual, expected) => {
  // asserting the two objects are equal
  expect(actual).toEqual(expected);
});

describe('real life examples', () => {

  it('forkJoin', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = '-u- a--    |'
      const in2 = '--- vb-    |'
      const in3 = '--- c--    |'
      const out = '--- --- (z|)'

      const values = {
        a: { foo: 'bar' },
        b: { bar: 'baz' },
        c: { fizz: 'buzz' },
        u: 'lost',
        v: 'also lost',
        z: {
          foo: 'bar',
          bar: 'baz',
          fizz: 'buzz',
        }
      }

      const in1$ = cold(in1, values)
      const in2$ = cold(in2, values)
      const in3$ = cold(in3, values)

      const outputStream = forkJoin(in1$, in2$, in3$).pipe(map(
        // @ts-ignore
        ([x, y, z]) => ({ ...x, ...y, ...z })))

      expectObservable(outputStream).toBe(out, values)

    })
  })

  describe('zip take 1', () => {

    it('order 1', () => {
      objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

        const in1 = '-x- a-- |'
        const in2 = '--- yb- |'
        const in3 = '--- c-- |'
        const out = '--- (z|)'

        const values = {
          z: ['x', 'y', 'c']
        }

        const in1$ = cold(in1)
        const in2$ = cold(in2)
        const in3$ = cold(in3)

        const outputStream = zip(in1$, in2$, in3$).pipe(take(1))

        expectObservable(outputStream).toBe(out, values)

      })
    })

    fit('order 2', () => {
      objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

        const in1 = '-xx a-a|'
        const in2 = 'yxx -b-|'
        const in3 = '--- dyy|'
        const out = '--- (z|)'

        const values = {
          z: ['x', 'y', 'd']
        }

        const in1$ = cold(in1)
        const in2$ = cold(in2)
        const in3$ = cold(in3)

        const outputStream = zip(in1$, in2$, in3$).pipe(take(1))

        expectObservable(outputStream).toBe(out, values)

      })
    })

  })

  describe('debounce', () => {

  })

})

describe('zip emits the most recently emitted item from each source observable, after all observables emit', () => {
  it('no 3rd item will be emitted here', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable} ) => {

      const in1 = '--a--b--c'
      const in2 = 'd--e-----'
      const out = '--a--b---'

      const values = {
        a: ['a','d'],
        b: ['b','e']
      }

      const in1$ = cold(in1)
      const in2$ = cold(in2)

      const outputStream = zip(in1$, in2$)

      expectObservable(outputStream).toBe(out, values)
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

describe('merge and mergeMap', () => {
  it('merge alone', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = cold('a---bc')
      const in2 = cold('d-----e--f')

      const outputStream = merge(in1, in2)

      expectObservable(outputStream).toBe('(ad)bce--f')

    })
  })

  it('mergeMap no concurrency', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = cold('abc---------|')
      const in2 = cold('1--2--3|')

      const outputStream = in1.pipe(
        mergeMap((x) => in2.pipe(map(y => x + y))),
      )

      expectObservable(outputStream).toBe('abcdefghi---|', { a: 'a1', b: 'b1', c: 'c1', d: 'a2', e: 'b2', f: 'c2', g: 'a3', h: 'b3', i: 'c3' })

    })
  })

})

describe('map', () => {
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
})
