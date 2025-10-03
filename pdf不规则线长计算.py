import fitz  # PyMuPDF
import os
import sys
import math
import xml.etree.ElementTree as ET
from svg.path import parse_path
import re

# --- 常量定义 ---
MM_PER_POINT = 25.4 / 72

# --- 核心计算函数 (保持不变) ---
def calculate_line_length(x1, y1, x2, y2):
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

def calculate_rect_perimeter(width, height):
    return 2 * (width + height)

def calculate_circle_circumference(r):
    return 2 * math.pi * r

def calculate_ellipse_circumference(rx, ry):
    a, b = max(rx, ry), min(rx, ry)
    if b == 0: return 4 * a
    h = ((a - b)**2) / ((a + b)**2)
    return math.pi * (a + b) * (1 + (3 * h) / (10 + math.sqrt(4 - 3 * h)))

def parse_points_string(points_str):
    points = re.findall(r"[-+]?\d*\.\d+|[-+]?\d+", points_str)
    return [(float(points[i]), float(points[i+1])) for i in range(0, len(points), 2)]

def calculate_polyline_length(points, closed=False):
    total_length = 0.0
    if len(points) < 2: return 0.0
    for i in range(len(points) - 1):
        p1, p2 = points[i], points[i+1]
        total_length += calculate_line_length(p1[0], p1[1], p2[0], p2[1])
    if closed and len(points) > 2:
        p_last, p_first = points[-1], points[0]
        total_length += calculate_line_length(p_last[0], p_last[1], p_first[0], p_first[1])
    return total_length

def calculate_path_length(d_string):
    try:
        path = parse_path(d_string)
        return path.length(error=1e-5)
    except Exception:
        return 0.0

# --- 颜色处理函数 (保持不变) ---
def parse_svg_styles(root):
    styles = {}
    namespace = "http://www.w3.org/2000/svg"
    style_tag = root.find(f'.//{{{namespace}}}defs/{{{namespace}}}style')
    if style_tag is not None and style_tag.text:
        css_text = re.sub(r'/\*.*?\*/', '', style_tag.text, flags=re.DOTALL)
        css_rules = re.findall(r'\.([\w-]+)\s*\{([^}]+)\}', css_text)
        for class_name, rules_text in css_rules:
            styles[class_name] = {}
            rules = [r.strip() for r in rules_text.split(';') if r.strip()]
            for rule in rules:
                if ':' in rule:
                    prop, val = rule.split(':', 1)
                    styles[class_name][prop.strip()] = val.strip()
    return styles

def get_element_stroke_color(elem, styles):
    stroke = elem.get('stroke')
    if stroke and stroke.lower() != 'none': return stroke
    style_attr = elem.get('style')
    if style_attr:
        match = re.search(r'stroke\s*:\s*([^;]+)', style_attr)
        if match:
            color = match.group(1).strip()
            if color.lower() != 'none': return color
    class_attr = elem.get('class')
    if class_attr and class_attr in styles:
        class_style = styles[class_attr]
        if 'stroke' in class_style and class_style['stroke'].lower() != 'none':
            return class_style['stroke']
    return 'none'

# --- 主处理函数 (已重构以支持最详细报告) ---

