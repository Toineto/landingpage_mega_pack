const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const width = 1080;
const height = 1920;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Helper: draw rounded rect
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// 1. Dark Space Background
const bgGrad = ctx.createLinearGradient(0, 0, width, height);
bgGrad.addColorStop(0, '#06050b');
bgGrad.addColorStop(0.3, '#0b0817');
bgGrad.addColorStop(0.7, '#070611');
bgGrad.addColorStop(1, '#030306');
ctx.fillStyle = bgGrad;
ctx.fillRect(0, 0, width, height);

// Glowing Ambient Orbs
function drawGlow(x, y, radius, r, g, b, alpha) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
  grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Top-left purple glow
drawGlow(200, 350, 450, 176, 38, 255, 0.4);
// Right cyan glow
drawGlow(880, 500, 420, 0, 210, 255, 0.35);
// Center phone glow
drawGlow(540, 1100, 500, 150, 40, 255, 0.3);
drawGlow(400, 1300, 400, 0, 210, 255, 0.25);

// Subtle light beam streaks
ctx.save();
ctx.rotate(-0.2);
const beamGrad = ctx.createLinearGradient(0, 200, 1200, 200);
beamGrad.addColorStop(0, 'rgba(176, 38, 255, 0)');
beamGrad.addColorStop(0.5, 'rgba(176, 38, 255, 0.08)');
beamGrad.addColorStop(1, 'rgba(0, 210, 255, 0)');
ctx.fillStyle = beamGrad;
ctx.fillRect(-200, 150, 1500, 180);
ctx.restore();

// 2. Top Logo Badge "TŌINMKT"
ctx.save();
const logoW = 340;
const logoH = 80;
const logoX = (width - logoW) / 2;
const logoY = 70;

// Outer glow & shadow
ctx.shadowColor = 'rgba(176, 38, 255, 0.4)';
ctx.shadowBlur = 25;
roundRect(ctx, logoX, logoY, logoW, logoH, 20);
const logoBg = ctx.createLinearGradient(logoX, logoY, logoX, logoY + logoH);
logoBg.addColorStop(0, '#2d2d3a');
logoBg.addColorStop(0.5, '#191924');
logoBg.addColorStop(1, '#101018');
ctx.fillStyle = logoBg;
ctx.fill();
ctx.shadowBlur = 0;

// Metallic border
ctx.lineWidth = 2.5;
const borderGrad = ctx.createLinearGradient(logoX, logoY, logoX + logoW, logoY + logoH);
borderGrad.addColorStop(0, '#9a9bb5');
borderGrad.addColorStop(0.5, '#4b4d66');
borderGrad.addColorStop(1, '#a1a3bf');
ctx.strokeStyle = borderGrad;
ctx.stroke();

// Logo text
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 36px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('toin mkt', width / 2, logoY + logoH / 2);
ctx.restore();

// 3. 3D Title: "MEGA"
ctx.save();
ctx.textAlign = 'center';

function draw3DText(text, x, y, font, faceColor, depthColor, depth, strokeColor) {
  ctx.font = font;
  // Depth layers
  for (let d = depth; d >= 1; d--) {
    ctx.fillStyle = depthColor;
    ctx.fillText(text, x, y + d * 1.8);
  }
  // Outline
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 6;
    ctx.strokeText(text, x, y);
  }
  // Face
  ctx.fillStyle = faceColor;
  ctx.fillText(text, x, y);
}

// "MEGA"
const megaGrad = ctx.createLinearGradient(width / 2 - 200, 200, width / 2 + 200, 320);
megaGrad.addColorStop(0, '#6ee7b7');
megaGrad.addColorStop(0.3, '#38bdf8');
megaGrad.addColorStop(0.7, '#c084fc');
megaGrad.addColorStop(1, '#a855f7');
draw3DText('MEGA', width / 2, 280, '900 135px Arial, sans-serif', megaGrad, '#3b0764', 12, '#1e1b4b');

