/**
 * Copyright 2020 The Magma Authors.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @flow
 * @format
 */

const jsonServer = require('json-server');
const https = require('https');
const fs = require('fs');

const certFile = process.env.API_CERT_FILENAME ?? '.cache/mock_server.cert';
const keyFile =
  process.env.API_PRIVATE_KEY_FILENAME ?? '.cache/mock_server.key';

const server = jsonServer.create();
const router = jsonServer.router('./mock/db.json');
const middlewares = jsonServer.defaults();
server.use(middlewares);

const buffer = fs.readFileSync('./mock/db.json', 'utf-8');
const db = JSON.parse(buffer);

// Add feg and feg_lte handlers
server.post('/magma/v1/feg', (req, res) => {
  if (req.method === 'POST') {
    res.status(200).jsonp('Success');
  }
});

server.post('/magma/v1/feg_lte', (req, res) => {
  if (req.method === 'POST') {
    res.status(200).jsonp('Success');
  }
});
server.post('/magma/v1/networks/test_feg_network2/tiers', (req, res) => {
  if (req.method === 'POST') {
    res.status(200).jsonp('Success');
  }
});
server.post('/magma/v1/networks/test_feg_lte_network2/tiers', (req, res) => {
  if (req.method === 'POST') {
    res.status(200).jsonp('Success');
  }
});

server.put('/magma/v1/feg_lte/test_feg_lte_network', (req, res) => {
  if (req.method === 'PUT') {
    res.status(200).jsonp('Success');
  }
});

server.get('/magma/v1/feg_lte/test_feg_lte_network', (req, res) => {
  if (req.method === 'GET') {
    res.status(200).jsonp(db['networksFull']['test_feg_lte_network']);
  }
});

server.get('/magma/v1/lte/test', (req, res) => {
  if (req.method === 'GET') {
    res.status(200).jsonp(db['networksFull']['test']);
  }
});
const networks = ['test', 'test_feg_lte_network'];
networks.forEach(network => {
  server.get(`/magma/v1/networks/${network}/gateways`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(db['networksFull'][network]['gateways']);
    }
  });

  server.get(`/magma/v1/networks/${network}/type`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(db['networksFull'][network]['type']);
    }
  });

  server.get(`/magma/v1/lte/${network}/gateways`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(db['lte']['gateways']);
    }
  });

  server.get(`/magma/v1/feg_lte/${network}/gateways`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(db['feg_lte']['gateways']);
    }
  });

  server.get(
    `/magma/v1/networks/${network}/prometheus/query_range`,
    (req, res) => {
      if (req.method === 'GET') {
        res.status(200).jsonp({
          status: 'success',
          data: {
            resultType: 'vector',
            result: [],
          },
        });
      }
    },
  );

  server.get(`/magma/v1/networks/${network}/prometheus/query`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp({
        status: 'success',
        data: {
          resultType: 'vector',
          result: [],
        },
      });
    }
  });
  server.get(`/magma/v1/networks/${network}/policies/rules`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(db['policies']);
    }
  });

  server.get(`/magma/v1/networks/${network}/apns`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(db['apns']);
    }
  });
  server.get(`/magma/v1/events/${network}/about/count`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(0);
    }
  });
  server.get(`/magma/v1/events/${network}`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp([]);
    }
  });
  server.get(`/magma/v1/lte/${network}/enodebs`, (req, res) => {
    if (req.method === 'GET') {
      res.status(200).jsonp(db['lte']['enodebs']);
    }
  });
  server.get(
    `/magma/v1/lte/{network}/enodebs/12020000051696P0013/state`,
    (req, res) => {
      if (req.method === 'GET') {
        res.status(200).jsonp(db['lte']['enodebState']['12020000051696P0013']);
      }
    },
  );
});

server.use('/magma/v1', router);

https
  .createServer(
    {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile),
    },
    server,
  )
  .listen(3001, '0.0.0.0', () => {
    console.log('Go to https://localhost:3001/');
  });