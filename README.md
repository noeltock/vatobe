# Vatobe

Mac app built using electron to remind of posture.

![screenshot](https://vatobe.io/img/fb_banner.png)

## Development

```bash
$ gulp
```

## Packaging

**Preparation**
- Update electron/modules
- Remove any distribution files from source folder
- Run Standard:
```bash
$ standard
$ standard --fix
```
- Clean NPM modules:
```bash
$ yarn clean
```

**Building**

```bash
$ yarn build
```
