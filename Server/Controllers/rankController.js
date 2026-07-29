
export const addKeyword= async (req,res)=>{

    try{
        const {keyword,url}=req.body;

        if(!keyword || !url){
            return res.status(400).json({message:"Key word and url are required",success:false})
        }

        let domain;

        //extract domain
        try{
            const urlObj=new URL(url.startsWith("http")?url:`https://${url}`);
            domain=urlObj.hostname.replace("www.","");
        }
        catch(err){
            console.error(err);
            return res.status(400).json({message:"Invalid URL format",success:false})
        }

        //find if already exists
        const existingKeyword=await keywordTrackingModel.findOne({userId:req.userId,keyword:keyword.toLowerCase().trim(),domain:domain});

        if(existingKeyword){
            return res.status(400).json({message:"Keyword already exists for this domain",success:false})
        }

        //Tracking keyword


        const trackingKeyword=new keywordTrackingModel({
            userId:req.userId,
            keyword:keyword.toLowerCase().trim(),
            url:url.startsWith("http")?url:`https://${url}`,
            domain:domain,
            status:'checking',

        })

        await trackingKeyword.save()

        res.save(201).json({message:"Keyword added successfully",success:true,data:trackingKeyword})
    }
    catch(error){

    }

}
export const getKeyword= async (req,res)=>{

}
export const adKeyword= async (req,res)=>{

}
export const refreshKeyword= async (req,res)=>{

}
export const deleteKeyword= async (req,res)=>{

}