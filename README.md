## Vite + React + TS + Express

#### Vite+Express as a Single Dev Server

Vite is great and I've been using it since I found about it in 2021. However, there's been one aspect of the developer experience that's been lacking for me - interop between Vite and a node/express backend.

During development, Vite spins up its own dev-server which serves modules to the browser. If you spin up a separate backend API with node, you have two servers running during development. I much prefer the simplicity of a single server to serve the static assets _and_ handle all API requests. The purpose of this repo is to demonstrate how to combine both Vite's dev server and a node API into one server while retaining all the great HMR capabilities you get out of box from Vite.

Here's how I accomplished it:

### createServer

`createServer` is the underlying function that initializes Vite's dev server. The strategy here is to utilize this function to do all of Vite's bootstrapping and take control of the rest of the process as you see fit. This repo contains the file `viteDevServer.mts` which exports its own version of `createServer`. The majority of the code is derived from [Setting up the Dev Server](https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server). The main difference is that our version of `createServer` allows you to inject a function that accepts an `Express` instance. This is useful to do all the server-y things you'd like, such as applying middleware and setting up routing.

Here's an example of how it is used from our custom dev server at `./server/index.dev.mts`:

```typescript
import { init as initializer } from "./init.mjs";
import { createServer } from "../viteDevServer.mjs";

createServer({ port: 1337, initializer });
```

### Custom dev Script

Since we are wrapping Vite's `createServer` we cannot run `vite` directly; we need to run `./server/index.dev.mts` instead. To accomplish this I needed to include `nodemon` with `ts-node` and wound up with this command:

```bash
nodemon --watch './server' -e mts --exec 'ts-node-esm ./server/index.dev.mts'
```

This command is rather long so let me explain all of the components and _why_ they are needed.

- `--watch './server'`
  This tells nodemon to watch for changes in the `./server` dir which is where all server-related code should go. Watching this dir allows for automatic server reloads when you, for example, edit API routes and don't want to manually restart the server. It's basically HMR for the backend.

- `-e mts`
  This tells nodemon to also observe `.mts` files which it does not do by default.

- `--exec 'ts-node-esm ./server/index.dev.mts'`
  This tells nodemon exactly how to execute its node command which I needed to override due to my use of esm. I've set `"type": "module"` in `package.json` which requires `ts-node` to operate in `esm` mode.

From there I just made the entire script `dev`. And that's basically it.

---

### Commands

#### Development Server w/HMR

```bash
npm run dev
```

#### Building for Production

```bash
npm run build
```

---

### A Note on .mts

Using an `.mts` file extension instead of `.ts` made this setup better due to issues with how node understands esm. My IDE (vscode) is kind enough to infer how `.mts` files are related, and automatically names their imports to `.mjs`. This is important because they become `.mjs` files after TypeScript compilation are most easy to use with node when the import path is fully-formed.

---

### TODO

This project is more-or-less a hack and I'm not sure if the steps I took to accomplish this are proper, or if there is a better way. With any luck this will be a temporary solution that I can simplify, and package for reuse.
