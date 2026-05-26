import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  try {

    const { msisdn } = req.body;

    // advertiser api
    const response = await fetch(
      `https://m.bolo2vas102.click/c/pin/297170/4033?msisdn=${msisdn}&token=51bd5411badf480c8c1e3a5b8d3d653b`
    );

    const data = await response.json();

    console.log("advertiser response:", data);

    const txid = data.txid;

    // insert database
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          msisdn: msisdn,
          txid: txid,
          status: 'pin_sent'
        }
      ]);

    // print insert error
    if(error){
      console.log("SUPABASE ERROR:", error);
    } else {
      console.log("DATABASE INSERT SUCCESS");
    }

    return res.status(200).json({
      success:true,
      txid:txid
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message
    });

  }

}