var Command = require('./Command');
var Promise = require('promise');
var Node = require('../Node');
var colors = require('colors');
var elegantSpinner = require('elegant-spinner');
var logUpdate = require('log-update');

var frame = elegantSpinner();

var DownloadCommand = new Command({
    offline: false
});

DownloadCommand.run = function (remotePath, localPath, options) {
    var self = this;

    var searchFunction = Node.loadByPath;
    var notFound = "No node exists at path '" + remotePath + "'";
    if (options.id) {
        searchFunction = Node.loadById;
        notFound = "No node exists with ID '" + remotePath + "'";
    }

    return Promise.denodeify(self.account.authorize).call(self.account, null)
        .then(function (data) {
            if (data.success === true) {
                return Promise.denodeify(searchFunction)(remotePath)
                    .then(function (node) {
                        if (!node) {
                            console.log(notFound.red);

                            return 1;
                        }

                        Command.startSpinner("Downloading... ");

                        return Promise.denodeify(node.download).call(node, localPath)
                            .then(function (data) {
                                if (data.success) {
                                    Command.stopSpinner('Done');

                                    return 0;
                                }

                                Command.stopSpinner(data.data.message.red);

                                return 1;
                            });
                    });
            } else {
                console.log("Account not authorized with Amazon's Cloud Drive. Run `init` command first.".red);

                return 1;
            }
        });
};

module.exports = DownloadCommand;