#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const minimist = require("minimist");
const plist2sprite = require("../index");
const path = require("path");
const fs = require("fs");

const argv = minimist(process.argv.slice(2), {
  boolean: ["help", "version"],
  string: ["path"],
  alias: {
      help: "h",
      version: "v",
      path: "p"
  },
  unknown: param => {
      if (param.startsWith("-")) {
          console.warn("Ignored unknown option: " + param + "\n");
      } else {
          console.warn(chalk.yellow("请输入参数"));
      }
      return false;
  }
});

if (argv["version"]) {
  console.log(makemodel.version);
  process.exit(0);
}

if (argv["help"]) {
  console.log(
      `Usage: makemde [options]

      -h,--help                    output usage information
      -v,--version                 output the version number
      -p <path>,--path <path>      Input file path and output <path>.json
  `
  );
  process.exit(argv["help"] ? 0 : 1);
}


if (argv["path"]) {
  let filePath = path.resolve(__dirname, process.cwd(), argv["path"]);
  let outputPath = path.resolve(__dirname, process.cwd(), argv["path"].replace(/\.plist$/, ".json"));
  let input;
  try {
      input = fs.readFileSync(filePath, "utf8");
  } catch (e) {
      process.stdout.write("\n");
      console.error("Unable to read file: " + filePath + "\n" + e);
      process.exit(1);
  }
  const result = plist2sprite.parse(input);
  fs.writeFileSync(outputPath,JSON.stringify(result,null,2));
  console.log(chalk.green(`成功生成json文件,路径为${outputPath}`))
  process.exit(0);
}