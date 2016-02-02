'use strict';

var couchbase = require("couchbase");

/**
 * Mass delete documents returned by a given query
 *
 * The example in the Couchbase docuementation does not work well when the
 * bucket contains millions of records to delete. The approach here is to
 * delete the records in batches of 1000.
 *
 * See http://blog.couchbase.com/mass-deleting-documents-by-compound-key-prefix-using-node-js
 * for more details.
 *
 * @param {Bucket} bucket Connected couchbase bucket
 * @param {ViewQuery} query Query with range already specified
 * @param {bool} verbose Whether or not to log results to console
 */
function massDelete(bucket, query, verbose) {
    if (verbose === undefined) {
        verbose = true;
    }

    query.limit(1000);

    infinite(function() {
        return deleteDocs(bucket, query, verbose);
    });
}

/**
 * Delete all records returned by a query
 *
 * @param {Bucket} bucket
 * @param {ViewQuery} query
 * @return {Promise}
 *
 * @private
 */
function deleteDocs(bucket, query, verbose) {
    return new Promise(function(resolve, reject) {

        bucket.query(query, function(error, results) {
            if(error) {
                bucket.disconnect();
                throw error;
            }

            if (results.length === 0) {
                bucket.disconnect();
                return resolve(false);
            }

            results.forEach(function(doc) {
                bucket.remove(doc.id, function(error, result) {
                    if(error) {

                        // ignore key not found errors
                        if (error.code !== couchbase.errors.keyNotFound) {
                            bucket.disconnect();
                            throw error;
                        }
                    }

                    if (verbose) {
                        console.log("Deleted " + doc.key);
                    }
                });
            });

            resolve(true);
        });
    })
}

/**
 * Call a function until told to stop
 *
 * Callback should return a promise. To stop the "loop", the promise should
 * be resolved with a value of `false`.
 *
 * @param {function} cb Callback to execute
 *
 * @private
 */
function infinite(cb) {
    cb
    .call()
    .then(function(shouldContinue) {

        if (shouldContinue) {

            // don't blow the stack
            setTimeout(function() {
                return infinite(cb, 1);
            });
        }
    });
}

module.exports = massDelete;