// "PACK CANVA"
const packGrad = ctx.createLinearGradient(width / 2 - 300, 340, width / 2 + 300, 470);
packGrad.addColorStop(0, '#ffffff');
packGrad.addColorStop(0.5, '#e2e8f0');
packGrad.addColorStop(1, '#cbd5e1');
draw3DText('PACK CANVA', width / 2, 420, '900 112px Arial, sans-serif', packGrad, '#4c1d95', 10, '#2e1065');

// "12.000 POSTS PRONTOS"
ctx.save();
ctx.shadowColor = '#00f0ff';
ctx.shadowBlur = 30;
ctx.fillStyle = '#00f0ff';
ctx.font = '900 68px Arial, sans-serif';
ctx.fillText('12.000 POSTS PRONTOS', width / 2, 530);
ctx.restore();

// "100% EDITÁVEIS NO CANVA"
ctx.fillStyle = '#f8fafc';
ctx.font = 'bold 36px Arial, sans-serif';
ctx.letterSpacing = '3px';
ctx.fillText('100% EDITÁVEIS NO CANVA', width / 2, 595);
ctx.restore();

// 4. Left Nichos Tag
ctx.save();
ctx.textAlign = 'left';
ctx.font = 'bold 24px Arial, sans-serif';
ctx.fillStyle = '#38bdf8';
const nichosX = 60;
const nichosY = 720;
ctx.fillText('NICHOS: BELEZA,', nichosX, nichosY);
ctx.fillText('ADVOCACIA,', nichosX, nichosY + 32);
ctx.fillText('RESTAURANTES,', nichosX, nichosY + 64);
ctx.fillText('IMOBILIÁRIA,', nichosX, nichosY + 96);
ctx.fillText('E MAIS!', nichosX, nichosY + 128);
ctx.restore();

// 5. Phone Centerpiece Mockup
const phoneW = 460;
const phoneH = 820;
const phoneX = (width - phoneW) / 2 + 30;
const phoneY = 760;

// Phone Outer Neon Rim Glow
ctx.save();
ctx.shadowColor = 'rgba(0, 210, 255, 0.7)';
ctx.shadowBlur = 35;
roundRect(ctx, phoneX - 6, phoneY - 6, phoneW + 12, phoneH + 12, 46);
ctx.strokeStyle = '#00d2ff';
ctx.lineWidth = 3;
ctx.stroke();

ctx.shadowColor = 'rgba(176, 38, 255, 0.7)';
ctx.shadowBlur = 40;
roundRect(ctx, phoneX - 10, phoneY - 10, phoneW + 20, phoneH + 20, 50);
ctx.strokeStyle = '#b026ff';
ctx.lineWidth = 2.5;
ctx.stroke();
ctx.restore();

// Phone Body (Titanium frame)
ctx.save();
roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 42);
const frameGrad = ctx.createLinearGradient(phoneX, phoneY, phoneX + phoneW, phoneY + phoneH);
frameGrad.addColorStop(0, '#2e2e38');
frameGrad.addColorStop(0.5, '#181820');
frameGrad.addColorStop(1, '#0e0e14');
ctx.fillStyle = frameGrad;
ctx.fill();

// Phone Screen Bezel
const screenPad = 14;
const screenX = phoneX + screenPad;
const screenY = phoneY + screenPad;
const screenW = phoneW - screenPad * 2;
const screenH = phoneH - screenPad * 2;
roundRect(ctx, screenX, screenY, screenW, screenH, 32);
ctx.fillStyle = '#0f1016';
ctx.fill();
ctx.clip(); // Clip inside phone screen

// Inside Phone Screen Content
// Top status bar
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 18px Arial, sans-serif';
ctx.textAlign = 'left';
ctx.fillText('9:41', screenX + 30, screenY + 32);

// Wifi & battery icons
ctx.textAlign = 'right';
ctx.fillText('●●● 🔋', screenX + screenW - 30, screenY + 32);

