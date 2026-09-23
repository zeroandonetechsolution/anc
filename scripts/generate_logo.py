import xml.etree.ElementTree as ET
import os

def generate_logo():
    width, height = 300, 80
    green_square_size = 80
    green = "#8cc63f"
    gray = "#6a7282"
    white = "#ffffff"

    svg = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "width": str(width),
        "height": str(height),
        "viewBox": f"0 0 {width} {height}"
    })

    rect = ET.SubElement(svg, "rect", {
        "x": "0",
        "y": "0",
        "width": str(green_square_size),
        "height": str(green_square_size),
        "fill": green,
        "rx": "6"
    })

    rubi_text = ET.SubElement(svg, "text", {
        "x": str(green_square_size / 2),
        "y": str(height / 2 + 6),
        "text-anchor": "middle",
        "fill": white,
        "font-family": "Arial, Helvetica, sans-serif",
        "font-size": "28",
        "font-weight": "bold",
        "letter-spacing": "1"
    })
    rubi_text.text = "RUBI"

    digital_text = ET.SubElement(svg, "text", {
        "x": str(green_square_size + 16),
        "y": str(height / 2 + 6),
        "fill": gray,
        "font-family": "Arial, Helvetica, sans-serif",
        "font-size": "26",
        "font-weight": "bold",
        "letter-spacing": "2"
    })
    digital_text.text = "DIGITAL"

    output_path = os.path.join(os.path.dirname(__file__), "..", "assets", "generated", "logo.svg")
    output_path = os.path.abspath(output_path)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    tree = ET.ElementTree(svg)
    ET.indent(tree, space="  ")
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated: {output_path}")

if __name__ == "__main__":
    generate_logo()
