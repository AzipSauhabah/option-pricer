package main

import (
	"log"
	"math"
	"net/http"

	"github.com/gorilla/websocket"
)

type OptionParams struct {
	Spot       float64 `json:"spot"`
	Strike     float64 `json:"strike"`
	Vol        float64 `json:"vol"`
	Rate       float64 `json:"rate"`
	Tau        float64 `json:"tau"`
	OptionType string  `json:"optionType"`
}

type BSResult struct {
	Price float64 `json:"price"`
	Delta float64 `json:"delta"`
	Gamma float64 `json:"gamma"`
	Vega  float64 `json:"vega"`
	Theta float64 `json:"theta"`
}

type WSMessage struct {
	Type    string    `json:"type"`
	Result  BSResult  `json:"result"`
	Spots   []float64 `json:"spots"`
	Prices  []float64 `json:"prices"`
	Payoffs []float64 `json:"payoffs"`
	Deltas  []float64 `json:"deltas"`
	Gammas  []float64 `json:"gammas"`
	Vegas   []float64 `json:"vegas"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade error:", err)
		return
	}
	defer conn.Close()
	log.Println("ws client connected:", conn.RemoteAddr())

	for {
		var params OptionParams
		if err := conn.ReadJSON(&params); err != nil {
			log.Println("readjson error:", err)
			break
		}

		// Calcul Black-Scholes pour les paramètres reçus
		result := blackScholes(params)

		// Générer une grille plus fine pour tracer les graphes
		var spots, prices, payoffs, deltas, gammas, vegas []float64
		for s := params.Spot * 0.5; s <= params.Spot*1.5; s += 1.0 { // plage +/-50% autour du spot
			p := OptionParams{
				Spot:       s,
				Strike:     params.Strike,
				Vol:        params.Vol,
				Rate:       params.Rate,
				Tau:        params.Tau,
				OptionType: params.OptionType,
			}
			r := blackScholes(p)

			spots = append(spots, s)
			prices = append(prices, r.Price)
			deltas = append(deltas, r.Delta)
			gammas = append(gammas, r.Gamma)
			vegas = append(vegas, r.Vega)

			if params.OptionType == "call" {
				payoffs = append(payoffs, math.Max(s-p.Strike, 0))
			} else {
				payoffs = append(payoffs, math.Max(p.Strike-s, 0))
			}
		}

		// Préparer le message JSON pour le frontend
		msg := WSMessage{
			Type:    "bs_result",
			Result:  result,
			Spots:   spots,
			Prices:  prices,
			Payoffs: payoffs,
			Deltas:  deltas,
			Gammas:  gammas,
			Vegas:   vegas,
		}

		if err := conn.WriteJSON(msg); err != nil {
			log.Println("writejson error:", err)
			break
		}
	}
}
