# Programmier Aufgabe

Hallo zusammen,

vielen Dank für das angenehme und interessante Bewerbungsgespräch. Es hat mich sehr gefreut, erneut von Ihnen zu hören und die Gelegenheit zu bekommen, diese Programmieraufgabe zu bearbeiten. Ich habe das Projekt vollständig umgesetzt und möchte Ihnen hier eine kurze Übersicht geben.

Das Projekt ist nach dem **Client-Server-Modell** aufgebaut. Eine Alternative wäre das **MVC-Modell** gewesen. Allerdings erschien mir das nicht so sinnvoll, da das **Client-Server-Modell** es mir ermöglicht, React und TypeScript nahtlos zu integrieren um auch den vorgegebenen Techstack zu erfüllen. Im **Backend** habe ich **ASP.NET** verwendet, zusammen mit **Models** und **Controllern**, um die HTTP-Endpunkte zu erstellen und eine Verbindung zur **SQLite-Datenbank** herzustellen. Dabei kam das **Entity Framework** als ORM (Object-Relational Mapping) zum Einsatz. Ich habe mich für das Entity Framework entschieden, da es eine bewährte und weit verbreitete Lösung in ASP.NET ist und sich gut mit SQLite integrieren lässt. Es gibt Alternativen wie **Dapper** oder **Raw ADO.NET**, aber aufgrund der guten Integration und einfachen Handhabung fiel die Wahl auf das Entity Framework.

Für die **API-Dokumentation** habe ich **Swagger** verwendet, das Teil des OpenAPI-Spezifikationsprojekts ist. Swagger bietet zahlreiche Vorteile, darunter eine interaktive Oberfläche zum Testen der API-Endpunkte, was mir besonders gefallen hat, da es die Entwicklung und Überprüfung erheblich vereinfacht.

Für die **Authentifizierung** habe ich das **JWT (JSON Web Token)** in Verbindung mit dem **Bearer-Verfahren** implementiert. JWT lässt sich in **ASP.NET Core** sehr leicht integrieren, da es eine eingebaute Unterstützung für tokenbasierte Authentifizierung bietet, was eine skalierbare und sichere Lösung darstellt.

Das **Frontend** habe ich mit **React** und **TypeScript** entwickelt.

# Anleitung zum Starten des Projekts

**Projekt anschauen**  

Ich habe das Projekt auf Azure geladen und man es dort Testen.
Frontend: http://layer2aufgabeserver20240911164841.azurewebsites.net  
Backend-API: http://layer2aufgabeserver20240911164841.azurewebsites.net/swagger/index.html

**Projekt klonen**  
   Zuerst das Projekt von dem Repository klonen.

- Führen Sie dann die Layer2Aufgabe.Server.exe im Verzeichnis ./publish aus um das Backend und Frontend zu starten:
     ```
     ./publish/Layer2Aufgabe.Server.exe
     ```

Der Server läuft dann auf `https://localhost:7073/`.

Um das Frontend aufzurufen, reicht es, die Seite `https://localhost:7073/` zu öffnen. Wenn Sie die **API-Dokumentation** anschauen möchtet, können Sie diese unter `https://localhost:7073/swagger/index.html` öffnen.

Im Frontend gelangen Sie dann auf eine **Login Page**. Ich habe eine Benutzerverwaltung mit **Read**, **Write** und **Admin** Rechten implementiert. Diese drei Benutzer werden beim Programmstart automatisch erstellt. Mir ist bewusst, dass dies keine gängige Methode ist und ich dies in einem Produktionssystem nicht machen würde, aber hier dient es nur dem Test.

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

Um die **API** zu testen, muss man sich ebenfalls zuerst einloggen und einen Token erstellen. Nutze dazu die `POST /api/Auth/login` und geben Sie einfach einen der oben genannten Benutzer im **Request Body** ein. Dann können Sie den Token aus der Response kopieren auf den **Authorize** Button klicken und im Value Feld eingeben.


### Quellen:
https://learn.microsoft.com/en-us/aspnet/entity-framework
https://www.w3schools.com/react/default.asp
https://www.oreilly.com/library/view/c-in-a/0596001819/ch04s10.html
https://jwt.io/
https://swagger.io/specification/
https://www.telerik.com/blogs/asp-net-core-basics-authentication-authorization-jwt
https://chatgpt.com/
https://codewithmukesh.com/blog/aspnet-core-api-with-jwt-authentication/
https://www.youtube.com/
https://stackoverflow.com/
https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-8.0
https://gemini.google.com/app?hl=en
https://learn.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger?view=aspnetcore-8.0
https://learn.microsoft.com/en-us/ef/core/
https://identityserver4.readthedocs.io/en/latest/
https://www.typescriptlang.org/docs/handbook/intro.html
