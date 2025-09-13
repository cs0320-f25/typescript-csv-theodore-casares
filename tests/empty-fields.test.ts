import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const EMPTY_FIELDS_CSV_PATH = path.join(__dirname, "../data/empty-fields.csv");

test("empty fields handling", async () => {
  const results = await parseCSV(EMPTY_FIELDS_CSV_PATH)
  
  expect(results[0]).toEqual(["name", "age", "city"]);
  expect(results[1]).toEqual(["Alice", "", "Boston"]);
  expect(results[2]).toEqual(["", "25", ""]);
  expect(results[3]).toEqual(["", "", "NYC"]);
  expect(results[4]).toEqual(["", "", ""]); // quoted empty fields
});