/**
 * XadillaX <i@2333.moe> created at 2017-03-07 23:11:03 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
"use strict";

const MailConsumer = require("./lib/consumer");

exports.create = function(conf) {
    return new MailConsumer(conf);
};
