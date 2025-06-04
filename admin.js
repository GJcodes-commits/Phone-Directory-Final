let isAdmin = false;

const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxD_rpYJP2JBRDNhjsH0Qf-WNhYzRvFlEPwZZEveeZYLt7sZenJvrTj9LGlKYl__V9o/exec"; // 🔁 Replace with your actual URL

// Load contacts and display in table
window.loadContacts = function () {
  fetch(GOOGLE_SHEETS_WEBAPP_URL)
    .then(response => response.json())
    .then(data => {
      const contacts = data.contacts || [];
      let contactList = document.getElementById("contact-list");
      contactList.innerHTML = "";

      contacts.forEach((contact, index) => {
        let row = `<tr>
          <td>${contact.name}</td>
          <td>${contact.phone}</td>
          <td>${contact.designation}</td>
          <td>
            <button onclick="editContact(${index})">Edit</button>
            <button onclick="deleteContact(${index})">Delete</button>
          </td>
        </tr>`;
        contactList.innerHTML += row;
      });

      // Save contacts locally for editing/deleting reference
      localStorage.setItem("contacts", JSON.stringify(contacts));
    })
    .catch(error => {
      console.error("Error loading contacts:", error);
    });
};

// Add or update contact on form submit
function addOrUpdateContact() {
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let designation = document.getElementById("designation").value.trim();
  let editIndex = document.getElementById("editIndex").value;

  if (!name || !phone || !designation) {
    alert("Please fill all fields.");
    return;
  }

  const action = editIndex === "" ? "add" : "update";

const formData = new URLSearchParams();
formData.append("action", action);
formData.append("name", name);
formData.append("phone", phone);
formData.append("designation", designation);
formData.append("key", action === "update" ? parseInt(editIndex) : -1);

// ✅ Use formData directly in fetch, no JSON, no headers
fetch(GOOGLE_SHEETS_WEBAPP_URL, {
  method: "POST",
  body: formData
})
.then(res => res.json())
.then(response => {
  if (response.status === "success") {
    alert(`Contact ${action === "add" ? "added" : "updated"} successfully!`);
    clearForm();
    loadContacts();
  } else {
    alert("Failed to save contact.");
  }
})
.catch(error => {
  console.error("Error:", error);
  alert("Request failed.");
});
}

function logout() {
  isAdmin = false;
  clearForm();
  window.location.href = "index.html";
}

// Populate form fields to edit contact
function editContact(index) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const contact = contacts[index];
  if (!contact) return alert("Contact not found!");

  document.getElementById("name").value = contact.name;
  document.getElementById("phone").value = contact.phone;
  document.getElementById("designation").value = contact.designation;
  document.getElementById("editIndex").value = index;
}

// Delete contact
function deleteContact(index) {
  if (!confirm("Are you sure you want to delete this contact?")) return;

  const data = {
    action: "delete",
    key: index
  };

  fetch(GOOGLE_SHEETS_WEBAPP_URL, {
    method: "POST",
       mode: 'cors',
    body:formData
  
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        alert("Contact deleted successfully!");
        loadContacts();
      } else {
        alert("Failed to delete contact.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Request failed.");
    });
}

// Clear form inputs
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("designation").value = "";
  document.getElementById("editIndex").value = "";
}

// Search contacts in table
function searchContacts() {
  let filter = document.getElementById("search").value.toLowerCase();
  let rows = document.querySelectorAll("#contact-list tr");

  rows.forEach(row => {
    let name = row.cells[0].textContent.toLowerCase();
    let phone = row.cells[1].textContent.toLowerCase();
    let designation = row.cells[2].textContent.toLowerCase();

    if (name.includes(filter) || phone.includes(filter) || designation.includes(filter)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Logout and clear form


// Load contacts on page load
window.onload = function () {
  loadContacts();
};

// 👇 This makes your functions visible globally so your HTML buttons can use them
window.addOrUpdateContact = addOrUpdateContact;
window.logout = logout;

