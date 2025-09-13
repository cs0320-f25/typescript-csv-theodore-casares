import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const SAYINGS_CSV_PATH = path.join(__dirname, "../data/empty.csv");

test("Empty Csv should return empty array", async () => {
  const results = await parseCSV(SAYINGS_CSV_PATH)
  
  expect(results).toEqual([]);
});

