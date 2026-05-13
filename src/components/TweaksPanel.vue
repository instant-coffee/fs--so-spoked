<template>
  <!-- Fixed floating trigger -->
  <button @click="open = !open" :style="triggerStyle">≡ TWEAKS</button>

  <!-- Panel (fixed position, draggable) -->
  <Teleport to="body">
    <div v-if="open" ref="panelRef" class="twk-panel" :style="panelPos">
      <div class="twk-hd" @mousedown="startDrag">
        <b>Tweaks</b>
        <button
          class="twk-x"
          aria-label="Close"
          @mousedown.stop
          @click="open = false"
        >
          ✕
        </button>
      </div>

      <div class="twk-body">
        <div class="twk-sect">Appearance</div>

        <!-- Theme -->
        <div class="twk-row">
          <div class="twk-lbl"><span>Theme</span></div>
          <div class="twk-seg">
            <div class="twk-seg-thumb" :style="segThumb(themeIdx, 2)" />
            <button type="button" @click="emit('set-tweak', 'theme', 'light')">
              Light
            </button>
            <button type="button" @click="emit('set-tweak', 'theme', 'dark')">
              Dark
            </button>
          </div>
        </div>

        <!-- Accent color chips -->
        <div class="twk-row">
          <div class="twk-lbl"><span>Accent</span></div>
          <div class="twk-chips" role="radiogroup">
            <button
              v-for="hex in ACCENT_HEXES"
              :key="hex"
              type="button"
              class="twk-chip"
              :data-on="tweaks.accent === hex ? '1' : '0'"
              :style="{ background: hex }"
              @click="emit('set-tweak', 'accent', hex)"
            >
              <svg
                v-if="tweaks.accent === hex"
                viewBox="0 0 14 14"
                aria-hidden="true"
                style="
                  position: absolute;
                  top: 6px;
                  left: 6px;
                  width: 13px;
                  height: 13px;
                  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
                "
              >
                <path
                  d="M3 7.2 5.8 10 11 4.2"
                  fill="none"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :stroke="isLight(hex) ? 'rgba(0,0,0,.78)' : '#fff'"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="twk-sect">Layout</div>

        <!-- Form layout -->
        <div class="twk-row">
          <div class="twk-lbl"><span>Form</span></div>
          <div class="twk-seg">
            <div class="twk-seg-thumb" :style="segThumb(layoutIdx, 2)" />
            <button
              type="button"
              @click="emit('set-tweak', 'layout', 'single')"
            >
              Single
            </button>
            <button
              type="button"
              @click="emit('set-tweak', 'layout', 'wizard')"
            >
              Wizard
            </button>
          </div>
        </div>

        <!-- Result detail -->
        <div class="twk-row">
          <div class="twk-lbl"><span>Result detail</span></div>
          <div class="twk-seg">
            <div class="twk-seg-thumb" :style="segThumb(detailIdx, 2)" />
            <button
              type="button"
              @click="emit('set-tweak', 'resultDetail', 'minimal')"
            >
              Minimal
            </button>
            <button
              type="button"
              @click="emit('set-tweak', 'resultDetail', 'detailed')"
            >
              Detailed
            </button>
          </div>
        </div>

        <div class="twk-sect">Modes</div>
        <button
          type="button"
          class="twk-btn"
          @click="emit('set-tweak', 'monolith', true)"
        >
          Enter Monolith mode
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { ACCENT_HEXES } from "../utils/theme.js";

  const props = defineProps({
    tweaks: Object,
  });

  const emit = defineEmits(["set-tweak"]);

  const open = ref(false);
  const panelRef = ref(null);
  const offset = ref({ x: 16, y: 72 });

  const triggerStyle = computed(() => ({
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 9998,
    background: "#101010",
    color: "#FFFFFF",
    border: "1px solid #2A2A28",
    borderTop: `2px solid ${props.tweaks.accent}`,
    padding: "8px 14px",
    cursor: "pointer",
    fontFamily: "Space Mono",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  }));

  const panelPos = computed(() => ({
    right: `${offset.value.x}px`,
    bottom: `${offset.value.y}px`,
  }));
  const themeIdx = computed(() => (props.tweaks.theme === "dark" ? 1 : 0));
  const layoutIdx = computed(() => (props.tweaks.layout === "wizard" ? 1 : 0));
  const detailIdx = computed(() =>
    props.tweaks.resultDetail === "detailed" ? 1 : 0
  );

  function segThumb(idx, n) {
    return {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`,
    };
  }

  function isLight(hex) {
    const h = String(hex).replace("#", "");
    const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
    const n = parseInt(x.slice(0, 6), 16);
    if (Number.isNaN(n)) return true;
    const r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255;
    return r * 299 + g * 587 + b * 114 > 148000;
  }

  const PAD = 16;

  function startDrag(e) {
    const panel = panelRef.value;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - rect.right;
    const startBottom = window.innerHeight - rect.bottom;

    function move(ev) {
      const p = panelRef.value;
      if (!p) return;
      const maxR = Math.max(PAD, window.innerWidth - p.offsetWidth - PAD);
      const maxB = Math.max(PAD, window.innerHeight - p.offsetHeight - PAD);
      offset.value = {
        x: Math.min(maxR, Math.max(PAD, startRight - (ev.clientX - sx))),
        y: Math.min(maxB, Math.max(PAD, startBottom - (ev.clientY - sy))),
      };
    }

    function up() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }
</script>

<style>
  .twk-panel {
    position: fixed;
    z-index: 2147483646;
    width: 280px;
    max-height: calc(100vh - 32px);
    display: flex;
    flex-direction: column;
    background: rgba(250, 249, 247, 0.88);
    color: #29261b;
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    backdrop-filter: blur(24px) saturate(160%);
    border: 0.5px solid rgba(255, 255, 255, 0.6);
    border-radius: 14px;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.5) inset,
      0 12px 40px rgba(0, 0, 0, 0.18);
    font:
      11.5px/1.4 ui-sans-serif,
      system-ui,
      -apple-system,
      sans-serif;
    overflow: hidden;
  }
  .twk-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 8px 10px 14px;
    cursor: move;
    user-select: none;
  }
  .twk-hd b {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
  .twk-x {
    appearance: none;
    border: 0;
    background: transparent;
    color: rgba(41, 38, 27, 0.55);
    width: 22px;
    height: 22px;
    border-radius: 6px;
    cursor: default;
    font-size: 13px;
    line-height: 1;
  }
  .twk-x:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #29261b;
  }
  .twk-body {
    padding: 2px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
  }
  .twk-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .twk-lbl {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    color: rgba(41, 38, 27, 0.72);
  }
  .twk-lbl > span:first-child {
    font-weight: 500;
  }
  .twk-sect {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(41, 38, 27, 0.45);
    padding: 10px 0 0;
  }
  .twk-sect:first-child {
    padding-top: 0;
  }
  .twk-seg {
    position: relative;
    display: flex;
    padding: 2px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.06);
    user-select: none;
  }
  .twk-seg-thumb {
    position: absolute;
    top: 2px;
    bottom: 2px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    transition:
      left 0.15s cubic-bezier(0.3, 0.7, 0.4, 1),
      width 0.15s;
  }
  .twk-seg button {
    appearance: none;
    position: relative;
    z-index: 1;
    flex: 1;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-weight: 500;
    min-height: 22px;
    border-radius: 6px;
    cursor: default;
    padding: 4px 6px;
    line-height: 1.2;
  }
  .twk-chips {
    display: flex;
    gap: 6px;
  }
  .twk-chip {
    position: relative;
    appearance: none;
    flex: 1;
    min-width: 0;
    height: 46px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    overflow: hidden;
    cursor: default;
    box-shadow:
      0 0 0 0.5px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.06);
    transition:
      transform 0.12s cubic-bezier(0.3, 0.7, 0.4, 1),
      box-shadow 0.12s;
  }
  .twk-chip:hover {
    transform: translateY(-1px);
    box-shadow:
      0 0 0 0.5px rgba(0, 0, 0, 0.18),
      0 4px 10px rgba(0, 0, 0, 0.12);
  }
  .twk-chip[data-on="1"] {
    box-shadow:
      0 0 0 1.5px rgba(0, 0, 0, 0.85),
      0 2px 6px rgba(0, 0, 0, 0.15);
  }
  .twk-btn {
    appearance: none;
    height: 26px;
    padding: 0 12px;
    border: 0;
    border-radius: 7px;
    background: rgba(0, 0, 0, 0.78);
    color: #fff;
    font: inherit;
    font-weight: 500;
    cursor: default;
  }
  .twk-btn:hover {
    background: rgba(0, 0, 0, 0.88);
  }
</style>
