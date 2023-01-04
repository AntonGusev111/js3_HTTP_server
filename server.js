const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');

const app = new Koa();

let tickets = [
        {id:1,
            name:'first',
            status: false,
            created: "01.01.2001 08:08"
       },
        {id:2,
            name:'second',
            status: true,
            created: "02.02.2002 09:09"
            },
        {id:3,
                name:'third',
                status: true,
                created: "02.02.2002 09:09"
            }
]

let ticketsFull = [
    {id:1,
        name:'first',
        status: false,
        description: "first desc",
        created: "01.01.2001 08:08"
    },
    {id:2,
        name:'second',
        description: "s desc",
        status: true,
        created: "02.02.2002 09:09"
        },
    {id:3,
            name:'second',
            description: "3 desc",
            status: true,
            created: "02.02.2002 09:09"
        }
]




app.use((ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
      return  next();
    };
    const headers = { 'Access-Control-Allow-Origin': '*', };
    if (ctx.request.method !== 'OPTIONS') {
      ctx.response.set({ ...headers });
      try {
        return next();
      } catch (e) {
        e.headers = { ...e.headers, ...headers };
        throw e;
      };
    };
  
    if (ctx.request.get('Access-Control-Request-Method')) {
      ctx.response.set({
        ...headers,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
      });
  
      if (ctx.request.get('Access-Control-Request-Headers')) {
        ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
      };
  
      ctx.response.status = 204;
    };
  });
    
  
app.use(koaBody({
    urlencoded: true,
}));



app.use(async ctx => {
    ctx.response.set('Access-Control-Allow-Origin', '*')

    const { method } = ctx.request.query;
 
    switch (method) {
       
        case 'allTickets': 
           console.log(tickets)
           ctx.response.body = tickets;
            return;
        case 'ticketById':
           console.log('idticket')
           ctx.response.status = 200;
           const {id} = ctx.request.query;
           console.log(ticketsFull[id-1])
           ctx.response.body = ticketsFull[id-1];
           return;
        case 'createTicket':
           ctx.response.status = 200;
           const ticket = ctx.request.body;
           ticket.id = Number(ticketsFull[ticketsFull.length-1].id)+1;
           ticket.created = `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`;
           ticketsFull.push(ticket);
           tickets.push({
            id:ticket.id,
            name: ticket.name,
            status: ticket.status,
            created: ticket.created
          });      
           return;
        default:
           ctx.response.status = 404;
           return;
   }
});
 
 


const server = http.createServer(app.callback());

const port = 9090;

server.listen(port, (err) =>{
    if (err){
        console.log(err);
        return  
    }
    console.log('Server is listening to ' + port);
});


