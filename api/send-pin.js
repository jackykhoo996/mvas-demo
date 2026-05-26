import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res){

  const { msisdn } = req.body;

  // request advertiser api
  const response = await fetch(
    `https://m.bolo2vas102.click/c/pin/297170/4033?msisdn=${msisdn}&token=51bd5411badf480c8c1e3a5b8d3d653b`
  );

  const data = await response.json();

  // advertiser returned txid
  const txid = data.txid;

  // save to database
  await supabase
    .from('leads')
    .insert([
      {
        msisdn: msisdn,
        txid: txid,
        status: 'pin_sent'
      }
    ]);

  res.status(200).json({
    success:true,
    txid:txid
  });

}