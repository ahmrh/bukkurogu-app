// {
//     id: 3657848524,
//     title: 'Harry Potter and the Philosopher\'s Stone',
//     author: 'J.K Rowling',
//     year: 1997,
//     isComplete: false,
// }
//////////////////////////////////////////////////////////////////////////////////////
const RENDER_EVENT = "render-event";
const SEARCH_EVENT = "search-event";
const MODAL_OPEN_EVENT = "modal-open-event";
const MODAL_CLOSE_EVENT = "modal-close-event";

//////////////////////////////////////////////////////////////////////////////////////
const ADD_MODAL_TYPE = "add-modal-type";
const PREFERENCE_MODAL_TYPE = "preference-modal-type";

//////////////////////////////////////////////////////////////////////////////////////

const STORAGE_KEY = "ブックログ_APP";

//////////////////////////////////////////////////////////////////////////////////////

var searchBarElement;
var completedContainerElement;
var bookContainerElement;
var preferenceButtonElement;
var addButtonElement;
var htmlElement;

const books = [];
const preference = { lightMode: false };

var renderedBooks = [];
const alertQueue = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser doesn't support local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  if (!isStorageExist()) return;

  const serializedData = localStorage.getItem(STORAGE_KEY);

  if (serializedData !== null) {
    const parsedData = JSON.parse(serializedData);
    const booksData = parsedData.books;
    const preferenceData = parsedData.preference;

    for (const book of booksData) {
      books.push(book);
    }
    preference.lightMode = preferenceData.lightMode;
  }

  console.log("Data loaded from storage");

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveDataToStorage() {
  if (!isStorageExist()) return;

  const parsedData = JSON.stringify({ books: books, preference: preference });

  localStorage.setItem(STORAGE_KEY, parsedData);

  console.log("Data saved to storage");
}

function createBookObject(title, author, year, isCompleted) {
  const id = +new Date();
  return { id, title, author, year, isCompleted };
}

function addBook(bookObject) {
  console.log(`Book ${bookObject} added`);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}