def analyze_pdf_and_calculate_lengths(pdf_path):
    if not os.path.exists(pdf_path):
        print(f"错误: 文件 '{pdf_path}' 不存在。")
        return

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"错误: 无法打开或处理PDF文件 '{pdf_path}'. 错误信息: {e}")
        return

    print(f"--- 开始分析文件: '{pdf_path}' (共 {doc.page_count} 页) ---\n")
    
    # 新的数据结构，用于存储所有页面的详细信息
    all_pages_results = []

    for page_num in range(doc.page_count):
        page = doc[page_num]
        
        # 用于存储当前页面按颜色分组的详细结果
        page_results_by_color = {}
        # 用于为当前页的每种形状编号
        page_element_counts = {}
        
        try:
            svg_string = page.get_svg_image(text_as_path=False)
            root = ET.fromstring(svg_string)
        except Exception as e:
            print(f"警告: 无法处理第 {page_num + 1} 页。跳过此页。错误: {e}")
            continue

        styles = parse_svg_styles(root)
        
        svg_ns = '{http://www.w3.org/2000/svg}'
        element_types = ['rect', 'path', 'line', 'circle', 'ellipse', 'polygon']
        
        for elem_type in element_types:
            for elem in root.findall(f'.//{svg_ns}{elem_type}'):
                color = get_element_stroke_color(elem, styles)
                if color == 'none':
                    continue
                
                length = 0.0
                try:
                    if elem_type == 'rect':
                        width, height = float(elem.get('width',0)), float(elem.get('height',0))
                        length = calculate_rect_perimeter(width, height)
                    elif elem_type == 'path':
                        length = calculate_path_length(elem.get('d', ''))
                    elif elem_type == 'line':
                        x1, y1, x2, y2 = float(elem.get('x1',0)), float(elem.get('y1',0)), float(elem.get('x2',0)), float(elem.get('y2',0))
                        length = calculate_line_length(x1, y1, x2, y2)
                    elif elem_type == 'circle':
                        length = calculate_circle_circumference(float(elem.get('r', 0)))
                    elif elem_type == 'ellipse':
                        rx, ry = float(elem.get('rx', 0)), float(elem.get('ry', 0))
                        length = calculate_ellipse_circumference(rx, ry)
                    elif elem_type == 'polygon':
                        points = parse_points_string(elem.get('points', ''))
                        length = calculate_polyline_length(points, closed=True)
                except (ValueError, TypeError, AttributeError):
                    continue
                
                if length > 0:
                    page_element_counts[elem_type] = page_element_counts.get(elem_type, 0) + 1
                    shape_name = f"{elem_type.capitalize()} #{page_element_counts[elem_type]}"
                    
                    if color not in page_results_by_color:
                        page_results_by_color[color] = []
                    
                    page_results_by_color[color].append({'name': shape_name, 'length_pt': length})
        
        all_pages_results.append({'page_num': page_num + 1, 'details_by_color': page_results_by_color})

    # --- 打印最终的、最详细的报告 ---
    print("\n" + "="*70)
    print(" " * 26 + "详细计算报告")
    print("="*70)

    grand_total_pt = 0.0
    
    for page_result in all_pages_results:
        page_num = page_result['page_num']
        details_by_color = page_result['details_by_color']
        page_subtotal_pt = 0.0

        print(f"\n--- 页面 {page_num} " + "-"*58)
        if not details_by_color:
            print("未在此页面找到可计算的矢量线条。")
            continue
        
        # 按颜色排序以获得一致的输出
        for color, shapes in sorted(details_by_color.items()):
            color_subtotal_pt = sum(s['length_pt'] for s in shapes)
            page_subtotal_pt += color_subtotal_pt
            
            print(f"\n  描边颜色: {color}")
            print(f"  {'':<25} | {'长度 (points)':>18} | {'长度 (mm)':>15}")
            print("  " + "-" * 60)
            
            for shape in shapes:
                length_pt = shape['length_pt']
                length_mm = length_pt * MM_PER_POINT
                print(f"  {shape['name']:<25} | {length_pt:18.2f} | {length_mm:15.2f}")
            
            print("  " + "-" * 60)
            color_subtotal_mm = color_subtotal_pt * MM_PER_POINT
            print(f"  {'颜色小计':<25} | {color_subtotal_pt:18.2f} | {color_subtotal_mm:15.2f}")

        print("-" * 70)
        page_subtotal_mm = page_subtotal_pt * MM_PER_POINT
        print(f"{'页面小计':<27} | {page_subtotal_pt:18.2f} | {page_subtotal_mm:15.2f}")
        grand_total_pt += page_subtotal_pt

    print("\n" + "="*70)
    grand_total_mm = grand_total_pt * MM_PER_POINT
    print(f"{'总计 (Grand Total)':<27} | {grand_total_pt:18.2f} | {grand_total_mm:15.2f}")
    print("="*70)
    
    doc.close()

# --- 主程序入口 ---
if __name__ == "__main__":
    pdf_file_to_process = "算法/线长计算/my_drawing.pdf"
    
    if len(sys.argv) > 1:
        pdf_file_to_process = sys.argv[1]
        
    analyze_pdf_and_calculate_lengths(pdf_file_to_process)