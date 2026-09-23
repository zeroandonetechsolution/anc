import xml.etree.ElementTree as ET
import os

GREEN = "#8cc63f"
SIZE = 64

def base_svg():
    svg = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "width": str(SIZE),
        "height": str(SIZE),
        "viewBox": f"0 0 {SIZE} {SIZE}",
        "fill": "none"
    })
    return svg

def add_circle(svg, cx, cy, r, width=2):
    return ET.SubElement(svg, "circle", {
        "cx": str(cx), "cy": str(cy), "r": str(r),
        "stroke": GREEN, "stroke-width": str(width), "fill": "none"
    })

def add_line(svg, x1, y1, x2, y2, width=2):
    return ET.SubElement(svg, "line", {
        "x1": str(x1), "y1": str(y1), "x2": str(x2), "y2": str(y2),
        "stroke": GREEN, "stroke-width": str(width), "stroke-linecap": "round"
    })

def add_path(svg, d, width=2):
    return ET.SubElement(svg, "path", {
        "d": d,
        "stroke": GREEN, "stroke-width": str(width),
        "fill": "none", "stroke-linecap": "round", "stroke-linejoin": "round"
    })

def add_rect(svg, x, y, w, h, width=2, rx=0):
    return ET.SubElement(svg, "rect", {
        "x": str(x), "y": str(y), "width": str(w), "height": str(h),
        "stroke": GREEN, "stroke-width": str(width), "fill": "none",
        "rx": str(rx)
    })

def save_svg(svg, name):
    output_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "generated", "icons")
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{name}.svg")
    tree = ET.ElementTree(svg)
    ET.indent(tree, space="  ")
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated: {output_path}")

def icon_24x7_support():
    svg = base_svg()
    add_circle(svg, 32, 32, 26, 2)
    add_path(svg, "M32 14v18l12 6")
    text = ET.SubElement(svg, "text", {
        "x": "32", "y": "42", "text-anchor": "middle",
        "fill": GREEN, "font-family": "Arial, sans-serif", "font-size": "10", "font-weight": "bold"
    })
    text.text = "24/7"
    save_svg(svg, "24x7-support")

def icon_local_service():
    svg = base_svg()
    add_path(svg, "M12 52h40l-4-28H16z")
    add_circle(svg, 22, 52, 4)
    add_circle(svg, 42, 52, 4)
    add_rect(svg, 26, 10, 12, 10, 2, 2)
    add_line(svg, 32, 10, 32, 4)
    save_svg(svg, "local-service")

def icon_all_india():
    svg = base_svg()
    add_circle(svg, 32, 32, 26, 2)
    add_path(svg, "M6 32h52M32 6c-8 10-8 36 0 46M32 6c8 10 8 36 0 46")
    add_path(svg, "M20 16c6 8 18 8 24 0M20 48c6-8 18-8 24 0")
    save_svg(svg, "all-india")

def icon_ott_integration():
    svg = base_svg()
    add_rect(svg, 10, 14, 44, 32, 2, 4)
    add_path(svg, "M26 24l12 8-12 8z", 2)
    add_circle(svg, 26, 10, 3)
    add_circle(svg, 38, 10, 3)
    save_svg(svg, "ott-integration")

def icon_low_latency():
    svg = base_svg()
    add_path(svg, "M10 32c4-10 12-16 22-16s18 6 22 16c-4 10-12 16-22 16S14 42 10 32z")
    add_line(svg, 32, 16, 32, 32, 2)
    add_line(svg, 32, 32, 42, 36, 2)
    add_circle(svg, 32, 32, 2, 2)
    add_path(svg, "M50 20l4-4M14 44l-4 4", 2)
    save_svg(svg, "low-latency")

def icon_channel_stability():
    svg = base_svg()
    add_path(svg, "M8 44L18 30l8 10 8-16 8 12 14-24")
    add_line(svg, 8, 52, 56, 52, 2)
    add_circle(svg, 8, 44, 2, 2)
    add_circle(svg, 56, 46, 2, 2)
    save_svg(svg, "channel-stability")

def icon_lco_network():
    svg = base_svg()
    add_circle(svg, 32, 14, 6, 2)
    add_circle(svg, 12, 46, 6, 2)
    add_circle(svg, 52, 46, 6, 2)
    add_circle(svg, 32, 46, 6, 2)
    add_line(svg, 32, 20, 32, 40, 2)
    add_line(svg, 28, 40, 16, 46, 2)
    add_line(svg, 36, 40, 48, 46, 2)
    add_line(svg, 28, 18, 18, 42, 2)
    add_line(svg, 36, 18, 46, 42, 2)
    save_svg(svg, "lco-network")

def icon_enterprise_headend():
    svg = base_svg()
    add_rect(svg, 12, 12, 40, 40, 2, 4)
    add_rect(svg, 20, 20, 24, 6, 2, 1)
    add_rect(svg, 20, 30, 24, 6, 2, 1)
    add_rect(svg, 20, 40, 24, 6, 2, 1)
    add_circle(svg, 30, 23, 1.5, 2)
    add_circle(svg, 38, 23, 1.5, 2)
    add_circle(svg, 30, 33, 1.5, 2)
    add_circle(svg, 38, 33, 1.5, 2)
    add_circle(svg, 30, 43, 1.5, 2)
    add_circle(svg, 38, 43, 1.5, 2)
    save_svg(svg, "enterprise-headend")

def generate_all_icons():
    icon_24x7_support()
    icon_local_service()
    icon_all_india()
    icon_ott_integration()
    icon_low_latency()
    icon_channel_stability()
    icon_lco_network()
    icon_enterprise_headend()
    print("All 8 feature icons generated.")

if __name__ == "__main__":
    generate_all_icons()
