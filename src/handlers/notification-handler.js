class NotificationHandler {
    constructor(io) {
        this.io = io;
        this.init();
    }
    async init() {
        this.nsp = this.io.of('/notifications');
        this.nsp.on("connection", socket => {
            socket.on('join', data => {
                //send unique data  about user [id]
                socket.join(data.id);
            })
        })
    }



}

export default NotificationHandler;