var app=require('http').createServer(handler),
	io=require('socket.io').listen(app),
	fs=require('fs'),
	path=require('path'),
	url=require('url'),
	mime=require('mime')

app.listen(process.env.PORT||5000)
function handler(req,res){
	var uri = url.parse(req.url).pathname;
	switch(uri){
		case '/':
			uri='/main.html'
			break
	}
	uri=uri.replace(/%20/g,' ')
	console.log(uri)
	fs.readFile(path.join(__dirname,uri),function(err,data){
		if(err){
			res.writeHead(404)
			return res.end('Error loading file...')			  
		}
		res.setHeader('Content-type',mime.lookup(uri))
		res.writeHead(200)
		res.end(data)
	})
}
io.on('connection',function(socket){
	socket.on('orient',function(data){
		this.broadcast.emit('orient',data,socket.id)
	}).on('motion',function(data){
		this.broadcast.emit('motion',data,socket.id)
	}).on('disconnect',function(){
		io.sockets.emit('lost',this.id)
	})
})
