# mdc-email-smtp

Message Distributing Center (MDC) 专用邮件适配器。

## 安装

```bash
$ npm install --save mdc-email-smtp
```

## 使用

### 配置

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

```js
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

#### 默认模板配置

如果需要添加默认模板文件，则直接在配置项中添加 `"defaultTemplate"` 字段即可，其对应的值就是默认模板文件名，格式为 [EJS](http://ejs.co/).

### 消息格式

在生产者端生产消息的时候，注意使用这样的消息格式：

```js
{
  "from": "发件者，格式如 NAME <MAIL@DOMAIN>",
  "to": "收件者列表，逗号分隔",
  "subject": "邮件标题",
  "var": {
    // 这是一个对象，里面各值用于填充 EJS 模板
  },
  "template": "可选项，模板文件，不传则用配置的 defaultTemplate"
}
```

### Major Contributor

**XadillaX** 死月 http://xcoder.in/

**shadow88sky** 徐晨
