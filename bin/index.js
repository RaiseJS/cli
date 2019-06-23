#!/usr/bin/env node
// ./bin/index.js

/**
 * RaiseJS / Raise your frontend projects to the next level! Initialize a clean folder structure with preconfigured compilers to use with your favourite languages - no oversized libraries included!
 * Copyright(C) 2019 Victor Homic, The RaiseJS project

 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.
 */

/**
 * dependencies and scripts
 */

const colors = require("colors");
const { prompt } = require('enquirer');
const fileManager = require("../lib/fileManager.js");
const rimraf = require("rimraf");
const fs = require("fs");

/**
 * CLI entry point
 */
var folder = "";
const states = { pending: "🔥", cancelled: "💔", submitted: "🚀" };
const emojify = {
    prefix: state => states[state.status]
};
var size = 0;
const calculate = choices => {
  size = 0;
  choices.forEach(ch => {
    if (ch.enabled) {
      size += ch.payload;
    }
  });
};
async function main() {
  try {
    console.clear();
    console.log("⚖️  ======== DISCLAIMER ========\nRaiseJS Copyright(C) 2019 Victor Homic / The RaiseJS project\nThis program comes with ABSOLUTELY NO WARRANTY; \nThis is free software, and you are welcome to redistribute it under certain conditions.\nFor details execute ".bgBlack.gray + "raiselicense".bgBlack.dim);
    console.log("🚀  " + "Lets raise your project to the next level!".rainbow);
    let response = await prompt({
        type: 'input',
        name: 'folder',
        message: 'Your project name? (And folder?)',
        theme: emojify,
        validate: value => value == 0 ? 'Please enter a folder name' :  fs.existsSync(value) ? 'This folder already exists in the current directory' : true
    });
    folder = response.folder;
    response = await prompt({
        type: "confirm",
        name: "confirmation",
        message: "RaiseJS will initialize the directory structure in " + folder,
        theme: emojify,
        initial: "true",
        default: "(n/Y)",
        onRun() {
            this.isTrue = value => value === "y";
            this.isFalse = value => value === "n";
        }
    });
    if (response.confirmation == false) {
        console.log("💔  To choose a different folder, please start the CLI again.");
        process.exit();
    } else {
        fs.mkdirSync(folder);
    }
    let config = [];
    response = await prompt({
      type: "Select",
      name: "cssprocessor",
      message: "Great! Would you like to use a CSS preprocessor?",
      theme: emojify,
      choices: [
        { message: "LESS " + "(recommended)".green.bold, value: "LESS" },
        { message: "Vanilla CSS", value: "CSS" },
        "SASS"
      ],
      header: "We recommend LESS. Check our docs for advice.".green,
      footer: "(Scroll to see all) All options include AutoPrefixer via PostCSS".blue.dim
    });
    config.push(response.cssprocessor);
    response = await prompt({
        type: "Select",
        name: "jsprocessor",
        message: "Awesome! What JS processor would you pick?",
        theme: emojify,
        choices: [
            { message: "TypeScript " + "(recommended)".green.bold, value: "ts" },
            { message: "Babel", value: "babel" },
            { message: "Vanilla JavaScript", value: "js" }
        ],
        header: "We recommend TypeScript. Check our docs for advice.".green,
        footer: "(Scroll to see all)".blue.dim
    });
    config.push(response.jsprocessor);
    response = await prompt({
        type: "Select",
        name: "docprocessor",
        message: "How about HTML templating?",
        theme: emojify,
        choices: [
            { message: "PUG " + "(recommended)".green.bold, value: "pug" },
            { message: "Pure HTML", value: "html" }
        ],
        header: "We recommend PUG. Check our docs for advice.".green,
        footer: "(Scroll to see all)".blue.dim
    });
    config.push(response.docprocessor);
    response = await prompt({
      type: "MultiSelect",
      name: "libs",
      message:
        "Choose any of our hand-picked, small-footprint libraries to finish your build: ",
      hint: "(Use <space> to select, <return> to submit)",
      theme: emojify,
      choices: [
        {
          message: "VJQ",
          name: "vjq",
          hint: "our jQuery alternative",
          payload: 3,
          onChoice: state => {
            calculate(state.choices);
          }
        },
        {
          message: "MustacheJS",
          name: "mustache",
          hint: "9KB of advanced templating for modern webapps",
          payload: 9,
          onChoice: state => {
            calculate(state.choices);
          }
        }
      ],
      symbols: { indicator: "○", activeIndicator: "●" },
      indicator(state, choice) {
        return choice.enabled
          ? state.symbols.activeIndicator
          : state.symbols.indicator;
      }
    });
    console.log("🚀 Total bundle size: ".bold + size.toString().bold + "kb".bold);
    config.push(response.libs);
    response = await prompt({
      type: "Input",
      name: "description",
      message: "How would you like to describe your project?",
      hint: "(start typing)",
      theme: emojify,
      footer: "This description is used for your package.json npm file".blue.dim,
      validate: value => value == 0 ? 'Please enter a description' : true
    });
    config.push(response.description);
    // response = await prompt({
    //   type: "numeric",
    //   name: "version",
    //   message: "What´s the current version of the project?",
    //   validate(state) {
    //     if (state.value <= 0) {
    //       return 'Please enter a valid version number';
    //     } else if (state.value > 1) {
    //       return 'The maximum first version number is 1.0';
    //     } else if (Number(state.value) != state.value || state.value % 1 == 0) {
    //       return 'Please use decimal notation to define the version number';
    //     } else {
    //       return true;
    //     }
    //   },
    //   theme: emojify,
    //   footer: "This version number is used for your package.json npm file".blue.dim
    // });
    // config.push(response.version);
    config.push("0.0.1");
    response = await prompt({
      type: "Input",
      name: "author",
      message: "Who´s the author of this project?",
      hint: "(start typing)",
      theme: emojify,
      validate: value => value == 0 ? 'Please enter a name' : true,
      footer: "The author is used for your package.json npm file".blue.dim
    });
    config.push(response.author);
    process.stdout.write("🔥 Creating directory structure inside folder...".dim);
    let dnames = await fileManager.structure(folder, config[0], config[1], config[2]);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("🚀 Created directory structure\n".bold);
    process.stdout.write("🔥 Copying libraries to dist folders...".dim);
    await fileManager.libs(folder,config[3],dnames[0],dnames[1]);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("🚀 Copyied libraries to dist folders\n".bold);
    process.stdout.write("🔥 Raising your project to the next level... ".dim + "(this might take a while)".green.dim);
    await fileManager.workflow(folder, config[4], config[5], config[6], config[0], config[1], config[2], config[3]);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("🚀 Raised your project to the next level\n".bold);
    process.stdout.write("🔥 Finishing up the install...".dim);
    await fileManager.finish(folder);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("🚀 You´re all set!\n".bold);
  } catch (err) {
    throw err;
  }
}
main()
  .then(() => {
    console.log("🚀  " + "Enjoy a modern, yet unbloated experience".rainbow + " 🔥🔥🔥");
  })
  .catch(error => {
    if (fs.existsSync(folder)) {
        rimraf.sync(folder);
        console.log("Reverting directory changes...".red.underline);
    }
    if (error == "") {
      console.log("You´ve exited the program. See ya 👍".red.underline);
    } else {
        console.log(error);
        console.log("😖  We´ve encountered an error! Let´s hope it goes better next time!".red.underline);
    }
  });