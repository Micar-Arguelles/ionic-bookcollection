<template>
  <div class="book-item">

    <div class="book-cover">
      <ion-icon :icon="bookOutline" />
    </div>

    <div class="book-details">
      <h3>{{ book.title }}</h3>

      <p class="author">
        {{ book.author }}
      </p>

      <div class="book-info">
        <span>{{ book.category }}</span>
        <span>{{ book.publicationYear }}</span>
      </div>

      <div
        class="status"
        :class="{
          available: book.availability === 'Available',
          unavailable: book.availability === 'Unavailable'
        }"
      >
        <span class="status-dot"></span>
        {{ book.availability }}
      </div>
    </div>

    <div class="book-actions">

      <ion-button
        fill="clear"
        size="small"
        class="edit-button"
        @click="$emit('edit', book)"
      >
        <ion-icon
          :icon="createOutline"
          slot="icon-only"
        />
      </ion-button>

      <ion-button
        fill="clear"
        size="small"
        class="delete-button"
        @click="$emit('delete', book.id)"
      >
        <ion-icon
          :icon="trashOutline"
          slot="icon-only"
        />
      </ion-button>

    </div>

  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
} from "@ionic/vue";

import {
  bookOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publicationYear: number;
  availability: string;
}

defineProps<{
  book: Book;
}>();

defineEmits<{
  edit: [book: Book];
  delete: [id: string];
}>();
</script>

<style scoped>
.book-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  background: #fffdf9;
  border: 1px solid #e5dbd0;
  border-radius: 15px;
  box-shadow: 0 3px 12px rgba(80, 60, 45, 0.045);
}

.book-cover {
  width: 48px;
  height: 62px;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8ddd0;
  border-radius: 7px;
  box-shadow: inset 0 0 0 1px rgba(100, 75, 55, 0.05);
}

.book-cover ion-icon {
  font-size: 23px;
  color: #725b48;
}

.book-details {
  flex: 1;
  min-width: 0;
}

.book-details h3 {
  margin: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 650;
  color: #352c26;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author {
  margin: 3px 0 7px;
  overflow: hidden;
  font-size: 12px;
  color: #8a7e75;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.book-info {
  display: flex;
  gap: 5px;
  margin-bottom: 7px;
}

.book-info span {
  padding: 4px 7px;
  background: #f1ebe4;
  border-radius: 5px;
  font-size: 10px;
  color: #76695f;
}

.status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.available {
  color: #637653;
}

.unavailable {
  color: #a0836c;
}

.book-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.book-actions ion-button {
  --padding-start: 5px;
  --padding-end: 5px;

  width: 30px;
  height: 30px;
  margin: 0;
}

.book-actions ion-icon {
  font-size: 17px;
}

.edit-button {
  --color: #80664f;
}

.delete-button {
  --color: #a15c55;
}
</style>