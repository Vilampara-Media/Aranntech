import re

with open('clean_original_footer.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract each main section/container
print("--- ALL TEXT AND LINKS IN SEQUENCE ---")
for m in re.finditer(r'(<h\d[^>]*>.*?</h\d>|<div[^>]*heading-title[^>]*>.*?</div>|<p[^>]*>.*?</p>|<ul[^>]*>.*?</ul>|<a\s+[^>]*href=[^>]*>.*?</a>)', text, re.DOTALL):
    chunk = m.group(0)
    # clean svg paths
    clean_chunk = re.sub(r'<svg.*?</svg>', '[SVG]', chunk, flags=re.DOTALL)
    clean_chunk = re.sub(r'\s+', ' ', clean_chunk).strip()
    if clean_chunk and not clean_chunk.startswith('<a class="elementor-icon elementor-animation-push"'):
        print(clean_chunk)

