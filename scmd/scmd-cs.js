const open = require("open");
const { program } = require("commander");

program.parse();

const urlEntryList = [
  {
    id: "1",
    name: "spring-admin-svc (SAS)",
    url: "https://sales-k8s-support.tre.se/sas/",
  },
  {
    id: "2",
    name: "deploy-assistant",
    url: "https://sales-k8s-support.tre.se/deployassistant/swagger-ui.html",
  },
  {
    id: "3",
    name: "treshop-dk",
    url: "https://sales-k8s.bt1.tre.se/bff-treshop-dk/swagger-ui.html",
  },
  {
    id: "4",
    name: "bff-elgiganten-se",
    url: "https://sales-k8s.bt1.tre.se/bff-elgiganten-se/swagger-ui.html",
  },
  {
    id: "5",
    name: "cart",
    url: "https://sales-k8s.bt1.tre.se/cart/swagger-ui.html",
  },
  {
    id: "6",
    name: "confirmation",
    url: "https://sales-k8s.bt1.tre.se/confirmation/swagger-ui.html",
  },
];

if (program.args.length === 0) {
  urlEntryList.forEach((entry) =>
    console.log(`[${entry.id}] - ${entry.name} - ${entry.url}`)
  );
} else {
  const urlEntry = urlEntryList.filter(
    (entry) => entry.id === program.args[0]
  )[0];
  open(urlEntry.url);
}
