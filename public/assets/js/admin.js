function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');

  const darkModeIcon = document.querySelector('.dark-mode-icon');
  darkModeIcon.classList.toggle('fa-sun');
  darkModeIcon.classList.toggle('fa-moon');
}

function searchUser() {
  var input = document.getElementById("searchInput").value.toLowerCase();


  var table = document.getElementById("userTable");
  var rows = table.getElementsByTagName("tr");


  for (var i = 0; i < rows.length; i++) {
    var username = rows[i].getElementsByTagName("td")[1];

    if (username) {
      var usernameValue = username.textContent || username.innerText;
      if (usernameValue.toLowerCase().indexOf(input) > -1) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
}

var searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", searchUser);