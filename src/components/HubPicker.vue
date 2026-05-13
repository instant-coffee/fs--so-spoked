<template>
  <div>
    <PresetCustomTabs
      :value="mode"
      :theme="theme"
      @change="$emit('change-mode', $event)"
    />

    <!-- Preset list -->
    <div
      v-if="mode === 'preset'"
      :style="{ maxHeight: '360px', overflowY: 'auto', paddingRight: '2px' }"
    >
      <PresetItem
        v-for="h in hubList"
        :key="h.id"
        :active="!hub?._custom && hub?.id === h.id"
        :theme="theme"
        :primary="`${h.brand} — ${h.model}`"
        :secondary="`L: ⌀${h.fdL} · ${h.ftcL}mm  │  R: ⌀${h.fdR} · ${h.ftcR}mm`"
        @select="onSelectPreset(h)"
      />
    </div>

    <!-- Custom inputs -->
    <div
      v-else
      :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }"
    >
      <div :style="sideHintStyle">
        {{
          build.wheelSide === "front"
            ? "L = DISC SIDE · R = NON-DISC"
            : "L = NON-DRIVE · R = DRIVE"
        }}
      </div>
      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }"
      >
        <NumInput
          label="Flange ⌀ L"
          :model-value="custom.fdL"
          @update:model-value="custom.fdL = $event"
          :theme="theme"
        />
        <NumInput
          label="Flange ⌀ R"
          :model-value="custom.fdR"
          @update:model-value="custom.fdR = $event"
          :theme="theme"
        />
        <NumInput
          label="FTC L"
          :model-value="custom.ftcL"
          @update:model-value="custom.ftcL = $event"
          :theme="theme"
        />
        <NumInput
          label="FTC R"
          :model-value="custom.ftcR"
          @update:model-value="custom.ftcR = $event"
          :theme="theme"
        />
      </div>
      <NumInput
        label="Spoke hole ⌀"
        :model-value="custom.shd"
        @update:model-value="custom.shd = $event"
        :theme="theme"
        :step="0.1"
      />
      <button @click="applyCustom" :style="applyBtnStyle">
        Apply custom hub
      </button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, computed } from "vue";
  import PresetCustomTabs from "./ui/PresetCustomTabs.vue";
  import PresetItem from "./ui/PresetItem.vue";
  import NumInput from "./ui/NumInput.vue";

  const props = defineProps({
    theme: Object,
    build: Object,
    hubList: Array,
    hub: Object,
    mode: String,
  });

  const emit = defineEmits([
    "set-hub",
    "set-hub-custom",
    "change-mode",
    "done",
  ]);

  const custom = reactive({
    fdL: props.build.hubCustom?.fdL ?? 54.5,
    ftcL: props.build.hubCustom?.ftcL ?? 31.6,
    ftcR: props.build.hubCustom?.ftcR ?? 23.5,
    fdR: props.build.hubCustom?.fdR ?? 60.5,
    shd: props.build.hubCustom?.shd ?? 2.6,
  });

  function onSelectPreset(h) {
    emit("set-hub", h);
    emit("done");
  }

  function applyCustom() {
    emit("set-hub-custom", { ...custom });
    emit("done");
  }

  const sideHintStyle = computed(() => ({
    fontFamily: "Space Mono",
    fontSize: "10px",
    color: props.theme.muted,
    letterSpacing: "0.12em",
    fontWeight: 700,
  }));

  const applyBtnStyle = computed(() => ({
    padding: "12px 0",
    backgroundColor: props.theme.accent,
    color: "#000",
    border: "none",
    fontFamily: "Space Mono",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    cursor: "pointer",
  }));
</script>
