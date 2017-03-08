/**
 * XadillaX <i@2333.moe> created at 2017-03-07 23:10:54 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
"use strict";

const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const path = require("path");

const async = require("async");
const cheerio = require("cheerio");
const ejs = require("ejs");
const nodemailer = require("nodemailer");

const DEFAULT_TEMPLATE_FILENAME = path.resolve(__dirname, "..", "example.ejs");

class MailConsumer extends EventEmitter {
    constructor(conf) {
        super();

        this.conf = conf || {};
        this.conf.defaultTemplate = this.conf.defaultTemplate || DEFAULT_TEMPLATE_FILENAME;
        this.transporter = nodemailer.createTransport(conf);
        this.renderer = {};

        const self = this;
        this.on("message", function(message, ack) {
            self.send(message, function(err, info) {
                if(err) {
                    if(!process.env.MOCHA) console.error(err);
                    return ack.acknowledge();
                }

                if(!process.env.MOCHA) console.log("Sent.", info);
                ack.acknowledge();
            });
        });
    }

    render(filename, variables, callback) {
        const self = this;
        async.waterfall([
            function(callback) {
                if(self.renderer[filename] === undefined ||
                    typeof self.renderer[filename].render !== "function") {
                    fs.readFile(filename, { encoding: "utf8" }, function(err, str) {
                        if(err) {
                            return callback(err);
                        }

                        const renderer = self.renderer[filename] = {
                            render: ejs.compile(str, {
                                // strict: true,
                                rmWhitespace: true
                            })
                        }
                        return callback(undefined, renderer.render);
                    });
                } else {
                    return callback(undefined, self.renderer[filename].render);
                }
            },

            function(render, callback) {
                const html = render(variables);
                const $ = cheerio.load(html);

                return callback(undefined, {
                    html: html,
                    text: $.text()
                });
            }
        ], function(err, ret) {
            return callback(err, ret);
        });
    }

    send(message, callback) {
        const self = this;
        this.render(message.template || self.conf.defaultTemplate, message.var, function(err, ret) {
            if(err) {
                return callback(err);
            }

            self.transporter.sendMail({
                from: message.from,
                to: message.to,
                subject: message.subject,
                text: ret.text,
                html: ret.html
            }, function(err, info) {
                return callback(err, info);
            });
        });
    }
}

module.exports = MailConsumer;
