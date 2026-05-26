const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

module.exports = async function handler(req, res) {

  try {

    const body =
      typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const msisdn = body.msisdn;

    // call advertiser send pin api

    const response = await fetch(

      `https://m.bolo2vas102.click/c/pin/297170/4033?msisdn=${msisdn}&token=${process.env.API_TOKEN}`

    );

    const data = await response.json();

    // save database

    await supabase
      .from('leads')
      .insert([
        {
          msisdn:msisdn,
          txid:data.txid,
          status:'pin_sent'
        }
      ]);

    return res.status(200).json(data);

  } catch(err){

    console.log(err);

    return res.status(500).json({
      error:err.message
    });

  }

}