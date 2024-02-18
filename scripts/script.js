// {
//     id: 3657848524,
//     title: 'Harry Potter and the Philosopher\'s Stone',
//     author: 'J.K Rowling',
//     year: 1997,
//     isComplete: false,
// }

const RENDER_EVENT = "render-event";
const ADD_EVENT = "add-event";
const PREFERENCE_CHANGE_EVENT = "preference-change-event";
const SEARCH_EVENT = "search-event";

const MODAL_OPEN_EVENT = "modal-open-event";
const MODAL_CLOSE_EVENT = "modal-close-event";

const ADD_MODAL_TYPE = "add-modal-type";
const PREFERENCE_MODAL_TYPE = "preference-modal-type";
const ALERT_MODAL_TYPE = "alert-modal-type";

const STORAGE_KEY = "ブックログ_APP";

const books = [];
const rendered_book = [];

const preference = { darkTheme: true };
const alertQueue = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser doesn't support local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  } else {
    populateDummyData();
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function createBookObject(title, author, year, isCompleted) {
  const id = +new Date();
  return { id, title, author, year, isCompleted };
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
        <div class="completed-item">
            <div class="text-container">
                <h1>${bookObject.title}</h1>
                <h2>${bookObject.author}</h2>
                <h2>${bookObject.year}</h2>
            </div>

            <button id="revert-button" class="icon-button" onclick="">
                <img src="assets/icons/revert-icon.svg" alt="Revert Button" />
            </button>
        </div>
    `;

  return completedBookHTMLString;
}

function createBookHTMLString(bookObject) {
  const bookHTMLString = `
        <!-- Book Item  -->
        <div class="book-item">
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
            <button id="complete-button" completed="${bookObject.isCompleted}" class="icon-button">
              <img src="assets/icons/complete-icon.svg" alt="Complete Button" />
            </button>
            <button id="delete-button" class="icon-button">
              <img src="assets/icons/delete-icon.svg" alt="Delete Button" />
            </button>
          </div>
        </div>
    `;
  return bookHTMLString;
}

function alert(alertMessage) {
  const modalEvent = new Event(MODAL_OPEN_EVENT);
  modalEvent.modalType = ALERT_MODAL_TYPE;
  modalEvent.alertMessage = alertMessage;

  // let alertObject = { event: modalEvent }
  // alertQueue.push(alertObject)

  document.dispatchEvent(modalEvent);
}

document.addEventListener("DOMContentLoaded", function () {
  const completedContainerElement = document.querySelector(
    ".completed-container"
  );
  console.log(completedContainerElement);

  if (isStorageExist()) {
    loadDataFromStorage();
  }
  alert("aaa");
  alert("aikjsdojasi");
});

document.addEventListener(RENDER_EVENT, function () {
  const completedContainerElement = document.querySelector(
    ".completed-container"
  );
  const bookContainerElement = document.querySelector(".book-container");
  completedContainerElement.innerHTML = "";
  bookContainerElement.innerHTML = "";

  for (const book of books) {
    if (book.isCompleted) {
      const completedBookHTMLString = createCompletedBookHTMLString(book);
      console.log(completedBookHTMLString);
      completedContainerElement.innerHTML += completedBookHTMLString;
    }

    const bookHTMLString = createBookHTMLString(book);
    bookContainerElement.innerHTML += bookHTMLString;
  }

  const addButton = document.querySelector("#add-button");
  addButton.addEventListener("click", function () {
    const modalEvent = new Event(MODAL_OPEN_EVENT);
    modalEvent.modalType = ADD_MODAL_TYPE;
    document.dispatchEvent(modalEvent);
  });

  const preferenceButton = document.querySelector("#preference-button");
  preferenceButton.addEventListener("click", function () {
    const modalEvent = new Event(MODAL_OPEN_EVENT);
    modalEvent.modalType = PREFERENCE_MODAL_TYPE;
    document.dispatchEvent(modalEvent);
  });
});

document.addEventListener(MODAL_OPEN_EVENT, function (event) {
  console.log(event.modalType);

  switch (event.modalType) {
    case ADD_MODAL_TYPE: {
      const modal = document.querySelector("#add-book-modal");
      modal.style.display = "flex";

      const backdrop = modal.querySelector(".backdrop");
      backdrop.addEventListener("click", function () {
        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
      });
      break;
    }
    case PREFERENCE_MODAL_TYPE: {
      const modal = document.querySelector("#preference-modal");
      modal.style.display = "flex";

      const backdrop = modal.querySelector(".backdrop");
      backdrop.addEventListener("click", function () {
        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
      });
      break;
    }

    case ALERT_MODAL_TYPE: {
      const modal = document.querySelector("#alert-modal");
      modal.style.display = "flex";

      const content = modal.querySelector(".content");
      content.innerHTML = modal.alertMessage;

      console.log("")

      const backdrop = modal.querySelector(".backdrop");

      backdrop.addEventListener("click", function () {
        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
      });

      const closeButton = modal.querySelector(".footer button");
      closeButton.addEventListener("click", function () {
        document.dispatchEvent(new Event(MODAL_CLOSE_EVENT));
      });

      break;
    }
  }
});

document.addEventListener(MODAL_CLOSE_EVENT, function () {
  const modalElements = document.querySelectorAll(".modal");
  for (let modal of modalElements) {
    modal.style.display = "none";
  }
});
