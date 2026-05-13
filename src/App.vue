<template>
  <!-- Monolith mode -->
  <MonolithView
    v-if="tweaks.monolith"
    :theme="theme"
    :result="result"
    :rim="rim"
    :hub="hub"
    :build="build"
    @exit="setTweak('monolith', false)"
  />

  <!-- Main layout -->
  <div
    v-else
    :style="{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: 'Space Grotesk',
      display: 'flex',
      justifyContent: 'center',
    }"
  >
    <div
      :style="{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: theme.bg,
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <Header
        :theme="theme"
        :wheel-side="build.wheelSide"
        @set-wheel-side="onSetWheelSide"
      />

      <ResultCard
        :theme="theme"
        :result="result"
        :rim="rim"
        :hub="hub"
        :build="build"
        :detail="tweaks.resultDetail"
        @save="saveBuild"
      />

      <!-- Step rows -->
      <div :style="{ marginTop: '24px' }">
        <!-- Step 1: Rim -->
        <StepRow
          v-if="!isWizard || openStep === 1"
          num="01"
          label="Rim"
          :value="rimSummary"
          :sub="rimSub"
          :open="openStep === 1"
          :theme="theme"
          @toggle="toggleStep(1)"
        >
          <RimPicker
            :theme="theme"
            :build="build"
            :rim="rim"
            :mode="rimMode"
            @set-rim="setRim"
            @set-rim-custom="setRimCustom"
            @change-mode="rimMode = $event"
            @done="isWizard ? (openStep = 2) : (openStep = null)"
          />
        </StepRow>

        <!-- Step 2: Hub -->
        <StepRow
          v-if="!isWizard || openStep === 2"
          num="02"
          :label="`${build.wheelSide} hub`"
          :value="hubSummary"
          :sub="hubSub"
          :open="openStep === 2"
          :theme="theme"
          @toggle="toggleStep(2)"
        >
          <HubPicker
            :theme="theme"
            :build="build"
            :hub-list="hubList"
            :hub="hub"
            :mode="hubMode"
            @set-hub="setHub"
            @set-hub-custom="setHubCustom"
            @change-mode="hubMode = $event"
            @done="isWizard ? (openStep = 3) : (openStep = null)"
          />
        </StepRow>

        <!-- Step 3: Holes -->
        <StepRow
          v-if="!isWizard || openStep === 3"
          num="03"
          label="Hole count"
          :value="`${build.holes} holes`"
          :sub="`${build.holes / 2} per flange`"
          :open="openStep === 3"
          :theme="theme"
          @toggle="toggleStep(3)"
        >
          <HolePicker
            :value="build.holes"
            :theme="theme"
            @change="updateBuild({ holes: $event })"
            @done="isWizard ? (openStep = 4) : (openStep = null)"
          />
        </StepRow>

        <!-- Step 4: Lacing -->
        <StepRow
          v-if="!isWizard || openStep === 4"
          num="04"
          label="Lacing pattern"
          :value="crossing.label"
          :sub="
            crossing.key === 0
              ? 'No crossings — radial'
              : `${crossing.key} crossing${crossing.key > 1 ? 's' : ''} per spoke`
          "
          :open="openStep === 4"
          :theme="theme"
          @toggle="toggleStep(4)"
        >
          <LacingPicker
            :value="build.crossings"
            :theme="theme"
            @change="updateBuild({ crossings: $event })"
            @done="openStep = null"
          />
        </StepRow>

        <!-- Wizard navigation -->
        <div
          v-if="isWizard"
          :style="{
            display: 'flex',
            gap: '8px',
            padding: '20px',
            borderTop: `1px solid ${theme.border}`,
          }"
        >
          <button
            :disabled="openStep <= 1"
            @click="openStep = Math.max(1, openStep - 1)"
            :style="wizardBackStyle"
          >
            ‹ Back
          </button>
          <button
            :disabled="openStep >= 4"
            @click="openStep = Math.min(4, openStep + 1)"
            :style="wizardNextStyle"
          >
            Next ›
          </button>
        </div>
      </div>

      <DiagramSection
        :theme="theme"
        :holes="build.holes"
        :crossings="build.crossings"
      />

      <RecentBuilds
        v-if="recents.length > 0"
        :theme="theme"
        :recents="recents"
        @load="loadRecent"
        @clear="recents = []"
      />

      !-- Footer -->
      <div :style="footerStyle">
        <span>SPOKE CALC · v1.0</span>
        <span>{{ recents.length }} SAVED</span>
      </div>
    </div>
  </div>

  <!-- Tweaks panel (visible unless in monolith) -->
  <TweaksPanel v-if="!tweaks.monolith" :tweaks="tweaks" @set-tweak="setTweak" />
