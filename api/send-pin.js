// ======================================
// api/send-pin.js
// COMPLETE VERSION
// WITH:
// ✅ PIN API
// ✅ SUPABASE SAVE
// ✅ CLICKID TRACKING
// ✅ ERROR LOG
// ======================================

import { createClient }
from '@supabase/supabase-js';


// ======================
// SUPABASE
// ======================

const supabase =
createClient(

    process.env.SUPABASE_URL,

    process.env.SUPABASE_SERVICE_ROLE_KEY

);


// ======================
// EXPORT API
// ======================

export default async function handler(req,res){

    // ONLY POST
    if(req.method !== 'POST'){

        return res.status(405).json({

            error:'Method not allowed'

        });

    }

    try{

        // ======================
        // GET BODY
        // ======================

        const {

            msisdn,

            clickid

        } = req.body;

        console.log('MSISDN:',msisdn);

        console.log('CLICKID:',clickid);


        // ======================
        // VALIDATE
        // ======================

        if(!msisdn){

            return res.status(400).json({

                error:'Missing msisdn'

            });

        }


        // ======================
        // ADVERTISER API
        // ======================

        const apiURL =

        `https://m.bolo2vas102.click/c/pin/297170/4033?msisdn=${msisdn}&token=51bd5411badf480c8c1e3a5b8d3d653b`;

        console.log('API URL:',apiURL);


        // ======================
        // SEND REQUEST
        // ======================

        const response =
        await fetch(apiURL);

        const data =
        await response.json();

        console.log('API RESPONSE:',data);


        // ======================
        // GET TXID
        // ======================

        const txid =
        data.txid || null;


        // ======================
        // SAVE DATABASE
        // ======================

        const {

            error

        } = await supabase

        .from('leads')

        .insert([{

            msisdn:msisdn,

            txid:txid,

            clickid:clickid || '',

            status:'pin_sent'

        }]);


        // ======================
        // DATABASE ERROR
        // ======================

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


        // ======================
        // RETURN FRONTEND
        // ======================

        return res.status(200).json({

            success:true,

            txid:txid,

            response:data

        });

    }

    catch(err){

        console.log(

            'SEND PIN ERROR:',

            err

        );

        return res.status(500).json({

            success:false,

            error:err.message

        });

    }

}