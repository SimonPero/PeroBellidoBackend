const submitButton = document.getElementById("submit-button");
const user = document.querySelector(".user");
const id = user.getAttribute("user-id");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault(); 
  const formData = new FormData();
  const identificacionInput = document.getElementById("identificacion");
  const domicilioInput = document.getElementById("domicilio");
  const statusInput = document.getElementById("status");
  formData.append("identificacion", identificacionInput.files[0]);
  formData.append("domicilio", domicilioInput.files[0]);
  formData.append("status", statusInput.files[0]);
    const response = await fetch(`/api/users/${id}/documents`, {
      method: 'POST',
      body: formData, 
    });
});
