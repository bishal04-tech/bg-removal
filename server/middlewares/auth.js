// import jwt from 'jsonwebtoken';

// const userAuth = async (req, res, next) => {
//     try {
//         console.log("Headers received:", req.headers);
//         const { token } = req.headers;
        
//         if (!token) {
//             return res.json({ success: false, message: "Not Authorized. Login Again" });
//         }
        
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
//         if (token_decode.id) {
//             req.body.userId = token_decode.id; // Adds userId to the request body
//         } else {
//              // Fallback if your token payload uses 'sub' instead of 'id'
//             req.body.userId = token_decode.sub;
//         }

//         next();
        
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// export default userAuth;

import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        // 1. Get the authorization header instead of 'token'
        const { authorization } = req.headers;

        // 2. Check if the header exists and is formatted correctly
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        // 3. Extract the token string (remove the "Bearer " prefix)
        const token = authorization.split(' ')[1];
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (token_decode.id) {
            req.body.userId = token_decode.id; 
        } else {
            req.body.userId = token_decode.sub;
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default userAuth;