# scmd (Sales CoMmanD line tool)

Collection of small command lines tools within the sales domain.

Examples:

    scmd //lists available commands
    scmd ep mom-engine //prints endpoints for mom engine in bt1 
    scmd ep mom-engine -e nr //same but in nr
    echo mom-engine | scmd ep //pipes are supported

## Installation

Globally, to use from anywhere:

    npm install -g .

Run locally:

    npm install
    ./scmd.js dp mom-engine

### Why no yarn?

Currently npm seems to support global commands better:
https://github.com/yarnpkg/yarn/issues/3256

## Contribute

Please do!

We use https://github.com/tj/commander.js/ to handle command line sub commands, args et c.

In short:

1.  Add your command to `scmd.js`, e g `myCommand`
2.  Add a file with the corresponding name: `scmd-myCommand.js`
3.  Implement your functionality in `scmd-myCommand.js`
4.  Run your command from the cli:

        scmd myCommand

### Principles:

1. Print lines to stdout to make things chainable
2. Prefer "do one thing, do it well" style
3. The cli command (your `scmd-myCommand.js` file above) should call functions in the api module and then print to stdout. Api module functions should just return results, not print anything.

Before commiting, please do

        npm install //if you didn't before
        npm run prettier:check

to check for formatting issues and

        npm run prettier:format

if there are any issues.
