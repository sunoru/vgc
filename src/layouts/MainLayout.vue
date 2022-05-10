<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          VGC Tools
        </q-toolbar-title>

        <div>By <a class="text-cyan-1" target="_blank" href="https://github.com/sunoru">Sunoru</a></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
    >
      <q-list>
        <q-item-label
          header
        >
          Pages
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Replay Parser',
    caption: 'Parse & import Pokemon Showdown replays',
    icon: 'video_library',
    link: '/replays'
  },
  {
    title: 'Battles',
    caption: 'Manage saved battles',
    icon: 'view_list',
    link: '/battles'
  },
  {
    title: 'Source Code',
    caption: 'https://github.com/sunoru/vgc',
    icon: 'code',
    href: 'https://github.com/sunoru/vgc',
    target: '_blank'
  }
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
});
</script>
wer
