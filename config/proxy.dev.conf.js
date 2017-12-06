const PROXY_CONFIG =
    [
        {
            'context': ['/services/api'],
            'target': {
                'host': '192.168.80.175',
                'protocol': 'https:',
                'port': 443
            },
            'secure': false,
            'changeOrigin': true
        },
        {
          'context': ['/services/atm-report'],
          'target': {
              'host': '192.168.80.175',
              'protocol': 'https:',
              'port': 443
          },
          'secure': false,
          'changeOrigin': true
        },
        {
            'context': ['/services/ws'],
            'target': {
                'host': '192.168.80.175',
                'protocol': 'wss:',
                'port': 443
            },
            'ws': true,
            'secure': false,
            'changeOrigin': true
        },
        {
          'context': ['/api/config/export'],
          'target': {
              'host': '192.168.80.175',
              'protocol': 'https:',
              'port': 443,
              'user':"admin",
              'password':"admin@atm"
          },
          'secure': false,
          'changeOrigin': true
        }
    ];
module.exports = PROXY_CONFIG;
