# adjust-md-for-publish

> This is a tool to adjust markdown document for publishing npm package, such as removing some section out from the destination document

## Usage

```js
const adjustMD = require('adjust-md-for-publish');

adjustMD({
  filename: 'README.md',
  destname: 'dist/README.md',
  filterSection: ['CHANGELOG', 'References']
});
```

The above code runs in the simulation that `README.md` needs to be copied to the dist directory for publishing npm package and some chapters (example means *CHANGELOG* and *References*) needs to be removed out. The result is as follows.

original README.md content:

```
# Title

> This is description

## Section 1

xxxxxxxxxxxxxxxx

## CHANGELOG

changelog link here

## References

1. reference link 1
1. reference link 2

## License

MIT
```

adjust README.md content:

```
# Title

> This is description

## Section 1

xxxxxxxxxxxxxxxx

## License

MIT
```

## CHANGELOG

[Change log](./CHANGELOG.md)

## License

MIT