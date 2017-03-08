/**
 * XadillaX <i@2333.moe> created at 2017-03-08 10:51:59 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
"use strict";

const path = require("path");

const should = require("should");

const MailConsumer = require("../lib/consumer");

describe("MailConsumer", function() {
    describe("constructor", function() {
        it("should create without template", function() {
            const options = {};
            const consumer = new MailConsumer(options);
            consumer.conf.should.equal(options);
            consumer.conf.defaultTemplate.should.equal(path.resolve(__dirname, "..", "example.ejs"));
            consumer.transporter.options.should.equal(options);
        });

        it("should create with template", function() {
            const options = {
                defaultTemplate: "123"
            };
            const consumer = new MailConsumer(options);
            consumer.conf.should.equal(options);
            consumer.conf.defaultTemplate.should.equal("123");
            consumer.transporter.options.should.equal(options);
        });
    });

    describe("event::message", function() {
        it("should call send and callback no error", function(done) {
            const consumer = new MailConsumer({});
            const msg = {};

            consumer.send = function(message, callback) {
                message.should.equal(msg);
                callback();
            };

            consumer.emit("message", msg, {
                acknowledge: function() {
                    done();
                }
            });
        });

        it("should call send and callback error", function(done) {
            const consumer = new MailConsumer({});
            const msg = {};

            consumer.send = function(message, callback) {
                message.should.equal(msg);
                callback(new Error("123"));
            };

            consumer.emit("message", msg, {
                acknowledge: function() {
                    done();
                }
            });
        });
    });

    describe("render", function() {
        const filename = path.resolve(__dirname, "..", "example.ejs");
        const consumer = new MailConsumer({});

        it("should render with no cache", function(done) {
            const fs = require("fs");
            const rdf = fs.readFile;
            fs.readFile = function() {
                arguments[0].should.equal(filename);
                arguments[1].should.be.eql({ encoding: "utf8" });
                rdf.apply(fs, arguments);
                fs.readFile = rdf;
            };

            should(consumer.renderer[filename]).equal(undefined);
            consumer.render(filename, { text: "<span style='color: red;'>Hello World</span>" }, function(err, ret) {
                should.ifError(err);
                ret.html.should.equal("<html>\n<body>\n<span style=\'color: red;\'>Hello World</span></body>\n</html>");
                ret.text.should.equal("\n\nHello World\n");
                const renderer = consumer.renderer[filename];
                renderer.should.be.instanceof(Object);
                renderer.render.should.be.instanceof(Function);
                done();
            });
        });

        it("should render with cache", function(done) {
            const fs = require("fs");
            const rdf = fs.readFile;
            fs.readFile = function() {
                (0).should.equal(1);
            };

            consumer.render(filename, { text: "<span style='color: red;'>Hello World</span>" }, function(err, ret) {
                should.ifError(err);
                ret.html.should.equal("<html>\n<body>\n<span style=\'color: red;\'>Hello World</span></body>\n</html>");
                ret.text.should.equal("\n\nHello World\n");
                fs.readFile = rdf;
                done();
            });
        });

        it("should occur error", function(done) {
            consumer.render("123", {}, function(err, ret) {
                err.should.be.instanceof(Error);
                should(ret).equal(undefined);
                done();
            });
        });
    });

    describe("send", function() {
        it("should render error", function(done) {
            const consumer = new MailConsumer({});
            consumer.render = function(filename, variables, callback) {
                filename.should.equal("234");
                variables.should.be.eql({ "456": "789" });
                return callback(new Error("123"));
            };

            consumer.send({ template: "234", var: { "456": "789" } }, function(err) {
                err.message.should.equal("123");
                done();
            });
        });

        it("should send error", function(done) {
            const consumer = new MailConsumer({});
            consumer.transporter.sendMail = function(params, callback) {
                params.from.should.equal("123");
                params.to.should.equal("456");
                params.subject.should.equal("789");
                params.text.should.equal("\n\n123\n");
                params.html.should.equal("<html>\n<body>\n123</body>\n</html>");
                callback(new Error("hello"));
            };

            consumer.send({
                var: { text: "123" },
                from: "123",
                to: "456",
                subject: "789"
            }, function(err) {
                err.message.should.equal("hello");
                done();
            });
        });

        it("should sent", function(done) {
            const consumer = new MailConsumer({});
            consumer.transporter.sendMail = function(params, callback) {
                return callback(undefined, { hello: "world" });
            };

            consumer.send({
                var: { text: "123" },
                from: "123",
                to: "456",
                subject: "789"
            }, function(err, info) {
                should.ifError(err);
                info.should.be.eql({ hello: "world" });
                done();
            });
        });
    });
});
