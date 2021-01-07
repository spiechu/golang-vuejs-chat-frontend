var sock = null;
var wsuri = process.env.VUE_APP_WEB_SOCKET_URI;
var readyToUse = false;
var messageListeners = [];

window.onload = function () {
    console.log("onload");
    sock = new WebSocket(wsuri);
    sock.onopen = function () {
        console.log("connected to " + wsuri);

        readyToUse = true;
    }
    sock.onerror = function (a) {
        console.log("error");
        console.log(a);

        readyToUse = false;
    }

    sock.onclose = function (e) {
        console.log("connection closed (" + e.code + ")");

        readyToUse = false;
    }
    sock.onmessage = function (e) {
        console.log("message received: " + e.data);

        let message = JSON.parse(e.data);

        messageListeners.forEach(function (callback) {
            callback.call(callback, message);
        });
    }
};

export default {
    setName: function (message) {
        console.log('setting name ' + message);

        if (readyToUse) {
            sock.send(JSON.stringify({Command: "setName", Body: message}));

            return;
        }

        console.log('error setting name');
    },
    sendMessage: function (message) {
        console.log('sending message ' + message);

        if (readyToUse) {
            sock.send(JSON.stringify({Command: "sendMessage", Body: message}));

            return;
        }

        console.log('error sending message');
    },
    listenToMessages: function (callback) {
        messageListeners.push(callback);
    }
}
