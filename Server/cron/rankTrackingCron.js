import cron from 'node-cron'
import  keywordTrackingModel from '../models/keywordTrackingModel'


export function startRankTrackingCron() {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running rank tracking daily cron job...')

        try{
            const activeTrackings=await keywordTrackingModel.find({isActive:true})
            activeTrackings.map(async (tracking)=>{trackKeyword(tracking)})
        }
        catch(error){

        }
    })
}