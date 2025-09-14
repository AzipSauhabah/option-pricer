import React from "react";

type Props = {
  spot: number;
  setSpot: (s: number) => void;
  strike: number;
  setStrike: (s: number) => void;
  vol: number;
  setVol: (v: number) => void;
  rate: number;
  setRate: (r: number) => void;
  tau: number;
  setTau: (t: number) => void;
  optionType: "call" | "put";
  setOptionType: (o: "call" | "put") => void;
};

export default function Controls({
  spot,
  setSpot,
  strike,
  setStrike,
  vol,
  setVol,
  rate,
  setRate,
  tau,
  setTau,
  optionType,
  setOptionType,
}: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      <div>
        <label>Spot: {spot}</label>
        <input
          type="range"
          min="0"
          max="200"
          value={spot}
          onChange={(e) => setSpot(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Strike: {strike}</label>
        <input
          type="range"
          min="0"
          max="200"
          value={strike}
          onChange={(e) => setStrike(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Volatility: {vol}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={vol}
          onChange={(e) => setVol(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Rate: {rate}</label>
        <input
          type="range"
          min="0"
          max="0.2"
          step="0.001"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Time to Maturity: {tau}</label>
        <input
          type="range"
          min="0.01"
          max="5"
          step="0.01"
          value={tau}
          onChange={(e) => setTau(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Option Type: </label>
        <select
          value={optionType}
          onChange={(e) => setOptionType(e.target.value as "call" | "put")}
        >
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
      </div>
    </div>
  );
}
