# Vatobe

Mac app built using electron to remind of posture.

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
