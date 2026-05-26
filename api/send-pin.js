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

    if (!msisdn) {

      return res.status(400).json({
        error:'No msisdn'
      });

    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          msisdn: msisdn,
          status:'submitted'
        }
      ]);

    if(error){

      console.log(error);

      return res.status(500).json({
        error:error.message
      });

    }

    return res.status(200).json({
      success:true
    });

  } catch(err){

    console.log(err);

    return res.status(500).json({
      error:err.message
    });

  }

}