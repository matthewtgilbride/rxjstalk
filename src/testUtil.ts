import { TestScheduler } from "rxjs/testing";


export const objectEqualityTestScheduler = () => new TestScheduler((actual, expected) => {
  // asserting the two objects are equal
  expect(actual).toEqual(expected);
});

export const snapshotTestScheduler = () => new TestScheduler((actual) => {
  // asserting saving to snapshot
  expect(actual).toMatchSnapshot()
});
