const express = require("express");
const app = express();
var http = require("http");
var socketIo = require("socket.io");
var path = require("path");
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

var easyrtc = require("easyrtc");
process.title = "node-easyrtc";

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var webServer = http.createServer(app);
// Start Socket.io so it attaches itself to Express server

var socketServer = socketIo.listen(webServer, { "log level": 1 });

const KindahRoutes = require("./Routes/routes");
const AuthRoutes = require("./Routes/AuthRoutes.js");
const { JSONCookies } = require("cookie-parser");
app.use(
  session({ secret: "kindahcare", resave: false, saveUninitialized: false })
);

//=============start push notification using socket.io==================
var clients = {};
socketServer.sockets.on("connection", function (socket) {
  //=================save all Login user Info to array=======
  socket.on("add-user", function (data) {
    clients[data.username] = {
      socket: socket.id,
    };
  });

  socket.on("SendCallRequestToPatient", function (data) {
    if (clients[data.pName]) {
      socketServer.sockets.connected[clients[data.pName].socket].emit(
        "CallRequest",
        data
      );
    } else {
      console.log("User does not exist: " + data.pName);
    }
  });
  socket.on("sendToCalBack", function (data) {
    if (clients[data.username]) {
      console.log("this is patient id on server " + JSON.stringify(data));
      socketServer.sockets.connected[clients[data.username].socket].emit(
        "callBackID",
        data
      );
    } else {
      console.log("User does not exist: " + data.pName);
    }
  });
  socket.on("RejectedAudioVideoCall", function (data) {
    if (clients[data.username]) {
      console.log(
        "this is docort Name " + JSON.stringify(clients[data.username])
      );
      socketServer.sockets.connected[clients[data.username].socket].emit(
        "GetRejectedConfirmation",
        data
      );
    } else {
      console.log("User does not exist: " + data.pName);
    }
  });

  //==========close patient calling screen on disconnect or end call============
  socket.on("ClosePatientScreen", function (data) {
    console.log(JSON.stringify(clients[data.username]));
    if (clients[data.username]) {
      socketServer.sockets.connected[clients[data.username].socket].emit(
        "ClosePatientScreen",
        data.pName
      );
    } else {
      console.log("User does not exist: " + data.pName);
    }
  });

  // ===========sent Notification to doctor  from client=====
  socket.on("NotifyDoctor", function (data) {
    if (clients[data.username]) {
      socketServer.sockets.connected[clients[data.username].socket].emit(
        "SendNotificationToDoctor",
        data
      );
    } else {
      console.log("User does not exist: " + data.username);
    }
  });

  //=========send accept or reject alert to patient by doctor========
  socket.on("AcceptRejectCall", function (data) {
    //====doctor send notification to client for accept/reject call to selected Client======
    if (clients[data.username]) {
      socketServer.sockets.connected[clients[data.username].socket].emit(
        "CallAccepted",
        data
      );
    } else {
      console.log("User does not exist");
    }
  });
  socket.on("UpdateOnlineStatus", function (data) {
    if (data.uID != "") {
      socket.broadcast.emit("UpdateDoctorOnlineStatus", data); // for all client except sender
    }
  });

  //Removing the socket on disconnect
  socket.on("disconnect", function () {
    for (var name in clients) {
      if (clients[name].socket === socket.id) {
        delete clients[name];
        break;
      }
    }
  });
});

//=========configure ice server=====
easyrtc.on("getIceConfig", function (connectionObj, callback) {
  // This object will take in an array of XirSys STUN and TURN servers
  var iceConfig = [
    {
      urls: ["stun:eu-turn7.xirsys.com"],
    },
    {
      username:
        "EdRvDLpBORwwEjJ2fbvu-nXkE8CxanpiCA4c7aNwWRhwkEtIhdsLMkpCShEAzz0eAAAAAF8W0tZzb2hhaWxtY3M=",
      credential: "2d847f6c-cb46-11ea-a731-0242ac140004",
      urls: [
        "turn:eu-turn7.xirsys.com:80?transport=udp",
        "turn:eu-turn7.xirsys.com:3478?transport=udp",
        "turn:eu-turn7.xirsys.com:80?transport=tcp",
        "turn:eu-turn7.xirsys.com:3478?transport=tcp",
        "turns:eu-turn7.xirsys.com:443?transport=tcp",
        "turns:eu-turn7.xirsys.com:5349?transport=tcp",
      ],
    },
  ];

  http.request(
    "https://service.xirsys.com/ice",
    {
      form: {
        ident: "sohailmcs",
        secret: "e5ce3562-cb3d-11ea-aef6-0242ac150002",
        domain: "https://chat-av.herokuapp.com/",
        application: "default",
        room: "KindahCare",
        secure: 1,
      },
      json: true,
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // body.d.iceServers is where the array of ICE servers lives
        iceConfig = body.d.iceServers;
        console.log("this  is ice " + iceConfig);
        callback(null, iceConfig);
      }
    }
  );
});

easyrtc.setOption("logLevel", "debug");

//Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function (
  socket,
  easyrtcid,
  msg,
  socketCallback,
  callback
) {
  easyrtc.events.defaultListeners.easyrtcAuth(
    socket,
    easyrtcid,
    msg,
    socketCallback,
    function (err, connectionObj) {
      if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
        callback(err, connectionObj);
        return;
      }

      connectionObj.setField("credential", msg.msgData.credential, {
        isShared: false,
      });

      console.log(
        "[" + socket + "] Credential saved!",
        connectionObj.getFieldValueSync("credential")
      );

      callback(err, connectionObj);
    }
  );
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function (
  connectionObj,
  roomName,
  roomParameter,
  callback
) {
  console.log(
    "[" + connectionObj.getEasyrtcid() + "] Credential retrieved!",
    connectionObj.getFieldValueSync("credential")
  );
  easyrtc.events.defaultListeners.roomJoin(
    connectionObj,
    roomName,
    roomParameter,
    callback
  );
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function (err, rtcRef) {
  console.log("Initiated");

  rtcRef.events.on("roomCreate", function (
    appObj,
    creatorConnectionObj,
    roomName,
    roomOptions,
    callback
  ) {
    console.log("roomCreate fired! Trying to create: " + roomName);

    appObj.events.defaultListeners.roomCreate(
      appObj,
      creatorConnectionObj,
      roomName,
      roomOptions,
      callback
    );
  });
});

//linking css AND JS FILES
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
//routes
app.use(KindahRoutes);
app.use(AuthRoutes);

//in case of page not existing put error 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

//=============end push notification using socket.io=====================
webServer.listen(process.env.PORT || 8080, () => console.log("Alll is ok"));
