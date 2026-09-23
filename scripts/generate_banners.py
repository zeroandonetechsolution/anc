import xml.etree.ElementTree as ET
import os

WIDTH = 800
HEIGHT = 500
GREEN_LIGHT = "#8cc63f"
GREEN_DARK = "#628a24"

def generate_hero_pattern():
    svg = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "width": str(WIDTH),
        "height": str(HEIGHT),
        "viewBox": f"0 0 {WIDTH} {HEIGHT}",
        "preserveAspectRatio": "xMidYMid slice"
    })

    defs = ET.SubElement(svg, "defs")

    linear_grad = ET.SubElement(defs, "linearGradient", {
        "id": "heroGradient",
        "x1": "0%", "y1": "0%",
        "x2": "100%", "y2": "100%"
    })
    stop1 = ET.SubElement(linear_grad, "stop", {
        "offset": "0%", "stop-color": GREEN_LIGHT, "stop-opacity": "1"
    })
    stop2 = ET.SubElement(linear_grad, "stop", {
        "offset": "100%", "stop-color": GREEN_DARK, "stop-opacity": "1"
    })

    wave_grad = ET.SubElement(defs, "linearGradient", {
        "id": "waveGradient",
        "x1": "0%", "y1": "0%",
        "x2": "0%", "y2": "100%"
    })
    wstop1 = ET.SubElement(wave_grad, "stop", {
        "offset": "0%", "stop-color": "#ffffff", "stop-opacity": "0.15"
    })
    wstop2 = ET.SubElement(wave_grad, "stop", {
        "offset": "100%", "stop-color": "#ffffff", "stop-opacity": "0.02"
    })

    bg = ET.SubElement(svg, "rect", {
        "x": "0", "y": "0",
        "width": str(WIDTH), "height": str(HEIGHT),
        "fill": "url(#heroGradient)"
    })

    wave1 = ET.SubElement(svg, "path", {
        "d": f"M0,280 C200,200 400,360 600,280 S800,200 800,280 L800,{HEIGHT} L0,{HEIGHT} Z",
        "fill": "url(#waveGradient)"
    })

    wave2 = ET.SubElement(svg, "path", {
        "d": f"M0,340 C150,280 350,400 550,320 S750,260 800,340 L800,{HEIGHT} L0,{HEIGHT} Z",
        "fill": "#ffffff",
        "fill-opacity": "0.08"
    })

    wave3 = ET.SubElement(svg, "path", {
        "d": f"M0,400 C250,340 450,440 650,380 S800,340 800,400 L800,{HEIGHT} L0,{HEIGHT} Z",
        "fill": "#ffffff",
        "fill-opacity": "0.05"
    })

    for i in range(30):
        cx = (i * 37 + 15) % WIDTH
        cy = (i * 53 + 20) % (HEIGHT - 100)
        r = 1 + (i % 3)
        circle = ET.SubElement(svg, "circle", {
            "cx": str(cx), "cy": str(cy), "r": str(r),
            "fill": "#ffffff", "fill-opacity": "0.15"
        })

    output_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "generated")
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "hero-pattern.svg")

    tree = ET.ElementTree(svg)
    ET.indent(tree, space="  ")
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated: {output_path}")

def generate_keyframes_css():
    css = """@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(140, 198, 63, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px 6px rgba(140, 198, 63, 0.2);
    transform: scale(1.02);
  }
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(60px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes counterSpin {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
"""
    css_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "css")
    css_dir = os.path.abspath(css_dir)
    os.makedirs(css_dir, exist_ok=True)
    css_path = os.path.join(css_dir, "keyframes.css")

    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css)
    print(f"Generated: {css_path}")

if __name__ == "__main__":
    generate_hero_pattern()
    generate_keyframes_css()
    print("Hero pattern and keyframes CSS generated.")
