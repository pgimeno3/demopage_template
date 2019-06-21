# numpy-loader

![npm-version](https://img.shields.io/npm/v/numpy-loader.svg)

A webpack loader for binary numpy .npy files


## Usage

Configure the loader in your `webpack.config.js` under `module` > `rules`, e.g. like this:

```js
{
  test: /\.(npy|npc)$/,
  exclude: /node_modules/,
  loader: 'numpy-loader',
  options: {
    outputPath: 'assets/data'
  }
}
```

You can specify an `outputPath` that will be used during compilation.

You can now load `.npy` files as `ndarray`s in your JS code simply by `require`ing them. There are two modes, for small and large npy files respectively:

### Small files

Load small `.npy` files directly from the webpack bundle using `embed=true`. These files will be base64 encoded and become a part of your webpack bundle.

```js
let npyarray = require("numpy-loader?embed=true!./data/array_uint8.npy");
console.log("Loaded array in JS directly from packed module: " + npyarray.constructor.name);
console.log(npyarray);
```

### Large files

You might not want to embed particularly large files in your webpack bundle. You can specify `embed=false` (or nothing; it's the default) to copy your `.npy` files to your output directory and load them as binary files from your server at runtime instead. Thus you need to use the `#load()` callback like this:

```js
const npyarray = require("numpy-loader?embed=false!./data/array_uint8.npy")

npyarray.load( (array) => {
  console.log("Loaded an .npy array in JS!");
  console.log(array);
})

```
