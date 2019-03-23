import { objectEqualityTestScheduler } from "../testUtil";
import { mergeMap, map } from "rxjs/operators";

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

        const out = 'y--- z--- ---- |'

        const values = {
          y: 'a1',
          z: 'b1',
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

  describe('at frame 8 (T3), the first observable (in1) has emitted three times and the second observable (in2) has emitted once\n', () => {
    it('nothing is emitted by the merged observable because the inner observable is >= 2 emissions behind (concurrency = 2)\n' + '' +
      'at frame 16 (T4), the second observable (in2) emits its second value.  it is combined with the cached third emission from the first observable\n' +
      'if nothing else were to occur, the first obserable\'s third value would later emit with the second observables second', () => {
      objectEqualityTestScheduler().run(({cold, expectObservable}) => {

        const in1 = 'a--- b--- c--- ---- |'
        const in2 = '1--- ---- ---- 2--- |'

        const out = 't--- u--- ---- v--- (xy) ---- ---- z--- |'

        const values = {
          t: 'a1',
          u: 'b1',
          v: 'a2',
          x: 'b2',
          y: 'c1',
          z: 'c2'
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

  describe('at frame 8 (T3), the first observable (in1) has emitted three times and the second observable (in2) has emitted once\n', () => {
    xit('nothing is emitted by the merged observable because the inner observable is >= 2 emissions behind (concurrency = 2)\n' + '' +
      'at frame 12 (T4), the second observable (in2) emits its second value.  it is combined with the cached third emission from the first observable\n' +
      'if nothing else were to occur, the first obserable\'s third value would later emit with the second observables second', () => {
      objectEqualityTestScheduler().run(({cold, expectObservable}) => {

        const in1 = 'a--- b--- c--- ---- ---- |'
        const in2 = '1--- ---- ---- 2--- 3--- |'

        const out = 't--- u--- ---- v--- (xy) ---- ---- z--- |'

        const values = {
          t: 'a1',
          u: 'b1',
          v: 'a2',
          x: 'b2',
          y: 'c1',
          z: 'c2'
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

  xit('extra time changes things?', () => {
    objectEqualityTestScheduler().run(({cold, expectObservable}) => {

      const in1 = 'a--- b--- c--- ---- ---- ---- ---- ---- ---- |'
      const in2 = '1--- ---- ---- 2--- 3--- |'

      const out = 'r--- s--- ---- t--- (uv) (wx) ---- ---- y--- z--- |'

      const values = {
        r: 'a1',
        s: 'b1',
        t: 'a2',
        u: 'a3',
        v: 'b2',
        w: 'b3',
        x: 'c1',
        y: 'c2',
        z: 'c3',
      }


      const in1$ = cold(in1)
      const in2$ = cold(in2)

      const outputStream = in1$.pipe(
        mergeMap(x => in2$.pipe(map(y => x + y)), 2)
      )

      expectObservable(outputStream).toBe(out, values)

    })
  })

})
