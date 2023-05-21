# This repository is for educational purposes

This is a repository created for debugging Pterodactyl Panel and Wings.

I'm using this to figure out how Pterodactyl Panel and Wings works behind the scenes for an upcoming project.

No support will be given, neither is this a project.

"fake-ptero" proxies Pterodactyl Panel, so you can see the requests and body. I had to manually change the "remote" variable on Wings config.yml to forward the requests to the proxy.

"fake-wings" is a (wip) fake Wings instance, so I can see the response body the panel sends to Wings. You can add this as a "node", and it'll show online on the Nodes admin page.
