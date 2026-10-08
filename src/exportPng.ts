/** Exporta el SVG de la cabina (con el flujo dibujado) a PNG con cabecera y leyenda */
export async function exportPng(svg: SVGSVGElement, title: string, subtitle: string, legend: { name: string; color: string }[]) {
  const vb = svg.viewBox.baseVal
  const W = vb.width, H = vb.height
  const head = 90
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('width', String(W))
  clone.setAttribute('height', String(H))
  clone.removeAttribute('style')
  clone.querySelectorAll('.draw').forEach(el => el.removeAttribute('class'))
  clone.querySelectorAll('.ripple, .hit').forEach(el => el.remove())
  const xml = new XMLSerializer().serializeToString(clone)
  const img = new Image()
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
  await img.decode()
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = (H + head) * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  ctx.fillStyle = '#0b1016'
  ctx.fillRect(0, 0, W, H + head)
  ctx.fillStyle = '#f8fafc'
  ctx.font = '700 30px ui-sans-serif, system-ui'
  ctx.fillText(title, 24, 42)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '500 17px ui-sans-serif, system-ui'
  ctx.fillText(subtitle, 24, 70)
  let x = W - 24
  ctx.font = '700 16px ui-sans-serif, system-ui'
  for (const l of [...legend].reverse()) {
    const w = ctx.measureText(l.name).width
    x -= w
    ctx.fillStyle = '#e2e8f0'
    ctx.fillText(l.name, x, 50)
    x -= 26
    ctx.fillStyle = l.color
    ctx.beginPath(); ctx.arc(x + 9, 44, 8, 0, Math.PI * 2); ctx.fill()
    x -= 20
  }
  ctx.drawImage(img, 0, head, W, H)
  const a = document.createElement('a')
  a.download = title.replace(/[^\w\-]+/g, '_') + '.png'
  a.href = canvas.toDataURL('image/png')
  a.click()
}
