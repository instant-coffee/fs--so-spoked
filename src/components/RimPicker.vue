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
      :style="{ maxHeight: '320px', overflowY: 'auto', paddingRight: '2px' }"
    >
      <PresetItem
        v-for="r in RIMS"
        :key="r.id"
        :active="!rim?._custom && rim?.id === r.id"
        :theme="theme"
        :primary="`${r.brand} — ${r.model}`"
        :secondary="`${r.size} · ERD ${r.erd}mm · Asym ${r.asym}mm · ${r.holes}H typical`"
        :badge="r.size"
        @select="onSelectPreset(r)"
      />
    </div>

    <!-- Custom inputs -->
    <div
      v-else
      :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }"
    >
      <NumInput
        label="ERD (Effective Rim Diameter)"
        :model-value="custom.erd"
        @update:model-value="custom.erd = $event"
        :theme="theme"
        :step="0.1"
      />
      <NumInput
        label="Asymmetric offset"
        :model-value="custom.asym"
        @update:model-value="custom.asym = $event"
        :theme="theme"
        :step="0.1"
      />
      <button @click="applyCustom" :style="applyBtnStyle">
        Apply custom rim
      </button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, computed } from "vue";
  import { RIMS } from "../data/rims.js";
  import PresetCustomTabs from "./ui/PresetCustomTabs.vue";
  import PresetItem from "./ui/PresetItem.vue";
  import NumInput from "./ui/NumInput.vue";

  const props = defineProps({
    theme: Object,
    build: Object,
    rim: Object,
    mode: String,
  });

  const emit = defineEmits([
    "set-rim",
    "set-rim-custom",
    "change-mode",
    "done",
  ]);

  const custom = reactive({
    erd: props.build.rimCustom?.erd ?? 597,
    asym: props.build.rimCustom?.asym ?? 2,
  });

  function onSelectPreset(r) {
    emit("set-rim", r);
    emit("done");
  }

  function applyCustom() {
    emit("set-rim-custom", { erd: custom.erd, asym: custom.asym });
    emit("done");
  }

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
