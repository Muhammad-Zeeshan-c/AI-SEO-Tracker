import jwt from 'jsonwebtoken'

const isAuthenticated = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: "Authentication failed"})
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userid = decoded.id
        next()
    }
    catch(err){
        console.log("Authentication error : ", err)
        res.status(401).json({message: "Authentication failed"})
    }
}

export default isAuthenticated