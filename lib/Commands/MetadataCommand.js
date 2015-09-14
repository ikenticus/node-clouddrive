var Command = require('./Command');
var Promise = require('promise');
var Node = require('../Node');
var colors = require('colors');

var SyncCommand = new Command({
    offline: false
});

SyncCommand.run = function (remotePath, options) {
    var self = this;

    var searchFunction = Node.loadByPath;
    var notFound = "No node exists at path '" + remotePath + "'";
    if (options.id) {
        searchFunction = Node.loadById;
        notFound = "No node exists with ID '" + remotePath + "'";
    }

    return Promise.denodeify(Node.loadByPath)(remotePath)
        .then(function (node) {
            if (!node) {
                console.log(notFound.red);

                return 1;
            }

            console.log(node.getData());

            return 0;
        });
};

module.exports = SyncCommand;