// Header bar: "< FOLDER"
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 22px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('<      FOLDER', screenX + screenW / 2, screenY + 70);

// Divider line
ctx.strokeStyle = 'rgba(255,255,255,0.1)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(screenX + 20, screenY + 95);
ctx.lineTo(screenX + screenW - 20, screenY + 95);
ctx.stroke();

// Grid inside folder
const colW = (screenW - 50) / 2;
const rowH = 135;
const gridStartX = screenX + 18;
const gridStartY = screenY + 115;

function drawFolder(x, y, title, isPreview, previewType) {
  // Folder card background
  roundRect(ctx, x, y, colW, rowH, 16);
  if (!isPreview) {
    ctx.fillStyle = '#1a1b26';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();

    // Folder tab icon
    ctx.fillStyle = '#475569';
    roundRect(ctx, x + 25, y + 25, 45, 32, 6);
    ctx.fill();
    roundRect(ctx, x + 25, y + 20, 22, 10, 4);
    ctx.fill();

    // Title
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 17px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 20, y + 95);
  } else {
    // Rich preview card
    const cardGrad = ctx.createLinearGradient(x, y, x + colW, y + rowH);
    if (previewType === 'law') {
      cardGrad.addColorStop(0, '#1e293b');
      cardGrad.addColorStop(1, '#0f172a');
    } else {
      cardGrad.addColorStop(0, '#3b0764');
      cardGrad.addColorStop(1, '#1e1b4b');
    }
    ctx.fillStyle = cardGrad;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner preview graphics
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 15, y + 35);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText(previewType === 'law' ? '⚖️ ADVOCACIA' : '💄 ESTÉTICA', x + 15, y + 65);

    // Mini decorative tag
    ctx.fillStyle = '#22c55e';
    roundRect(ctx, x + 15, y + 85, 75, 22, 6);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.fillText('CANVA PRO', x + 22, y + 100);
  }
}

// Row 1: Advogados & Beleza
drawFolder(gridStartX, gridStartY, 'ADVOGADOS', false);
drawFolder(gridStartX + colW + 14, gridStartY, 'BELEZA & ESTÉTICA', false);

// Row 2: Previews Law & Makeup
drawFolder(gridStartX, gridStartY + rowH + 14, 'MODERN LAW', true, 'law');
drawFolder(gridStartX + colW + 14, gridStartY + rowH + 14, 'MAKEUP VIP', true, 'beauty');

// Row 3: Comida & Imobiliária
drawFolder(gridStartX, gridStartY + (rowH + 14) * 2, 'COMIDA', false);
drawFolder(gridStartX + colW + 14, gridStartY + (rowH + 14) * 2, 'IMOBILIÁRIA', false);

// Row 4: Barbearia & Mobiliária
drawFolder(gridStartX, gridStartY + (rowH + 14) * 3, 'BARBEARIA', false);
drawFolder(gridStartX + colW + 14, gridStartY + (rowH + 14) * 3, 'MOBILIÁRIA', false);

// Bottom Mobile App Bar
const navY = screenY + screenH - 65;
ctx.fillStyle = '#0d0d14';
ctx.fillRect(screenX, navY, screenW, 65);
ctx.fillStyle = '#94a3b8';
ctx.font = '22px Arial, sans-serif';
ctx.textAlign = 'center';
const navSpacing = screenW / 5;
ctx.fillText('🏠', screenX + navSpacing * 0.5, navY + 40);
ctx.fillText('🔍', screenX + navSpacing * 1.5, navY + 40);
ctx.fillText('➕', screenX + navSpacing * 2.5, navY + 40);
ctx.fillText('❤️', screenX + navSpacing * 3.5, navY + 40);
ctx.fillText('👤', screenX + navSpacing * 4.5, navY + 40);

ctx.restore(); // Restore phone clip

// 6. Floating 3D Elements Around Phone

