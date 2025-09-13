import * as fs from "fs";
import * as readline from "readline";
<<<<<<< HEAD
import{z, ZodType} from "zod";
/* z for main zod namespace
/* Zodtype for the base type of all zod schemas.
=======
>>>>>>> fbfd3f0e3c288d9d0a5d814877ec2e7ac83f99bd

/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * @param path The path to the file being loaded.
 * @returns a "promise" to produce a 2-d array of cell values
 */
<<<<<<< HEAD
export async function parseCSV<T>(path: string, schema?: ZodType<T> ): Promise<T[] | string[][]> {
=======
export async function parseCSV(path: string): Promise<string[][]> {
>>>>>>> fbfd3f0e3c288d9d0a5d814877ec2e7ac83f99bd
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  // Create an empty array to hold the results
<<<<<<< HEAD
  let result: T[] | string[][] = [];

=======
  let result = []
>>>>>>> fbfd3f0e3c288d9d0a5d814877ec2e7ac83f99bd
  
  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!
  for await (const line of rl) {
<<<<<<< HEAD
    const values = line.split(",").map((v: string) => v.trim());

    if (schema === undefined) {
      (result as string[][]).push(values);
    } else {
      const safe_parsed = schema.safeParse(values);
      if (safe_parsed.success) {
        (result as T[]).push(safe_parsed.data);
      } else {
        throw new Error(`method safeParse failed on result`)
      }
    }
=======
    const values = line.split(",").map((v) => v.trim());
    result.push(values)
>>>>>>> fbfd3f0e3c288d9d0a5d814877ec2e7ac83f99bd
  }
  return result
}