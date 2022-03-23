# Cloudflare Worker Demo

### Pre-requisites:

1. [nvm](https://github.com/nvm-sh/nvm)
2. [Node.js](https://nodejs.org/en/)
3. An example Cloudflare worker deployed.
4. [Ngrok](https://ngrok.com) or similar tunneling tool
5. Wrangler CLI

### How to run the code?

The project is setup to be executed with HTTPS domain to ensure real life scenario. There's a docker-compose.yaml
file which will run the `index.html` file behind nginx server on port `8081` on your local. You can change
the port to anything else if `8081` is occupied.

1. Run `nvm use` and then install dependencies using `npm i` or `yarn i` if that's your preference.
2. Start Frontend: `docker-compose -f build/docker-compose.yaml up -d` or Stop Frontend: `docker-compose -f build/docker-compose.yaml down`
3. Obtain the HTTPS domain for your local frontend using `ngrok http 8081`. Copy the HTTPS url shown on your screen.
4. Update the `frontendUrl` key in `util/config.js`. Also update the worker endpoint in this file to your worker.
5. Update the worker url in `index.html` to your URL.
6. Either run the index.js locally (`wrangler dev`) or publish it to your worker `wrangler publish`
7. Open the HTTPS url which you obtained from the ngrok screen and you should see project working.

## Improvements

- [] - Unit test
- [] - Environment variables for config

# 👷 `worker-template` Hello World

A template for kick starting a Cloudflare worker project.

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) is the content of the Workers script.

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