// Left: Color Swatch Fan (Pantone style)
ctx.save();
ctx.translate(140, 1150);
ctx.rotate(-0.35);
const swatches = ['#00d2ff', '#f59e0b', '#10b981', '#ec4899', '#f97316'];
swatches.forEach((color, i) => {
  ctx.save();
  ctx.rotate(i * 0.12);
  roundRect(ctx, 0, 0, 75, 210, 12);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 15;
  // Colored top
  roundRect(ctx, 6, 6, 63, 140, 8);
  ctx.fillStyle = color;
  ctx.fill();
  // Bottom swatch label
  ctx.fillStyle = '#64748b';
  roundRect(ctx, 12, 160, 50, 8, 4);
  ctx.fill();
  roundRect(ctx, 12, 175, 35, 6, 3);
  ctx.fill();
  ctx.restore();
});
ctx.restore();

// Left Floating Heart Reaction 3D Bubble
ctx.save();
ctx.translate(230, 1420);
ctx.rotate(-0.15);
ctx.shadowColor = '#b026ff';
ctx.shadowBlur = 30;
roundRect(ctx, -50, -50, 100, 100, 30);
const heartGrad = ctx.createLinearGradient(-50, -50, 50, 50);
heartGrad.addColorStop(0, '#d946ef');
heartGrad.addColorStop(1, '#8b5cf6');
ctx.fillStyle = heartGrad;
ctx.fill();
ctx.fillStyle = '#ffffff';
ctx.font = '45px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('❤️', 0, 4);
ctx.restore();

// Right Floating "Like" Thumbs-Up 3D Bubble
ctx.save();
ctx.translate(880, 1060);
ctx.rotate(0.2);
ctx.shadowColor = '#00d2ff';
ctx.shadowBlur = 30;
roundRect(ctx, -45, -45, 90, 90, 26);
const likeGrad = ctx.createLinearGradient(-45, -45, 45, 45);
likeGrad.addColorStop(0, '#38bdf8');
likeGrad.addColorStop(1, '#2563eb');
ctx.fillStyle = likeGrad;
ctx.fill();
ctx.fillStyle = '#ffffff';
ctx.font = '42px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('👍', 0, 3);
ctx.restore();

// Right Floating Avatar Bubble
ctx.save();
ctx.translate(920, 890);
ctx.shadowColor = '#b026ff';
ctx.shadowBlur = 25;
roundRect(ctx, -40, -40, 80, 80, 24);
const avatarGrad = ctx.createLinearGradient(-40, -40, 40, 40);
avatarGrad.addColorStop(0, '#a855f7');
avatarGrad.addColorStop(1, '#6366f1');
ctx.fillStyle = avatarGrad;
ctx.fill();
ctx.fillStyle = '#ffffff';
ctx.font = '36px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('👤', 0, 2);
ctx.restore();

// Right Floating Message Bubble
ctx.save();
ctx.translate(900, 1220);
ctx.rotate(-0.1);
ctx.shadowColor = '#00d2ff';
ctx.shadowBlur = 25;
roundRect(ctx, -45, -35, 90, 70, 22);
const msgGrad = ctx.createLinearGradient(-45, -35, 45, 35);
msgGrad.addColorStop(0, '#06b6d4');
msgGrad.addColorStop(1, '#0284c7');
ctx.fillStyle = msgGrad;
ctx.fill();
ctx.fillStyle = '#ffffff';
ctx.font = '30px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('💬', 0, 2);
ctx.restore();

// Right Bottom: 3D Ergonomic Wireless Mouse
ctx.save();
ctx.translate(760, 1420);
ctx.rotate(0.25);
ctx.shadowColor = '#b026ff';
ctx.shadowBlur = 35;
roundRect(ctx, -60, -90, 120, 180, 50);
const mouseGrad = ctx.createLinearGradient(-60, -90, 60, 90);
mouseGrad.addColorStop(0, '#8b5cf6');
mouseGrad.addColorStop(0.5, '#4338ca');
mouseGrad.addColorStop(1, '#1e1b4b');
ctx.fillStyle = mouseGrad;
ctx.fill();
// Mouse scroll wheel
roundRect(ctx, -10, -50, 20, 45, 10);
ctx.fillStyle = '#00d2ff';
ctx.fill();
// Mouse center seam
ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(0, -90);
ctx.lineTo(0, 40);
ctx.stroke();
ctx.restore();

