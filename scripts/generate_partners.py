import xml.etree.ElementTree as ET
import os

WIDTH = 180
HEIGHT = 80
GRAY = "#6a7282"
BG = "#f9fafb"
GREEN = "#8cc63f"

PARTNERS = [
    "cisco", "evertz", "hp", "nagra", "atme",
    "dell", "fortinet", "nstv", "waveion"
]

def generate_partner(name):
    svg = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "width": str(WIDTH),
        "height": str(HEIGHT),
        "viewBox": f"0 0 {WIDTH} {HEIGHT}"
    })

    bg = ET.SubElement(svg, "rect", {
        "x": "0", "y": "0",
        "width": str(WIDTH), "height": str(HEIGHT),
        "fill": BG,
        "rx": "6",
        "stroke": "#e5e7eb",
        "stroke-width": "1"
    })

    accent = ET.SubElement(svg, "rect", {
        "x": "0", "y": "0",
        "width": "4", "height": str(HEIGHT),
        "fill": GREEN,
        "rx": "2"
    })

    border_top = ET.SubElement(svg, "line", {
        "x1": "4", "y1": "0",
        "x2": str(WIDTH), "y2": "0",
        "stroke": GREEN,
        "stroke-width": "1"
    })

    display_name = name.upper()
    font_size = 18 if len(display_name) <= 6 else (16 if len(display_name) <= 8 else 14)

    text = ET.SubElement(svg, "text", {
        "x": str(WIDTH / 2 + 2),
        "y": str(HEIGHT / 2 + 6),
        "text-anchor": "middle",
        "fill": GRAY,
        "font-family": "Arial, Helvetica, sans-serif",
        "font-size": str(font_size),
        "font-weight": "600",
        "letter-spacing": "1.5"
    })
    text.text = display_name

    output_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "generated", "partners")
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{name}.svg")

    tree = ET.ElementTree(svg)
    ET.indent(tree, space="  ")
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated: {output_path}")

def generate_all_partners():
    for partner in PARTNERS:
        generate_partner(partner)
    print(f"All {len(PARTNERS)} partner placeholders generated.")

if __name__ == "__main__":
    generate_all_partners()
