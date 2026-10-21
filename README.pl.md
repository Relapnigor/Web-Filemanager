# Express Filemanager

*[🇬🇧 English version of README](README.md)*

Serwerowy menedżer plików zbudowany w Express i Handlebars. Udostępnia rejestrację i logowanie przez ciasteczka, przeglądanie lokalnego katalogu `upload`, wieloplikowe wysyłanie plików, tworzenie plików i folderów, zmianę nazw, usuwanie, pobieranie, podgląd oraz prostą edycję tekstu i obrazów.

## Funkcje

- Rejestracja i logowanie przechowywane w pamięci procesu serwera
- Przeglądanie plików i folderów zapisanych w `upload/`
- Wysyłanie wielu plików z obsługą kolizji nazw (`- kopia`)
- Tworzenie plików tekstowych na podstawie szablonów z `static/f_layouts/`
- Tworzenie folderów, zmiana nazw plików i folderów, usuwanie, pobieranie i podgląd obrazów
- Edytor tekstu z numerami linii, ustawieniami czcionki/koloru i zapisem
- Edytor obrazów z podglądem filtrów grayscale, invert i sepia
- Układy, partiale i helpery Handlebars do ikon typów plików
- Angielskie komentarze w kodzie źródłowym oraz polskie etykiety interfejsu zachowane z oryginalnego projektu

## Stack technologiczny

- Node.js i Express
- Express Handlebars
- Formidable do wieloczęściowego wysyłania plików
- Cookie Parser, Body Parser i middleware NoCache
- Zwykły JavaScript przeglądarkowy i CSS

## Struktura projektu

```
.
├── server.js                         # punkt startowy aplikacji i konfiguracja middleware
├── package.json                      # metadane npm i zależności uruchomieniowe
├── static/
│   ├── server/
│   │   ├── state.js                  # współdzielony stan pamięci i ścieżki plików
│   │   ├── helpers.js                # skanowanie, nazwy i dane widoków
│   │   ├── auth-routes.js            # trasy logowania, rejestracji i błędów
│   │   ├── file-routes.js            # trasy menedżera plików, uploadu i metadanych
│   │   └── editor-routes.js          # trasy edytora tekstu i obrazów
│   ├── scripts/                      # skrypty edytora i filtrów po stronie przeglądarki
│   ├── css/                          # style aplikacji
│   ├── f_layouts/                    # początkowa zawartość nowych plików
│   ├── icons/                        # ikony typów plików SVG
│   └── settings/settings.json        # zapisane ustawienia edytora
├── views/
│   ├── layouts/main.hbs              # wspólny układ HTML
│   ├── partials/dialog.hbs           # współużywany dialog menedżera plików
│   └── *.hbs                         # strony aplikacji
├── upload/                           # pliki użytkownika w czasie działania; pominięte w opisie
└── data.json                         # metadane projektu dla katalogu przykładów
```

## Uruchomienie lokalne

```bash
npm install
node server.js
```

Otwórz `http://localhost:3000` w przeglądarce. Najpierw zarejestruj użytkownika, a następnie zaloguj się, aby wejść do menedżera plików.

## Dane i przechowywanie

Konta użytkowników są przechowywane wyłącznie w pamięci i znikają po zatrzymaniu procesu. Wysłane pliki trafiają do `upload/`, a kopia dostępna dla przeglądarki jest umieszczana w `static/upload/` na potrzeby podglądu i pobierania. Katalogi `upload/` zawierają pliki testowe/runtime i celowo nie są opisywane pojedynczo.

## Uwagi

- Serwer nasłuchuje na porcie `3000`.
- Komentarze dodane do kodu JavaScript i widoków Handlebars są po angielsku.
