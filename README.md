# Bunny Edge Scripts

This repository deploys the
[`@zimme/bunny-ddns-edge-script`](https://github.com/zimme/bunny-edge-scripts/tree/cefcba3e7a4d01d610b2261163f3dc587bb3315d/packages/bunny-ddns-edge-script)
handler as a standalone Bunny Edge Script. The router receives only a narrowly
scoped HTTP Basic Auth credential; the Bunny DNS API key stays in Bunny
Environment Secrets.

## Required Bunny configuration

Create the following values in **Edge Platform > Scripting > Env
Configuration**. Never commit their values to this repository.

| Kind | Name | Description |
| --- | --- | --- |
| Secret | `BUNNY_API_KEY` | API key authorized to update the target DNS record |
| Secret | `DDNS_SHARED_SECRET` | Long, unique password for the DDNS client |
| Variable | `DDNS_USERNAME` | HTTP Basic Auth username, for example `opnsense-ddns` |
| Variable | `DDNS_ALLOWED_HOSTS` | Exact allowed FQDN, for example `home.example.com` |
| Variable | `DDNS_AUTO_CREATE` | `false`, to prevent unplanned record creation |

Enable **Run script before cache** for the script or its Pull Zone. The update
endpoint must run for every request.

## OPNsense

Configure **Services > Dynamic DNS** with the `ddclient` backend:

| Field | Value |
| --- | --- |
| Service | `Custom` |
| Protocol | `Custom GET` |
| Server | `https://YOUR-SCRIPT-URL/nic/update?hostname=__HOSTNAME__&myip=__MYIP__` |
| Username | Value of `DDNS_USERNAME` |
| Password | Value of `DDNS_SHARED_SECRET` |
| Hostname(s) | Value of `DDNS_ALLOWED_HOSTS` |
| Check IP method | `ipify-ipv4` |
| Force SSL | Enabled |

The endpoint returns DynDNS-compatible responses such as `good`, `badauth`,
and `badip`.

The package source is pinned by Git commit in `deno.json`. Upgrade it
deliberately after reviewing the upstream changes and updating that pin.

## Development

```sh
deno task check
deno task build
```

The deployment artifact is written to `generated/script.ts`. Configure Bunny
GitHub integration with:

```text
Install command: deno install --frozen
Build command:   deno task build
Entry file:      generated/script.ts
```