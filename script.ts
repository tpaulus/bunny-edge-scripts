import * as BunnySDK from "@bunny.net/edgescript-sdk";
import {
  createBunnyDdnsHandler,
  readBunnyDdnsConfigFromEnv,
} from "@zimme/bunny-ddns-edge-script";

const config = readBunnyDdnsConfigFromEnv({
  get(name: string) {
    return Deno.env.get(name);
  },
});

const handler = createBunnyDdnsHandler({ config });

BunnySDK.net.http.serve(handler);
