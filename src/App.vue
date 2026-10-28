
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import EventList from "./components/EventList.vue";
import { initialEvents } from "./data/events";
import type { CampusEvent } from "./types";

const events = ref<CampusEvent[]>(initialEvents.map(e => ({ ...e })));

const myBookings = ref<number[]>([]);

const bookingCount = computed(() => myBookings.value.length);

function onBook(id: number) {
  const event = events.value.find(e => e.id === id);

  if (!event || event.booked >= event.capacity) {
    return;
  }

  event.booked++;
  myBookings.value.push(id);
}

// Restore bookings when the app starts.
try {
  const saved = localStorage.getItem("myBookings");

  if (saved) {
    const ids: unknown = JSON.parse(saved);

    if (Array.isArray(ids) && ids.every(id => typeof id === "number")) {
      for (const id of ids) {
        const event = events.value.find(e => e.id === id);

        if (event && event.booked < event.capacity) {
          event.booked++;
          myBookings.value.push(id);
        }
      }
    }
  }
} catch {
  // Ignore unavailable localStorage or invalid saved data.
}

// Save bookings whenever they change.
watch(
  myBookings,
  (ids) => {
    try {
      localStorage.setItem("myBookings", JSON.stringify(ids));
    } catch {
      // The app can still work when storage is unavailable.
    }
  },
  { deep: true }
);
</script>

<template>
  <main>
    <header>
      <h1>Campus Events</h1>
      <p class="mine">
        You have booked {{ bookingCount }}
        {{ bookingCount === 1 ? "seat" : "seats" }}.
      </p>
    </header>

    <EventList :events="events" @book="onBook" />
  </main>
</template>

<style scoped>
header { margin-bottom: 16px; }
.mine { color: #6b7280; margin: 0; }
</style>
