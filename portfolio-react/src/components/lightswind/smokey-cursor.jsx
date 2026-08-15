import { useEffect, useRef } from 'react';

/**
 * SmokeyCursor — a parameterized WebGL fluid "smoke trail" cursor effect.
 *
 * Usage (matches the lightswind-style API):
 *
 *   import SmokeyCursor from '@/components/lightswind/smokey-cursor';
 *
 *   <SmokeyCursor />
 *   <SmokeyCursor simulationResolution={256} dyeResolution={1024} enableShading />
 *
 * Props:
 *   simulationResolution   int   sim grid width (default 128)
 *   dyeResolution          int   dye texture width (default 512)
 *   densityDissipation     num   smoke decay speed. Accepts 0..1 (1 = most
 *                                persistent) OR the 0-10 scale used in the
 *                                examples where higher = more persistent.
 *   velocityDissipation    num   velocity decay, same scale as above.
 *   pressureIterations     int   solver iterations (default 20)
 *   pressureDissipation    num   pressure decay 0..1 (default 0.8)
 *   curl                   num   vorticity strength (default 30)
 *   splatRadius            num   splat radius (default 0.25)
 *   splatForce             num   injection strength (default 6000 ≈ the
 *                                original cursor-trail.js feel)
 *   enableShading          bool  accepted for API parity; the underlying
 *                                shaders don't implement lighting, so it's a
 *                                no-op (same as the original sim).
 *   colorful               bool  default true = random hue per splat. If
 *                                false, the trail is fixed cyan.
 *   colorUpdateSpeed       num   how many mousemove events between color
 *                                changes (default 10).
 *   backgroundColor        {r,g,b} clear color (default matches the original).
 *
 * The simulation is the same WebGL fluid as the original cursor-trail.js,
 * with the init-order crash fixed. A canvas is created that fills the screen,
 * fixed, behind content (pointer-events: none), and cleanup tears it down.
 */

const DEFAULT_PROPS = {
  simulationResolution: 128,
  dyeResolution: 512,
  densityDissipation: 0.98,
  velocityDissipation: 0.99,
  pressureIterations: 20,
  pressureDissipation: 0.8,
  curl: 30,
  splatRadius: 0.25,
  splatForce: 6000,
  enableShading: true,
  colorful: true,
  colorUpdateSpeed: 10,
  backgroundColor: { r: 0.05, g: 0.05, b: 0.08 },
};

/**
 * Normalizes a dissipation prop into the 0..1 range the sim expects
 * (higher = slower decay). Values already <= 1 pass through; larger values
 * follow the examples' 0-10 scale (higher = more persistent).
 */
function normalizeDissipation(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0.9;
  if (n <= 1) return Math.min(1, Math.max(0, n));
  return 1 - 1 / (n + 1);
}

