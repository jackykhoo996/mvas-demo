import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {

    // ONLY POST
    if (req.method !== 'POST') {

        return res.status(405).json({
            success:false
        });

    }

    try {

        // =========================
        // SUPABASE
        // =========================

        const supabase = createClient(

            process.env.SUPABASE_URL,

            process.env.SUPABASE_SERVICE_ROLE_KEY

        );

        // =========================
        // BODY
        // =========================

        const {

            msisdn,

            clickid

        } = req.body;

        // =========================
        // PIN API
        // =========================

        const apiUrl =

        `https://m.bolo2vas102.click/c/pin/297170/4033?msisdn=${msisdn}&token=51bd5411badf480c8c1e3a5b8d3d653b`;

        console.log(apiUrl);

        // =========================
        // REQUEST
        // =========================

        const response =

        await fetch(apiUrl);

        const data =

        await response.json();

        console.log(data);

        // =========================
        // TXID
        // =========================

        const txid =

        data.txid || '';

        // =========================
        // INSERT DATABASE
        // =========================

        const { error } =

        await supabase

        .from('leads')

        .insert([{

            msisdn: msisdn,

            txid: txid,

            clickid: clickid || '',

            status: 'pin_sent'

        }]);

        // =========================
        // ERROR
        // =========================

        if(error){

            console.log(

                'SUPABASE ERROR:',
                error

            );

        }

        else{

            console.log(

                'DATABASE INSERT SUCCESS'
            );

        }

        // =========================
        // RETURN
        // =========================

        return res.status(200).json({

            success:true,

            txid:txid,

            response:data

        });

    }

    catch(err){

        console.log(err);

        return res.status(500).json({

            success:false,

            error:err.message

        });

    }

}