
const { expect } = require('chai');
const { parse, types } = require('../src/index.js');
const { string, boolean, array, number } = types;

const mapping = {
  google: {
    projectId: string(),
  },
  use: boolean(),
  redis: {
    cluster: {
      use: boolean(),
      hosts: array(2, {
        host: string(),
        port: number(),
      }),
    },
  },
  mongo: {
    host: string(),
    port: number(),
    db: string(),
    options: {
      readPreference: string(),
    },
  },
  un: {
    host: string(),
    port: number(),
  },
  darray: array(2, {
    dvalue: number(20),
    svalue: string(),
  }, [{
    dvalue: 22,
    svalue: 'one',
  }])
};

Object.assign(process.env, {
  MOE_GOOGLE_PROJECT_ID: 'quizizz-org',
  MOE_USE: 'false',
  MOE_MONGO_HOST: '127.0.0.1',
  MOE_MONGO_PORT: '27017',
  MOE_MONGO_DB: 'quizizz',
  MOE_MONGO_OPTIONS_READ_PREFERENCE: 'secondary',
  MOE_REDIS_CLUSTER_USE: 'true',
  'MOE_REDIS_CLUSTER_HOSTS[0]_HOST': '127.0.0.1',
  'MOE_REDIS_CLUSTER_HOSTS[0]_PORT': '6371',
  'MOE_REDIS_CLUSTER_HOSTS[1]_HOST': '127.0.0.2',
  'MOE_REDIS_CLUSTER_HOSTS[1]_PORT': '6372',
  'MOE_DARRAY[1]_DVALUE': '21',
});

describe('Types', () => {
  it('Will use default values', () => {
    const config = parse(mapping, {
      prefix: 'MOE',
    });
    expect(config).to.deep.equal({
      google: {
        projectId: 'quizizz-org',
      },
      use: false,
      redis: {
        cluster: {
          use: true,
          hosts: [{
            host: '127.0.0.1',
            port: 6371,
          }, {
            host: '127.0.0.2',
            port: 6372,
          }],
        },
      },
      mongo: {
        host: '127.0.0.1',
        port: 27017,
        db: 'quizizz',
        options: {
          readPreference: 'secondary',
        },
      },
      un: {
        host: null,
        port: null,
      },
      darray: [{
        dvalue: 22,
        svalue: 'one',
      }, {
        dvalue: 21,
        svalue: null,
      }],
    });
  });
});
