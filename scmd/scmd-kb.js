const open = require("open");

const {program} = require("commander");
const {init, getEnvironment, getEnvOptionDesc, specialEnvs} = require(
    "./utils");

const allowedEnvs = [getEnvironment('bt1'), getEnvironment('nr'),
  getEnvironment('prod')]

program.option("-e, --environment <environment>", getEnvOptionDesc(allowedEnvs),
    "bt1")
program.option("-d, --debug",
    "Output to commandline rather than opening in browser")
program.option("-l, --level <level>", "Log level, default is 'ERROR'", "ERROR")
program.option("-m, --message <message>", "Message")

init(program, (environment, args) => {
  const service = args[0];
  const level = program.opts().level;
  const message = program.opts().message;

  const queryUrlSegment = `${service != null ? `kubernetes.labels.app:%20%22${service}%22%20AND%20` : ''}${message != null ? `logevent.message:%20%22${encodeURIComponent(message)}%22%20AND%20` : ''}logevent.level:%20%22${level}%22`

  const env = getEnvironment(environment)
  const host = specialEnvs.kibana.url[env.shortName];
  const index = specialEnvs.kibana.index[env.shortName];
  const url = `${host}/s/sales/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-24h,to:now))&_a=(columns:!(kubernetes.labels.app,logevent.level,logevent.message),filters:!(),index:${index},interval:auto,query:(language:kuery,query:'${queryUrlSegment}'),sort:!(!('@timestamp',desc)))`

  if (program.opts().debug) {
    console.log({
      service,
      level,
      message,
      url,

    })
  } else {
    open(url);
  }

}, allowedEnvs);

