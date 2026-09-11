<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Kapag nag-emit ang CameraComponent ng "photoCaptured", tatawagin ang handlePhotoCaptured -->
      <CameraComponent @photoCaptured="handlePhotoCaptured" />

      <!-- Ipapasa ang photos array sa Gallery -->
      <PhotoGalleryComponent :photos="photos" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";

import CameraComponent from "@/components/CameraComponent.vue";
import PhotoGalleryComponent from "@/components/PhotoGalleryComponent.vue";

// State kung saan nakatabi ang listahan ng mga litrato
const photos = ref<string[]>([]);

// Function na nagdaragdag ng bagong kuha sa unahan ng array
const handlePhotoCaptured = (photoPath: string) => {
  photos.value.unshift(photoPath);
};
</script>