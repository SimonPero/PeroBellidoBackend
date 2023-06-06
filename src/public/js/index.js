const socket = io()

const formProducts = document.getElementById("form-products")
const submitButton = document.getElementById("submit-button")
const inputTitle = document.getElementById("form-title")
const inputDescript = document.getElementById("form-description")
const inputPrice = document.getElementById("form-price")
const inputCode = document.getElementById("form-code")
const inputStock = document.getElementById("form-stock")
const inputCategory = document.getElementById("form-category")

function deleteProduct(id) {
  socket.emit("delete-product", id)
}
// Handlebars template
const productsTemplate = `
{{#each products}}
<li id="{{#if this._id}}{{this._id}}{{else}}{{this.id}}{{/if}}">
<h3>{{this.title}}</h3>
<p>ID: {{#if this._id}}{{this._id}}{{else}}{{this.id}}{{/if}}</p>
  <p>Descripción:{{this.description}}</p>
  <p>Precio: {{this.price}}</p>
  <p>Código: {{this.code}}</p>
  <p>Stock: {{this.stock}}</p>
  <p>Categoría: {{this.category}}</p>
  <img src="/public/{{this.picture}}" alt="">
  <button class="btn-delete" onclick="deleteProduct('{{#if this._id}}{{this._id}}{{else}}{{this.id}}{{/if}}')">Eliminar</button>
</li>
{{/each}}
`
// Compile Handlebars template
const template = Handlebars.compile(productsTemplate)
socket.on("msgProdu_back_to_front", (data) => {
  renderEjemplo(data)

})

socket.on("product_deleted", (id) => {
  const li = document.getElementById(id);
  if (li) {
    li.remove();
  }
});

const renderEjemplo = (ejemplos) => {
  const html = template({ products: ejemplos })
  document.getElementById("ejemplo").innerHTML = html
}

submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  const title = inputTitle.value;
  const description = inputDescript.value;
  const price = inputPrice.value;
  const code = inputCode.value;
  const stock = inputStock.value;
  const category = inputCategory.value;

  const fileInput = document.getElementById("form-file");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);

  fetch("/realtimeproducts", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const fileData = data.filename; // Obtener el nombre del archivo guardado

      socket.emit("new-product", title, description, price, code, stock, category, fileData);
    })
    .catch((error) => console.log(error));
})
