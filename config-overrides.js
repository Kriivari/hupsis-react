const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const webpack = require('webpack'); 
module.exports = function override(config, env) { 
    const fallback = config.resolve.fallback || {}; 
    Object.assign(fallback, { 
	"crypto": require.resolve("crypto-browserify"),
	"stream": require.resolve("stream-browserify"),
    }) 
    config.resolve.fallback = fallback; 
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin))
    config.plugins = (config.plugins || []).concat([ 
   	new webpack.ProvidePlugin({ 
    	process: 'process/browser', 
        Buffer: ['buffer', 'Buffer'] 
      }) 
    ])
    config.module.rules.push({ test: /\.m?js/, resolve: { fullySpecified: false } })
    return config;
}

