import { parseCSV } from "../src/basic-parser";
import { z } from "zod";
import * as path from "path";

const BAD_DATA_PATH = path.join(__dirname, "../data/bad-data.csv");
const PEOPLE_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV throws when schema validation fails", async () => {
  // Strict schema that won't coerce - expects actual number
  const StrictNumberSchema = z.tuple([z.string(), z.number()])
  
  // This should throw because "not-a-number" can't be parsed as number
  await expect(parseCSV(BAD_DATA_PATH, StrictNumberSchema))
    .rejects.toThrow("method safeParse failed");
});

test("parseCSV fails on wrong number of columns", async () => {
  // Schema expects exactly 3 columns
  const ThreeColumnSchema = z.tuple([z.string(), z.string(), z.string()])
  
  // people.csv only has 2 columns per row
  await expect(parseCSV(PEOPLE_PATH, ThreeColumnSchema))
    .rejects.toThrow();
});