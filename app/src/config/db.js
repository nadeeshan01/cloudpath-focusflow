const mongoose = require('mongoose');
const dns = require('dns');

async function connectDatabase(uri) {
  try {
    if (process.env.DNS_SERVERS) {
      dns.setServers(process.env.DNS_SERVERS.split(','));
    } else {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch {
        // Ignore if setServers is not allowed
      }
    }

    if (typeof globalThis.crypto === 'undefined') {
      try {
        const nodeCrypto = require('crypto');
        globalThis.crypto = nodeCrypto.webcrypto || nodeCrypto;
      } catch {
        // Ignore if crypto is not available
      }
    }

    await mongoose.connect(uri);

    console.log(
      JSON.stringify({
        event: 'database_connected',
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'database_connection_failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    );

    process.exit(1);
  }
}

module.exports = {
  connectDatabase,
};
