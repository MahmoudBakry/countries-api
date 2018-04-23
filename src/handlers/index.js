

import NotificationHandler from './notification-handler'

class EventHandler {
    constructor(io) {
        new NotificationHandler(io)
    }
}


export default EventHandler;