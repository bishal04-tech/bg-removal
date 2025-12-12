// 
// src/context/AppContext.jsx
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);
  const [credit, setCredit] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- JWT helpers ---
  const getToken = () => localStorage.getItem("token");
  const isSignedIn = () => !!getToken();

  const authHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
      // token missing/expired/invalid
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // --- API calls ---
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/credits`,
        { headers: { ...authHeader() } }
      );
      if (data.success) setCredit(data.credits);
      else toast.error(data.message || "Failed to load credits");
    } catch (error) {
      console.log(error);
      handleAuthError(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const removeBG = async (imgFile) => {
    try {
      if (!isSignedIn()) {
        // was: openSignIn()
        return navigate("/login");
      }

      setResultImage(false);
      setImage(imgFile);
      navigate("/result");

      const formData = new FormData();
      if (imgFile) formData.append("image", imgFile);

      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-bg`,
        formData,
        {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setResultImage(data.resultImage);
        if (typeof data.creditBalance !== "undefined") {
          setCredit(data.creditBalance);
        }
      } else {
        toast.error(data.message || "Background removal failed");
        if (typeof data.creditBalance !== "undefined") {
          setCredit(data.creditBalance);
          if (data.creditBalance === 0) navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      handleAuthError(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const value = {
    image,
    setImage,
    backendUrl,
    removeBG,
    loadCreditsData,
    resultImage,
    setResultImage,
    credit,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
