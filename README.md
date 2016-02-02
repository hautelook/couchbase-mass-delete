# Couchbase Mass Delete

Scalable way to mass delete Couchbase documents returned by a given query.

## Example

```javascript
var couchbase = require("couchbase");
var massDelete = require("couchbase-mass-delete");

var url = "http://couchbase.example.com:8091";
var bucketName = "default";
var designDoc = "docs";
var view = "by_id";

var cluster = new couchbase.Cluster(url);

var bucket = cluster.openBucket(bucketName);

var ViewQuery = couchbase.ViewQuery;
var query = ViewQuery.from(designDoc, view);

// find all 26 character sessions stored in couchbase that start with "sf2_".
query.range("sf2_", "sf2_zzzzzzzzzzzzzzzzzzzzzzzzzz", true);
```

From the command line run:

```bash
$ npm install couchbase-mass-delete
$ npm start
```

## License

Licensed under either of
 * Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any
additional terms or conditions.
