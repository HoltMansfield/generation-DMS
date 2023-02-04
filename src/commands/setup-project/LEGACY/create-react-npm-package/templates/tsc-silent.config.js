module.exports = {
  suppress: [
    {
      // src folder errors
      pathRegExp: '/src/.*',
      codes: [2605, 2769]
    },
    {
      // node_modules errors
      pathRegExp: '/node_modules/.*',
      codes: [2320, 2694, 2339, 2717, 2307, 1319]
    }
  ]
}
