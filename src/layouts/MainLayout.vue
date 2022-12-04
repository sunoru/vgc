<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> VGC Tools </q-toolbar-title>

        <q-toggle label="Dark Mode" v-model="inDarkMode" color="black" />

        <q-btn flat stretch disable icon="login" label="Sign in" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above elevated>
      <q-list>
        <q-item-label header> Pages </q-item-label>

        <essential-link v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import EssentialLink from '../components/EssentialLink.vue'
import { useQuasar } from 'quasar'
import { LocalConfigs } from 'src/utils/config'

const linksList = [
  {
    title: 'Home',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Replay Importer',
    caption: 'Parse & import Pokemon Showdown replays',
    icon: 'video_library',
    link: '/replays',
  },
  {
    title: 'Battles',
    caption: 'Manage & analyze saved battles',
    icon: 'view_list',
    link: '/battles',
  },
  {
    title: 'Damage Calculator',
    icon: 'calculate',
    link: '/damagecalc',
  },
  // {
  //   title: 'Speed Tiers',
  //   icon: 'speed',
  //   link: '/speed-tiers',
  // },
  {
    title: 'Scripts',
    icon: 'integration_instructions',
    link: '/scripts',
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings',
  },
  {
    title: 'Source Code',
    caption: 'https://github.com/sunoru/vgc',
    icon: 'code',
    href: 'https://github.com/sunoru/vgc',
    target: '_blank',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    const inDarkMode = ref(LocalConfigs.useDarkMode)
    $q.dark.set(inDarkMode.value)

    watch(
      () => inDarkMode.value,
      (v) => {
        LocalConfigs.useDarkMode = v
        $q.dark.set(v)
      }
    )

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      inDarkMode,
    }
  },
})
</script>
