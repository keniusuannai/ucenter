const koa = require('koa');
const app = new koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const statics = require('koa-static');
const session = require('koa-session-minimal');
const koaRedis = require('koa-redis');
const hbs = require('koa-hbs');

const route = require('./routes');
const redisStore = require('./middlewares/redisStore');

//session
app.keys = ['keys', 'tagee_ucenter'];
app.use(session({
    store: koaRedis({
        client: redisStore.redisClient
    })
}));

// 中间件
app.use(logger());
app.use(bodyParser());

// 渲染引擎
app.use(hbs.middleware({
    viewPath: __dirname + '/views',
    defaultLayout: 'admin/layout',
    disableCache: true
}));

// 静态资源路径
app.use(statics(__dirname + '/public'));

// 路由配置
app.use(route.routes());
app.use(route.allowedMethods());

// 错误信息
onerror(app);


module.exports = app;