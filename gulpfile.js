// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
var gulp = require('gulp');
var requireDir = require('require-dir');

//////////////////////////
// INCLUDE FABRIC TASKS
//////////////////////////

requireDir('./gulp');

gulp.task('default', ['build']);

