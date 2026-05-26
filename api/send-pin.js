const { createClient }
= require('@supabase/supabase-js')

const supabase = createClient(

 process.env.SUPABASE_URL,

 process.env.SUPABASE_ANON_KEY

)

module.exports = async function handler(req,res){

 const { msisdn } = req.body;

 await supabase
   .from('leads')
   .insert([
      {
        msisdn:msisdn,
        status:'submitted'
      }
   ]);

 res.status(200).json({
    success:true
 });

}