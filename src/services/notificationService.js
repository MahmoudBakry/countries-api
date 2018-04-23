import NotificationModel from '../models/notification.model';
import { send } from '../services/push-notifications'

export async function sendRealStateChatNotificToOtherOne(message, io) {
    try {
        let targetUserId = message.issuer.id != message.ads.owner ? message.ads.owner : message.serviceUser;
        let chatNotifi = await NotificationModel.create({
            issuer: message.issuer,
            serviceUser: message.serviceUser,
            targetUser: targetUserId,
            subjectOfNotificationTypes: 'user-realEstate-message',
            subjectOfNotification: message.id,
            type: 'CHAT'
        });

        chatNotifi = await NotificationModel.findById(chatNotifi.id)
            .populate('issuer')
            .populate({
                path: 'subjectOfNotification',
                populate: {
                    path: 'ads',
                    model: 'ads-base-model'
                }
            })
        console.log(chatNotifi)

        //in app notification
        io.of(`/notifications`).to(targetUserId).emit("newNotification", chatNotifi);

        //send push notification 
        send(targetUserId, 'لديك رساله جديده', chatNotifi.subjectOfNotificationTypes, chatNotifi.subjectOfNotification)

        //  console.log("Chat-ads-Notification-Namespace => ", nsp.name);
    } catch (err) {
        console.log('ads Chat Notifi Err: ', err);
    }
}
//send notification to all followers of specific question 
export async function sendAnswerNotificToFollowersOfQuestion(question, io) {
    try {
        let followersIds = question.followersIds;
        for (let x = 0; x < followersIds.length; x++) {

            let answerNotification = await NotificationModel.create({
                targetUser: followersIds[x],
                subjectOfNotificationTypes: "question",
                subjectOfNotification: question.id,
                type: 'ANSWER'
            })
            let answerNotificationDetails = await NotificationModel.findById(answerNotification.id)
                .populate('targetUser')
                .populate('subjectOfNotification')
            //in app notification
            io.of(`/notifications`).to(followersIds[x]).emit("newNotification", answerNotificationDetails);
            //send push notification 
            send(followersIds[x], 'لديك اجابه على سؤال تتابعه ', answerNotificationDetails)
        }
    } catch (err) {
        console.log('ads Chat Notifi Err: ', err);
    }
}
