var daemon = require("daemonize2").setup({
    main: "app.js",
    name: "lensite",
    pidfile: "lensite.pid"
});

switch (process.argv[2]) {

    case "start":
        daemon.start();
        break;

    case "stop":
        daemon.stop();
        break;


    case "restart":
        daemon.stop(function() {daemon.start()});
        break;
    default:
        console.log("Usage: [start|stop]");
}
