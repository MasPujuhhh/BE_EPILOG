import jwt from '../helper/jwt.js'
class Auth{
    static async verifikasiToken(req,res,next){
        try {
            let token = req.headers.authorization.split(" ")
            let hasil = await jwt.verify(token[1]);
            if(hasil){
                req.user = hasil;
                next()
            } else{
                res.status(500).json({pesan:"token anda tidak valid"})
            }
        } catch (error) {
            res.status(500).json({pesan:"token anda tidak valid"})
        }
       
    }

    static async verifikasiAdmin(req, res, next){
        try {
            let token = req.headers.authorization.split(" ")
            let hasil = await jwt.verify(token[1]);
            if(hasil.role == 1 || hasil.role == 2){
                // console.log('sd')
                req.admin = hasil;
                next()
            } else{
                res.status(500).json({pesan:"anda tidak punya akses"})
            }
        } catch (error) {
            res.status(500).json({pesan:"token anda tidak valid"})
        }
    }

    static async verifikasiSuperAdmin(req, res, next){
        try {
            let token = req.headers.authorization.split(" ")
            let hasil = await jwt.verify(token[1]);
            if(hasil.role == 2){
                req.admin = hasil;
                next()
            } else{
                res.status(500).json({pesan:"anda tidak punya akses"})
            }
        } catch (error) {
            res.status(500).json({pesan:"token anda tidak valid"})
        }
    }
}

export default Auth;