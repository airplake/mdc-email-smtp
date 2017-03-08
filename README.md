# mdc-email-smtp

Message Distributing Center (MDC) 专用邮件适配器。

## 安装

```bash
$ npm install --save mdc-email-smtp
```

## 使用

在 MDC 配置文件中做好配置，如：

```js
{
  ...,
  "pubsub": {
    ...,
    "consumerAdapters": [{
      "queueName": "SPECIFY_A_NAME",
      "require": "mdc-email-smtp",

      // 其它 mdc-email-smtp 参数
      ...
    }]
  }
}
```

其中**其它 mdc-email-smtp 参数**列表直接使用 [nodemailer](https://nodemailer.com/about/) 创建 [Transporter](https://nodemailer.com/smtp/) 的参数。如：

```json
...,

"consumerAdapters": [{
  "queueName": "SPECIFY_A_NAME",
  "require": "mdc-email-smtp",

  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "auth": {
    "user": "user@gmail.com",
    "pass": "pass"
  }
}]
```

做好配置之后在 MDC 中直接启动消费者端即可。
