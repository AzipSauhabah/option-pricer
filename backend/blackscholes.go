package main

import (
	"math"
)

// CDF de la loi normale
func normCDF(x float64) float64 {
	return 0.5 * (1.0 + math.Erf(x/math.Sqrt2))
}

// PDF de la loi normale
func normPDF(x float64) float64 {
	return (1.0 / math.Sqrt(2*math.Pi)) * math.Exp(-0.5*x*x)
}

func blackScholes(p OptionParams) BSResult {
	S := p.Spot
	K := p.Strike
	r := p.Rate
	sigma := p.Vol
	T := p.Tau

	d1 := (math.Log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma * math.Sqrt(T))
	d2 := d1 - sigma*math.Sqrt(T)

	var price, delta float64
	if p.OptionType == "call" {
		price = S*normCDF(d1) - K*math.Exp(-r*T)*normCDF(d2)
		delta = normCDF(d1)
	} else {
		price = K*math.Exp(-r*T)*normCDF(-d2) - S*normCDF(-d1)
		delta = normCDF(d1) - 1
	}

	gamma := normPDF(d1) / (S * sigma * math.Sqrt(T))
	vega := S * normPDF(d1) * math.Sqrt(T)
	theta := -(S*normPDF(d1)*sigma)/(2*math.Sqrt(T)) - r*K*math.Exp(-r*T)*normCDF(d2)

	if p.OptionType == "put" {
		theta = -(S*normPDF(d1)*sigma)/(2*math.Sqrt(T)) + r*K*math.Exp(-r*T)*normCDF(-d2)
	}

	return BSResult{
		Price: price,
		Delta: delta,
		Gamma: gamma,
		Vega:  vega,
		Theta: theta,
	}
}
