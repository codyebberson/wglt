import { Console, Terminal, loadImage2x } from 'wglt';
import { CgaPalette, Key } from 'wglt';

const crt = {
  scale: 6,
  blur: 0.5,
  curvature: 0.1,
  chroma: 0.5,
  vignette: 0.15,
  scanlineWidth: 0.75,
  scanlineIntensity: 0.25,
};

const term = new Terminal('canvas', 80, 45, { crt });

term.fillRect(0, 0, 80, 45, 0, CgaPalette.WHITE, CgaPalette.BLACK);

let img = null as Console | null;
loadImage2x('../smtpe.png', (result) => {
  img = result;
});

term.update = () => {
  if (term.isKeyPressed(Key.VK_Q)) {
    crt.curvature += 0.01;
  }
  if (term.isKeyPressed(Key.VK_A)) {
    crt.curvature -= 0.01;
  }
  if (term.isKeyPressed(Key.VK_W)) {
    crt.chroma += 0.1;
  }
  if (term.isKeyPressed(Key.VK_S)) {
    crt.chroma -= 0.1;
  }
  if (term.isKeyPressed(Key.VK_E)) {
    crt.vignette += 0.01;
  }
  if (term.isKeyPressed(Key.VK_D)) {
    crt.vignette -= 0.01;
  }
  if (term.isKeyPressed(Key.VK_R)) {
    crt.scanlineWidth += 0.05;
  }
  if (term.isKeyPressed(Key.VK_F)) {
    crt.scanlineWidth -= 0.05;
  }
  if (term.isKeyPressed(Key.VK_T)) {
    crt.scanlineIntensity += 0.05;
  }
  if (term.isKeyPressed(Key.VK_G)) {
    crt.scanlineIntensity -= 0.05;
  }
  if (term.isKeyPressed(Key.VK_Y)) {
    crt.blur += 0.1;
  }
  if (term.isKeyPressed(Key.VK_H)) {
    crt.blur -= 0.1;
  }

  if (term.isKeyPressed(Key.VK_0)) {
    crt.blur = 0;
    crt.curvature = 0;
    crt.chroma = 0;
    crt.vignette = 0;
    crt.scanlineWidth = 0;
    crt.scanlineIntensity = 0;
  }

  crt.curvature = clamp(crt.curvature, 0.0, 0.5);
  crt.chroma = clamp(crt.chroma, 0.0, 2.0);
  crt.vignette = clamp(crt.vignette, 0.0, 0.5);
  crt.scanlineWidth = clamp(crt.scanlineWidth, 0.0, 1.0);
  crt.scanlineIntensity = clamp(crt.scanlineIntensity, 0.0, 1.0);
  crt.blur = clamp(crt.blur, 0.0, 4.0);

  term.clear();

  if (img) {
    term.drawConsole(0, 0, img, 0, 0, 80, 45);
  }

  term.drawString(
    1,
    1,
    `Curvature:            ${crt.curvature.toFixed(2)} [Q/A]`,
    CgaPalette.WHITE
  );
  term.drawString(1, 3, `Chromatic aberration: ${crt.chroma.toFixed(2)} [W/S]`, CgaPalette.WHITE);
  term.drawString(1, 5, `Vignette:             ${crt.vignette.toFixed(2)} [E/D]`, CgaPalette.WHITE);
  term.drawString(
    1,
    7,
    `Scanline Width:       ${crt.scanlineWidth.toFixed(2)} [R/F]`,
    CgaPalette.WHITE
  );
  term.drawString(
    1,
    9,
    `Scanline Intensity:   ${crt.scanlineIntensity.toFixed(2)} [T/G]`,
    CgaPalette.WHITE
  );
  term.drawString(1, 11, `Blur:                 ${crt.blur.toFixed(2)} [Y/H]`, CgaPalette.WHITE);
};

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
