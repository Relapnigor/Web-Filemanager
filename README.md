# Express Filemanager

*[🇵🇱 Polska wersja README](README.pl.md)*

A server-rendered file manager built with Express and Handlebars. It provides cookie-based registration and login, browsing of the local `upload` directory, multi-file uploads, file and folder creation, rename and delete operations, downloads, previews, and lightweight text and image editing.

## Features

- Cookie-based login and registration held in memory while the server is running
- Browsing of files and folders stored in `upload/`
- Multi-file uploads with duplicate-name handling (`- kopia`)
- Creation of text files from extension-specific templates in `static/f_layouts/`
- Folder creation, folder/file rename, deletion, download, and image preview
- Text editor with line numbers, font/color settings, and save support
- Image editor with grayscale, invert, and sepia previews
- Handlebars layouts, partials, and helpers for file-type icons
- English source comments and Polish user interface labels inherited from the original project

## Tech stack

- Node.js and Express
- Express Handlebars
- Formidable for multipart file uploads
- Cookie Parser, Body Parser, and NoCache middleware
- Plain browser JavaScript and CSS

## Project structure

```
.
├── server.js                         # application entry point and middleware setup
├── package.json                      # npm metadata and runtime dependencies
├── static/
│   ├── server/
│   │   ├── state.js                  # shared in-memory state and filesystem paths
│   │   ├── helpers.js                # upload scanning, naming, and view-data helpers
│   │   ├── auth-routes.js            # login, registration, and error routes
│   │   ├── file-routes.js            # file-manager, upload, navigation, and metadata routes
│   │   └── editor-routes.js          # text and image editor routes
│   ├── scripts/                      # browser-side editor and filter scripts
│   ├── css/                          # application styles
│   ├── f_layouts/                    # starter contents for newly created files
│   ├── icons/                        # file-type SVG icons
│   └── settings/settings.json        # persisted editor settings
├── views/
│   ├── layouts/main.hbs              # shared HTML layout
│   ├── partials/dialog.hbs           # reusable file-manager dialog
│   └── *.hbs                         # application pages
└── upload/                           # runtime user files; excluded from this description
```

## Running locally

```bash
npm install
node server.js
```

Open `http://localhost:3000` in a browser. Register a user first, then log in to access the file manager.

## Data and storage

User accounts are stored only in memory and disappear when the process stops. Uploaded files are stored under `upload/`; a browser-facing copy is placed in `static/upload/` for previews and downloads. The `upload/` directories contain test/runtime files and are intentionally not documented individually.

## Notes

- The server listens on port `3000`.
- Comments added to the JavaScript and Handlebars source are in English.
