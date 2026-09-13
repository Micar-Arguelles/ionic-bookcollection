<template>
  <div class="form-container">

    <div class="form-header">
      <div>
        <p class="form-label">
          {{ editingBook ? "UPDATE BOOK" : "NEW BOOK" }}
        </p>

        <h2>
          {{ editingBook ? "Edit Book" : "Add a Book" }}
        </h2>

        <p class="form-description">
          {{
            editingBook
              ? "Update the details of this book."
              : "Add a book to your collection."
          }}
        </p>
      </div>

      <div class="form-icon">
        <span>📖</span>
      </div>
    </div>

    <div class="input-group">
      <ion-item>
        <ion-input
          v-model="form.title"
          label="Book Title"
          label-placement="stacked"
          placeholder="e.g. The Hobbit"
        />
      </ion-item>
    </div>

    <div class="input-group">
      <ion-item>
        <ion-input
          v-model="form.author"
          label="Author"
          label-placement="stacked"
          placeholder="e.g. J.R.R. Tolkien"
        />
      </ion-item>
    </div>

    <div class="input-group">
      <ion-item>
        <ion-select
          v-model="form.category"
          label="Category"
          label-placement="stacked"
          placeholder="Choose a category"
        >
          <ion-select-option value="Fiction">
            Fiction
          </ion-select-option>

          <ion-select-option value="Non-Fiction">
            Non-Fiction
          </ion-select-option>

          <ion-select-option value="Science">
            Science
          </ion-select-option>

          <ion-select-option value="History">
            History
          </ion-select-option>

          <ion-select-option value="Romance">
            Romance
          </ion-select-option>

          <ion-select-option value="Fantasy">
            Fantasy
          </ion-select-option>

          <ion-select-option value="Other">
            Other
          </ion-select-option>
        </ion-select>
      </ion-item>
    </div>

    <div class="input-group">
      <ion-item>
        <ion-input
          v-model="form.publicationYear"
          type="number"
          label="Publication Year"
          label-placement="stacked"
          placeholder="e.g. 1997"
        />
      </ion-item>
    </div>

    <div class="input-group">
      <ion-item>
        <ion-select
          v-model="form.availability"
          label="Availability Status"
          label-placement="stacked"
        >
          <ion-select-option value="Available">
            Available
          </ion-select-option>

          <ion-select-option value="Unavailable">
            Unavailable
          </ion-select-option>
        </ion-select>
      </ion-item>
    </div>

    <p
      v-if="errorMessage"
      class="error-message"
    >
      {{ errorMessage }}
    </p>

    <div class="form-buttons">
      <ion-button
        expand="block"
        class="save-button"
        @click="submitForm"
      >
        {{ editingBook ? "Update Book" : "Save Book" }}
      </ion-button>

      <ion-button
        expand="block"
        fill="clear"
        class="cancel-button"
        @click="cancelEdit"
      >
        Cancel
      </ion-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import {
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
} from "@ionic/vue";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publicationYear: number;
  availability: string;
}

const props = defineProps<{
  editingBook: Book | null;
}>();

const emit = defineEmits<{
  save: [
    book: {
      id?: string;
      title: string;
      author: string;
      category: string;
      publicationYear: number;
      availability: string;
    }
  ];
  cancel: [];
}>();

const form = ref({
  title: "",
  author: "",
  category: "",
  publicationYear: new Date().getFullYear(),
  availability: "Available",
});

const errorMessage = ref("");

watch(
  () => props.editingBook,
  (book) => {
    if (book) {
      form.value = {
        title: book.title,
        author: book.author,
        category: book.category,
        publicationYear: book.publicationYear,
        availability: book.availability,
      };
    } else {
      resetForm();
    }

    errorMessage.value = "";
  },
  { immediate: true }
);

function submitForm() {
  errorMessage.value = "";

  if (
    !form.value.title.trim() ||
    !form.value.author.trim() ||
    !form.value.category ||
    !form.value.publicationYear
  ) {
    errorMessage.value = "Please complete all fields.";
    return;
  }

  const currentYear = new Date().getFullYear();

  if (
    form.value.publicationYear < 1000 ||
    form.value.publicationYear > currentYear
  ) {
    errorMessage.value = "Please enter a valid publication year.";
    return;
  }

  emit("save", {
    ...(props.editingBook
      ? { id: props.editingBook.id }
      : {}),
    title: form.value.title.trim(),
    author: form.value.author.trim(),
    category: form.value.category,
    publicationYear: Number(form.value.publicationYear),
    availability: form.value.availability,
  });
}

function resetForm() {
  form.value = {
    title: "",
    author: "",
    category: "",
    publicationYear: new Date().getFullYear(),
    availability: "Available",
  };
}

function cancelEdit() {
  emit("cancel");
}
</script>

<style scoped>
.form-container {
  background: #fffdf9;
  padding: 20px;
  border: 1px solid #e6ddd3;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(80, 60, 45, 0.06);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-label {
  margin: 0 0 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  color: #9a8069;
}

.form-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #352c26;
}

.form-description {
  margin: 5px 0 0;
  font-size: 13px;
  color: #81756c;
}

.form-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee4d8;
  border-radius: 13px;
  font-size: 23px;
}

.input-group {
  margin-bottom: 9px;
}

ion-item {
  --background: #f8f4ef;
  --border-color: #e2d8ce;
  --color: #352c26;
  --inner-padding-end: 12px;
  --inner-padding-start: 12px;

  border: 1px solid #e2d8ce;
  border-radius: 10px;
  overflow: hidden;
}

ion-input {
  --color: #352c26;
  --placeholder-color: #a69b92;
  --highlight-color-focused: #80664f;
}

ion-select {
  --color: #352c26;
  --placeholder-color: #a69b92;
}

.error-message {
  margin: 12px 2px 0;
  font-size: 13px;
  color: #b4473f;
}

.form-buttons {
  margin-top: 20px;
}

.save-button {
  --background: #5e4938;
  --color: #ffffff;
  --border-radius: 10px;
  --box-shadow: none;

  height: 47px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
}

.cancel-button {
  --color: #76695f;

  height: 42px;
  font-size: 13px;
  text-transform: none;
}
</style>