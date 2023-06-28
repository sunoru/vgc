<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> VGC Tools </q-toolbar-title>

        <q-toggle label="Dark Mode" v-model="config.darkMode" color="black" />

        <q-btn flat stretch disable icon="login" label="Sign in" />

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Pages </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { EssentialLinkProps } from '../components/EssentialLink.vue'

import { useConfigStore } from '../stores/config'

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Home',
    icon: 'home',
    to: '/',
  },
  {
    title: 'Replay Importer',
    caption: 'Parse & import Pokemon Showdown replays',
    icon: 'video_library',
    to: '/replay-importer',
  },
  {
    title: 'Battles',
    caption: 'Manage & analyze saved battles',
    icon: 'view_list',
    to: '/battles',
  },
  {
    title: 'Damage Calculator',
    icon: 'calculate',
    to: '/damagecalc',
  },
  // {
  //   title: 'Speed Tiers',
  //   icon: 'speed',
  //   to: '/speed-tiers',
  // },
  // {
  //   title: 'Scripts',
  //   icon: 'integration_instructions',
  //   to: '/scripts',
  // },
  {
    title: 'Settings',
    icon: 'settings',
    to: '/settings',
  },
  {
    title: 'Source Code',
    caption: 'https://github.com/sunoru/vgc',
    icon: 'code',
    href: 'https://github.com/sunoru/vgc',
    target: '_blank',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const config = useConfigStore().config
</script>
