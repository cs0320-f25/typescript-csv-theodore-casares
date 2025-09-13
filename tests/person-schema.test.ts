import { parseCSV } from "../src/basic-parser";
import { z } from "zod";
import * as path from "path";

const PEOPLE_NO_HEADER_PATH = path.join(__dirname, "../data/people-no-header.csv");

// Schema from instructions - tuple to object transformation
const PersonRowSchema = z.tuple([z.string(), z.coerce.number()])
  .transform(tup => ({name: tup[0], age: tup[1]}));

type Person = z.infer<typeof PersonRowSchema>;

test("parseCSV with Person schema transforms to objects", async () => {
  const results = await parseCSV(PEOPLE_NO_HEADER_PATH, PersonRowSchema)
  
  expect(results).toHaveLength(4);
  expect(results[0]).toEqual({name: "Alice", age: 23});
  expect(results[1]).toEqual({name: "Bob", age: 30});
  expect(results[2]).toEqual({name: "Charlie", age: 25});
  expect(results[3]).toEqual({name: "Nim", age: 22});
});
