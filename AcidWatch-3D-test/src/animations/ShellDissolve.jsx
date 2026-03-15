/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import "../styles.css";

export default function ShellDissolve({ pH }) {
  const [dissolving, setDissolving] = useState(false);

  useEffect(() => {
    if (pH < 7.8) {
      setDissolving(true);
    } else {
      setDissolving(false);
    }
  }, [pH]);

  return (
    <div className="shell-section">
      <h3>Pteropod Shell</h3>

      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        className={dissolving ? "shell dissolving" : "shell"}
      >
        <path
          d="M50 10
             C70 20,80 40,60 60
             C40 80,20 70,30 50
             C40 30,45 20,50 10"
          fill="none"
          stroke="black"
          strokeWidth="3"
        />
      </svg>

      <div className="shell-status">
        pH {pH.toFixed(2)}
        <br />
        {dissolving ? "Shell dissolving" : "Shell stable"}
      </div>
    </div>
  );
}
