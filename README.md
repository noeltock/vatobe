# Vatobe

Mac app built using electron to remind of posture, [website](https://vatobe.io) here.

![screenshot](https://vatobe.io/img/fb_banner.png)

## Development

```bash
$ npm install
```

```bash
$ gulp
```

### Upgrading npm modules
```
npm i -g npm-check-updates
ncu -u
npm install
```

## Packaging

**Preparation**
- Update electron/modules
- Remove any distribution files from source folder (as it uses the single folder system)
- Run Standard:
```bash
$ standard
$ standard --fix
```

- Clean NPM modules:
```bash
$ yarn autoclean --force
```

**Build**

```bash
$ yarn build
```