function runFluidSimulation(canvas, props) {
  const config = {
    simulationResolution: props.simulationResolution ?? DEFAULT_PROPS.simulationResolution,
    dyeResolution: props.dyeResolution ?? DEFAULT_PROPS.dyeResolution,
    densityDissipation: normalizeDissipation(props.densityDissipation ?? DEFAULT_PROPS.densityDissipation),
    velocityDissipation: normalizeDissipation(props.velocityDissipation ?? DEFAULT_PROPS.velocityDissipation),
    pressureDissipation: props.pressureDissipation ?? DEFAULT_PROPS.pressureDissipation,
    pressureIterations: props.pressureIterations ?? DEFAULT_PROPS.pressureIterations,
    curl: props.curl ?? DEFAULT_PROPS.curl,
    splatRadius: props.splatRadius ?? DEFAULT_PROPS.splatRadius,
    splatForce: props.splatForce ?? DEFAULT_PROPS.splatForce,
    shading: props.enableShading ?? DEFAULT_PROPS.enableShading,
    colorful: props.colorful ?? DEFAULT_PROPS.colorful,
    colorUpdateSpeed: props.colorUpdateSpeed ?? DEFAULT_PROPS.colorUpdateSpeed,
    backgroundColor: props.backgroundColor ?? DEFAULT_PROPS.backgroundColor,
  };

  // Scale so splatForce === 6000 reproduces the original cursor-trail.js feel
  // (which injected velocity scaled by 5.0).
  const forceScale = config.splatForce / 1200;

  let gl = null;

  const resizeCanvas = () => {
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      initFramebuffers();
    }
  };

  function getWebGLContext(c) {
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let glc = c.getContext('webgl2', params);
    const isWebGL2 = !!glc;
    if (!isWebGL2) {
      glc = c.getContext('webgl', params) || c.getContext('experimental-webgl', params);
    }
    if (!glc) return null;

    let halfFloat, supportLinearFiltering;
    if (isWebGL2) {
      glc.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = glc.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = glc.getExtension('OES_texture_half_float');
      supportLinearFiltering = glc.getExtension('OES_texture_half_float_linear');
    }

    glc.clearColor(config.backgroundColor.r, config.backgroundColor.g, config.backgroundColor.b, 1.0);

    const halfFloatTexType = isWebGL2 ? glc.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
    let formatRGBA, formatRG, formatR;

    if (isWebGL2) {
      formatRGBA = getSupportedFormat(glc, glc.RGBA16F, glc.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(glc, glc.RG16F, glc.RG, halfFloatTexType);
      formatR = getSupportedFormat(glc, glc.R16F, glc.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(glc, glc.RGBA, glc.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(glc, glc.RGBA, glc.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(glc, glc.RGBA, glc.RGBA, halfFloatTexType);
    }

    return { gl: glc, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
  }

  function getSupportedFormat(glc, internalFormat, format, type) {
    if (!supportRenderTextureFormat(glc, internalFormat, format, type)) {
      switch (internalFormat) {
        case glc.R16F: return getSupportedFormat(glc, glc.RG16F, glc.RG, type);
        case glc.RG16F: return getSupportedFormat(glc, glc.RGBA16F, glc.RGBA, type);
        default: return null;
      }
    }
    return { internalFormat, format };
  }

  function supportRenderTextureFormat(glc, internalFormat, format, type) {
    let texture = glc.createTexture();
    glc.bindTexture(glc.TEXTURE_2D, texture);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.NEAREST);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.NEAREST);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
    glc.texImage2D(glc.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    let fbo = glc.createFramebuffer();
    glc.bindFramebuffer(glc.FRAMEBUFFER, fbo);
    glc.framebufferTexture2D(glc.FRAMEBUFFER, glc.COLOR_ATTACHMENT0, glc.TEXTURE_2D, texture, 0);

    return glc.checkFramebufferStatus(glc.FRAMEBUFFER) === glc.FRAMEBUFFER_COMPLETE;
  }

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  // ---- acquire the context FIRST (fixes the original's TDZ crash) ----
  const context = getWebGLContext(canvas);
  if (!context || !context.gl) {
    console.warn('WebGL not available — SmokeyCursor disabled');
    return () => {};
  }
  gl = context.gl;
  const ext = context.ext;

  const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
      vUv = aPosition * 0.5 + 0.5;
      vL = vUv - vec2(texelSize.x, 0.0);
      vR = vUv + vec2(texelSize.x, 0.0);
      vT = vUv + vec2(0.0, texelSize.y);
      vB = vUv - vec2(0.0, texelSize.y);
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `);

  const displayShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
      vec3 C = texture2D(uTexture, vUv).rgb;
      float a = max(C.r, max(C.g, C.b));
      gl_FragColor = vec4(C, a);
    }
  `);

  const splatShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
      vec2 p = vUv - point.xy;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.0);
    }
  `);

  const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;
    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - 0.5;
      vec2 iuv = floor(st);
      vec2 fuv = fract(st);
      vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }
    void main () {
      vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
      gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
      gl_FragColor.a = 1.0;
    }
  `);

  const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; }
      if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; }
      if (vB.y < 0.0) { B = -C.y; }
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `);

  const curlShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      float vorticity = R - L - T + B;
      gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
  `);

  const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 vel = texture2D(uVelocity, vUv).xy;
      gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
    }
  `);

  const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float C = texture2D(uPressure, vUv).x;
      float divergence = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `);

  const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `);

  const clearShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
      gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `);

  class GLProgram {
    constructor(vertexShader, fragmentShader) {
      this.uniforms = {};
      this.program = gl.createProgram();
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);

      const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformName = gl.getActiveUniform(this.program, i).name;
        this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
      }
    }
    bind() {
      gl.useProgram(this.program);
    }
  }

  const displayProgram = new GLProgram(baseVertexShader, displayShader);
  const splatProgram = new GLProgram(baseVertexShader, splatShader);
  const advectionProgram = new GLProgram(baseVertexShader, advectionShader);
  const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
  const curlProgram = new GLProgram(baseVertexShader, curlShader);
  const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
  const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
  const gradientSubtractProgram = new GLProgram(baseVertexShader, gradientSubtractShader);
  const clearProgram = new GLProgram(baseVertexShader, clearShader);

  function createFBO(w, h, internalFormat, format, type, param) {
    gl.activeTexture(gl.TEXTURE0);
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return { texture, fbo, width: w, height: h, attach(id) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    }};
  }

  function createDoubleFBO(w, h, internalFormat, format, type, param) {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);
    return {
      width: w, height: h,
      texelSizeX: 1.0 / w, texelSizeY: 1.0 / h,
      read: fbo1, write: fbo2,
      swap() { let temp = fbo1; fbo1 = fbo2; fbo2 = temp; this.read = fbo1; this.write = fbo2; }
    };
  }

  let simWidth, simHeight, dyeWidth, dyeHeight;
  let density, velocity, divergence, curl, pressure;

  function initFramebuffers() {
    simWidth = config.simulationResolution;
    simHeight = Math.round(simWidth / (canvas.width / canvas.height));
    dyeWidth = config.dyeResolution;
    dyeHeight = Math.round(dyeWidth / (canvas.width / canvas.height));

    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const rg = ext.formatRG;
    const r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    density = createDoubleFBO(dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, texType, filtering);
    velocity = createDoubleFBO(simWidth, simHeight, rg.internalFormat, rg.format, texType, filtering);
    divergence = createFBO(simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
    curl = createFBO(simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
    pressure = createDoubleFBO(simWidth, simHeight, r.internalFormat, r.format, texType, gl.NEAREST);
  }

  // Safe first init — gl/ext are already assigned.
  resizeCanvas();

  const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    return (destination) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
  })();

  let pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, color: [0, 0.5, 1] };
  let colorCounter = 0;

  function randomColor() {
    if (!config.colorful) {
      // Fixed cyan to match the site theme.
      return [0.0, 0.94, 1.0];
    }
    return HSVtoRGB(Math.random(), 1.0, 1.0);
  }

  const onMouseMove = (e) => {
    pointer.moved = true;
    const rect = canvas.getBoundingClientRect();
    pointer.dx = (e.clientX - rect.left - pointer.x) * forceScale;
    pointer.dy = (e.clientY - rect.top - pointer.y) * forceScale;
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;

    colorCounter++;
    if (colorCounter >= Math.max(1, Math.round(config.colorUpdateSpeed))) {
      colorCounter = 0;
      pointer.color = randomColor();
    }
  };

  function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return [r, g, b];
  }

  function splat(x, y, dx, dy, color) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
    gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
    gl.uniform1f(splatProgram.uniforms.radius, config.splatRadius / 100.0);
    blit(velocity.write.fbo);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
    blit(density.write.fbo);
    density.swap();
  }

  let lastTime = Date.now();
  let rafId = null;

  function update() {
    resizeCanvas();
    const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
    lastTime = Date.now();

    if (pointer.moved) {
      splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
      pointer.moved = false;
    }

    curlProgram.bind();
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl.fbo);

    vorticityProgram.bind();
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.curl);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write.fbo);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence.fbo);

    clearProgram.bind();
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.pressureDissipation);
    blit(pressure.write.fbo);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.pressureIterations; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write.fbo);
      pressure.swap();
    }

    gradientSubtractProgram.bind();
    gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write.fbo);
    velocity.swap();

    advectionProgram.bind();
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.velocityDissipation);
    blit(velocity.write.fbo);
    velocity.swap();

    gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, density.texelSizeX, density.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1));
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.densityDissipation);
    blit(density.write.fbo);
    density.swap();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    displayProgram.bind();
    gl.uniform1i(displayProgram.uniforms.uTexture, density.read.attach(0));
    blit(null);

    rafId = requestAnimationFrame(update);
  }

  const onResize = () => resizeCanvas();

  document.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  update();
  console.log('SmokeyCursor WebGL fluid simulation loaded ✓');

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
  };
}

export default function SmokeyCursor(props = {}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    return runFluidSimulation(canvas, props);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="smokey-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
