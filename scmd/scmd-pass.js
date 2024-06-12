const co = require("co");
const prompt = require("co-prompt");
const {program} = require("commander");
let keychain = require('keychain');
const {init} = require("./utils");

program.option("-s, --set", "Set password in keychain")
program.option("-g, --get", "Get password from keychain")
program.option("-d, --delete", "Delete password in keychain")

co(function* () {
    program.parse();
    if (program.opts().set) {
        const username = yield prompt("username: ");
        const password = yield prompt.password("password: ");
        keychain.setPassword({account: username, service: 'scmd', password: password}, function (err) {
        });
        console.log("Password set successfully");
    } else if (program.opts().get) {
        const username = yield prompt("username: ");
        keychain.getPassword({account: username, service: 'scmd'}, yield Promise.resolve(function (err, pass) {
            console.log('Password is', pass);
            process.exit(0);
        }));
    } else if (program.opts().delete) {
        const username = yield prompt("username: ");
        keychain.deletePassword({account: username, service: 'scmd'}, function (err) {
            console.log("Password deleted successfully");
            process.exit(0);
        });
    } else {
        console.log("No option supplied, use --set, --get or --delete");
    }
}).then((e) => {
});
