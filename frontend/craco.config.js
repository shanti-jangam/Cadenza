module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "buffer": require.resolve("buffer/"),
          "stream": false,
          "util": false,
          "crypto": false,
          "process": false,
          "http": false,
          "https": false,
          "zlib": false,
        }
      }
    }
  }
}; 