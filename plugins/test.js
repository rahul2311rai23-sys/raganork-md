const { Module } = require("../main");

/* ---------------- TIME FORMAT ---------------- */
function TimeCalculator(a) {
  let b = Math.floor(a / 31536e3),
    c = Math.floor((a % 31536e3) / 2628e3),
    d = Math.floor(((a % 31536e3) % 2628e3) / 86400),
    e = Math.floor((a % 86400) / 3600),
    f = Math.floor((a % 3600) / 60),
    g = Math.floor(a % 60);

  return (
    (b ? b + " years, " : "") +
    (c ? c + " months, " : "") +
    (d ? d + " days, " : "") +
    (e ? e + " hours, " : "") +
    (f ? f + " minutes, " : "") +
    (g ? g + " seconds" : "")
  );
}

/* ---------------- AGE COMMAND ---------------- */
Module(
  {
    pattern: "age ?(.*)",
    desc: "Age calculator",
    use: "utility",
    fromMe: false
  },
  async (m, t) => {
    if (!t[1]) return m.sendReply("_Give DOB: dd/mm/yyyy_");

    if (
      !/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(t[1])
    )
      return m.sendReply("_Format must be dd/mm/yyyy_");

    let DOB = t[1];
    let actual = DOB.includes("-")
      ? DOB.split("-")[1] + "-" + DOB.split("-")[0] + "-" + DOB.split("-")[2]
      : DOB.split("/")[1] + "-" + DOB.split("/")[0] + "-" + DOB.split("/")[2];

    let dob = new Date(actual).getTime();
    let today = new Date().getTime();

    let age = (today - dob) / 1000;

    return m.sendReply("```" + TimeCalculator(age) + "```");
  }
);

/* ---------------- COUNTDOWN ---------------- */
Module(
  {
    pattern: "cntd ?(.*)",
    desc: "Countdown to date",
    use: "utility",
    fromMe: false
  },
  async (m, t) => {
    if (!t[1]) return m.sendReply("_Give future date_");

    let DOB = t[1];
    let actual = DOB.includes("-")
      ? DOB.split("-")[1] + "-" + DOB.split("-")[0] + "-" + DOB.split("-")[2]
      : DOB.split("/")[1] + "-" + DOB.split("/")[0] + "-" + DOB.split("/")[2];

    let dob = new Date(actual).getTime();
    let today = new Date().getTime();

    let diff = (dob - today) / 1000;

    return m.sendReply("_" + TimeCalculator(diff) + " remaining_");
  }
);

/* ---------------- PING ---------------- */
Module(
  {
    pattern: "ping",
    desc: "Check bot latency",
    use: "utility",
    fromMe: false
  },
  async (m) => {
    const start = Date.now();
    let msg = await m.sendReply("*Pinging...*");
    const end = Date.now();

    return m.edit(
      "*Latency:* " + (end - start) + " ms",
      m.jid,
      msg.key
    );
  }
);
