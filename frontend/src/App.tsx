import React, { useState, useEffect } from "react";
import Controls from "./components/Controls";
import ChartDisplay from "./components/ChartDisplay";
import useWS from "./useWS";

export default function App() {
  const [spot, setSpot] = useState(100);
  const [strike, setStrike] = useState(100);
  const [vol, setVol] = useState(0.2);
  const [rate, setRate] = useState(0.01);
  const [tau, setTau] = useState(1);
  const [optionType, setOptionType] = useState<"call" | "put">("call");

  const [result, setResult] = useState<any>(null);
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

  // Envoyer mise à jour à chaque changement de paramètre
  useEffect(() => {
    const timer = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ spot, strike, vol, rate, tau, optionType }));
      }
    }, 80); // debounce
    return () => clearTimeout(timer);
  }, [spot, strike, vol, rate, tau, optionType, wsRef]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Black-Scholes Pricer — live</h2>
      <Controls
        spot={spot} setSpot={setSpot}
        strike={strike} setStrike={setStrike}
        vol={vol} setVol={setVol}
        rate={rate} setRate={setRate}
        tau={tau} setTau={setTau}
        optionType={optionType} setOptionType={setOptionType}
      />
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <ChartDisplay spots={spots} prices={prices} payoffs={payoffs} deltas={deltas} gammas={gammas} vegas={vegas} />
        </div>
        <div style={{ width: 300 }}>
          <h3>Résultats</h3>
          {result ? (
            <ul>
              <li>Price: {result.price.toFixed(4)}</li>
              <li>Delta: {result.delta.toFixed(4)}</li>
              <li>Gamma: {result.gamma.toFixed(6)}</li>
              <li>Vega: {result.vega.toFixed(6)}</li>
              <li>Theta: {result.theta.toFixed(6)}</li>
            </ul>
          ) : <div>En attente...</div>}
        </div>
      </div>
    </div>
  );
}
