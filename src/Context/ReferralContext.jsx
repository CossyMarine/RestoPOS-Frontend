import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { setAuthToken, getReferralApi } from "../api/referralApi";

export const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);

  const [referral, setReferral] = useState({
    referralLink: "",
    totalEarned: 0,
    totalMembers: 0,
    level: 1,
    badge: "/Assets/white.jpg",
    members: [],
  });

  const [loading, setLoading] = useState(true);

  // Badge logic
  const getBadge = (totalMembers) => {
    if (totalMembers >= 200) return "/Assets/orange.jpg";
    if (totalMembers >= 100) return "/Assets/blue.jpg";
    if (totalMembers >= 50) return "/Assets/black.jpg";
    if (totalMembers >= 20) return "/Assets/white.jpg";
    return "/Assets/white.jpg";
  };

  // Level logic
  const getLevel = (totalMembers) => {
    if (totalMembers >= 200) return 5;
    if (totalMembers >= 100) return 4;
    if (totalMembers >= 50) return 3;
    if (totalMembers >= 20) return 2;
    return 1;
  };

  // Fetch referral data
  useEffect(() => {
    if (!user || !token) return;

    setAuthToken(token); // ✅ attach token globally  

    const fetchReferral = async () => {  
      setLoading(true);  
      try {  
        const res = await getReferralApi();  
        const { totalEarned, referrals } = res;   // ✅ FIX: backend returns referrals
        const totalMembers = referrals.length;  

        setReferral({  
          referralLink: user ? `https://marinecash.app/ref/${user._id}` : "",  
          totalEarned,  
          totalMembers,  
          level: getLevel(totalMembers),  
          badge: getBadge(totalMembers),  
          members: referrals,   // ✅ FIX: save backend referrals into members
        });  
      } catch (err) {  
        console.error("Failed to fetch referral data:", err);  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchReferral();  
    const interval = setInterval(fetchReferral, 15000);  
    return () => clearInterval(interval);

  }, [user, token]);

  // Local update
  const updateReferral = (update) => {
    setReferral((prev) => {
      const updatedMembers = update.members || prev.members;
      const totalMembers = updatedMembers.length;

      return {  
        ...prev,  
        ...update,  
        totalMembers,  
        level: getLevel(totalMembers),  
        badge: getBadge(totalMembers),  
      };  
    });
  };

  return (
    <ReferralContext.Provider
      value={{ referral, setReferral, updateReferral, loading }}
    >
      {children}
    </ReferralContext.Provider>
  );
};