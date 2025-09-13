import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const SAYINGS_CSV_PATH = path.join(__dirname, "../data/sayings.csv");

test("commas in quotes don't start new cells", async () => {
  const results = await parseCSV(SAYINGS_CSV_PATH)
  
  expect(results[0]).toEqual(["name", "age", "favorite saying"]);
  expect(results[2]).toEqual(["Bob", "thirty", "do you, like weather?"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25", ",just the way the cookie crumbles"]);
  expect(results[4]).toEqual(["Nim", "22","shoes on the other foot,"]);
  expect(results[5]).toEqual(["Julius", "2000ish","veni, vidi, vici"]);
});

