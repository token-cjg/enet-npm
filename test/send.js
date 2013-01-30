var enet=require("../lib/enet");

var send_to_ip = process.argv[2] || "127.0.0.1";
var send_to_port = process.argv[3] || 5000;

var client = new enet.Host( new enet.Address("0.0.0.0",0),32);

var peer = client.connect(new enet.Address( send_to_ip, send_to_port),5,40000);

client.on("disconnect",function(){
	console.log("disconnected.");
	client.destroy();
	process.exit();
});

client.on("connect",function(){
    console.log("connected, sending packet and ping!");
    var packet = new enet.Packet(new Buffer("Bye Bye"),1);
    peer.send(1,packet);
    peer.ping();
});

client.on("message",function(peer,packet,channel,data){
	console.log("got message:",packet.data().toString(),"on channel",channel);
    peer.disconnectLater();
    console.log("disconnecting...");
});

console.log("connecting to ",send_to_ip+":"+send_to_port);
client.start();