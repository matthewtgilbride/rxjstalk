import { objectEqualityTestScheduler } from "../testUtil";
import { forkJoin, zip } from 'rxjs';
import { map, take } from 'rxjs/operators';

describe('scenarios from real life', () => {

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
