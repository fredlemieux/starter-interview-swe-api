import {dateKeysFromRange} from "./dates";

describe('dateKeysFromRange()', () => {
  test('to and from dates on the same day return only one key', () => {
    const date = new Date();
    const [expected] = date.toISOString().split("T");
    const res = dateKeysFromRange(date, date);

    expect(res).toHaveLength(1);

    expect(res[0]).toEqual(expected);
  });

  test('to and from date two days apart should return 3 keys', () => {
    const endDate = new Date();
    const days = 2;
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const res = dateKeysFromRange(startDate, endDate);

    const expectedFirst = startDate.toISOString().split('T')[0];
    const expectedLast = endDate.toISOString().split('T')[0];
    const expectedMid = new Date(endDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    expect(res).toHaveLength(3);
    expect(res[0]).toBe(expectedFirst);
    expect(res[1]).toBe(expectedMid);
    expect(res[2]).toBe(expectedLast);
  });

  test.skip('get dates regardless of whether to and from are not in correct order', () => {
    const startDate = new Date();
    const days = 2;
    const endDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    const res = dateKeysFromRange(startDate, endDate);

    const expectedFirst = endDate.toISOString().split('T')[0];
    const expectedLast = startDate.toISOString().split('T')[0];
    const expectedMid = new Date(startDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    expect(res).toHaveLength(3);
    expect(res[0]).toBe(expectedFirst);
    expect(res[1]).toBe(expectedMid);
    expect(res[2]).toBe(expectedLast);
  });
});
