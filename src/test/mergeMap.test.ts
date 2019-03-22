import { objectEqualityTestScheduler } from "../testUtil";
import { mergeMap, map } from "rxjs/operators";


describe('I <3 RxJS', () => {
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
        mergeMap(x => in2$.pipe(map(y => x + y)), 2)
      )

      expectObservable(outputStream).toBe(out, values)

    })
  })
})