// 7. Reflective Floor & Bottom Lights
const floorGrad = ctx.createLinearGradient(0, 1600, 0, height);
floorGrad.addColorStop(0, 'rgba(0,0,0,0)');
floorGrad.addColorStop(0.3, 'rgba(11, 8, 23, 0.7)');
floorGrad.addColorStop(1, '#050408');
ctx.fillStyle = floorGrad;
ctx.fillRect(0, 1550, width, height - 1550);

// Bottom Subtitle text
ctx.save();
ctx.fillStyle = '#38bdf8';
ctx.font = 'bold 26px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('NICHOS: BELEZA, ADVOCACIA, RESTAURANTES, IMOBILIÁRIA, E MAIS!', width / 2, 1640);
ctx.restore();

// 8. Bottom CTA Pill: "SÓ R$ 19,90 | GARANTA JÁ O SEU ACESSO IMEDIATO!"
ctx.save();
const ctaW = 860;
const ctaH = 125;
const ctaX = (width - ctaW) / 2;
const ctaY = 1675;

// Glowing border
ctx.shadowColor = 'rgba(0, 210, 255, 0.8)';
ctx.shadowBlur = 30;
roundRect(ctx, ctaX, ctaY, ctaW, ctaH, 30);
const ctaBg = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH);
ctaBg.addColorStop(0, '#0c1222');
ctaBg.addColorStop(0.5, '#1e1035');
ctaBg.addColorStop(1, '#0d0d1a');
ctx.fillStyle = ctaBg;
ctx.fill();

ctx.lineWidth = 3.5;
const ctaBorder = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY);
ctaBorder.addColorStop(0, '#00d2ff');
ctaBorder.addColorStop(0.5, '#b026ff');
ctaBorder.addColorStop(1, '#00d2ff');
ctx.strokeStyle = ctaBorder;
ctx.stroke();

// CTA Text
ctx.shadowBlur = 0;
ctx.textAlign = 'center';
ctx.fillStyle = '#38bdf8';
ctx.font = '900 36px Arial, sans-serif';
ctx.fillText('SÓ R$ 29,99 | GARANTA JÁ O SEU ACESSO IMEDIATO!', width / 2, ctaY + 52);

ctx.fillStyle = '#ffffff';
ctx.font = 'bold 24px Arial, sans-serif';
ctx.letterSpacing = '2px';
ctx.fillText('INVESTIMENTO ÚNICO E VITALÍCIO', width / 2, ctaY + 95);
ctx.restore();

// 9. Footer Capsule Badge: "toin mkt"
ctx.save();
const ftW = 540;
const ftH = 65;
const ftX = (width - ftW) / 2;
const ftY = 1825;

roundRect(ctx, ftX, ftY, ftW, ftH, 18);
const ftBg = ctx.createLinearGradient(ftX, ftY, ftX, ftY + ftH);
ftBg.addColorStop(0, '#262633');
ftBg.addColorStop(1, '#111118');
ctx.fillStyle = ftBg;
ctx.fill();
ctx.strokeStyle = '#475569';
ctx.lineWidth = 1.5;
ctx.stroke();

ctx.fillStyle = '#cbd5e1';
ctx.font = 'bold 24px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.letterSpacing = '1px';
ctx.fillText('toin mkt', width / 2, ftY + ftH / 2);
ctx.restore();

// Save outputs
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
fs.writeFileSync('Gemini_Generated_Image_.jpg', buffer);
fs.writeFileSync('watermarked_img_17771731536052550763.jpg', buffer);
fs.writeFileSync('img/flyer.jpg', buffer);
console.log('Successfully generated flyer image! Size:', buffer.length, 'bytes');
