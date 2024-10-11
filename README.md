# Restreamer-UI Fitur Tambahan

![SS Utama](https://github.com/user-attachments/assets/7ffbbb7c-e69a-40de-ba39-64c8ed85ea37)
![SSyt](https://github.com/user-attachments/assets/625a933c-4fcd-4fee-9b32-d273c0068aba)


The user interface of the Restreamer for the connection to the [datarhei Core](https://github.com/datarhei/core)application.

- React
- Material-UI (MUI)

## Development

### For the Restreamer interface:

```
$ git clone https://github.com/alfaputra27/RestreamerUi.git
$ cd restreamer-ui
$ yarn install
$ npm run start
```

Connect the UI with a [datarhei Core](https://github.com/datarhei/core):
http://localhost:3000?address=http://core-ip:core-port

### To add/fix translations:
Locales are located in `src/locals`
```
$ npm run i18n-extract:clean
$ npm run i18n-compile
```

## License
See the [LICENSE](./LICENSE) file for licensing information.
