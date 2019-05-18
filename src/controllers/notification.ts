import User, { Notification, UserModel } from "../models/User";

export const createNotificationByCode = async (userId: any, notification: Notification) => {
    await User.updateOne({$or: [{code: userId}]}, {
        $push: {
            notifications: {
                $each: [notification],
                $sort: {
                    time: -1
                }
            }
        }
    });
};