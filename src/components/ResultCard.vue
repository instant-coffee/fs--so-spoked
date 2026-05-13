<template>
  <div v-if="result" :style="cardStyle">
    <!-- Header row -->
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '18px',
      }"
    >
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: theme.resultAccent,
        }"
      >
        SPOKE LENGTH
      </span>
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '9px',
          color: '#888880',
          letterSpacing: '0.1em',
        }"
      >
        {{ build.holes }}H · {{ build.crossings }}X · LIVE
      </span>
    </div>

    <!-- Numbers -->
    <div
      :style="{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        position: 'relative',
      }"
    >
      <!-- Left (NDS or Disc) -->
      <div :style="{ paddingRight: '12px', textAlign: 'left' }">
        <div :style="numLabelStyle">{{ labelLeft }}</div>
        <div :style="{ display: 'flex', alignItems: 'baseline', gap: '4px' }">
          <span :style="bigNumStyle">{{ leftRound }}</span>
          <span :style="mmStyle">mm</span>
        </div>
        <div :style="rawStyle">RAW {{ left.toFixed(2) }}</div>
      </div>

      <!-- Divider -->
      <span aria-hidden="true" :style="dividerStyle" />

      <!-- Right (DS or Non-disc) -->
      <div :style="{ paddingLeft: '12px', textAlign: 'right' }">
        <div :style="numLabelStyle">{{ labelRight }}</div>
        <div
          :style="{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
            gap: '4px',
          }"
        >
          <span :style="bigNumStyle">{{ rightRound }}</span>
          <span :style="mmStyle">mm</span>
        </div>
        <div :style="rawStyle">RAW {{ right.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Detailed extras -->
    <div v-if="detail === 'detailed'" :style="detailStyle">
      <div>
        EFFECTIVE ERD<br /><span style="color: #fff"
          >{{ rim?.erd.toFixed(1) }}mm</span
        >
      </div>
      <div>
        ASYM OFFSET<br /><span style="color: #fff"
          >{{ (rim?.asym ?? 0).toFixed(1) }}mm</span
        >
      </div>
      <div>
        FLANGE ⌀ L / R<br /><span style="color: #fff"
          >{{ hub?.fdL }} / {{ hub?.fdR }}mm</span
        >
      </div>
      <div>
        FTC L / R<br /><span style="color: #fff"
          >{{ hub?.ftcL }} / {{ hub?.ftcR }}mm</span
        >
      </div>
    </div>

    <!-- Actions -->
    <div :style="{ display: 'flex', gap: '8px', marginTop: '18px' }">
      <button @click="$emit('save')" :style="saveBtnStyle">Save build</button>
      <button @click="handleCopy" :style="copyBtnStyle">
        {{ copied ? "Copied ✓" : "Copy result" }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { roundSpoke } from "../utils/calc.js";

  const props = defineProps({
    theme: Object,
    result: Object,
    rim: Object,
    hub: Object,
    build: Object,
    detail: String,
  });

  defineEmits(["save"]);

  const copied = ref(false);

  const left = computed(() => props.result?.left ?? 0);
  const right = computed(() => props.result?.right ?? 0);
  const leftRound = computed(() => roundSpoke(left.value));
  const rightRound = computed(() => roundSpoke(right.value));
  const labelLeft = computed(() =>
    props.build.wheelSide === "front" ? "DISC" : "NON-DRIVE"
  );
  const labelRight = computed(() =>
    props.build.wheelSide === "front" ? "NON-DISC" : "DRIVE"
  );

  const cardStyle = computed(() => ({
    backgroundColor: props.theme.resultBg,
    color: props.theme.resultText,
    padding: "24px 20px",
    borderBottom: `1px solid ${props.theme.border}`,
    position: "relative",
    overflow: "hidden",
  }));

  const numLabelStyle = computed(() => ({
    fontFamily: "Space Mono",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    color: "#888880",
    marginBottom: "6px",
  }));

  const bigNumStyle = computed(() => ({
    fontFamily: props.theme.displayFont,
    fontWeight: 700,
    fontSize: "56px",
    lineHeight: 0.95,
    color: props.theme.resultAccent,
    letterSpacing: "-0.02em",
  }));

  const mmStyle = {
    fontFamily: "Space Mono",
    fontSize: "13px",
    color: "#FFFFFF",
    letterSpacing: "0.05em",
  };

  const rawStyle = {
    fontFamily: "Space Mono",
    fontSize: "10px",
    color: "#888880",
    marginTop: "4px",
    letterSpacing: "0.05em",
  };

  const dividerStyle = {
    position: "absolute",
    left: "50%",
    top: "4px",
    bottom: "4px",
    width: "1px",
    backgroundColor: "#333333",
  };

  const detailStyle = computed(() => ({
    marginTop: "18px",
    paddingTop: "14px",
    borderTop: "1px solid #222",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    fontFamily: "Space Mono",
    fontSize: "10px",
    color: "#888880",
    letterSpacing: "0.06em",
  }));

  const saveBtnStyle = computed(() => ({
    flex: 1,
    padding: "12px 0",
    border: `1px solid ${props.theme.resultAccent}`,
    backgroundColor: "transparent",
    color: props.theme.resultAccent,
    fontFamily: "Space Mono",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
  }));

  const copyBtnStyle = computed(() => ({
    flex: 1,
    padding: "12px 0",
    border: "none",
    backgroundColor: props.theme.resultAccent,
    color: "#000000",
    fontFamily: "Space Mono",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
  }));

  async function handleCopy() {
    const txt = `${labelLeft.value} ${leftRound.value}mm (raw ${left.value.toFixed(2)}) | ${labelRight.value} ${rightRound.value}mm (raw ${right.value.toFixed(2)}) — ${props.build.holes}H ${props.build.crossings}X`;
    try {
      await navigator.clipboard.writeText(txt);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1400);
    } catch {}
  }
</script>
