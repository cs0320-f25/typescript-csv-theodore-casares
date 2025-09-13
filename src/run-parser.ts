import { parseCSV } from "./basic-parser";

/*
  Example of how to run the parser outside of a test suite.
*/

<<<<<<< HEAD
const DATA_FILE = "./data/sayings.csv"; // update with your actual file name
=======
const DATA_FILE = "./data/people.csv"; // update with your actual file name
>>>>>>> fbfd3f0e3c288d9d0a5d814877ec2e7ac83f99bd

async function main() {
  // Because the parseCSV function needs to "await" data, we need to do the same here.
  const results = await parseCSV(DATA_FILE)

  // Notice the difference between "of" and "in". One iterates over the entries, 
  // another iterates over the indexes only.
  for(const record of results)
    console.log(record)
<<<<<<< HEAD
  for(const record in results) //in iterates over indexes (012345)
=======
  for(const record in results)
>>>>>>> fbfd3f0e3c288d9d0a5d814877ec2e7ac83f99bd
    console.log(record)
}

main();