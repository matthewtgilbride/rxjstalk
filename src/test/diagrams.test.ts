import { objectEqualityTestScheduler } from "../testUtil";
import { mergeMap, debounceTime } from "rxjs/operators";
import { merge, concat } from "rxjs";

describe('rxmarbles.com diagrams', () => {

  it('merge', () => {
    objectEqualityTestScheduler().run(({cold, expectObservable}) => {

      const in1 = 'a-- b-- c-- d-- e-- ---|'
      const in2 = '--- --- -x- --- -x- ---|'
      const out = 'a-- b-- cx- d-- ex- ---|'

      const values = {
        a: '20',
        b: '40',
        c: '60',
        d: '80',
        e: '100',
        x: '1',
      }

      const in1$ = cold(in1, values)
      const in2$ = cold(in2, values)

      const out$ = merge(in1$, in2$)

      expectObservable(out$).toBe(out, values)

    })
  })

  it('concat', () => {
    objectEqualityTestScheduler().run(({cold, expectObservable}) => {

      const in1 = 'a-- --- a-- --- a-- |'
      const in2 = 'b-- b-- |'
      const out = 'a-- --- a-- --- a-- b-- b--|'

      const values = {
        a: '1',
        b: '2',
      }

      const in1$ = cold(in1, values)
      const in2$ = cold(in2, values)

      const out$ = concat(in1$, in2$)

      expectObservable(out$).toBe(out, values)

    })
  })

  it('debounce', () => {
    objectEqualityTestScheduler().run(({cold, expectObservable}) => {

      const in1 = 'a-- --- b-a ab- --- a--    |'
      const out = '--- a-- --- --- -b- --- (a|)'

      const values = {
        a: '1',
        b: '2',
      }

      const in1$ = cold(in1, values)

      const out$ = in1$.pipe(debounceTime(3))

      expectObservable(out$).toBe(out, values)

    })
  })

  it('mergeMap', () => {
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
        mergeMap(() => in2$, (x, y) => "" + x + y, 2)
      )

      expectObservable(outputStream).toBe(out, values)

    })
  })
})
