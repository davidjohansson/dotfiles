#!/usr/bin/env node
const { program } = require("commander");
program.version("0.0.1");

program
  .description("Various useful stuff")
  .command("dash", "Shows the dashboard")
  .command("dp", "Info regarding deployments in all environments")
  .command("ep <service> [replacement]", "Print available endpoints for the provided service. If provided, 'replacement' will be replaced in the endpoint url for any path parameters (specified within {})")
  .command("err [service]", "Fetches errors from kibana")
  .command("cs [id]", "URL sales cheat sheet. Prints the entire cs if 'id' is not provided")
  .command("poid", "Prints a few productorder ids")
  .command("po <orderReference>", "Prints basic, non personalized, info about a product order")
  .command("da", "View deployments waiting in Deploy Assistant")
  .command("cf", "Create a confirmation.")
  .command("co <orderReference>", "Prints info about a checkout")
  .command("to", "Fetches a JWT access token")
  .command("kb [service] [loglevel]", "Opens nice kibana links in your browser")
  .command("poj <orderReference>", "Fetch product order for a reference. Not runnable in prod due to personal data")
  .command("pass", "Manages keychain passwords for scmd")
  .command("sw <service>", "Print swagger url for service")
  .command("ac", "Search accessories")
  .command("stats [service]", "Print some scmd debug info")
  .parse(process.argv);
