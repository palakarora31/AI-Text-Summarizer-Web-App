const textArea = document.getElementById("text_to_summarize");
const charCount = document.getElementById('char-count');
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
const copyBtn = document.getElementById("copyButton");

submitButton.disabled = true;

textArea.addEventListener('input', function() {
  charCount.textContent = `${textArea.value.length}/100,000 characters`;
});

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

function verifyTextLength(e) {
 // The e.target property gives us the HTML element that triggered the event, which in this case is the textarea. We save this to a variable called 'textarea'
  const textarea = e.target;

  // Verify the TextArea value.
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    // Enable the button when text area has value.
    submitButton.disabled = false;
  } else {
    // Disable the button when text area is empty.
    submitButton.disabled = true;
  }
}

copyBtn.addEventListener("click", function () {
  copyToClipboard(summarizedTextArea.value);
  console.log("TEXT: ",summarizedTextArea.value);
});

function submitData(e) {
  console.log("Submitted\n");

 // This is used to add animation to the submit button
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Send the text to the server using fetch API

 // Note - here we can omit the “baseUrl” we needed in Postman and just use a relative path to “/summarize” because we will be calling the API from our Replit!  
  fetch('https://ai-text-summarizer-app-gold.vercel.app/api/summarize', requestOptions)
    .then(response => response.text()) // Response will be summarized text
    .then(summary => {
      // Do something with the summary response from the back end API!

      // Update the output text area with new summary
      summarizedTextArea.value = summary;

      // Stop the spinning loading animation
      submitButton.classList.remove("submit-button--loading");
      copyBtn.style.display = "inline-block";
    })
    .catch(error => {
      console.log(error.message);
    });
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Copied to clipboard");
}