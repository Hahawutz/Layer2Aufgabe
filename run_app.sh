#!/bin/bash

# Pfad zu deinem ASP.NET Core Web API
API_DIR="./layer2Aufgabe.Server"

# Pfad zu deiner React-App (Vite)
REACT_DIR="./layer2aufgabe.client"

# Start ASP.NET Core Web API
echo "Starte ASP.NET Core Web API..."
cd "$API_DIR"
dotnet run &  # Startet ASP.NET Core im Hintergrund
API_PID=$!    # Speichert die Prozess-ID von dotnet run

# Starte React App mit Vite
echo "Starte React App mit Vite..."
cd "../$REACT_DIR"
npm run dev &  # Startet Vite im Hintergrund
REACT_PID=$!   # Speichert die Prozess-ID von npm run dev

# Funktion zum Beenden der Prozesse
function cleanup {
    echo "Beende ASP.NET Core Web API (PID: $API_PID)..."
    kill -TERM -$API_PID  # Beendet den ASP.NET Core Prozess und seine Subprozesse
    echo "Beende React App (PID: $REACT_PID)..."
    kill -TERM -$REACT_PID  # Beendet den Vite/React Prozess und seine Subprozesse
}

# Wenn das Skript ein Signal (z. B. SIGINT durch Strg+C) erhält, wird cleanup aufgerufen
trap cleanup EXIT

# Warte auf beide Prozesse
wait
