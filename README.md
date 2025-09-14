# 📈 Option Pricer — Black-Scholes (Go + React + MySQL): GO GO GO

Ce projet est une application complète permettant de **calculer et visualiser le prix d’options vanilles (call/put)** selon le modèle de **Black-Scholes**.  
Elle affiche également les **grecs (Delta, Gamma, Vega, Theta)** en temps réel.  
L’utilisateur peut modifier les paramètres (Spot, Strike, Volatilité, Taux, Maturité) et voir les courbes évoluer instantanément.

---

## ⚙️ Stack technique

- **Backend** : [Go](https://golang.org/)  
  - API WebSocket  
  - Calculs Black-Scholes + grecs  
  - Connexion à **MySQL** pour sauvegarder les résultats  

- **Frontend** : [React](https://react.dev/) + [Vite.js](https://vitejs.dev/)  
  - UI interactive  
  - Graphiques avec [Chart.js](https://www.chartjs.org/)  
  - Connexion WebSocket au backend  

- **Base de données** : MySQL  
  - Stockage des calculs (`bs_results`)  
  - Récupération des **valeurs par défaut** à la dernière mise à jour  

---

## 📂 Structure du projet
option-pricer/
│
├── backend/ # Code Go (serveur + WS + MySQL)
│ ├── main.go
│ ├── websocket.go
│ ├── db.go
│ └── blackscholes.go
│
├── frontend/ # Code React + Vite + TS
│ ├── src/
│ │ ├── App.tsx
│ │ ├── Controls.tsx
│ │ ├── ChartDisplay.tsx
│ │ └── useWS.ts
│ └── index.html
│
└── README.md # Documentation


---

## 🛠️ Installation

### 1️⃣ Backend (Go)

1. Aller dans le dossier backend :

```bash
cd backend

2. Initialiser et installer les dépendances :
go mod init option-pricer-backend
go get github.com/gorilla/websocket
go get github.com/go-sql-driver/mysql

3. Lancer le backend :
go run .

👉 Le backend écoute sur http://localhost:8080

### 2️⃣ Base de données MySQL

CREATE TABLE bs_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    spot DOUBLE,
    strike DOUBLE,
    rate DOUBLE,
    vol DOUBLE,
    tau DOUBLE,
    option_type VARCHAR(10),
    price DOUBLE,
    delta DOUBLE,
    gamma DOUBLE,
    vega DOUBLE,
    theta DOUBLE
);

3️⃣ Frontend (React + Vite)

1. Aller dans le dossier frontend :

cd frontend


2. Installer les dépendances :

npm install


3. Lancer le serveur de dev :

npm run dev

🚀 Utilisation

Lancer MySQL et s’assurer que la table bs_results existe.

Démarrer le backend Go :

cd backend
go run .


Démarrer le frontend React :

cd frontend
npm run dev


Ouvrir http://localhost:5173
 dans un navigateur.

👉 L’écran affichera automatiquement les dernières valeurs stockées en base.
👉 Toute modification d’un paramètre met à jour en temps réel les courbes et enregistre le calcul dans MySQL.

📊 Fonctionnalités

- Calcul Black-Scholes Call / Put

- Affichage du payoff à maturité

- Courbe du prix théorique en fonction du spot

- Courbes des grecs : Delta, Gamma, Vega, Theta

- Sauvegarde en base de données MySQL

- Chargement automatique des derniers paramètres au lancement

✅ Exemple

📌 TODO

- Ajouter l’affichage de plusieurs scénarios (volatilité, taux différents)

- Export des résultats vers CSV / Excel

- Intégration d’autres modèles de pricing (Binomial, Monte Carlo)

👨‍💻 Auteur

Projet développé par @AzipSauhabah

---





