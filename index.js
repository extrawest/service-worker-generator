#!/usr/bin/env node
const fs = require("fs");
const MemoryFs = require("memory-fs");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const program = require("commander");
const path = require("path");

const BUNDLE_FILE_NAME = "bundle.js";

/**
 * Command line options
 */
program
  .arguments("<file>")
  .option(
    "-e, --env [path]",
    "path to environment variables files [./.env]",
    "./.env"
  )
  .option(
    "-d, --output-path [path]",
    "path of generated artifacts [./build]",
    "./build"
  )
  .option(
    "-m, --mode <mode>",
    "output mode [dev|build|replace]",
    /^(dev|build)$/i
  )
  .action(function (file) {
    const { mode } = program.opts();

    if (mode === "dev") {
      process.env.BABEL_ENV = "development";
      process.env.NODE_ENV = "development";
    } else {
      process.env.BABEL_ENV = "production";
      process.env.NODE_ENV = "production";
    }

    compile(file, mode)
      .then(({ result }) => generateSw(result, file))
      .catch((error) => console.error(error));
  })
  .parse(process.argv);

/**
 * Compile entry file using WebPack
 *
 * @param {String} entry Path to entry file
 * @returns {Promise}
 */
function compile(entry, mode) {
  const compiler = webpack({
    mode: mode === "dev" ? "development" : "production",
    entry: [entry],
    output: {
      filename: BUNDLE_FILE_NAME,
      path: "/"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: ["@babel/plugin-transform-runtime"]
            }
          }
        }
      ]
    },
    plugins: [
      new Dotenv({
        path: program.opts().env, // Path to .env file (this is the default)
        safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
        silent: true,
        systemvars: true // Load all system variables and REACT .env as well
      })
    ]
  });

  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);

      if (stats.hasErrors() || stats.hasWarnings()) {
        return reject(
          new Error(
            stats.toString({
              errorDetails: true,
              warnings: true
            })
          )
        );
      }

      const result = compiler.outputFileSystem.data[
        BUNDLE_FILE_NAME
      ].toString();
      resolve({ result, stats });
    });
  });
}

/**
 * Generated code write to file
 *
 * @param {String} code
 * @returns {Promise}
 */
function generateSw(code, file) {  
  const options = program.opts();

  const filename = path.basename(file);
  return writeFile(code, `${options.outputPath}/${filename}`);  
}

function writeFile(content, file) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, "utf8", error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}
