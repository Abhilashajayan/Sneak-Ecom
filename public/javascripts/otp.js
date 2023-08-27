let timerOn = true;
function timer(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  document.getElementById("countdown").innerHTML = `Time left: ${m} : ${s}`;
  remaining -= 1;
  if (remaining >= 0 && timerOn) {
    setTimeout(function () {
      timer(remaining);
    }, 1000);
    document.getElementById("resend").innerHTML = `
    `;
    return;
  }
  if (!timerOn) {
    return;
  }
  document.getElementById("resend").innerHTML = `Don't receive the code? 
  <span class="font-weight-bold text-color cursor" onclick="timer(60)">Resend
  </span>`;
}
timer(60);

// const sendButton = document.getElementById("resend");
//   sendButton.addEventListener("click", () => {
//     const sendButton = document.getElementById("resend");
//     sendButton.addEventListener("click", async () => {
//       try {
//         // Make an AJAX request to the server to resend the OTP
//         const response = await fetch("/verify-email", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
          
//           body: JSON.stringify({}),
//         });
  
//         // Check the response status
//         if (response.ok) {
//           const data = await response.json();
//           // Handle the response data, if needed
//           console.log(data); // For example, you might log the response data
  
//           // Optionally, you can update the web page to show a success message or any other action
//           // For example:
//           alert("OTP Resent Successfully!");
//         } else {
//           throw new Error("Failed to resend OTP.");
//         }
//       } catch (error) {
//         console.error(error);
//         // Handle errors, if any
//         alert("Failed to resend OTP. Please try again later.");
//       }
//     }) });

const inputs = document.querySelectorAll('input[type="text"]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', function(event) {
        const currentInput = event.target;
        const nextInput = currentInput.nextElementSibling;

        if (currentInput.value.length === 1 && nextInput) {
          nextInput.focus();
        }
      });
      inputs[i].addEventListener('keydown', function(event) {
        const currentInput = event.target;
        const previousInput = currentInput.previousElementSibling;

        if (event.keyCode === 8 && currentInput.value.length === 0 && previousInput) {
          previousInput.focus();
        }
      });
    
    }


    document.addEventListener("DOMContentLoaded", function() {
      var resendButton = document.getElementById("resend");
  
      if (resendButton) {
          resendButton.addEventListener("click", function() {
              var email = document.getElementById('email').value;  // Replace with the actual email
              var xhr = new XMLHttpRequest();
              xhr.open("POST", "/verify-email", true);
              xhr.setRequestHeader("Content-Type", "application/json");
  
              xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                      alert('OTP resend successful!');
                  } else {
                      alert('Error resending OTP: ' + xhr.statusText);
                  }
              };
  
              xhr.onerror = function() {
                  alert('Network error while resending OTP.');
              };
  
              var data = JSON.stringify({ email: email });
              xhr.send(data);
          });
      }
  });
  