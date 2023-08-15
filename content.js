function nextBtnFlow(reqData, nextBtn) {
  console.log("in nextBtnFlow");
  const isIamAccount = reqData.account === "";
  const resolvingInputToFill = isIamAccount
    ? reqData.username
    : reqData.account;

  const radios = document.querySelectorAll('input[name="userType"]');

  if (isIamAccount) {
    // select the iam account radio button
    radios.forEach((radio) => {
      if (radio.value === "iamUser") {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
    });
  } else {
    // select the root account radio button
    radios.forEach((radio) => {
      if (radio.value === "rootUser") {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
    });
  }

  const resolvingInput = document.getElementById("resolving_input");
  resolvingInput.value = resolvingInputToFill;
  nextBtn.click();
}

function triggerAngularSignInClick() {
  // Create a script element
  const scriptEl = document.createElement("script");

  // Set the script source to your inject.js file
  scriptEl.src = chrome.runtime.getURL("inject.js");

  // Append the script to the page's body
  document.body.appendChild(scriptEl);

  // Optionally, remove the script after it runs to keep the DOM clean
  scriptEl.onload = function () {
    scriptEl.remove();
  };
}

function simulateTyping(element, value) {
  for (let char of value) {
    element.value += char;

    // Create and dispatch the event
    let event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(event);
  }
}

function fillLogin(reqData) {
  const account = document.getElementById("account");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  // account.value = reqData.account;
  // username.value = reqData.username;
  // password.value = reqData.password;
  if (account.value !== reqData.account) {
    simulateTyping(account, reqData.account);
  }
  simulateTyping(username, reqData.username);
  simulateTyping(password, reqData.password);

  // wait a millisecond
  setTimeout(() => {
    // Execute the function
    triggerAngularSignInClick();
  }, 1);
}

chrome.runtime.onMessage.addListener(function (
  request,
  _sender,
  _sendResponse
) {
  // check if a button with id = "next_button_text" exists
  const nextBtnSpan = document.getElementById("next_button_text");

  // if it does
  if (nextBtnSpan) {
    nextBtnFlow(request.data, nextBtnSpan);
  } else {
    // else
    fillLogin(request.data);
  }

  console.log("request", JSON.stringify(request));
  // if (request.action === "fillLogin") {
  //   document.getElementById("account").value = request.data.account;
  //   document.getElementById("username").value = request.data.username;
  //   document.getElementById("password").value = request.data.password;
  // }
});

// how to confirm my script is getting loaded
console.log("content script loaded");
