# Project Structure

We scaffolded this project by [vue-webpack-boilerplate](https://github.com/vuejs-templates/webpack) and revised the structure to fit our demand. However, the original [documentation](http://vuejs-templates.github.io/webpack/) is still helpful to understanding the project structure. We suggests that check it out if you want to contribute this project.


``` bash
.
├── build/                           # Build scripts and webpack config files
├── config/                          # Project configures
├── credential/                      # Crendential API url (request to us if you need)
├── desktop/                         # Electron files
├── dist/                            # Packed files (prepared to deploy to server)
├── docs/                            # Documentation files
├── release/                         # Bundled desktop app files
├── src/                             # Source files
│   ├── assets/                      # Module assets
│   ├── components/                  # Vue UI components
│   ├── sass/                        # Global style files
│   ├── store/                       # Vuex stores
│   ├── util/                        # Global utilities
│   ├── App.vue                      # Main app component
│   ├── main-library-desktop.js      # Main entry for desktop app
│   ├── main-external-client.js      # Main entry for client out of library
│   └── seat-config.json             # Seats properties on the map
├── server/                          # Server related files
├── seatConfigGenerator/             # Seats properties generator
├── static/                          # Static assets (without processing by webpack)
├── test/                            # Automated tests (under constructed)
├── index.html                       # index.html template
└── package.json                     # build scripts and dependencies
```

### `build/`

### `credential/`

### `desktop/`

### `release/`

### `src/`

### `server/`

