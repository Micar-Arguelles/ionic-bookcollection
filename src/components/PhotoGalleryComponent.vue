<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Photo Gallery</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <!-- Walang litrato -->
      <ion-text v-if="photos.length === 0" color="medium" class="ion-text-center">
        <p>No photos captured yet.</p>
      </ion-text>

      <!-- May mga litrato -->
      <ion-grid v-else>
        <ion-row>
          <ion-col size="6" size-md="4" v-for="(photo, index) in photos" :key="index">
            <ion-img :src="photo" alt="Captured photo" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
} from "@ionic/vue";

defineProps<{
  photos: string[];
}>();
</script>

<style scoped>
ion-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}
</style>