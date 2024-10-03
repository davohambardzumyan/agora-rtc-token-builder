import { createClient } from '@supabase/supabase-js'

export default {
    route:'/verify-subscription',
    handler:async (req, res) => {
        const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        const data = req.body;
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);

        const {error} = await supabase
            .from('subscriptions')
            .insert({
                orig_tx_id: data?.purchase?.orderId,
                current_period_start: `${date} ${time}`,
                current_period_end: `${nextMonth.toLocaleDateString()} ${time}`,
                token: data.purchase.purchaseToken,
                uid: data.userId,
                product_id: 'premium_monthly',
                latest_receipt: '',
                app: data.appType,
                status: 'TRUE',
            })

        const { err } = await supabase
            .from('users')
            .update({
                subscription_status: 'premium',
                is_premium: 1
            })
            .eq('uid', data.userId)

        if(!err && !error){
            return  res.status(200).json('success');
        }

        if(err){
            return  res.status(500).json('Something went wrong, users table');
        }
        if(error){
            return  res.status(500).json('Something went wrong, subscription table');

        }
    }

}

