import schedule from 'node-schedule';
import { Resend } from 'resend';

import { Registration } from "../models/registrationModels";
import { Event } from "../models/eventModel";
import { User } from "../models/userModel";

// Her gün sabah 8'de gün içinde ki etkinliğe kayıtlı olan kullanıcılara hatırlatma mail gönderir.
const reminderEventJob = schedule.scheduleJob('0 8 * * *', async () => {
    try {

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const events = await Event.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        for (const event of events) {

            const registrations = await Registration.find({ event: event._id });
        
            const userIds = registrations.map(reg => reg.user);
            const users = await User.find({ _id: { $in: userIds } });

            const emails = users.map(user => user.email);

            if (emails.length > 0) {
                // E-posta içeriğini oluştur
                emails.forEach((email) =>{

                    const resend = new Resend(process.env.RESEND_API_KEY);
                    resend.emails.send({
                        from: 'onboarding@resend.dev',
                        to: email, // Normal de admin mail adresi olmalı
                        subject: `Event Reminder: ${event.title}`,
                        html: `<p>Dear participant, this is a reminder for the event "${event.title}" scheduled for today.</p>`
                    });
    
                })
                console.log(`Email sent to ${emails.length} participants for event: ${event.title}`);
            }
        }
        

        console.log('Daily report job executed successfully.');

    } catch (error : any) {
        console.error('Job failed:', error.message);
    }
});

export default reminderEventJob;