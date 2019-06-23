// ./lib/fileManager.js

/** 
 * RaiseJS / Raise your frontend projects to the next level! Initialize a clean folder structure with preconfigured compilers to use with your favourite languages - no oversized libraries included!
 * Copyright(C) 2019 Victor Homic, The RaiseJS project

 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.
 */

/**
 * Create directory structure
 *
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
exports.structure = function(folder,css,js,html) {
    try {
        fs.mkdirSync(folder + "/public");
        fs.mkdirSync(folder + "/public/css");
        fs.mkdirSync(folder + "/public/js");
        fs.mkdirSync(folder + "/public/css/dist");
        fs.mkdirSync(folder + "/public/js/dist");
        let cssd = "";
        switch (css) {
            case "CSS":
                cssd = "styles";
                break;
            case "LESS":
                cssd = "less";
                break;
            case "SASS":
                cssd = "sass";
                break;
            default:
                cssd = "styles";
        }
        let jsd = "";
        switch (js) {
            case "js":
                jsd = "javascript";
                break;
            case "babel":
                jsd = "babel";
                break;
            case "ts":
                jsd = "typescript";
                break;
            default:
                jsd = "javascript";
        }
        let htmld = "";
        switch (html) {
            case "html":
                htmld = "html";
                break;
            case "pug":
                htmld = "pug";
                break;
            default:
                htmld = "html";
        }
        fs.mkdirSync(folder + "/" + cssd);
        fs.mkdirSync(folder + "/" + cssd + "/dist");
        fs.writeFileSync(folder + "/" + cssd + "/index." + css.toLowerCase(), "");
        fs.writeFileSync(folder + "/" + cssd + "/layout." + css.toLowerCase(), "");
        fs.mkdirSync(folder + "/" + jsd);
        if (js != "babel") {
            fs.writeFileSync(folder + "/" + jsd + "/index." + js, "");
        } else {
            fs.writeFileSync(folder + "/" + jsd + "/index.js", "");
        }
        fs.mkdirSync(folder + "/" + jsd + "/dist");
        fs.mkdirSync(folder + "/" + htmld);
        if (jsd != "javascript") {
            fs.mkdirSync(folder + "/jsdist");
        }
        return [ htmld, jsd ];
    } catch (err) {
        console.log("Error occoured during creation of folder structure: " + err);
        return false;
    }
}

exports.libs = function(folder,libraries,htmld,jsd) {
    try {
      if (libraries.includes("mustache")) {
        fs.mkdirSync(folder + "/" + htmld + "/mustache");
        fs.mkdirSync(folder + "/public/mustache");
        if (jsd != "javascript") {
          fs.copyFileSync(
            path.join(
              __dirname,
              "..",
              "node_modules",
              "mustache",
              "mustache.min.js"
            ),
            folder + "/jsdist/mustache.min.js"
          );
        } else {
          fs.copyFileSync(
            path.join(
              __dirname,
              "..",
              "node_modules",
              "mustache",
              "mustache.min.js"
            ),
            folder + "/" + jsd + "/dist/mustache.min.js"
          );
        }
      }
      if (libraries.includes("vjq")) {
        if (jsd != "javascript") {
          fs.copyFileSync(
            path.join(__dirname, "vjq.js"),
            folder + "/jsdist/vjq.js"
          );
        } else {
          fs.copyFileSync(
            path.join(__dirname, "vjq.js"),
            folder + "/" + jsd + "/dist/vjq.js"
          );
        }
      }
    } catch (err) {
        console.log("Error occoured during copying of library files: " + err);
        return false;
    }
}

exports.workflow = function(folder, description, version, author, css, js, html, libs) {
    try {
        // Create package.json
        let devdependencies =
          '"devDependencies": {\r\n    "cross-env": "^5.2.0",\r\n    "laravel-mix": "^4.0.15",';
        switch (css) {
          case "LESS":
            devdependencies += '\r\n    "less": "^3.9.0",\r\n    "less-loader": "^5.0.0",';
            break;
          case "SASS":
            devdependencies += '\r\n    "resolve-url-loader": "^2.3.1",\r\n    "sass": "^1.21.0",\r\n    "sass-loader": "^7.1.0",';
            break;
        }
        switch (js) {
          case "babel":
            devdependencies += '\r\n    "laravel-mix-polyfill": "^1.0.2",\r\n    "vue-template-compiler": "^2.6.10",';
            break;
          case "ts":
            devdependencies += '\r\n    "typescript": "^2.5.2",';
            break;
        }
        switch (html) {
          case "pug":
            devdependencies += '\r\n    "laravel-mix-pug": "^0.3.0",\r\n    "pug": "^2.0.3"';
            break;
        }
        if (devdependencies.slice(-1) == ',') {
            devdependencies = devdependencies.slice(0, -1);
        }
        devdependencies += "\r\n }";
        let packagejson =
          '{\r\n  "private": true,\r\n  "name": "' +
          folder +
          '",\r\n  "version": "' +
          version +
          '",\r\n  "description": "' +
          description +
          '",\r\n  "main": "public/index.html",\r\n "author": "' +
          author +
          '",\r\n  "license": "GPL-3.0-or-later",\r\n  "scripts": {\r\n    "dev": "npm run development",\r\n    "development": "cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",\r\n    "watch": "npm run development -- --watch",\r\n    "watch-poll": "npm run watch -- --watch-poll",\r\n    "hot": "cross-env NODE_ENV=development node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --hot --config=node_modules/laravel-mix/setup/webpack.config.js",\r\n    "prod": "npm run production",\r\n    "production": "cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --no-progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js"\r\n  },\r\n  ' +
          devdependencies +
          " \r\n}";
        fs.writeFileSync(folder + "/package.json", packagejson);
        // Create .gitignore
        fs.writeFileSync(folder + "/.gitignore", "/node_modules");
        // Initialize npm
        execSync("npm i --silent --no-progress", {
          // npm i --silent --no-progress &> ./_build.log
          cwd: path.join(process.cwd(), folder),
          windowsHide: true
        });
        // fs.unlinkSync(folder + "/_build.log");
        // Initialize git
        execSync("git init", {
          cwd: path.join(process.cwd(), folder),
          windowsHide: true
        });
        // Create webpack.mix.js
        let webpackmix = "";
        let mixheader = "let mix = require('laravel-mix');\r\n";
        let mixbody = "";
        switch (css) {
            case "LESS":
                mixbody += "mix.less('less/layout.less', 'public/css/layout.css')\r\n    .less('less/index.less', 'public/css/index.css')\r\n    .options({\r\n        processCssUrls: false\r\n    });\r\n";
                break;
            case "SASS":
                mixbody += "mix.sass('sass/layout.less', 'public/css/layout.css')\r\n    .sass('sass/index.less', 'public/css/index.css')\r\n    .options({\r\n        processCssUrls: false\r\n    });\r\n";
                break;
            case "CSS":
                mixbody += "mix.copy('styles/layout.less', 'public/css/layout.css')\r\n    .copy('styles/index.less', 'public/css/index.css');\r\n";
                break;
        }
        switch (js) {
            case "babel":
                mixheader += "require('laravel-mix-polyfill');\r\n";
                mixbody += "mix.js('babel/index.js', 'public/js/index.js')\r\n    .polyfill({enabled: true,\r\n        useBuiltIns: 'usage',\r\n        targets: \"> 0.3%, not dead\"\r\n    });\r\n";
                break;
            case "ts":
                mixbody += "mix.ts('typescript/index.ts', 'public/js/index.js');\r\n";
                break;
            case "js":
                mixbody += "mix.js('javascript/index.js', 'public/js/index.js');\r\n";
                break;
        }
        if (js != "js") {
            mixbody += "mix.copy('jsdist/*.js', 'public/js/dist');\r\n";
        } else {
            mixbody += "mix.copy('javascript/dist/*.js', 'public/js/dist');\r\n";
        }
        switch (html) {
            case "pug":
                mixheader += "mix.pug = require('laravel-mix-pug');\r\n";
                mixbody += "mix.pug('pug/*.pug', '../public', {\r\n        exludePath: 'pug/'\r\n    })";
                if (libs.includes("mustache")) {
                    mixbody += "\r\n    .pug('pug/mustache/*.pug', '../../public/mustache', {\r\n        excludePath: 'pug/mustache/',\r\n        ext: '.mst'\r\n    })"; 
                }
                mixbody += "\r\n    .setPublicPath('public');\r\n";
                break;
            case "html":
                mixbody += "mix.copy('html/*.html', 'public')";
                if (libs.includes("mustache")) {
                    mixbody += "\r\n    .copy('html/mustache/*.mst', 'public/mustache')";
                }
                mixbody += ";\r\n";
                break;
        }
        mixbody += "mix.disableSuccessNotifications();\r\n";
        webpackmix = mixheader + mixbody;
        fs.writeFileSync(folder + "/webpack.mix.js", webpackmix);
    } catch (err) {
        console.log("Error occoured during initialization of npm, git and laravel-mix: " + err);
        return false;
    }
};
exports.finish = function(folder) {
  try {
    let a = 1;
  } catch (err) {
    console.log("Error occoured during final install steps: " + err);
    return false;
  }
};