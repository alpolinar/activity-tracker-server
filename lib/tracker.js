window.addEventListener("load", function () {
  //localStorage.removeItem("attInfoCache");
  let userInfo = {};
  let debugActive = false;

  let formKeys = [
    {
      keys: { id: "first_name", name: "first_name" },
      handles: { type: "name", concat: " " },
    },
    {
      keys: { id: "last_name", name: "last_name" },
      handles: { type: "concat", concatFinish: true },
    },
    { keys: { id: "email", name: "email" }, handles: { type: "email" } },
    { keys: { id: "phone", name: "phone" }, handles: { type: "phone" } },
    {
      keys: {
        id: "Current_injury_Description__c",
        name: "Current_injury_Description__c",
      },
      handles: { type: "Description" },
    },
    { keys: { name: "first-name" }, handles: { type: "name" } },
    { keys: { name: "your-phone" }, handles: { type: "phone" } },
    { keys: { name: "your-email" }, handles: { type: "email" } },
    { keys: { name: "your-message" }, handles: { type: "Description" } },
  ];

  let forms = [];

  function translator() {
    let tempForms = [];
    let inputs = document.getElementsByTagName("input");
    let textareas = document.getElementsByTagName("textarea");

    let concatTemp = { next: [] };

    inputSearch: for (let input in inputs) {
      keySearch: for (let keys in formKeys) {
        for (let key in formKeys[keys].keys) {
          if (inputs[input][key] != formKeys[keys].keys[key])
            continue keySearch;
        }

        for (let form in tempForms) {
          if (tempForms[form].form == inputs[input].form) {
            switch (formKeys[keys].handles.type) {
              case "concat":
                concatTemp["next"].push(inputs[input]);

                if (formKeys[keys].handles.concatFinish) {
                  let concat = [];

                  concat.push(concatTemp.first);
                  if (concatTemp.next.length > 0)
                    concat.push({ value: concatTemp.delim, concat: true });

                  for (let piece in concatTemp.next) {
                    concat.push(concatTemp.next[piece]);
                    if (piece < concatTemp.next.length - 1)
                      concat.push({ value: concatTemp.delim, concat: true });
                  }

                  tempForms[form][concatTemp.type] = concat;

                  concatTemp = { next: [] };
                }

                break;
              default:
                if (formKeys[keys].handles.concat) {
                  concatTemp["first"] = inputs[input];
                  concatTemp["delim"] = formKeys[keys].handles.concat;
                  concatTemp["type"] = formKeys[keys].handles.type;
                } else {
                  tempForms[form][formKeys[keys].handles.type] = inputs[input];
                }
                break;
            }
            continue inputSearch;
          }
        }

        let i = tempForms.push({ form: inputs[input].form }) - 1;

        switch (formKeys[keys].handles.type) {
          case "concat":
            concatTemp["next"].push(inputs[input]);

            if (formKeys[keys].handles.concatFinish) {
              let concat = [];

              concat.push(concatTemp.first);
              if (concatTemp.next.length > 0)
                concat.push({ value: concatTemp.delim, concat: true });

              for (let piece in concatTemp.next) {
                concat.push(concatTemp.next[piece]);
                if (piece < concatTemp.next.length - 1)
                  concat.push({ value: concatTemp.delim, concat: true });
              }

              tempForms[i][concatTemp.type] = concat;

              concatTemp = { next: [] };
            }

            break;
          default:
            if (formKeys[keys].handles.concat) {
              concatTemp["first"] = inputs[input];
              concatTemp["delim"] = formKeys[keys].handles.concat;
              concatTemp["type"] = formKeys[keys].handles.type;
            } else {
              tempForms[i][formKeys[keys].handles.type] = inputs[input];
            }
            break;
        }
        continue inputSearch;
      }
    }

    textSearch: for (let input in textareas) {
      key2Search: for (let keys in formKeys) {
        for (let key in formKeys[keys].keys) {
          if (textareas[input][key] != formKeys[keys].keys[key])
            continue key2Search;
        }

        for (let form in tempForms) {
          if (tempForms[form].form == textareas[input].form) {
            switch (formKeys[keys].handles.type) {
              case "concat":
                concatTemp["next"].push(textareas[input]);

                if (formKeys[keys].handles.concatFinish) {
                  let concat = [];

                  concat.push(concatTemp.first);
                  if (concatTemp.next.length > 0)
                    concat.push({ value: concatTemp.delim, concat: true });

                  for (let piece in concatTemp.next) {
                    concat.push(concatTemp.next[piece]);
                    if (piece < concatTemp.next.length - 1)
                      concat.push({ value: concatTemp.delim, concat: true });
                  }

                  tempForms[form][concatTemp.type] = concat;

                  concatTemp = { next: [] };
                }

                break;
              default:
                if (formKeys[keys].handles.concat) {
                  concatTemp["first"] = textareas[input];
                  concatTemp["delim"] = formKeys[keys].handles.concat;
                  concatTemp["type"] = formKeys[keys].handles.type;
                } else {
                  tempForms[form][formKeys[keys].handles.type] =
                    textareas[input];
                }
                break;
            }
            continue textSearch;
          }
        }

        let i = tempForms.push({ form: textareas[input].form }) - 1;

        switch (formKeys[keys].handles.type) {
          case "concat":
            concatTemp["next"].push(textareas[input]);

            if (formKeys[keys].handles.concatFinish) {
              let concat = [];

              concat.push(concatTemp.first);
              if (concatTemp.next.length > 0)
                concat.push({ value: concatTemp.delim, concat: true });

              for (let piece in concatTemp.next) {
                concat.push(concatTemp.next[piece]);
                if (piece < concatTemp.next.length - 1)
                  concat.push({ value: concatTemp.delim, concat: true });
              }

              tempForms[i][concatTemp.type] = concat;

              concatTemp = { next: [] };
            }

            break;
          default:
            if (formKeys[keys].handles.concat) {
              concatTemp["first"] = textareas[input];
              concatTemp["delim"] = formKeys[keys].handles.concat;
              concatTemp["type"] = formKeys[keys].handles.type;
            } else {
              tempForms[i][formKeys[keys].handles.type] = textareas[input];
            }
            break;
        }
        continue textSearch;
      }
    }

    forms = tempForms;

    for (let form of forms) {
      form.cache = {};

      for (let item in form) {
        switch (item) {
          case "submit":
            form[item].addEventListener("click", formHandler.bind(null, form));
            break;
          case "form":
            if (!form.submit)
              form[item].addEventListener(
                "submit",
                formHandler.bind(null, form)
              );
            break;
          case "cache":
            break;
          default:
            if (Array.isArray(form[item])) {
              for (let part of form[item]) {
                if (!part.concat)
                  part.addEventListener(
                    "input",
                    getInput.bind(null, form, item)
                  );
              }
            } else
              form[item].addEventListener(
                "input",
                getInput.bind(null, form, item)
              );
        }
      }
    }
  }

  //CASE BY CASE
  //Hooks
  translator();

  let chatHooks;

  let mobileHook = document.querySelectorAll('[href="tel: 8005005200"]')[0];

  function formHandler(form) {
    let extra = {};

    for (let key in form) {
      switch (key) {
        case "form":
        case "cache":
        case "submit":
          break;
        case "name":
        case "email":
        case "phone":
          if (getInput(form, key) != "") userInfo[key] = getInput(form, key);
          else if (form.cache[key] != "") userInfo[key] = form.cache[key];
        default:
          if (getInput(form, key) != "") extra[key] = getInput(form, key);
          else if (form.cache[key] != "") extra[key] = form.cache[key];
          else extra[key] = "";
          break;
      }
    }

    extra.form = getDateString();
    userInfo.info.push(extra);

    localStorage.setItem("attInfoCache", JSON.stringify(userInfo));
  }

  function getInput(form, input) {
    if (Array.isArray(form[input])) {
      let value = "";
      let valid = false;

      for (let part of form[input]) {
        value += part.value;
        valid = (part.value != "" && !part.concat) || valid;
      }

      if (!valid) value = "";

      form.cache[input] = value;

      return value;
    } else form.cache[input] = form[input].value;

    return form[input].value;
  }

  //Handlers
  function chatHandler() {
    for (let key in chatHooks) {
      switch (key) {
        case "name":
        case "email":
        case "phone":
          if (chatHooks[key].value != "") userInfo[key] = chatHooks[key].value;
          break;
        case "submit":
          break;
        case "message":
          let chat = {};
          chat[key] = chatHooks[key].value;
          chat.dateGenerated = getDateString();
          chat.sender = "Client";
          userInfo.chat.push(chat);
          break;
        default:
          break;
      }
    }
  }

  function mobileHandler() {
    userInfo.info.push({ call: getDateString() });
  }

  //Validation
  let chatEnable = false;
  let chatRetrys = 10;

  let mobileEnable = !(mobileHook === undefined);

  //getChatHooks();

  async function getChatHooks() {
    chatRetrys--;

    try {
      let core = document.getElementById("wp-live-chat-by-3CX");

      chatHooks =
        core === null
          ? { bad: null }
          : {
              name:
                core.shadowRoot.getElementById("offline_name") === null
                  ? null
                  : document
                      .getElementById("wp-live-chat-by-3CX")
                      .shadowRoot.getElementById("offline_name")
                      .firstElementChild,
              email:
                core.shadowRoot.getElementById("offline_email") === null
                  ? null
                  : document
                      .getElementById("wp-live-chat-by-3CX")
                      .shadowRoot.getElementById("offline_email")
                      .firstElementChild,
              phone:
                core.shadowRoot.getElementById("offline_phone") === null
                  ? null
                  : document
                      .getElementById("wp-live-chat-by-3CX")
                      .shadowRoot.getElementById("offline_phone")
                      .firstElementChild,
              message:
                core.shadowRoot.getElementById("offline_message") === null
                  ? null
                  : document
                      .getElementById("wp-live-chat-by-3CX")
                      .shadowRoot.getElementById("offline_message")
                      .firstElementChild,
              submit:
                core.shadowRoot.getElementById("offline_name") === null
                  ? null
                  : document
                      .getElementById("wp-live-chat-by-3CX")
                      .shadowRoot.getElementById("offline_name").parentElement
                      .parentElement.parentElement.nextElementSibling,
            };
    } catch (e) {
      chatHooks = { bad: null };
    }

    if (
      (chatHooks.bad !== undefined || chatHooks.name === null) &&
      chatRetrys >= 0
    )
      setTimeout(getChatHooks, 1000);

    chatEnable = true;
    for (let key in chatHooks) if (chatHooks[key] === null) chatEnable = false;

    if (chatEnable) chatHooks.submit.addEventListener("click", chatHandler);
  }

  if (mobileEnable) mobileHook.addEventListener("click", mobileHandler);

  //GLOBAL
  if (localStorage.getItem("attInfoCache") === null) {
    userInfo.ID = genID();
    userInfo.name = "";
    userInfo.phone = "";
    userInfo.email = "";
    userInfo.crumbs = [];
    //userInfo.interaction = [];
    userInfo.info = [];
    userInfo.chat = [];
    userInfo.entryURL = window.location.href;
    userInfo.initTime = getDateString();
    userInfo.conf = false;
    userInfo.changes = false;

    localStorage.setItem("attInfoCache", JSON.stringify(userInfo));
  } else {
    userInfo = JSON.parse(localStorage.getItem("attInfoCache"));
  }

  userInfo.crumbs.push({
    page: document.title,
    time: getDateString(),
    interactions: [],
    url: window.location.href,
  });

  userInfo.changes = true;

  localStorage.setItem("attInfoCache", JSON.stringify(userInfo));

  if (debugActive) console.log(userInfo);

  window.addEventListener("click", function (e) {
    e = e || window.event;
    let target = e.target || e.srcElement;
    let text = target.tagName;
    let name = "";

    if (target.attributes.name) name = target.attributes.name.value;
    else name = "undefined";

    userInfo.crumbs[userInfo.crumbs.length - 1].interactions.push({
      elementTag: target.tagName,
      elementName: name,
      time: getDateString(),
    });

    userInfo.changes = true;

    localStorage.setItem("attInfoCache", JSON.stringify(userInfo));

    if (debugActive) console.log(userInfo);
  });

  // Generates an ID.
  function genID() {
    //Randomly creates a string a 4 characters.
    function gen4C() {
      return Math.floor((1 + Math.random()) * 65536)
        .toString(16)
        .substring(1);
    }

    return (
      gen4C() +
      gen4C() +
      "-" +
      gen4C() +
      "-" +
      gen4C() +
      "-" +
      gen4C() +
      "-" +
      gen4C() +
      gen4C() +
      gen4C()
    );
  }

  function getDateString() {
    let date = new Date().toISOString();
    let dateReg = /(\d{4}).(\d{2}).(\d{2}).(\d{2}).(\d{2}).(\d{2}).(\d{1,3})/g;
    let dateParts = dateReg.exec(date);

    return (
      dateParts[1] +
      "-" +
      dateParts[2] +
      "-" +
      dateParts[3] +
      " " +
      dateParts[4] +
      ":" +
      dateParts[5] +
      ":" +
      dateParts[6] +
      "." +
      dateParts[7]
    );
  }

  function recall() {
    if (!JSON.parse(localStorage.getItem("attInfoCache")).changes) {
      setTimeout(recall, 10000);
      if (debugActive) console.log("n");

      return;
    }

    if (debugActive) console.log("y");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://client.getattribution.com/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(localStorage.getItem("attInfoCache"));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          if (debugActive) console.log(xhr.responseText);

          if (xhr.responseText.length <= 2) {
            if (xhr.responseText == "0") {
              userInfo.changes = false;

              if (!userInfo.conf) {
                userInfo.conf = true;
              }

              localStorage.setItem("attInfoCache", JSON.stringify(userInfo));
            }
          } else if (xhr.responseText.length > 2) {
            userInfo.ID = xhr.responseText;

            localStorage.setItem("attInfoCache", JSON.stringify(userInfo));
          }
        }
        setTimeout(recall, 10000);
      }
    };
  }

  recall();
});
