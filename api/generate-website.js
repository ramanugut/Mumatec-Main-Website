/* Optional server-only AI generation. Enable only after configuring a key and a shared rate limit. */
module.exports = async (req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'METHOD_NOT_ALLOWED'});}
  if(process.env.AI_BUILDER_ENABLED!=='true'||!process.env.OPENAI_API_KEY)return res.status(503).json({error:'AI_NOT_CONNECTED'});
  if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'INVALID_ORIGIN'});}catch(_){return res.status(403).json({error:'INVALID_ORIGIN'});}}
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch(_){return res.status(400).json({error:'BAD_REQUEST'});}
  const description=String(body?.description||'').trim();
  if(description.length<12||description.length>600)return res.status(400).json({error:'INVALID_DESCRIPTION'});
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12500);
  try{
    const r=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',signal:controller.signal,
      headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({model:process.env.AI_BUILDER_MODEL||'gpt-4.1-mini',response_format:{type:'json_object'},max_tokens:900,
        messages:[{role:'system',content:'Return only JSON with fields name, headline, description, services (array of 3 short strings), color (one of #105479, #b54b2b, #257b66, #9b5672, #333e60). Write useful concise business website copy in simple South African English. Never invent contact details, prices, testimonials or certifications. Use business name only if given.'},{role:'user',content:description}]})
    });
    if(!r.ok)return res.status(502).json({error:'GENERATION_UNAVAILABLE'});
    const value=JSON.parse((await r.json()).choices[0].message.content);
    const clip=(v,n)=>String(v??'').trim().slice(0,n);
    if(!Array.isArray(value.services))throw Error('Bad format');
    return res.status(200).json({site:{name:clip(value.name,60),headline:clip(value.headline,110),description:clip(value.description,290),services:value.services.slice(0,4).map(x=>clip(x,70)),color:['#105479','#b54b2b','#257b66','#9b5672','#333e60'].includes(value.color)?value.color:'#105479'}});
  }catch(_){return res.status(502).json({error:'GENERATION_FAILED'});}
  finally{clearTimeout(timer);}
};
