const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa-cors');

const app = new Koa();
app.use(cors());
app.use(koaBody({
    json: true
}))


let tickets = [{
    id: 00001,
    name: 'починить принтер',
    status: false,
    created: 1655799208466
},
{
    id: 00002,
    name: 'починить сканер',
    status: true,
    created: 1655799208488
},
{
    id: 00003,
    name: 'добавить пользователя',
    status: false,
    created: 1655799208599
}];

let ticketFull = [{
    id: 00001,
    name: 'починить принтер',
    description: 'Сломался принтер и надо его починить',
    status: false,
    created: 1655799208466
},
{
    id: 00002,
    name: 'починить сканер',
    description: 'Сканер сканирует с полосой',
    status: true,
    created: 1655799208488
},
{
    id: 00003,
    name: 'добавить пользователя',
    description: 'Вышел новый пользователь',
    status: false,
    created: 1655799208599
}];

app.use(async ctx => {
    const { method, id } = ctx.request.query;

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        case 'ticketById':
            ctx.response.body = ticketFull.filter(item => item.id == id);
            return;
        case 'removeTicket':
            tickets = tickets.filter(obj => obj.id != ctx.request.body.id);
            ticketFull = ticketFull.filter(obj => obj.id != ctx.request.body.id);
            ctx.response.body = 'success';
            return;
        case 'editTicket':
            tickets[tickets.findIndex(item=>item.id == ctx.request.body.id)].name = ctx.request.body.name;
            tickets[tickets.findIndex(item=>item.id == ctx.request.body.id)].status = ctx.request.body.status;
            ticketFull[ticketFull.findIndex(item=>item.id == ctx.request.body.id)].name = ctx.request.body.name;
            ticketFull[ticketFull.findIndex(item=>item.id == ctx.request.body.id)].status = ctx.request.body.status;
            ticketFull[ticketFull.findIndex(item=>item.id == ctx.request.body.id)].description = ctx.request.body.description;
            ctx.response.body = 'success';
            return;
        case 'createTicket':
            let idNum = generateIdNum();
            tickets.push({
                id: idNum,
                name: ctx.request.body.name,
                status: false,
                created: Date.now()
            });
            ticketFull.push({
                id: idNum,
                name: ctx.request.body.name,
                description: ctx.request.body.description,
                status: false,
                created: Date.now()
            });
            ctx.response.body = 'success';

            return;
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404;
            return;
    }
});
const server = http.createServer(app.callback()).listen(7070);

function generateIdNum() {
    return ticketFull[ticketFull.length - 1].id + 1;
};