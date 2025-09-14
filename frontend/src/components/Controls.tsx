import React from "react";

type Props = {
  spot: number;
  setSpot: (n: number) => void;
  strike: number;
  setStrike: (n: number) => void;
  vol: number;
  setVol: (n: number) => void;
  rate: number;
  setRate: (n: number) => void;
  tau: number;
  setTau: (n: number) => void;
  optionType: "call" | "put";
  setOptionType: (s: "call" | "put") => void;
};

export default function Controls({
  spot, setSpot,
  strike, setStrike,
  vol, setVol,
  rate, setRate,
  tau, setTau,
  optionType, setOptionType,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        Spot: <input type="number" value={spot} onChange={(e) => setSpot(parseFloat(e.target.value))} />
      </div>
      <div>
        Strike: <input type="number" value={strike} onChange={(e) => setStrike(parseFloat(e.target.value))} />
      </div>
      <div>
        Volatility: <input type="number" value={vol} step={0.01} onChange={(e) => setVol(parseFloat(e.target.value))} />
      </div>
      <div>
        Rate: <input type="number" value={rate} step={0.001} onChange={(e) => setRate(parseFloat(e.target.value))} />
      </div>
      <div>
        Tau: <input type="number" value={tau} step={0.01} onChange={(e) => setTau(parseFloat(e.target.value))} />
      </div>
      <div>
        Option Type: 
        <select value={optionType} onChange={(e) => setOptionType(e.target.value as "call" | "put")}>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
      </div>
    </div>
  );
}
