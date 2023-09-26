const submitButton = document.getElementById("submit-button");
const user = document.querySelector(".user");
const id = user.getAttribute("user-id");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault(); 
  const formData = new FormData();
  const identificacionInput = document.getElementById("identificacion");
  const domicilioInput = document.getElementById("domicilio");
  const statusInput = document.getElementById("status");
  console.log(statusInput.files,domicilioInput.files,identificacionInput.files)
  formData.append("identificacion", identificacionInput.files[0]);
  formData.append("domicilio", domicilioInput.files[0]);
  formData.append("status", statusInput.files[0]);
  console.log(formData.file)
  try {
    const response = await fetch(`/api/users/${id}/documents`, {
      method: 'POST',
      body: formData, 
    });
    if (response.ok) {
      console.log('Documents uploaded successfully.');
    } else {
      console.error('Error uploading documents.');
    }
  } catch (error) {
    console.error('Error uploading documents', error);
  }
});
