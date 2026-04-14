import __panic_manager from 'panic-manager';
import __events from 'events';
import __ip from 'ip';
import __fs from 'fs';
import __leveldown from 'leveldown';
import __encoding_down from 'encoding-down';
import __levelup from 'levelup';
import __index from '../../../index';
import __level from '../../../lib/level';
import __http from 'http';
import panic from 'panic-server';
import { fileURLToPath } from 'node:url';
import { dirname as __dirnameOf } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
const clients = panic.clients;
const manager = __panic_manager();
const opts    = { radisk: false, localStorage: false, file: false };

__events.EventEmitter.defaultMaxListeners = Infinity;

const config = {
  ip      : __ip.address(),
  port    : 8765,
  servers : 3,
  route   : {
    '/'          : __dirname + '/index.html',
    '/gun.js'    : __dirname + '/../../gun.js',
    '/jquery.js' : __dirname + '/../../examples/jquery.js'
  }
};

const srv = panic.server();
srv.on('request', (req, res) => {
  config.route[req.url] && __fs.createReadStream(config.route[req.url]).pipe(res);
}).listen(config.port);

manager.start({
  clients: Array(config.servers).fill().map((u,i) => ({
    type: 'node',
    port: config.port + i + 1,
  })),
  panic: `http://${config.ip}:${config.port}`
});

const servers = clients.filter('Node.js');
const server  = servers.pluck(1);
const alice   = servers.excluding(server).pluck(1);
const bob     = servers.excluding(server).excluding(alice).pluck(1);

describe('Make sure the leveldb storage engine works', function() {
  this.timeout(5 * 60 * 60 * 1000);

  it("servers have joined!", function() {
    return servers.atLeast(config.servers);
  });

  it("GUN started!", function() {
    return server.run(function(test) {
      test.async();
      const {config,opts} = test.props;

      const leveldown = __leveldown;
      const encode    = __encoding_down;
      const levelup   = __levelup;

      if (__fs.existsSync('./lvldata')) {
        console.error('Please delete previous data first!');
        return;
      }

      // Initialize leveldb
      // const level = global.level = levelup(leveldown('./lvldata'));
      const level = global.level = levelup(encode(leveldown('./lvldata'), { valueEncoding: 'json' }));

      // Load the libraries under test
      const Gun   = __index;
      const debug = __level;

      // // Add debug message
      // debug.on('create', () => console.log('LEVEL CREATE'));
      // debug.on('get'   , key => console.log('LEVEL GET', key));
      // debug.on('put'   , (key, value) => console.log('LEVEL PUT', key, value));
      // // debug.on('list', () => console.log('LEVEL LIST'));
      // debug.on('error' , err => console.log('LEVEL ERROR', err));

      // Track state (so we can wait on put, it's called late by radisk)
      global.state = 0;
      debug.on('put', () => global.state++);

      // Create server
      opts.web = __http.createServer(function(req, res) {
        res.end("Number five is alive!");
      });

      // Initialize gun & start server
      const gun = global.gun = Gun({ ...opts, level });
      opts.web.listen(config.port + 1, function() {
        test.done();
      });

    }, {config,opts});
  });

  it("Alice saves data", function() {
    return alice.run(function(test) {
      test.async();
      const {config,opts} = test.props;
      const Gun           = __index;

      // Start gun
      const gun = global.gun = Gun({
        ...opts,
        peers: 'http://'+ config.ip + ':' + (config.port + 1) + '/gun',
        lack : 1000 * 60 * 60,
      });

      // Save data
      // Timeout allows callbacks to fire before server read
      const ref = gun.get('asdf');
      ref.put({ hello: 'world' });
      setTimeout(() => {
        test.done();
      }, 1);
    }, {config,opts});
  });

  it('Server read data', function() {
    return server.run(function(test) {
      test.async();

      // Read data (triggers fetch from alice + write to disk)
      const ref = gun.get('asdf');
      ref.on(data => {
        if (data.hello !== 'world') {
          return test.fail('Invalid data returned');
        }
        ref.off();
        test.done();
      });

    });
  });

  it('Wait for server to store', function() {
    return server.run(function(test) {
      test.async();
      setTimeout(function awaitState() {
        if (global.state < 2) return setTimeout(awaitState, 50);
        test.done();
      }, 50);
    });
  });

  it('Close all original running nodes', function() {
    clients.pluck(2).run(function() {
      if (global.level) {
        global.level.close(function() {
          process.exit();
        });
      } else {
        process.exit();
      }
    });
  });

  it('Start bob', function() {
    return bob.run(function(test) {
      test.async();
      const {config,opts} = test.props;

      const leveldown = __leveldown;
      const encode    = __encoding_down;
      const levelup   = __levelup;

      // Initialize gun opts
      const level = global.level = levelup(encode(leveldown('./lvldata'), { valueEncoding: 'json' }));

      // Load the libraries under test
      const Gun   = __index;
      const debug = __level;

      // // Add debug messages
      // debug.on('get', key => console.log('LEVEL GET', key));
      // debug.on('put', (key, value) => console.log('LEVEL PUT', key, value));
      // // debug.on('list', () => console.log('LEVEL LIST'));
      // debug.on('error', err => console.log('LEVEL ERROR', err));

      // Create server
      opts.web = __http.createServer((req, res) => {
        res.end("Number five is alive!");
      });

      // Initialize gun & start server
      const gun = global.gun = Gun({ ...opts, level });
      opts.web.listen(config.port + 1, () => {
        test.done();
      });
    }, {config,opts});
  });

  it('Bob read', function() {
    return bob.run(function(test) {
      test.async();

      // Read data
      const ref = gun.get('asdf');
      ref.on(data => {
        if (data.hello !== 'world') {
          return test.fail('Invalid data returned');
        }
        ref.off();
        test.done();
      });

    });
  });

  it('Shutdown bob', function() {
    return clients.run(function() {
      process.exit()
    });
  });

  it("All finished!", function(done) {
    srv.close();
    done();
  });

});
