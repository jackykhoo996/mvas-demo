import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  try {

    const { txid, pin } = req.body;

    // advertiser verify api
    const response = await fetch(
      `https://m.bolo2vas102.click/c/pin/verify?txid=${txid}&pin=${pin}&token=51bd5411badf480c8c1e3a5b8d3d653b`
    );

    const data = await response.json();

    console.log(data);

    // success
    if(data.stateCode == 0){

      // update database
      await supabase
        .from('leads')
        .update({
          status:'verified'
        })
        .eq('txid', txid);

      return res.status(200).json({
        success:true
      });

    } else {

      // failed
      await supabase
        .from('leads')
        .update({
          status:'failed'
        })
        .eq('txid', txid);

      return res.status(200).json({
        success:false
      });

    }

  } catch(err){

    console.log(err);

    return res.status(500).json({
      error: err.message
    });

  }

}