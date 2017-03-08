/**
 * XadillaX <i@2333.moe> created at 2017-03-08 10:46:46 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
"use strict";

require("should");

const creator = require("../");
const MailConsumer = require("../lib/consumer");

describe("create", function() {
    it("should create a MailConsumer", function() {
        const conf = {};
        const consumer = creator.create(conf);
        consumer.should.be.instanceof(MailConsumer);
        consumer.conf.should.equal(conf);
    });
});