</template>

<script setup>
  import { ref, computed, watch } from "vue";

  import { RIMS } from "./data/rims.js";
  import { REAR_HUBS, FRONT_HUBS } from "./data/hubs.js";
  import { LACING_OPTIONS } from "./data/options.js";
  import { calcSpokes } from "./utils/calc.js";
  import { makeTheme } from "./utils/theme.js";

  import Header from "./components/Header.vue";
  import ResultCard from "./components/ResultCard.vue";
  import StepRow from "./components/StepRow.vue";
  import RimPicker from "./components/RimPicker.vue";
  import HubPicker from "./components/HubPicker.vue";
  import HolePicker from "./components/HolePicker.vue";
  import LacingPicker from "./components/LacingPicker.vue";
  import DiagramSection from "./components/DiagramSection.vue";
  import RecentBuilds from "./components/RecentBuilds.vue";
  import MonolithView from "./components/MonolithView.vue";
  import TweaksPanel from "./components/TweaksPanel.vue";

  // ── Tweaks ───────────────────────────────────────────────────────────────────
  const tweaks = ref(
    (() => {
      try {
        return (
          JSON.parse(localStorage.getItem("spokecalc:tweaks") || "null") ||
          defaultTweaks()
        );
      } catch {
        return defaultTweaks();
      }
    })()
  );

  function defaultTweaks() {
    return {
      theme: "light",
      accent: "#FF5C00",
      layout: "single",
      resultDetail: "minimal",
      monolith: false,
    };
  }

  function setTweak(key, value) {
    tweaks.value = { ...tweaks.value, [key]: value };
  }

  watch(
    tweaks,
    (val) => {
      try {
        localStorage.setItem("spokecalc:tweaks", JSON.stringify(val));
      } catch {}
    },
    { deep: true }
  );

  // ── Theme ────────────────────────────────────────────────────────────────────
  const theme = computed(() =>
    makeTheme(tweaks.value.theme, tweaks.value.accent)
  );

  // ── Build state ───────────────────────────────────────────────────────────────
  const DEFAULT_BUILD = {
    wheelSide: "rear",
    rimId: "nobl-tr37-29",
    rimCustom: null,
    hubId: "p321-g3-148",
    hubCustom: null,
    holes: 32,
    crossings: 3,
  };

  const build = ref(
    (() => {
      try {
        return (
          JSON.parse(localStorage.getItem("spokecalc:build") || "null") ||
          DEFAULT_BUILD
        );
      } catch {
        return DEFAULT_BUILD;
      }
    })()
  );

  const recents = ref(
    (() => {
      try {
        return JSON.parse(localStorage.getItem("spokecalc:recents") || "[]");
      } catch {
        return [];
      }
    })()
  );

  watch(
    build,
    (val) => {
      try {
        localStorage.setItem("spokecalc:build", JSON.stringify(val));
      } catch {}
    },
    { deep: true }
  );

  watch(
    recents,
    (val) => {
      try {
        localStorage.setItem("spokecalc:recents", JSON.stringify(val));
      } catch {}
    },
    { deep: true }
  );

  // ── UI state ─────────────────────────────────────────────────────────────────
  const openStep = ref(tweaks.value.layout === "wizard" ? 1 : null);
  const rimMode = ref("preset");
  const hubMode = ref("preset");

  const isWizard = computed(() => tweaks.value.layout === "wizard");

  watch(
    () => tweaks.value.layout,
    (layout) => {
      if (layout === "wizard" && openStep.value === null) openStep.value = 1;
    }
  );

  // ── Resolved data ─────────────────────────────────────────────────────────────
  const hubList = computed(() =>
    build.value.wheelSide === "front" ? FRONT_HUBS : REAR_HUBS
  );

  const rim = computed(() => {
    if (build.value.rimCustom)
      return { ...build.value.rimCustom, _custom: true };
    return RIMS.find((r) => r.id === build.value.rimId) || null;
  });

  const hub = computed(() => {
    if (build.value.hubCustom)
      return { ...build.value.hubCustom, _custom: true };
    return hubList.value.find((h) => h.id === build.value.hubId) || null;
  });

  const result = computed(() => {
    if (!rim.value || !hub.value) return null;
    return calcSpokes({
      rim: rim.value,
      hub: hub.value,
      holes: build.value.holes,
      crossings: build.value.crossings,
      wheelSide: build.value.wheelSide,
    });
  });

  const rimSummary = computed(() => {
    if (!rim.value) return null;
    return rim.value._custom
      ? `Custom — ERD ${rim.value.erd}mm`
      : `${rim.value.brand} ${rim.value.model}`;
  });

  const rimSub = computed(() => {
    if (!rim.value) return null;
    return rim.value._custom
      ? `Asym ${rim.value.asym}mm`
      : `${rim.value.size} · ERD ${rim.value.erd}mm · Asym ${rim.value.asym}mm`;
  });

  const hubSummary = computed(() => {
    if (!hub.value) return null;
    return hub.value._custom
      ? "Custom hub"
      : `${hub.value.brand} ${hub.value.model}`;
  });

  const hubSub = computed(() => {
    if (!hub.value) return null;
    return `L: ${hub.value.fdL}mm ⌀ / ${hub.value.ftcL}mm   R: ${hub.value.fdR}mm ⌀ / ${hub.value.ftcR}mm`;
  });

  const crossing = computed(
    () =>
      LACING_OPTIONS.find((o) => o.key === build.value.crossings) ||
      LACING_OPTIONS[3]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────────
  function updateBuild(patch) {
    build.value = { ...build.value, ...patch };
  }

  function onSetWheelSide(ws) {
    updateBuild({
      wheelSide: ws,
      hubId: ws === "front" ? FRONT_HUBS[0].id : REAR_HUBS[0].id,
      hubCustom: null,
    });
  }

  function setRim(rimObj) {
    updateBuild({ rimId: rimObj.id, rimCustom: null });
  }

  function setRimCustom(custom) {
    updateBuild({ rimCustom: custom, rimId: null });
  }

  function setHub(hubObj) {
    updateBuild({ hubId: hubObj.id, hubCustom: null });
  }

  function setHubCustom(custom) {
    updateBuild({ hubCustom: custom, hubId: null });
  }

  function toggleStep(n) {
    if (isWizard.value) {
      openStep.value = n;
    } else {
      openStep.value = openStep.value === n ? null : n;
    }
  }

  function saveBuild() {
    if (!rim.value || !hub.value || !result.value) return;
    const r = rim.value;
    const h = hub.value;
    const entry = {
      id: Date.now(),
      label: `${r._custom ? "Custom rim" : `${r.brand} ${r.model}`} · ${h._custom ? "Custom hub" : `${h.brand} ${h.model.split(" ").slice(0, 2).join(" ")}`}`,
      sub: `${build.value.holes}H · ${build.value.crossings}X · ${build.value.wheelSide.toUpperCase()}`,
      left: result.value.left,
      right: result.value.right,
      build: { ...build.value },
    };
    recents.value = [
      entry,
      ...recents.value.filter((e) => e.label !== entry.label),
    ].slice(0, 6);
  }

  function loadRecent(entry) {
    build.value = entry.build;
  }

  // ── Wizard styles ─────────────────────────────────────────────────────────────
  const wizardBackStyle = computed(() => ({
    flex: 1,
    padding: "14px 0",
    border: `1px solid ${theme.value.text}`,
    backgroundColor: "transparent",
    color: theme.value.text,
    fontFamily: "Space Mono",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    cursor: openStep.value > 1 ? "pointer" : "not-allowed",
    opacity: openStep.value > 1 ? 1 : 0.3,
  }));

  const wizardNextStyle = computed(() => ({
    flex: 1,
    padding: "14px 0",
    border: "none",
    backgroundColor: theme.value.accent,
    color: "#000000",
    fontFamily: "Space Mono",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    cursor: openStep.value < 4 ? "pointer" : "not-allowed",
    opacity: openStep.value < 4 ? 1 : 0.3,
  }));

  const footerStyle = computed(() => ({
    borderTop: `1px solid ${theme.value.border}`,
    padding: "24px 20px 40px",
    fontFamily: "Space Mono",
    fontSize: "10px",
    color: theme.value.muted,
    letterSpacing: "0.1em",
    display: "flex",
    justifyContent: "space-between",
  }));
</script>
