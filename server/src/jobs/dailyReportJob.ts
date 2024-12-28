import schedule from 'node-schedule';
import { Resend } from 'resend';

import { Registration } from "../models/registrationModels";

// Her gün sonu admine günlük kayıt sayısı ile ilgili rapor mail gönderir.
const dailyReportJob = schedule.scheduleJob('59 23 * * *', async () => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);


        const todayRegistrations = await Registration.find({
            registrationDate: {
                $gte: startOfDay, 
                $lte: endOfDay  
            }
        });


        const eventCounts = await Registration.aggregate([
            {
                $match: { 
                    registrationDate: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: { 
                    _id: "$event", 
                    count: { $sum: 1 } 
                }
            },
            {
                $lookup: { 
                    from: "events", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "eventDetails"
                }
            },
            {
                $unwind: "$eventDetails"
            },
            {
                $project: { 
                    _id: 1,
                    count: 1,
                    title: "$eventDetails.title"
                }
            }
        ]);

        
        const numberRegistrations = `Number of registrations made today : ${todayRegistrations.length}`;
        let reportString = '';
        eventCounts.forEach(event => {
            reportString += `<p>Event Id: ${event._id} - Event Title: ${event.title}, Today Registrations: ${event.count}</p>`;
        });

        
        const resend = new Resend(process.env.RESEND_API_KEY);

        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: "emreorbay64@gmail.com", // Normal de admin mail adresi olmalı
            subject: 'Daily Registrations Report',
            html: `<p>${numberRegistrations}</p><p>Event-wise Registration Counts:</p>${reportString}`
        });


        console.log('Reminder event job executed successfully.');

    } catch (error : any) {
        console.error('Job failed:', error.message);
    }
});

export default dailyReportJob;