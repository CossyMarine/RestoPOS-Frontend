import React, { useContext } from "react";
import { WalletContext } from "../Context/WalletContext";
import logo from "../Assets/logo.png";

const TopBar = () => {
  const { wallet } = useContext(WalletContext);

  return (
    <nav
      className="w-full bg-orange-400 flex justify-between items-center px-3 sticky top-0 z-50 shadow-md"
      style={{ height: "64px" }}
    >
      <img
        src={logo}
        alt="MarineCash"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
      <div className="flex gap-2">
        <div className="bg-white rounded-xl px-3 py-1.5 text-center shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Earned Today</p>
          <p className="text-green-500 font-bold text-sm leading-tight">
            ${Number(wallet?.earnedToday ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl px-3 py-1.5 text-center shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Total Balance</p>
          <p className="text-green-500 font-bold text-sm leading-tight">
            ${Number(wallet?.balance ?? 0).toFixed(2)}
          </p>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
