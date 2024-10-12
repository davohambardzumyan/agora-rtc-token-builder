import { createClient } from '@supabase/supabase-js'

export default {
    route:'/verify-subscription-ios',
    handler:async (req, res) => {
        const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        if(!supabase){
            return res.status(400).json({
                'error':"Client not created"
            });
        }


        const data = req.body;
        data.purchase = typeof data.purchase === "string" ? JSON.parse(data.purchase) : data.purchase;

        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);

        const formatDate = (date) => {
            return date.toISOString();
        };
        const {error} = await supabase
            .from('subscriptions')
            .insert({
                orig_tx_id: data?.transactionId,
                current_period_start: formatDate(now),
                current_period_end: formatDate(now),
                token: data?.purchase?.transactionIdentifier,
                uid: data.userId,
                product_id: 'premium_monthly',
                latest_receipt: '',
                app: data.appType,
                status: 'TRUE',
            })

        if(error){
            return res.status(409).json({
                'error':{
                    message:"Supabase query failed",
                    description: error,
                    request_body:data,
                }
            });
        }

        const { err } = await supabase
            .from('users')
            .update({
                subscription_status: 'premium',
                is_premium: 1,
                slides_count: 1000000,
            })
            .eq('uid', data.userId)

        if(err){

            return res.status(410).json({
                'error':{
                    message:"Users query failed",
                    description: err,
                    request_body:data,
                }
            });

        }

        if(!err && !error){
            return  res.status(200).json('success');
        }
    }

}

