import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const MIXED_QUOTES_CSV_PATH = path.join(__dirname, "../data/mixed-quotes.csv");

test("mixing quoted and unquoted fields", async () => {
  const results = await parseCSV(MIXED_QUOTES_CSV_PATH)
  
  expect(results[0]).toEqual(["name", "age", "city"]);
  expect(results[1]).toEqual(["John", "25", "New York"]);
  expect(results[2]).toEqual(["Jane", "30", "Boston"]);
  expect(results[3]).toEqual(["Mary", "28", "Los Angeles"]);
});