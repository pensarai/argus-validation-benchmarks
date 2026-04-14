module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@app/shared-types': '../shared-types/src',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    ],
  ],
};
