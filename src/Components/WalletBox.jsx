import React from "react";
import "../Styles/WalletBox.css"; // optional, for styling

export default function WalletBox({ title, amount }) {
  return (
    <div className="wallet-box">
      <h3>{title}</h3>
      <p>${amount.toFixed(2)}</p>
    </div>
  );
}