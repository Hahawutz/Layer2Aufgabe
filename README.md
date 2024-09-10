
# Programmier Aufgabe

Hallo zusammen,

vielen Dank für das angenehme und interessante Bewerbungsgespräch. Es hat mich sehr gefreut, erneut von Ihnen zu hören und die Gelegenheit zu bekommen, diese Programmieraufgabe zu bearbeiten. Ich habe das Projekt vollständig umgesetzt und möchte Ihnen hier eine kurze Übersicht geben.

Das Projekt ist nach dem **Client-Server-Modell** aufgebaut. Im **Backend** habe ich **ASP.NET** verwendet, zusammen mit **Models** und **Controllern**, um die HTTP-Endpunkte zu erstellen und eine Verbindung zur **SQLite-Datenbank** herzustellen. Dabei kam das **Entity Framework** als ORM (Object-Relational Mapping) zum Einsatz. Ich habe mich für das Entity Framework entschieden, da es eine bewährte und weit verbreitete Lösung in ASP.NET ist und sich gut mit SQLite integrieren lässt. Es gibt Alternativen wie **Dapper** oder **Raw ADO.NET**, aber aufgrund der guten Integration und einfachen Handhabung fiel die Wahl auf das Entity Framework.

Für die **API-Dokumentation** habe ich **Swagger** verwendet, das Teil des OpenAPI-Spezifikationsprojekts ist. Swagger bietet zahlreiche Vorteile, darunter eine interaktive Oberfläche zum Testen der API-Endpunkte, was mir besonders gefallen hat, da es die Entwicklung und Überprüfung erheblich vereinfacht.

Für die **Authentifizierung** habe ich das **JWT (JSON Web Token)** in Verbindung mit dem **Bearer-Verfahren** implementiert. JWT lässt sich in **ASP.NET Core** sehr leicht integrieren, da es eine eingebaute Unterstützung für tokenbasierte Authentifizierung bietet, was eine skalierbare und sichere Lösung darstellt.

Das **Frontend** habe ich mit **React** und **TypeScript** entwickelt.

# Anleitung zum Starten des Projekts

1. **Projekt klonen**  
   Zuerst das Projekt von dem Repository klonen.

2. **Projekt mit `run_app.sh` starten**  
   Nach dem Klonen kann das Projekt durch Ausführen des Skripts `run_app.sh` gestartet werden.  
   > Hinweis: Beim ersten Start kann es etwas länger dauern, da möglicherweise Abhängigkeiten installiert werden müssen. Wenn es überhaupt nicht lädt dann bitte schließen und nochmal Ausführen.

3. **Alternativ über das Terminal starten**

   **Backend starten:**
   - Navigiere im Terminal zum Backend-Verzeichnis:
     ```bash
     cd ./Layer2Aufgabe/Layer2Aufgabe.Server
     ```
   - Starte das Backend:
     ```bash
     dotnet run
     ```
   > Falls Abhängigkeiten fehlen, installiere diese vor dem Start.

   **Frontend starten:**
   - Navigiere im Terminal zum Frontend-Verzeichnis:
     ```bash
     cd ./Layer2Aufgabe/Layer2Aufgabe.Client
     ```
   - Starte das Frontend:
     ```bash
     npm run dev
     ```
   > Falls Abhängigkeiten fehlen, installiere sie mit:
     ```bash
     npm install
     ```

Der Backend-Server läuft dann auf `https://localhost:7073/` und das Frontend auf `https://localhost:5173/`.

Um das Frontend aufzurufen, reicht es, die Seite `https://localhost:5173/` zu öffnen. Wenn ihr euch die **API-Dokumentation** anschauen möchtet, könnt ihr `https://localhost:7073/swagger/index.html` öffnen.

Im Frontend gelangt ihr dann auf eine **Login Page**. Ich habe eine Benutzerverwaltung mit **Read**, **Write** und **Admin** Rechten implementiert. Diese drei Benutzer werden beim Programmstart automatisch erstellt. Mir ist bewusst, dass dies keine gängige Methode ist und ich dies in einem Produktionssystem nicht machen würde, aber hier dient es nur dem Test.

### Einlog-Daten:

**Admin (Darf alles):**
- Benutzername: `Admin`
- Passwort: `Admin@123`

**Read (Darf nur lesen):**
- Benutzername: `Read`
- Passwort: `Read@123`

**Write (Darf lesen und schreiben):**
- Benutzername: `Write`
- Passwort: `Write@123`

Um die **API** zu testen, muss man sich ebenfalls zuerst einloggen und einen Token erstellen. Nutze dazu die `POST /api/Auth/login` und gib einfach einen der oben genannten Benutzer im **Request Body** ein. Dann den Token aus der Response kopieren auf **Authorize** Button klicken und dann im Value Feld eingeben.

