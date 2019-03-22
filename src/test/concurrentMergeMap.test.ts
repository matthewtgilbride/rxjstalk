import { objectEqualityTestScheduler } from "../testUtil";
import { mergeMap } from "rxjs/operators";

describe('the mergeMap diagram', () => {

  describe('at frame 0 (T0), the first observable (in1) has emitted once and the second observable (in2) has emitted once', () => {
    it('in1\'s first value is combined with in2\'s first value', () => {
      objectEqualityTestScheduler().run(({cold, expectObservable}) => {

        const in1 = 'a--- |'
        const in2 = '1--- |'

        const out = 'a--- |'

        const values = {
          a: 'a1',
        }


        const in1$ = cold(in1)
        const in2$ = cold(in2)

        const outputStream = in1$.pipe(
          mergeMap(() => in2$, (x, y) => "" + x + y, 2)
        )

        expectObservable(outputStream).toBe(out, values)

      })

    })

  })

  describe('at frame 4 (T2), the first observable (in1) has emitted twice and the second observable (in2) has emitted once', () => {
    it('in1\'s second value is combined with in2\'s first value', () => {
      objectEqualityTestScheduler().run(({cold, expectObservable}) => {

        const in1 = 'a--- b--- |'
        const in2 = '1--- ---- |'

        const out = 'a--- b--- ---- |'

        const values = {
          a: 'a1',
          b: 'b1',
        }


        const in1$ = cold(in1)
        const in2$ = cold(in2)

        const outputStream = in1$.pipe(
          mergeMap(() => in2$, (x, y) => "" + x + y, 2)
        )

        expectObservable(outputStream).toBe(out, values)

      })

    })

  })

  describe('at frame 8 (T3), the first observable (in1) has emitted three times and the second observable (in2) has emitted once', () => {
    fit('nothing is emitted by the merged observable because the inner observable is >= 2 emissions behind (concurrency = 2)', () => {
      objectEqualityTestScheduler().run(({cold, expectObservable}) => {

        const in1 = 'a--- b--- c--- ---- |'
        const in2 = '1--- ---- ---- 2--- |'

        const out = 'a--- b--- ---- 2--- c--- ---- |'

        const values = {
          a: 'a1',
          b: 'b1',
          c: 'c1'
        }


        const in1$ = cold(in1)
        const in2$ = cold(in2)

        const outputStream = in1$.pipe(
          mergeMap(() => in2$, (x, y) => "" + x + y, 2)
        )

        expectObservable(outputStream).toBe('', values)

      })

    })

  })

  it('mergeMap', () => {
    objectEqualityTestScheduler().run(({cold, expectObservable}) => {

      const in1 = 'a--- b--- c--- ---- ---- ---- ---- ---- ---- |'
      const in2 = '1--- ---- ---- 2--- 3--- |'

      const out = 'a--- b--- ---- c--- (de) (fg) ---- ---- h--- i--- |'

      const values = {
        a: 'a1',
        b: 'b1',
        c: 'a2',
        d: 'a3',
        e: 'b2',
        f: 'b3',
        g: 'c1',
        h: 'c2',
        i: 'c3',
      }


      const in1$ = cold(in1)
      const in2$ = cold(in2)

      const outputStream = in1$.pipe(
        mergeMap(() => in2$, (x, y) => "" + x + y, 2)
      )

      expectObservable(outputStream).toBe(out, values)

    })
  })

})
