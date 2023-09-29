document.getElementById("sumbit-btn").addEventListener("click", function(event) {
    // Get form values
    var usernameInput = document.getElementById("form2Example26").value.trim();
    var emailInput = document.getElementById("form2Example27").value.trim();
    var passwordInput = document.getElementById("form2Example26").value.trim(); 
    var checkBox = document.getElementById("exampleCheck1").checked;
  
    // Display error messages for empty fields
    if (usernameInput === "") {
      document.getElementById("name-id").style.display = "block";
      event.preventDefault();
      return;
    } else {
      document.getElementById("name-id").style.display = "none";
    }
  
    if (emailInput === "") {
      document.getElementById("email-id").style.display = "block";
      event.preventDefault();
      return;
    } else {
      document.getElementById("email-id").style.display = "none";
    }
  
    if (passwordInput === "") {
      document.getElementById("pass-id").style.display = "block";
      event.preventDefault();
      return;
    } else {
      document.getElementById("pass-id").style.display = "none";
    }
  
    // Check the checkbox
    if (!checkBox) {
        const selectsize = new bootstrap.Modal(document.getElementById('selectSizes'));
          selectsize.show();
        setTimeout(() => {
          selectsize.hide();
        }, 1000);
      event.preventDefault();
      return;
    }
});
