module.exports = {
  // default applies to all environments
  default: {
    enabled: true,
    available_providers: ['ipfs'],
    ipfs_bin: 'ipfs',
    provider: 'ipfs',
    versions: {
      'ipfs-api': '18.2.0'
    }
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      {
        provider: 'ipfs',
        host: 'localhost',
        port: 5001,
        getUrl: 'http://localhost:8080/ipfs/'
      }
    ]
  },

  // merges with the settings in default
  // used with 'embark run privatenet'
  privatenet: {
  },

  // merges with the settings in default
  // used with 'embark run testnet'
  testnet: {
    dappConnection: [
      {
        provider: 'ipfs',
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        getUrl: 'https://ipfs.infura.io/ipfs/'
      }
    ]
  },

  // merges with the settings in default
  // used with 'embark run livenet'
  livenet: {
    dappConnection: [
      {
        provider: 'ipfs',
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        getUrl: 'https://ipfs.infura.io/ipfs/'
      }
    ]
  }

  // you can name an environment with specific settings and then specify with
  // 'embark run custom_name'
  // ,custom_name: {
  // }
};
