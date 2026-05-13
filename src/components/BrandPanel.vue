<template>
  <!-- Fixed floating trigger — bottom-left, mirroring TWEAKS at bottom-right -->
  <button @click="open = !open" :style="triggerStyle">≡ BRAND</button>

  <Teleport to="body">
    <div v-if="open" ref="panelRef" class="brd-panel" :style="panelPos">
      <div class="brd-hd" @mousedown="startDrag">
        <b>Brand</b>
        <button class="brd-x" aria-label="Close" @mousedown.stop @click="open = false">✕</button>
      </div>

      <div class="brd-body">

        <!-- ── Identity ──────────────────────────────────────────────────── -->
        <div class="brd-sect">Identity</div>
        <div class="brd-row">
          <div class="brd-lbl"><span>Mode</span></div>
          <div class="brd-seg">
            <div class="brd-seg-thumb" :style="segThumb(brand.enabled ? 1 : 0, 2)" />
            <button type="button" @click="set('enabled', false)">Default</button>
            <button type="button" @click="set('enabled', true)">Brand</button>
          </div>
        </div>

        <!-- ── Colors ────────────────────────────────────────────────────── -->
        <div class="brd-sect">Colors</div>

        <div class="brd-row">
          <div class="brd-lbl"><span>Primary</span></div>
          <div class="brd-color-row">
            <label class="brd-swatch" :style="{ background: brand.primary }">
              <input type="color" :value="brand.primary" @input="set('primary', $event.target.value)" />
            </label>
            <input type="text" class="brd-hex" :value="brand.primary"
              @change="onHex('primary', $event.target.value)" maxlength="7" placeholder="#000000" />
          </div>
        </div>

        <div class="brd-row">
          <div class="brd-lbl"><span>Secondary</span></div>
          <div class="brd-color-row">
            <label class="brd-swatch" :style="{ background: brand.secondary }">
              <input type="color" :value="brand.secondary" @input="set('secondary', $event.target.value)" />
            </label>
            <input type="text" class="brd-hex" :value="brand.secondary"
              @change="onHex('secondary', $event.target.value)" maxlength="7" placeholder="#000000" />
          </div>
        </div>

        <div class="brd-row">
          <div class="brd-lbl"><span>Accent</span></div>
          <div class="brd-color-row">
            <label class="brd-swatch" :style="{ background: brand.accent }">
              <input type="color" :value="brand.accent" @input="set('accent', $event.target.value)" />
            </label>
            <input type="text" class="brd-hex" :value="brand.accent"
              @change="onHex('accent', $event.target.value)" maxlength="7" placeholder="#000000" />
          </div>
        </div>

        <!-- ── Typography ────────────────────────────────────────────────── -->
        <div class="brd-sect">Typography</div>

        <div class="brd-row">
          <div class="brd-lbl"><span>Display</span></div>
          <select class="brd-select" :value="brand.displayFont"
            @change="set('displayFont', $event.target.value)">
            <optgroup label="Serif">
              <option v-for="f in DISPLAY_FONTS.serif" :key="f" :value="f">{{ f }}</option>
            </optgroup>
            <optgroup label="Sans-serif">
              <option v-for="f in DISPLAY_FONTS.sansSerif" :key="f" :value="f">{{ f }}</option>
            </optgroup>
          </select>
        </div>

        <div class="brd-row">
          <div class="brd-lbl"><span>Body</span></div>
          <select class="brd-select" :value="brand.bodyFont"
            @change="set('bodyFont', $event.target.value)">
            <optgroup label="Serif">
              <option v-for="f in BODY_FONTS.serif" :key="f" :value="f">{{ f }}</option>
            </optgroup>
            <optgroup label="Sans-serif">
              <option v-for="f in BODY_FONTS.sansSerif" :key="f" :value="f">{{ f }}</option>
            </optgroup>
          </select>
        </div>

        <!-- TODO(v2): free-text Google Font name input with debounced live preview -->
        <!-- TODO(v3): custom font file upload (WOFF2 / TTF) -->

      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { ref, computed } from "vue"
  import { DISPLAY_FONTS, BODY_FONTS } from "../utils/brand.js"

  const props = defineProps({
    brand: Object,
  })

  const emit = defineEmits(["set-brand"])

  const open = ref(false)
  const panelRef = ref(null)
  // Panel anchored bottom-left, opposite TWEAKS (bottom-right)
  const offset = ref({ x: 16, y: 72 })

  const triggerStyle = computed(() => ({
    position: "fixed",
    bottom: "20px",
    left: "20px",
    zIndex: 9998,
    background: "#101010",
    color: "#FFFFFF",
    border: "1px solid #2A2A28",
    borderTop: `2px solid ${props.brand.primary}`,
    padding: "8px 14px",
    cursor: "pointer",
    fontFamily: "Space Mono",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  }))

  const panelPos = computed(() => ({
    left: `${offset.value.x}px`,
    bottom: `${offset.value.y}px`,
  }))

  function segThumb(idx, n) {
    return {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`,
    }
  }

  function set(key, value) {
    emit("set-brand", key, value)
  }

  function onHex(key, val) {
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      set(key, val.toUpperCase())
    }
  }

  const PAD = 16

  function startDrag(e) {
    const panel = panelRef.value
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    const startLeft   = rect.left
    const startBottom = window.innerHeight - rect.bottom

    function move(ev) {
      const p = panelRef.value
      if (!p) return
      const maxL = Math.max(PAD, window.innerWidth  - p.offsetWidth  - PAD)
      const maxB = Math.max(PAD, window.innerHeight - p.offsetHeight - PAD)
      offset.value = {
        x: Math.min(maxL, Math.max(PAD, startLeft   + (ev.clientX - sx))),
        y: Math.min(maxB, Math.max(PAD, startBottom - (ev.clientY - sy))),
      }
    }

    function up() {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup",   up)
    }

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup",   up)
  }
</script>

<style>
  /* ── Panel shell — matches TweaksPanel frosted glass aesthetic ── */
  .brd-panel {
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
  .brd-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 8px 10px 14px;
    cursor: move;
    user-select: none;
  }
  .brd-hd b {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
  .brd-x {
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
  .brd-x:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #29261b;
  }
  .brd-body {
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
  .brd-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .brd-lbl {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    color: rgba(41, 38, 27, 0.72);
  }
  .brd-lbl > span:first-child {
    font-weight: 500;
  }
  .brd-sect {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(41, 38, 27, 0.45);
    padding: 10px 0 0;
  }
  .brd-sect:first-child {
    padding-top: 0;
  }

  /* ── Segmented control (mode toggle) ── */
  .brd-seg {
    position: relative;
    display: flex;
    padding: 2px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.06);
    user-select: none;
  }
  .brd-seg-thumb {
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
  .brd-seg button {
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

  /* ── Color picker row ── */
  .brd-color-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brd-swatch {
    position: relative;
    width: 34px;
    height: 34px;
    border-radius: 6px;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow:
      0 0 0 0.5px rgba(0, 0, 0, 0.15),
      0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: block;
  }
  .brd-swatch input[type="color"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    padding: 0;
    border: none;
  }
  .brd-hex {
    flex: 1;
    height: 34px;
    padding: 0 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.7);
    color: #29261b;
    font: inherit;
    font-size: 12px;
    font-family: ui-monospace, monospace;
    letter-spacing: 0.04em;
    outline: none;
  }
  .brd-hex:focus {
    border-color: rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.95);
  }

  /* ── Font select ── */
  .brd-select {
    width: 100%;
    height: 32px;
    padding: 0 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.7);
    color: #29261b;
    font: inherit;
    font-size: 12px;
    outline: none;
    cursor: pointer;
    appearance: auto;
  }
  .brd-select:focus {
    border-color: rgba(0, 0, 0, 0.3);
  }
</style>
