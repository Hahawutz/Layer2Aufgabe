#!/bin/bash

function install_dotnet {
    echo ".NET SDK nicht gefunden. Installiere .NET SDK..."
    wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
    chmod +x dotnet-install.sh
    ./dotnet-install.sh --channel LTS 
    export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools
    echo ".NET SDK wurde installiert."
}

function install_node {
    echo "Node.js nicht gefunden. Installiere Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -  
    sudo apt-get install -y nodejs
    echo "Node.js und npm wurden installiert."
}

if ! command -v dotnet &> /dev/null
then
    install_dotnet
else
    echo ".NET SDK ist bereits installiert."
fi

if ! command -v npm &> /dev/null
then
    install_node
else
    echo "npm (Node.js) ist bereits installiert."
fi

API_DIR="./layer2Aufgabe.Server"

REACT_DIR="./layer2aufgabe.client"

echo "Installiere Abhängigkeiten für ASP.NET Core Web API..."
cd "$API_DIR"
dotnet restore 

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
