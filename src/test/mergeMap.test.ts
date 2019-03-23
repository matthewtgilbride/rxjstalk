import { objectEqualityTestScheduler, snapshotTestScheduler } from "../testUtil";
import { mergeMap, map } from "rxjs/operators";


describe('mergeMap', () => {

  it('plain mergeMap', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = 'abc --- --- --- |'
      const in2 = '1-- 2-- 3-- |'

      const out = 'abc def ghi --- |'

      const values = {
        a: 'a1',
        b: 'b1',
        c: 'c1',
        d: 'a2',
        e: 'b2',
        f: 'c2',
        g: 'a3',
        h: 'b3',
        i: 'c3'
      }

      const in1$ = cold(in1)
      const in2$ = cold(in2)

      const outputStream = in1$.pipe(
        mergeMap((x) => in2$.pipe(map(y => `${x}${y}`))),
      )

      expectObservable(outputStream).toBe(out, values)

    })
  })

  it('snapshot', () => {
    snapshotTestScheduler().run(({cold, expectObservable}) => {

      const in1 = 'abc --- --- --- --- |'
      const in2 = '1-- 2-- 3-- |'


      const in1$ = cold(in1)
      const in2$ = cold(in2)

      const outputStream = in1$.pipe(
        mergeMap(x => in2$.pipe(map(y => x + y)), 2)
      )

      expectObservable(outputStream).toBe('')

    })
  })

  it('equality', () => {
    objectEqualityTestScheduler().run(({cold, expectObservable}) => {

      const in1 = 'abc --- --- --- --- |'
      const in2 = '1-- 2-- 3-- |'
      const out = 'qr- st- uv- x-- y-- z-- |'

      const values = {
        q: 'a1',
        r: 'b1',
        s: 'a2',
        t: 'b2',
        u: 'a3',
        v: 'b3',
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
