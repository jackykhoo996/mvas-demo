import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  try {

    const { msisdn } = req.body;

    // advertiser PIN API
    const response = await fetch(
      `https://m.bolo2vas102.click/c/pin/297170/4033?msisdn=${msisdn}&token=51bd5411badf480c8c1e3a5b8d3d653b`
    );

    const data = await response.json();

    console.log(data);

    const txid = data.txid;

    // save database
    await supabase
      .from('leads')
      .insert([
        {
          msisdn: msisdn,
          txid: txid,
          status: 'pin_sent'
        }
      ]);

    return res.status(200).json({
      success: true,
      txid: txid
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message
    });

  }

}