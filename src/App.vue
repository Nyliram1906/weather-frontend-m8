<template>
  <NavBar />
  <router-view />
  <FooterApp />
</template>

<script setup>
import NavBar from '@/components/Navbar.vue'
import FooterApp from '@/components/Footer.vue'
</script>

<style scoped></style>