function changePreference(preferenceObject) {
  preference.lightMode = preferenceObject.lightMode;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function removeBook(bookId) {
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    if (book.id == bookId) {
      books.splice(i, 1);
      break;
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function addBookToCompleted(bookId) {
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    if (book.id == bookId) {
      book.isCompleted = true;
      break;
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function removeBookFromCompleted(bookId) {
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    if (book.id == bookId) {
      book.isCompleted = false;
      break;
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function populateDummyData() {
  for (let i = 0; i < 30; i++) {
    let bookObject = createBookObject(
      "Harry Potter and the Philosopher's Stone",
      "J. K. Rowling",
      1997,
      true
    );
    books.push(bookObject);
  }
}
function createCompletedBookHTMLString(bookObject) {
  const completedBookHTMLString = `
        <!-- Completed Item  -->
        <div class="completed-item" >
            <div class="text-container">
                <h1>${bookObject.title}</h1>
                <h2>${bookObject.author}</h2>
                <h2>${bookObject.year}</h2>
            </div>

            <button id="revert-button" class="icon-button" onclick="removeBookFromCompleted(${bookObject.id})">
                <img src="assets/icons/revert-icon.svg" alt="Revert Button" />
            </button>
        </div>
    `;

  return completedBookHTMLString;
}

function createBookHTMLString(bookObject) {
  const bookHTMLString = `
        <!-- Book Item  -->
        <div class="book-item" book-id="${bookObject.id}">
          <div class="flex-container">
            <img
              src="assets/images/book-placeholder-img.png"
              alt="Book Cover Placeholder"
            />

            <div class="text-container">
              <h1>${bookObject.title}</h1>
              <h2>${bookObject.author}</h2>
              <h2>${bookObject.year}</h2>
            </div>
          </div>

          <div class="button-container">
            <button id="complete-button" completed="${
              bookObject.isCompleted
            }" class="icon-button" onclick="${onClickBookCompleteButtonHTMLString(
    bookObject
  )}">
              <img src="assets/icons/complete-icon.svg" alt="Complete Button" />
            </button>
            <button id="delete-button" class="icon-button" onclick="removeBook(${
              bookObject.id
            })">
              <img src="assets/icons/delete-icon.svg" alt="Delete Button" />
            </button>
          </div>
        </div>
    `;
  return bookHTMLString;
}

const onClickBookCompleteButtonHTMLString = (bookObject) => {
  return bookObject.isCompleted
    ? `removeBookFromCompleted(${bookObject.id})`
    : `addBookToCompleted(${bookObject.id})`;
};

document.addEventListener("DOMContentLoaded", function () {
  searchBarElement = document.querySelector("#search-bar input");
  completedContainerElement = document.querySelector(".completed-container");
  bookContainerElement = document.querySelector(".book-container");
  preferenceButtonElement = document.querySelector("#preference-button");
  addButtonElement = document.querySelector("#add-button");
  htmlElement = document.querySelector("html");

  loadDataFromStorage();
});

document.addEventListener(RENDER_EVENT, function () {
  completedContainerElement.innerHTML = "";
  bookContainerElement.innerHTML = "";

  let searchValue = searchBarElement.value;
  if (searchValue === undefined) searchValue = "";

  for (const book of books) {
    if (book.isCompleted) {
      const completedBookHTMLString = createCompletedBookHTMLString(book);
      completedContainerElement.innerHTML += completedBookHTMLString;
    }
  }

  for (const book of books) {
    if (book.title.includes(searchValue) || book.author.includes(searchValue)) {
      const bookHTMLString = createBookHTMLString(book);
      bookContainerElement.innerHTML += bookHTMLString;
    }
  }

  addButtonElement.addEventListener("click", function () {
    const modalEvent = new Event(MODAL_OPEN_EVENT);
    modalEvent.modalType = ADD_MODAL_TYPE;
    document.dispatchEvent(modalEvent);
  });

  preferenceButtonElement.addEventListener("click", function () {
    const modalEvent = new Event(MODAL_OPEN_EVENT);
    modalEvent.modalType = PREFERENCE_MODAL_TYPE;
    document.dispatchEvent(modalEvent);
  });

  searchBarElement.addEventListener("input", function () {
    document.dispatchEvent(new Event(SEARCH_EVENT));
  });

  if (preference.lightMode === true) {
    htmlElement.className = "light-mode";
  } else {
    htmlElement.className = "";
  }
});

document.addEventListener(SEARCH_EVENT, function () {
  bookContainerElement.innerHTML = "";
  let searchValue = searchBarElement.value;
  if (searchValue === undefined) searchValue = "";

  for (const book of books) {
    if (book.title.includes(searchValue) || book.author.includes(searchValue)) {
      const bookHTMLString = createBookHTMLString(book);
      bookContainerElement.innerHTML += bookHTMLString;
    }
  }
});

document.addEventListener(MODAL_OPEN_EVENT, function (event) {
  switch (event.modalType) {
    case ADD_MODAL_TYPE: {
      const modal = document.querySelector("#add-book-modal");
      modal.style.display = "flex";

      const backdrop = modal.querySelector(".backdrop");
      backdrop.addEventListener("click", function () {
        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
      });

      const titleTextField = modal.querySelector("#title");
      const authorTextField = modal.querySelector("#author");
      const yearTextField = modal.querySelector("#year");
      const completedCheckBox = modal.querySelector("#completed");

      titleTextField.addEventListener("input", function () {
        titleTextField.setAttribute(
          "valid",
          !titleTextField.validity.valueMissing
        );
      });
      authorTextField.addEventListener("input", function () {
        authorTextField.setAttribute(
          "valid",
          !authorTextField.validity.valueMissing
        );
      });

      yearTextField.addEventListener("input", function () {
        yearTextField.setAttribute(
          "valid",
          !yearTextField.validity.valueMissing
        );
      });

      const saveButton = modal.querySelector(".footer button");
      saveButton.addEventListener("click", function () {
        if (
          titleTextField.value === "" ||
          authorTextField.value === "" ||
          yearTextField === ""
        ) {
          titleTextField.setAttribute(
            "valid",
            !titleTextField.validity.valueMissing
          );
          authorTextField.setAttribute(
            "valid",
            !authorTextField.validity.valueMissing
          );
          yearTextField.setAttribute(
            "valid",
            !yearTextField.validity.valueMissing
          );
          return;
        }

        const bookObject = createBookObject(
          titleTextField.value,
          authorTextField.value,
          yearTextField.value,
          completedCheckBox.checked
        );

        titleTextField.value = "";
        authorTextField.value = "";
        yearTextField.value = "";
        completedCheckBox.value = "";

        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
        addBook(bookObject);
        alert("Book is added");
      });

      break;
    }
    case PREFERENCE_MODAL_TYPE: {
      const modal = document.querySelector("#preference-modal");
      const lightModeCheckbox = modal.querySelector("#light-mode-checkbox");

      modal.style.display = "flex";
      lightModeCheckbox.checked = preference.lightMode;

      const backdrop = modal.querySelector(".backdrop");
      backdrop.addEventListener("click", function () {
        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
      });

      lightModeCheckbox.addEventListener("change", function () {
        changePreference({ lightMode: lightModeCheckbox.checked });
      });

      const saveButton = modal.querySelector(".footer button");
      saveButton.addEventListener("click", function () {
        changePreference({ lightMode: lightModeCheckbox.checked });
        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
      });

      break;
    }
  }
  console.log(MODAL_OPEN_EVENT + "IS CALLED");
});

document.addEventListener(MODAL_CLOSE_EVENT, function () {
  const modalElements = document.querySelectorAll(".modal");
  for (let modal of modalElements) {
    modal.style.display = "none";
  }
  console.log(MODAL_CLOSE_EVENT + "IS CALLED");
});
