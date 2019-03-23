import { objectEqualityTestScheduler } from "../testUtil";
import { map, mergeMap } from "rxjs/operators";
import { merge } from "rxjs";

describe('merge and mergeMap', () => {

  it('map alone', () => {

    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const input = 'a'

      const input$ = cold(input, { a: 5 });

      const outputStream = input$.pipe(map(v => v * 2));

      expectObservable(outputStream).toBe(input, { a: 10 });
    });

  });

  it('merge alone', () => {
    objectEqualityTestScheduler().run(({ cold, expectObservable}) => {

      const in1 = 'a--- bc-- |'
      const in2 = 'd--- --e- f--- |'
      const out = '(ad) bce- f--- |'

      const in1$ = cold(in1)
      const in2$ = cold(in2)

      const outputStream = merge(in1$, in2$)

      expectObservable(outputStream).toBe(out)

    })
  })

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

})
