const socket = io();

// Selecciona elementos del formulario y otros elementos en el DOM
const formProducts = document.getElementById("form-products");
const submitButton = document.getElementById("submit-button");
const inputTitle = document.getElementById("form-title");
const inputDescript = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputCategory = document.getElementById("form-category");

const userRoleElement = document.querySelector(".user-owner");
const owner = userRoleElement.getAttribute("user-owner-id");

// Función para eliminar un producto
function deleteProduct(id) {
  socket.emit("delete-product", id, owner);
}

// Plantilla Handlebars para mostrar los productos
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

// Compila la plantilla Handlebars
const template = Handlebars.compile(productsTemplate);

// Maneja el evento cuando se envía un producto
submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  // Obtiene los valores del formulario
  const title = inputTitle.value;
  const description = inputDescript.value;
  const price = inputPrice.value;
  const code = inputCode.value;
  const stock = inputStock.value;
  const category = inputCategory.value;

  const fileInput = document.getElementById("form-file");
  const file = fileInput.files[0];

  // Crea un objeto FormData para enviar los datos del formulario
  const formData = new FormData();
  formData.append("file", file);

  // Realiza una solicitud POST para cargar el archivo y obtener el nombre del archivo guardado
  fetch("/realtimeproducts", {
    method: "POST",
    body: formData,
  })
    .then((data) => {
      const fileData = data.filename; // Obtener el nombre del archivo guardado

      // Emitir un evento para crear un nuevo producto en tiempo real
      socket.emit("new-product", title, description, price, code, stock, category, fileData, owner);
    });
});

// Maneja eventos de socket
socket.on("msgProdu_back_to_front", (data) => {
  renderProducts(data);
});

socket.on("product_deleted", (id) => {
  const li = document.getElementById(id);
  if (li) {
    li.remove();
  }
});

// Renderiza los productos en la página usando la plantilla Handlebars
const renderProducts = (products) => {
  const html = template({ products: products });
  document.getElementById("products").innerHTML = html;
}
