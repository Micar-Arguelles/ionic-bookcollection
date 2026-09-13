<template>
  <div class="book-section">

    <div class="section-header">
      <div>
        <p class="section-label">YOUR COLLECTION</p>

        <h2>My Books</h2>

        <p class="book-count">
          {{ books.length }}
          {{ books.length === 1 ? "book" : "books" }}
        </p>
      </div>

      <div class="collection-icon">
        <ion-icon :icon="libraryOutline" />
      </div>
    </div>

    <div
      v-if="books.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        <ion-icon :icon="bookOutline" />
      </div>

      <h3>Your shelf is empty</h3>

      <p>
        Add your first book to start your collection.
      </p>
    </div>

    <div
      v-else
      class="book-list"
    >
      <BookItem
        v-for="book in books"
        :key="book.id"
        :book="book"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";

import {
  bookOutline,
  libraryOutline,
} from "ionicons/icons";

import BookItem from "./BookItem.vue";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publicationYear: number;
  availability: string;
}

defineProps<{
  books: Book[];
}>();

defineEmits<{
  edit: [book: Book];
  delete: [id: string];
}>();
</script>

<style scoped>
.book-section {
  margin-top: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-label {
  margin: 0 0 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  color: #9a8069;
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #352c26;
}

.book-count {
  margin: 3px 0 0;
  font-size: 12px;
  color: #8a7e75;
}

.collection-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8ddd0;
  border-radius: 12px;
}

.collection-icon ion-icon {
  font-size: 21px;
  color: #725b48;
}

.empty-state {
  padding: 55px 20px;
  text-align: center;
  background: #fffdf9;
  border: 1px dashed #d9cec2;
  border-radius: 16px;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee4d8;
  border-radius: 50%;
}

.empty-icon ion-icon {
  font-size: 28px;
  color: #806b58;
}

.empty-state h3 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 600;
  color: #4b4038;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #8a7e75;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}
</style>