import { objectEqualityTestScheduler } from "../testUtil";
import { zip } from 'rxjs';

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
