const jwt=require("jsonwebtoken")

module.exports=function(){
    return (req,res,next)=>{
        const authHeader=req.headers['authentication']
        const token=authHeader && authHeader.split(' ')[1]
        if(!token){
            return res.status(401).send({message:'Access denied. No token provided.'})
        }
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decoded
            next()
        }
        catch(err){
            return res.status(400).send({message:'Invalid token.'})
        }
    }
}