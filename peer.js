const Hyperswarm = require("hyperswarm");
const Corestore = require("corestore");

// path to the store
const storePath = process.argv.slice(2)[0];
// names of cores to create or open
const coreNames = process.argv.slice(3);

// hardcored topic
const topic = Buffer.alloc(32).fill("my-topic");
const coreName = Buffer.alloc(32).fill("example-master-core");

const swarm = new Hyperswarm();
const store = new Corestore(storePath);
const masterCore = store.get({ key: coreName });

let peer;

swarm.on("connection", async (conn) => {
  console.log("we are connected!");
  await masterCore.ready();
  // const key = masterCore.key;
  const extension = masterCore.registerExtension("replicator", {
    encoding: "binary",
    onmessage: (msg, peer) => {
      console.log("new message from extension!");
      console.log("key:", msg.toString("hex"));
      store.get({ key: msg });
    },
  });

  masterCore.on("peer-add", (peer) => {
    coreNames.forEach(async (name) => {
      const core = store.get({ name });
      await core.ready();
      await core.append(Buffer.from(String(Math.random() * name.length)));
      const key = core.key;
      console.log(key.toString("hex"));
      extension.send(key, peer);
    });
  });
  store.replicate(conn);
});

swarm.join(topic);
