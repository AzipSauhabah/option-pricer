import { useEffect, useRef } from "react";

export default function useWS(url: string, onMessage: (msg: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket ouvert");
      // Envoi initial pour éviter erreur EOF côté Go
      ws.send(
        JSON.stringify({
          spot: 100,
          strike: 100,
          vol: 0.2,
          rate: 0.01,
          tau: 1,
          optionType: "call",
        })
      );
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        console.log("Message reçu WS:", msg);
        onMessage(msg);
      } catch (err) {
        console.error("Erreur parsing WS", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("⚠️ WebSocket fermé");

    return () => ws.close();
  }, [url]);

  return wsRef;
}
