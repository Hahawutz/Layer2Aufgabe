#!/bin/bash


API_DIR="./layer2Aufgabe.Server"


REACT_DIR="./layer2aufgabe.client"

# Installiere Abhängigkeiten für das ASP.NET Core Web API
echo "Installiere Abhängigkeiten für ASP.NET Core Web API..."
cd "$API_DIR"
dotnet restore  

# Start ASP.NET Core Web API
echo "Starte ASP.NET Core Web API..."
dotnet run &  
API_PID=$!    

echo "Installiere Abhängigkeiten für React App..."
cd "../$REACT_DIR"
npm install  


echo "Starte React App mit Vite..."
npm run dev & 
REACT_PID=$!  


function cleanup {
    echo "Beende ASP.NET Core Web API (PID: $API_PID)..."
    kill -TERM -$API_PID  
    echo "Beende React App (PID: $REACT_PID)..."
    kill -TERM -$REACT_PID  
}

trap cleanup EXIT

wait
