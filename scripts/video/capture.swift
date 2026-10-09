// Captura la web a 1280×720 con WebKit (sin navegador externo).
// Uso: swift scripts/video/capture.swift <steps.json> <dir-salida>
// steps.json: [{ "js": "código async (puede usar await)", "wait": ms, "out": "01.png" | null }]
import AppKit
import WebKit

struct Step: Decodable { let js: String; let wait: Int?; let out: String? }
let args = CommandLine.arguments
let steps = try! JSONDecoder().decode([Step].self, from: Data(contentsOf: URL(fileURLWithPath: args[1])))
let outDir = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let cfg = WKWebViewConfiguration()
cfg.websiteDataStore = .nonPersistent()
let web = WKWebView(frame: NSRect(x: 0, y: 0, width: 1280, height: 720), configuration: cfg)
let window = NSWindow(contentRect: NSRect(x: -3000, y: 0, width: 1280, height: 720), styleMask: [.borderless], backing: .buffered, defer: false)
window.contentView = web
window.orderBack(nil)

final class Runner: NSObject, WKNavigationDelegate {
  var i = 0
  var started = false
  func webView(_ w: WKWebView, didFinish n: WKNavigation!) { if !started { started = true; next() } }
  func next() {
    guard i < steps.count else { print("listo"); exit(0) }
    let s = steps[i]; i += 1
    web.callAsyncJavaScript(s.js, arguments: [:], in: nil, in: .page) { r in
      if case .failure(let e) = r { print("paso \(self.i) error: \(e)") }
      DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(s.wait ?? 400)) {
        guard let out = s.out else { self.next(); return }
        let c = WKSnapshotConfiguration(); c.rect = NSRect(x: 0, y: 0, width: 1280, height: 720); c.snapshotWidth = 1280
        web.takeSnapshot(with: c) { img, err in
          if let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) {
            try? png.write(to: outDir.appendingPathComponent(out)); print("✓ \(out)")
          } else { print("✗ \(out) \(String(describing: err))") }
          self.next()
        }
      }
    }
  }
}
let runner = Runner()
web.navigationDelegate = runner
web.load(URLRequest(url: URL(string: "http://localhost:5181/")!))
app.run()
