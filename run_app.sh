#!/bin/bash

function install_dotnet {
    echo ".NET SDK nicht gefunden. Installiere .NET SDK..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
        chmod +x dotnet-install.sh
        ./dotnet-install.sh --channel LTS 
        export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools
    elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ "$OSTYPE" == "win32"* ]]; then
        # Windows
        Invoke-WebRequest -Uri "https://dot.net/v1/dotnet-install.ps1" -OutFile "dotnet-install.ps1"
        powershell -ExecutionPolicy Bypass -File dotnet-install.ps1 -Channel LTS
        $env:PATH += ";$env:USERPROFILE\.dotnet;$env:USERPROFILE\.dotnet\tools"
    fi
    echo ".NET SDK wurde installiert."
}

function install_node {
    echo "Node.js nicht gefunden. Installiere Node.js..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ "$OSTYPE" == "win32"* ]]; then
        # Windows
        Invoke-WebRequest -Uri "https://nodejs.org/dist/v16.0.0/node-v16.0.0-x64.msi" -OutFile "nodejs-installer.msi"
        Start-Process -Wait -FilePath "msiexec.exe" -ArgumentList "/i nodejs-installer.msi /quiet /norestart"
    fi
    echo "Node.js und npm wurden installiert."
}

function check_dotnet {
    if ! command -v dotnet &> /dev/null; then
        install_dotnet
    else
        echo ".NET SDK ist bereits installiert."
    fi
}

function check_npm {
    if ! command -v npm &> /dev/null; then
        install_node
    else
        echo "npm (Node.js) ist bereits installiert."
    fi
}

check_dotnet
check_npm

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
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        kill -TERM -$API_PID
    elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ "$OSTYPE" == "win32"* ]]; then
        Stop-Process -Id $API_PID -Force
    fi

    echo "Beende React App (PID: $REACT_PID)..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        kill -TERM -$REACT_PID
    elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ "$OSTYPE" == "win32"* ]]; then
        Stop-Process -Id $REACT_PID -Force
    fi
}

trap cleanup EXIT

wait
