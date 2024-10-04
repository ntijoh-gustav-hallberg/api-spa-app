function timer() {
  let time = 0;
  const output = document.querySelector("div.timer");
  const interval = setInterval(() => {
    time++;
    output.innerHTML = time;
  }, 100);
}

function block() {
  while (true) {
    console.log("ooops");
  }
}

function updateData(data) {
  const dataDiv = document.querySelector("div.data");
  dataDiv.innerHTML = `<span>${data}</span>`;
}

function blockingXMLHTTPRequest() {
  console.log("Blocking request clicked");
  const request = new XMLHttpRequest();
  request.open("GET", "http://localhost:9292/slow", false);
  console.log("Sending request");
  request.send(null);
  console.log(`received ${request.status}`);

  if (request.status === 200) {
    updateData(request.responseText);
  }
}

function nonBlockingXMLHTTPRequest() {
  console.log("NonBlocking request clicked");
  const request = new XMLHttpRequest();
  request.open("GET", "http://localhost:9292/slow", true);
  request.onload = function (e) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log(`received ${request.status}`);
        updateData(request.responseText);
        console.log(`request completed`);
      }
    }
  };
  console.log("Sending Request");
  request.send(null);
  console.log("Request Sent");
}

function fetchWithPromise() {
  console.log("Fetch With Promise Clicked");
  console.log("Sending Request");
  const fetchPromise = fetch("http://localhost:9292/slow");
  fetchPromise
    .then((response) => {
      console.log(`recieved ${response.status}`);
      return response.json();
    })
    .then((result) => {
      updateData(JSON.stringify(result));
      console.log("Request Completed");
    });
  console.log("Request Sent");
}

async function fetchWithAsyncAwait() {
  console.log("Fetch With Async Await Clicked");
  console.log("Sending Request");
  const response = await fetch("http://localhost:9292/slow");

  const result = await response.json();
  updateData(JSON.stringify(result));
  console.log("Request Completed");
}
