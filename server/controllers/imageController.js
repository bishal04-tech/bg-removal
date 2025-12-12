
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

/**
 * POST /api/image/remove-bg
 * Auth: JWT in Authorization: Bearer <token>
 * File: multipart/form-data with field "image" (multer.diskStorage)
 */
export const removeBgImage = async (req, res) => {
    let reservedCredit = false; // track if we decremented already (so we can rollback on error)

    try {
        // 1) Verify JWT (kept inside controller for safety)
        
        
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        // Handle both 'sub' (standard) and 'id' (custom) payload structures
        const userId = payload.sub || payload.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Invalid token payload' });
        }

        // 2) Validate file
        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }
        const imagePath = req.file.path;

        // 3) Reserve a credit atomically (only if balance > 0)
        //    This prevents race conditions (two parallel requests consuming the same last credit).
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId, creditBalance: { $gt: 0 } },
            { $inc: { creditBalance: -1 } },
            { new: true } // return the updated doc (already decremented)
        );

        if (!updatedUser) {
            // No user or no credits left
            cleanupFileQuiet(imagePath);
            // Fetch current balance to show in error
            const u = await userModel.findById(userId).select('creditBalance').lean();
            return res.json({
                success: false,
                message: 'No Credit Balance. Please buy more credits.',
                creditBalance: u?.creditBalance ?? 0,
            });
        }
        
        reservedCredit = true; // mark reserved so we can rollback if provider fails

        // 4) Prepare request for Clipdrop
        const clipdropKey = process.env.CLIPDROP_API;
        if (!clipdropKey) {
            // Rollback reserved credit if misconfigured
            await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: 1 } });
            reservedCredit = false;
            cleanupFileQuiet(imagePath);
            return res.status(500).json({
                success: false,
                message: 'Clipdrop API key not configured',
            });
        }

        const formdata = new FormData();
        formdata.append('image_file', fs.createReadStream(imagePath));

        // 5) Call Clipdrop API
        let vendorResp;
        try {
            vendorResp = await axios.post(
                'https://clipdrop-api.co/remove-background/v1',
                formdata,
                {
                    headers: {
                        'x-api-key': clipdropKey,
                        ...formdata.getHeaders(),
                    },
                    responseType: 'arraybuffer', // Crucial for image data
                }
            );
        } catch (err) {
            // ROLLBACK CREDIT ON FAILURE
            try {
                if (reservedCredit) {
                    await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: 1 } });
                    reservedCredit = false;
                }
            } catch (rollbackErr) {
                console.error('Credit rollback failed:', rollbackErr);
            }
            
            cleanupFileQuiet(imagePath);

            const status = err.response?.status || 500;
            
            // Clipdrop sometimes returns raw buffers on error; extract message safely
            let message = 'Background service error';
            
            if (err.response?.data) {
                // If data is a Buffer (common with arraybuffer responseType), convert to string
                const dataString = Buffer.isBuffer(err.response.data) 
                    ? err.response.data.toString() 
                    : JSON.stringify(err.response.data);
                    
                // Try to parse JSON error if possible
                try {
                    const jsonErr = JSON.parse(dataString);
                    message = jsonErr.error || jsonErr.message || message;
                } catch {
                    // If not JSON, use the raw string or generic message
                    if (!Buffer.isBuffer(err.response.data)) {
                         message = dataString || err.message;
                    }
                }
            } else {
                 message = err.message;
            }

            console.error('Clipdrop API Error:', message);
            return res.json({ success: false, message });
        }

        // 6) Success: convert to base64 and respond
        const base64 = Buffer.from(vendorResp.data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64}`; // Clipdrop usually returns PNG

        cleanupFileQuiet(imagePath);

        return res.json({
            success: true,
            message: 'Background Removed',
            resultImage,
            creditBalance: updatedUser.creditBalance, // already decremented
        });

    } catch (error) {
        console.error('removeBgImage crash:', error?.stack || error);

        // Best-effort rollback if we had reserved a credit but failed locally
        try {
            if (reservedCredit) {
                // We need to re-verify token to get ID if the crash happened before userId was set
                // But usually crash happens after. We try to use scope variables if available.
                // Since this is a catch-all, we might not have userId easily if it failed early.
                // We will rely on the fact that if reservedCredit is true, userId MUST have been set.
                
                // However, accessing 'userId' here relies on it being defined in the try block's scope.
                // It is defined in the try block, so strictly it's not available in catch block in older JS, 
                // but usually fine in modern let/const block scoping if defined at top. 
                // To be safe, we re-parse headers or just skip if we can't find ID.
                
                const authHeader = req.headers.authorization || '';
                const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
                if (token) {
                    const payload = jwt.decode(token); // decode is faster/safe enough for rollback
                    const uid = payload?.sub || payload?.id;
                    if (uid) {
                        await userModel.findByIdAndUpdate(uid, { $inc: { creditBalance: 1 } });
                    }
                }
            }
        } catch (rollbackErr) {
            console.error('Credit rollback after crash failed:', rollbackErr);
        }

        // Cleanup temp file if present
        try {
            if (req.file?.path) cleanupFileQuiet(req.file.path);
        } catch (_) {}

        return res.json({ success: false, message: 'Internal Server Error' });
    }
};

// Small helper: safely remove temp file
function cleanupFileQuiet(path) {
    try {
        if (path && fs.existsSync(path)) fs.unlinkSync(path);
    } catch (_) {}
}

export default removeBgImage;