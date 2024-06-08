function soloAdmin(req,res,next){
    console.log ("COOKIE",req.headers.cookies)
}

function soloPublico(req,res,next){
    
}


export const methods = {
    soloAdmin,
    soloPublico,
    
}