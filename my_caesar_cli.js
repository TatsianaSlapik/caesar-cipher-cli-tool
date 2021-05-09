const { Command, Option } = require("commander");
const readline = require("readline");
const fs = require("fs");
const { caesarShift } = require("./caesarShift.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const command = new Command();
command
  .requiredOption("-s, --shift <number>", "a shift", parseInt)
  .option("-i, --input <path>", "an input file")
  .option("-o, --output <path>", "an output file");

let actionOption = new Option("-a, --action <type>", "an action encode/decode");
actionOption.choices(["encode", "decode"]);
actionOption.mandatory = true;

command.addOption(actionOption);

command.parse(process.argv);
const options = command.opts();

console.log(options);

if (options.action === "encode") {
  if (!options.input) {
    rl.question("Please insert text-> ", (text) => {
      if (!options.output) {
        console.log(`Encoded text: ${encode(text, options.shift)}`);
      } else {
        writeToFile(options.output, encode(text, options.shift));
      }
      rl.close();
    });
  } else {
    readFromFile(options.input, (text) => {
      var encodedText = encode(text, options.shift);
      if (!options.output) {
        console.log(encodedText);
        process.exit();
      } else {
        writeToFile(options.output, encodedText);
      }
    });
  }
} else {
  if (!options.input) {
    rl.question("Please insert text-> ", (text) => {
      if (!options.output) {
        console.log(`Decoded text: ${decode(text, options.shift)}`);
      } else {
        writeToFile(options.output, decode(text, options.shift));
      }
      rl.close();
    });
  } else {
    readFromFile(options.input, (text) => {
      var decodedText = decode(text, options.shift);
      if (!options.output) {
        console.log(decodedText);
        process.exit();
      } else {
        writeToFile(options.output, decodedText);
      }
    });
  }
}

function encode(text, shift) {
  return caesarShift(text, shift);
}

function decode(text, shift) {
  return caesarShift(text, shift * -1);
}

function writeToFile(file, text) {
  let writeStream = fs.createWriteStream(file);
  writeStream.write(text, "utf8");
  writeStream.on("finish", () => {
    console.log("Text is written to file");
    process.exit();
  });
  writeStream.end();
}

function readFromFile(file, func) {
  var text = "";
  var readerStream = fs.createReadStream(file);
  readerStream.setEncoding("utf8");

  readerStream.on("data", function (chunk) {
    text += chunk;
  });

  readerStream.on("end", function () {
    func(text);
  });

  readerStream.on("error", function (err) {
    console.log(
      "An error occurred during file reading, please check that file does exist."
    );
    process.exit();
  });
}
