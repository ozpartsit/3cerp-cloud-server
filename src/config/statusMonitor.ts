import monitor from "express-status-monitor"
export default monitor(
    {
        title: '3C Cloud Status',  // Default title
        theme: 'default.css',     // Default styles
        path: '/status',
        socketPath: '/socket.io', // In case you use a custom path

        spans: [{
            interval: 1,            // Every second
            retention: 60           // Keep 60 datapoints in memory
        }, {
            interval: 5,            // Every 5 seconds
            retention: 60
        }, {
            interval: 15,           // Every 15 seconds
            retention: 60
        }],
        chartVisibility: {
            cpu: true,
            mem: true,
            load: true,
            eventLoop: true,
            heap: true,
            responseTime: true,
            rps: true,
            statusCodes: true
        },
        healthChecks: [{
            protocol: 'http',
            host: 'localhost',
            path: '/admin/health/ex1',
            port: '3000'
        }, {
            protocol: 'http',
            host: 'localhost',
            path: '/admin/health/ex2',
            port: '3000'
        }],
        ignoreStartsWith: '/admin'
    }
);