<template>
  <label
    :style="{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      fontFamily: 'Space Mono',
    }"
  >
    <span :style="labelTextStyle">{{ label }}</span>
    <span :style="{ position: 'relative', display: 'block' }">
      <input
        type="number"
        inputmode="decimal"
        :step="step"
        :value="modelValue"
        @input="onInput"
        :style="inputStyle"
      />
      <span :style="unitStyle">{{ unit }}</span>
    </span>
  </label>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    label: String,
    modelValue: [Number, String],
    theme: Object,
    unit: { type: String, default: "mm" },
    step: { type: Number, default: 0.1 },
  });

  const emit = defineEmits(["update:modelValue"]);

  function onInput(e) {
    const v = e.target.value;
    const parsed = parseFloat(v);
    emit("update:modelValue", isNaN(parsed) ? 0 : parsed);
  }

  const labelTextStyle = computed(() => ({
    fontSize: "10px",
    color: props.theme.muted,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    fontWeight: 700,
  }));

  const inputStyle = computed(() => ({
    width: "100%",
    padding: "10px 36px 10px 12px",
    border: `1px solid ${props.theme.border}`,
    backgroundColor: props.theme.surface,
    color: props.theme.text,
    fontFamily: "Space Mono",
    fontSize: "14px",
    fontWeight: 700,
    borderRadius: 0,
    boxSizing: "border-box",
    outline: "none",
  }));

  const unitStyle = computed(() => ({
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "10px",
    color: props.theme.muted,
    letterSpacing: "0.1em",
    pointerEvents: "none",
  }));
</script>
