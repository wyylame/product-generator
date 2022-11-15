const categoryRus = document.querySelector(".rus");
const categoryEng = document.querySelector(".eng");
const addCategoryBtn = document.querySelector(".add-category");

const categoriesList = document.querySelector(".categories__list");

// Товары
const productTitle = document.querySelector(".product-title");
const productDescr = document.querySelector(".product-description");
const imgFilesCount = document.querySelector(".files-сount");
const productCategoryContainer = document.querySelector(".product-category");

const price = document.querySelector(".price");
const salePrice = document.querySelector(".sale-price");

const paramsContainer = document.querySelector(".params");

const addParamBtn = document.querySelector(".add-params-btn");
const removeParamsBtn = document.querySelector(".remove-params-btn");

const generateBtn = document.querySelector(".generate-product");

const code = document.querySelector(".code");

const clearBtn = document.querySelector(".clear-btn");

let categories = !!localStorage.getItem("categories")
  ? JSON.parse(localStorage.getItem("categories"))
  : [];

let products = !!localStorage.getItem("products")
  ? JSON.parse(localStorage.getItem("products"))
  : [];

let params = !!localStorage.getItem("params") ? JSON.parse(localStorage.getItem("params")) : [];

let paramsCounter = params.length + 1;

// структура товара
const productStructure = (title, desc, filesCount, category, price, params) => {
  return {
    id: products.length + 1,
    title: title,
    description: desc,
    imgs: {
      folder: `product${products.length + 1}`,
      files: [...Array(filesCount)].map((_, i) => `${i + 1}.png`),
    },
    category: category,
    price: price,
    params: params,
  };
};

// структура категории для видимости
const categoryStructure = (title, name) => `
  <div class="category-item">
    <h4>${title}</h4>
    <span>${name}</span>
    <div class="remove">X</div>
  </div>
`;

// структура категории для товара
const categoryProductStructure = (title, value) => `
  <label for="productCategory">
    ${title}
    <input type="radio" name="productCategory" value=${value}>
  </label>
`;

// структура параметра
const paramStructure = (i = 1, key = "", value = "") => `
  <div class="param">
    <span>${i}.</span>
    <input type="text" class="key" placeholder="Название параметра" value="${key}"/>
    <input type="text" class="value" placeholder="Значение параметра" value="${value}"/>
    <span class='remove-param'>X</span>
  </div>
`;

// сохраняет категории в ls
function saveToLocalStorageCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

// сохраняет продукты в ls
function saveToLocalStorageProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// сохранение параметров в LocalStorage
function saveParamsToLS() {
  localStorage.setItem("params", JSON.stringify(params));
}

// помещает категории на страницу
function addCategoriesOnPage() {
  categoriesList.innerHTML = "";
  categories.map((e) => (categoriesList.innerHTML += categoryStructure(e.title, e.name)));
}

//добавляет инпуты типа radio с существующими категориями в генератор товара
function addCategoryBtnsOnProduct() {
  productCategoryContainer.innerHTML = "";
  categories.map(
    (item) =>
      (productCategoryContainer.innerHTML += categoryProductStructure(item.title, item.name))
  );
}

//помещает товары на страницу
function addProductsOnPage() {
  code.innerHTML = JSON.stringify(products);
}

// помещает параметры на страницу
function addParamsOnPage() {
  paramsContainer.innerHTML = "";
  params.map(
    (item, i) => (paramsContainer.innerHTML += paramStructure(i + 1, item.key, item.value))
  );
}

// установка params текущих значение инпутов
function getParams() {
  const paramsItems = paramsContainer.querySelectorAll(".param");

  params = [...paramsItems]
    .map((item) => {
      const key = item.querySelector(".key").value;
      const value = item.querySelector(".value").value;

      return { key: key, value: value };
    })
    .filter((item) => item.value !== "");

  saveParamsToLS();
}

// добавляет новый параметр
function addParam() {
  getParams();

  addParamsOnPage();
  paramsContainer.innerHTML += paramStructure(paramsCounter++);
  getParams();
}

// удаляет все параметры
function removeParams() {
  paramsContainer.innerHTML = "";
  params = [];
  saveParamsToLS();
}

// удаляет определённый параметр
function removeOneParam(num) {
  params = params.filter((_, i) => i !== num);
  addParamsOnPage();
  saveParamsToLS();
  --paramsCounter;
}

//пушит товар в массив
function pushProduct() {
  const currentCategory = [...productCategoryContainer.querySelectorAll("input")].find(
    (e) => e.checked
  ).value;

  getParams();

  const item = productStructure(
    productTitle.value,
    productDescr.value,
    +imgFilesCount.value,
    currentCategory,
    +price.value,
    params
  );

  products.push(
    salePrice.value === ""
      ? item
      : {
          ...item,
          salePrice: +salePrice.value,
        }
  );

  addProductsOnPage();
  saveToLocalStorageProducts();
}

//очистка ls
function clearData() {
  products = [];
  saveToLocalStorageProducts();
  addProductsOnPage();
}

addCategoriesOnPage();
addCategoryBtnsOnProduct();
addParamsOnPage();
addProductsOnPage();

addCategoryBtn.addEventListener("click", () => {
  if (categoryRus.value !== "" && categoryEng.value !== 0) {
    categories.push({
      title: categoryRus.value,
      name: categoryEng.value,
      img: `${categoryEng.value}.png`,
    });
    addCategoriesOnPage();
    addCategoryBtnsOnProduct();
    saveToLocalStorageCategories();
  }
});

categoriesList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    categories.splice(
      categories.findIndex(
        (item) => item.title === e.target.parentNode.querySelector("h4").innerText
      ),
      1
    );
    saveToLocalStorageCategories();
    addCategoriesOnPage();
    addCategoryBtnsOnProduct();
  }
});

removeParamsBtn.addEventListener("click", removeParams);
addParamBtn.addEventListener("click", addParam);

paramsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-param")) {
    const spanValue = e.target.parentNode.querySelector("span").innerText;
    removeOneParam(+spanValue.replace(".", "") - 1);
  }
});

generateBtn.addEventListener("click", pushProduct);

clearBtn.addEventListener("click", clearData);
