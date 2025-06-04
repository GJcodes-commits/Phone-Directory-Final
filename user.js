const sheetURL = "https://script.google.com/macros/s/AKfycbxD_rpYJP2JBRDNhjsH0Qf-WNhYzRvFlEPwZZEveeZYLt7sZenJvrTj9LGlKYl__V9o/exec"; // Replace with your deployed Google Apps Script URL

function loadContacts() {
  fetch(sheetURL)
    .then(response => response.json())
    .then(data => {
      const contacts = data.contacts || [];
      const contactList = document.getElementById("contact-list");
      contactList.innerHTML = "";

      contacts.forEach(contact => {
        const row = `<tr>
          <td>${contact.name}</td>
          <td>${contact.phone}</td>
          <td>${contact.designation}</td>
        </tr>`;
        contactList.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Error loading contacts:", error);
    });
}

function searchContacts() {
  const filter = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#contact-list tr");

  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    const phone = row.cells[1].textContent.toLowerCase();
    const designation = row.cells[2].textContent.toLowerCase();

    if (name.includes(filter) || phone.includes(filter) || designation.includes(filter)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

window.onload = loadContacts;