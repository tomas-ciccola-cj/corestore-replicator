const Hyperswarm = require("hyperswarm");
const Corestore = require("corestore");

// path to the store
const storePath = process.argv.slice(2)[0];
// names of cores to create or open
const coreNames = process.argv.slice(3);
// hardcored topic
const topic = Buffer.alloc(32).fill("my-topic");

const swarm = new Hyperswarm();
const store = new Corestore(storePath);

swarm.on("connection", (conn) => {
  console.log("we are connected!");

  coreNames.forEach(async (name) => {
    const core = store.get({ name });
    await core.ready();
    const key = core.key;
    await core.append(Buffer.from(Math.random() * name.length));
    conn.write(key);
  });

  conn.on("data", (d) => {
    console.log("new key from peer!");
    console.log(d.toString("hex"));
    store.get({ key: d });
  });

  // replicate store from peer
  // this breaks because we are replicating the store and sharing keys via the same socket
  // store.replicate(conn);
});

swarm.join(topic);
