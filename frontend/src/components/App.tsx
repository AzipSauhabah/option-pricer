import React, { useEffect, useRef, useState } from "react";
import Controls from "./components/Controls";
import ChartDisplay from "./components/ChartDisplay";

type WSMessage = {
  type: string;
  result?: any;
  spots?: number[];
  prices?: number[];
  payoffs?: number[];
};

function useWS(url: string, onMessage: (m:WSMessage)=>void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => console.log("ws open");
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      onMessage(data);
    };
    ws.onclose = ()=> console.log("ws closed");
    ws.onerror = (e) => console.error("ws error", e);
    return () => {
      ws.close();
    };
  }, [url]);
  return wsRef;
}

export default function App() {
  const [spot, setSpot] = useState(100);
  const [strike, setStrike] = useState(100);
  const [vol, setVol] = useState(0.2);
  const [rate, setRate] = useState(0.01);
  const [tau, setTau] = useState(0.5);
  const [optionType, setOptionType] = useState("call");
  const [spots, setSpots] = useState<number[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [payoffs, setPayoffs] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const wsRef = useWS("ws://localhost:8080/ws", (msg)=> {
    if (msg.type === "bs_result") {
      setResult(msg.result);
      setSpots(msg.spots || []);
      setPrices(msg.prices || []);
      setPayoffs(msg.payoffs || []);
    }
  });

  // send update when any parameter changes (debounce lightly)
  useEffect(() => {
    const timer = setTimeout(() => {
      const ws = wsRef.current?.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          spot, strike, vol, rate, tau, optionType
        }));
      }
    }, 80); // small debounce for smoother UX
    return () => clearTimeout(timer);
  }, [spot, strike, vol, rate, tau, optionType]);

  return (
    <div style={{padding:20}}>
      <h2>Black-Scholes Pricer — live</h2>
      <Controls
        spot={spot} setSpot={setSpot}
        strike={strike} setStrike={setStrike}
        vol={vol} setVol={setVol}
        rate={rate} setRate={setRate}
        tau={tau} setTau={setTau}
        optionType={optionType} setOptionType={setOptionType}
      />
      <div style={{display:"flex", gap:20, marginTop:20}}>
        <div style={{flex:1}}>
          <ChartDisplay spots={spots} prices={prices} payoffs={payoffs}/>
        </div>
        <div style={{width:300}}>
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
