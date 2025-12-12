



import express from 'express';
import { userCredits, paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js'; // Import the middleware

const userRouter = express.Router();

userRouter.get('/credits', userAuth, userCredits);
userRouter.post('/pay-razor', userAuth, paymentRazorpay);
userRouter.post('/verify-razor', userAuth, verifyRazorpay);
userRouter.post('/pay-stripe', userAuth, paymentStripe);
userRouter.post('/verify-stripe', userAuth, verifyStripe);

export default userRouter;