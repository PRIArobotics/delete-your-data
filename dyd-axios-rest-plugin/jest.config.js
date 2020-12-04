module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    // consider all source directories
    '<rootDir>/{components,layouts,middleware,pages,plugins,server,store}/**/*.{vue,js}',
    // model files are declarative, their coverage doesn't tell us anything
    '!<rootDir>/server/models/**/*.model.js',
  ],
};
