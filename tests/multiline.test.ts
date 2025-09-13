import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const MULTILINE_CSV_PATH = path.join(__dirname, "../data/multiline.csv");

test("new lines inside of quotes  should be kept", async () => {
  const results = await parseCSV(MULTILINE_CSV_PATH)
  
  expect(results[0]).toEqual(["name", "address"]);
  expect(results[1]).toEqual(["John", "123 Main Street\nApartment 4B"]);
  expect(results[2]).toEqual(["Jane", "456 Oak Avenue\nSuite 200"]);
});