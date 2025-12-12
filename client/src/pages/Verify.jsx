
// src/pages/Verify.jsx
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const transactionId = searchParams.get('transactionId');

  const { backendUrl, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  const verifyStripe = async () => {
    try {
      // must be logged in
      const token = getToken();
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      // basic param check
      if (!transactionId) {
        toast.error('Missing transaction ID');
        navigate('/', { replace: true });
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-stripe`,
        { success, transactionId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ JWT header
          },
        }
      );

      if (data.success) {
        toast.success(data.message || 'Payment verified');
        // refresh credits
        await loadCreditsData();
      } else {
        toast.error(data.message || 'Verification failed');
      }

      navigate('/', { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Verification error';
      toast.error(msg);
      // If unauthorized, send to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  useEffect(() => {
    verifyStripe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin" />
    </div>
  );
};

export default Verify;
