import React, { useState, useEffect } from "react";
import Controls from "./components/Controls";
import ChartDisplay from "./components/ChartDisplay";
import useWS from "./usews";

type Result = {
  price: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
};

export default function App() {
  const [spot, setSpot] = useState(100);
  const [strike, setStrike] = useState(100);
  const [vol, setVol] = useState(0.2);
  const [rate, setRate] = useState(0.01);
  const [tau, setTau] = useState(1);
  const [optionType, setOptionType] = useState<"call" | "put">("call");

  const [result, setResult] = useState<Result | null>(null);
  const [spots, setSpots] = useState<number[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [payoffs, setPayoffs] = useState<number[]>([]);
  const [deltas, setDeltas] = useState<number[]>([]);
  const [gammas, setGammas] = useState<number[]>([]);
  const [vegas, setVegas] = useState<number[]>([]);

  const wsRef = useWS("ws://localhost:8080/ws", (msg) => {
    if (msg.type === "bs_result") {
      setResult(msg.result);
      setSpots(msg.spots || []);
      setPrices(msg.prices || []);
      setPayoffs(msg.payoffs || []);
      setDeltas(msg.deltas || []);
      setGammas(msg.gammas || []);
      setVegas(msg.vegas || []);
    }
  });

  // Envoi automatique des paramètres quand ils changent
  useEffect(() => {
    const timer = setTimeout(() => {
      const ws = wsRef.current?.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ spot, strike, vol, rate, tau, optionType })
        );
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [spot, strike, vol, rate, tau, optionType]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Black-Scholes Pricer — live</h2>

      <Controls
        spot={spot}
        setSpot={setSpot}
        strike={strike}
        setStrike={setStrike}
        vol={vol}
        setVol={setVol}
        rate={rate}
        setRate={setRate}
        tau={tau}
        setTau={setTau}
        optionType={optionType}
        setOptionType={setOptionType}
      />

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 2 }}>
          <ChartDisplay
            spots={spots}
            prices={prices}
            payoffs={payoffs}
            delta={deltas}
            gamma={gammas}
            vega={vegas}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h3>Résultats</h3>
          {result ? (
            <ul>
              <li>Price: {result.price.toFixed(4)}</li>
              <li>Delta: {result.delta.toFixed(4)}</li>
              <li>Gamma: {result.gamma.toFixed(6)}</li>
              <li>Vega: {result.vega.toFixed(6)}</li>
              <li>Theta: {result.theta.toFixed(6)}</li>
            </ul>
          ) : (
            <div>En attente...</div>
          )}
        </div>
      </div>
    </div>
  );
}
