# This repository is for educational purposes

This is a repository created for debugging Pterodactyl Panel and Wings.

I'm using this to figure out how Pterodactyl Panel and Wings works behind the scenes for an upcoming project.

No support will be given, neither is this a project.

"ptero-proxy" proxies Pterodactyl Panel, so you can see the requests and body. I had to manually change the "remote" variable on Wings config.yml to forward the requests to the proxy.

"wings-proxy" proxies Wings for the same reason as ptero-proxy.

"fake-wings" is a (wip) fake Wings instance, so I can see the response body the panel sends to Wings. You can add this as a "node", and it'll show online on the Nodes admin page.

**The proxies aren't perfect!**

## How to setup Wings proxy

Make sure the "remote" in config.yml points to the proxied panel, and add a node to the PROXIED WINGS instead of the real one to the panel.

Make sure to make the token and token_id the same value you use on the proxied panel.

For allocations, set them as an allocation the actual Wings can use.
