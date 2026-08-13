<script setup>
/*
 * Shared filter defs for treated imagery.
 *
 * duotone: luminance remapped onto a two-point ink/paper ramp. Treated images
 * multiply over their container, so each surface supplies its own second
 * colour without needing a filter per article.
 *
 * grain: fine fractal noise blended back over the source and clipped to its
 * alpha, replacing the full-screen noise overlay.
 */
</script>

<template>
  <svg
    class="image-effects"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <filter
        id="duotone"
        color-interpolation-filters="sRGB"
      >
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0
                  0.2126 0.7152 0.0722 0 0
                  0.2126 0.7152 0.0722 0 0
                  0      0      0      1 0"
        />
        <feComponentTransfer>
          <feFuncR
            type="table"
            tableValues="0.09 0.99"
          />
          <feFuncG
            type="table"
            tableValues="0.08 0.97"
          />
          <feFuncB
            type="table"
            tableValues="0.24 0.93"
          />
        </feComponentTransfer>
      </filter>

      <filter
        id="grain"
        color-interpolation-filters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="1"
          seed="6"
          result="noise"
        />
        <feColorMatrix
          in="noise"
          type="saturate"
          values="0"
          result="mono"
        />
        <feComponentTransfer
          in="mono"
          result="grain"
        >
          <feFuncA
            type="linear"
            slope="0"
            intercept="0.12"
          />
        </feComponentTransfer>
        <feBlend
          in="grain"
          in2="SourceGraphic"
          mode="overlay"
          result="grained"
        />
        <feComposite
          in="grained"
          in2="SourceGraphic"
          operator="in"
        />
      </filter>
    </defs>
  </svg>
</template>

<style scoped>
.image-effects {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
