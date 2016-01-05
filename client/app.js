function showLoggedInState(nickname) {
    document.getElementById('btn-login').textContent = 'Log out';
    document.getElementById('logged-in-box').style.display = 'inline';
    document.getElementById('nick').textContent = nickname;
}

$(document).ready(function() {
    var lock = new Auth0Lock(
        // These properties are set in auth0-variables.js
        AUTH0_CLIENT_ID,
        AUTH0_DOMAIN
    );

    var userProfile;
    var nickname = sessionStorage.getItem('nickname');
    //alert(nickname);
    if(nickname) {
      showLoggedInState(nickname);
    }

    document.getElementById('btn-login').addEventListener('click', function() {
      if(this.textContent == "Log out") {
        localStorage.clear();
        sessionStorage.clear();
        document.getElementById('btn-login').textContent = 'Log in';
        document.getElementById('logged-in-box').style.display = 'none';
        return
      }
      lock.show(function(err, profile, token) {
        if (err) {
          // Error callback
          console.error("Something went wrong: ", err);
          alert("Something went wrong, check the Console errors");
        } else {
          // Success calback

          // Save the JWT token.
          localStorage.setItem('userToken', token);

          // Save the profile
          userProfile = profile;
          sessionStorage.setItem('nickname', userProfile.nickname);
          showLoggedInState(userProfile.nickname);
        }
      });
    });


  document.getElementById('btn-api').addEventListener('click', function() {
    // Just call your API here. The header will be sent
    alert("Hello real world");
    $.ajax({
      url: "/secured/ping",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('userToken'));
      },
      error: function(err) {
        // error handler
        alert(JSON.stringify(err));
      },
      success: function(data) {
        // success handler
        alert(JSON.stringify(data));
      }
    });
  });
});
