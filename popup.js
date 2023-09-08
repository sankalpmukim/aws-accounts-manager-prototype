const accountList = document.getElementById("account-list");
const addAccountBtn = document.getElementById("add-account");

// Load stored accounts
chrome.storage.local.get("awsAccounts", function (data) {
  if (data.awsAccounts) {
    data.awsAccounts.forEach((account) => {
      let li = document.createElement("li");
      li.innerText = account.alias;
      li.onclick = function () {
        console.log(account);
        autofillLogin(account);
      };
      accountList.appendChild(li);
    });
  }
});

addAccountBtn.onclick = function () {
  const account = prompt(
    "Enter account details in the format: IAM Alias, Username, Password, User Alias"
  );
  const details = account.split(",");
  const newAccount = {
    account: details[0].trim(),
    username: details[1].trim(),
    password: details[2].trim(),
    alias: details[3].trim(),
  };

  chrome.storage.local.get("awsAccounts", function (data) {
    if (data.awsAccounts) {
      data.awsAccounts.push(newAccount);
      chrome.storage.local.set({ awsAccounts: data.awsAccounts });
    } else {
      chrome.storage.local.set({ awsAccounts: [newAccount] });
    }
  });
};

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log(`Tab ${tab.id} found`);
  return tab.id;
}

function autofillLogin(account) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      action: "fillLogin",
      data: account,
    });
  });
}
