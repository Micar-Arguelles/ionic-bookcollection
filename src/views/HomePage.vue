```vue
<template>
  <ion-page>
    <ion-header class="app-header">
      <ion-toolbar>
        <div class="header-content">
          <div>
            <p class="small-title">MY LIBRARY</p>
            <h1>Book Collection</h1>
          </div>

          <div class="header-icon">
            <ion-icon :icon="libraryOutline" />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">

        <!-- Intro -->
        <div class="intro-section" v-if="!showForm">
          <p>
            Keep track of the books in your personal collection.
          </p>
        </div>

        <!-- Add Book Button -->
        <ion-button
          v-if="!showForm"
          expand="block"
          class="add-button"
          @click="openAddForm"
        >
          <ion-icon :icon="addOutline" slot="start" />
          Add New Book
        </ion-button>

        <!-- Form -->
        <div v-if="showForm" class="form-wrapper">
          <BookForm
            :editing-book="editingBook"
            @save="saveBook"
            @cancel="cancelEdit"
          />
        </div>

        <!-- Book List -->
        <BookList
          v-if="!showForm"
          :books="books"
          @edit="editBook"
          @delete="deleteBook"
        />

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
  alertController,
  toastController,
} from "@ionic/vue";

import {
  libraryOutline,
  addOutline,
} from "ionicons/icons";

import {
  ref as dbRef,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";

import { db } from "@/firebase";

import BookForm from "@/components/BookForm.vue";
import BookList from "@/components/BookList.vue";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publicationYear: number;
  availability: string;
}

const books = ref<Book[]>([]);

const editingBook = ref<Book | null>(null);

const showForm = ref(false);

/*
 * READ
 * Load all books from Firebase Realtime Database
 */
async function loadBooks() {
  try {
    const booksRef = dbRef(db, "books");
    const snapshot = await get(booksRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

      books.value = Object.entries(data).map(
        ([id, book]: [string, any]) => ({
          id,
          title: book.title,
          author: book.author,
          category: book.category,
          publicationYear: Number(book.publicationYear),
          availability: book.availability,
        })
      );
    } else {
      books.value = [];
    }
  } catch (error) {
    console.error("Error loading books:", error);

    showMessage(
      "Unable to load books from Firebase.",
      "danger"
    );
  }
}

/*
 * Open Add Form
 */
function openAddForm() {
  editingBook.value = null;
  showForm.value = true;
}

/*
 * CREATE / UPDATE
 */
async function saveBook(book: {
  id?: string;
  title: string;
  author: string;
  category: string;
  publicationYear: number;
  availability: string;
}) {
  try {
    /*
     * Check for duplicate books
     *
     * Same:
     * - title
     * - author
     * - publication year
     */
    const booksRef = dbRef(db, "books");
    const snapshot = await get(booksRef);

    let duplicate = false;

    if (snapshot.exists()) {
      const data = snapshot.val();

      duplicate = Object.entries(data).some(
        ([id, existingBook]: [string, any]) => {
          const sameBook =
            String(existingBook.title).trim().toLowerCase() ===
              book.title.trim().toLowerCase() &&
            String(existingBook.author).trim().toLowerCase() ===
              book.author.trim().toLowerCase() &&
            Number(existingBook.publicationYear) ===
              Number(book.publicationYear);

          if (book.id) {
            return sameBook && id !== book.id;
          }

          return sameBook;
        }
      );
    }

    if (duplicate) {
      showMessage(
        "This book already exists in your collection.",
        "danger"
      );
      return;
    }

    /*
     * UPDATE
     */
    if (book.id) {
      const bookRef = dbRef(
        db,
        `books/${book.id}`
      );

      await update(bookRef, {
        title: book.title,
        author: book.author,
        category: book.category,
        publicationYear: Number(book.publicationYear),
        availability: book.availability,
      });

      await loadBooks();

      editingBook.value = null;
      showForm.value = false;

      showMessage(
        "Book updated successfully.",
        "success"
      );

      return;
    }

    /*
     * CREATE
     */
    const newBookRef = push(
      dbRef(db, "books")
    );

    await set(newBookRef, {
      title: book.title,
      author: book.author,
      category: book.category,
      publicationYear: Number(book.publicationYear),
      availability: book.availability,
    });

    await loadBooks();

    showForm.value = false;

    showMessage(
      "Book added successfully.",
      "success"
    );

  } catch (error) {
    console.error("Error saving book:", error);

    showMessage(
      "Unable to save the book.",
      "danger"
    );
  }
}

/*
 * Open Edit Form
 */
function editBook(book: Book) {
  editingBook.value = { ...book };
  showForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/*
 * DELETE
 */
async function deleteBook(id: string) {
  const alert = await alertController.create({
    header: "Delete Book",
    message: "Are you sure you want to remove this book?",
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
      },
      {
        text: "Delete",
        role: "destructive",
        handler: () => {
          removeBook(id);
        },
      },
    ],
  });

  await alert.present();
}

async function removeBook(id: string) {
  try {
    const bookRef = dbRef(
      db,
      `books/${id}`
    );

    await remove(bookRef);

    await loadBooks();

    showMessage(
      "Book removed from your collection.",
      "success"
    );

  } catch (error) {
    console.error("Error deleting book:", error);

    showMessage(
      "Unable to delete the book.",
      "danger"
    );
  }
}

/*
 * Cancel Add/Edit
 */
function cancelEdit() {
  editingBook.value = null;
  showForm.value = false;
}

/*
 * Toast Message
 */
async function showMessage(
  message: string,
  color: "success" | "danger"
) {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: "bottom",
    color,
  });

  await toast.present();
}

/*
 * Load Firebase data when page starts
 */
onMounted(() => {
  loadBooks();
});
</script>

<style scoped>
ion-content {
  --background: #f7f3ed;
}

ion-toolbar {
  --background: #f7f3ed;
  --color: #352c26;
  --border-width: 0;
  padding: 8px 18px 4px;
}

.app-header {
  box-shadow: none;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.small-title {
  margin: 0 0 3px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #9a8069;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #352c26;
}

.header-icon {
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8ddd0;
  border-radius: 12px;
}

.header-icon ion-icon {
  font-size: 22px;
  color: #725b48;
}

.page-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 10px 18px 35px;
}

.intro-section {
  margin: 5px 0 18px;
}

.intro-section p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #776c63;
}

.add-button {
  --background: #5e4938;
  --background-hover: #4f3d30;
  --color: #ffffff;
  --border-radius: 12px;
  --box-shadow: none;

  height: 50px;
  margin: 0 0 26px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
}

.form-wrapper {
  margin-top: 5px;
}

@media (min-width: 600px) {
  .page-container {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
