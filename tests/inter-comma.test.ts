import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const SAYINGS_CSV_PATH = path.join(__dirname, "../data/sayings.csv");

test("Commas in quotes don't indicate new cells", async () => {
  const results = await parseCSV(SAYINGS_CSV_PATH)
  
  expect(results).toHaveLength(6);
  expect(results[0]).toEqual(["name", "age", "favorite saying"]);
  expect(results[1]).toEqual(["Alice", "23", "we're not in wonderland anymore toto"]);
  expect(results[2]).toEqual(["Bob", "thirty", "do you like weather?"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25", "just the way the cookie crumbles"]);
  expect(results[4]).toEqual(["Nim", "22","shoes on the other foot"]);
  expect(results[5]).toEqual(["Julius", "2000ish","veni, vidi, vici"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(SAYINGS_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});
