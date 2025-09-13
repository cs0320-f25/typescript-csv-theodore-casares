import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const SPACES_CSV_PATH = path.join(__dirname, "../data/spaces.csv");

test("spaces handling", async () => {
  const results = await parseCSV(SPACES_CSV_PATH)
  
  expect(results[0]).toEqual(["name", "age", "city"]);
  expect(results[1]).toEqual(["Alice", "23", "Boston"]); 
  expect(results[2]).toEqual(["  Bob  ", "  30  ", "  NYC  "]); 
});