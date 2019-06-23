#!/usr/bin/env node
// ./bin/licensing.js

/**
 * RaiseJS / Raise your frontend projects to the next level! Initialize a clean folder structure with preconfigured compilers to use with your favourite languages - no oversized libraries included!
 * Copyright(C) 2019 Victor Homic, The RaiseJS project

 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.
 */

/**
 * CLI licensing output
 */
var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, '..', 'license.txt');

fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
        console.log(data);
    } else {
        console.log("Error while retrieving license.txt: "+ err + ". Have you deleted the license file?");
    }
});