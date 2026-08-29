import math

w = 17
hw = w / 2
S = (17.0, 0.0)
E = (83.0, 100.0)
vx, vy = E[0] - S[0], E[1] - S[1]
L = math.hypot(vx, vy)
ux, uy = -vy / L, vx / L


def off(p, d):
    return (p[0] + ux * d, p[1] + uy * d)


def fmt(p):
    return f"{p[0]:.2f},{p[1]:.2f}"


def clip_point(p):
    return (max(0, min(100, p[0])), max(0, min(100, p[1])))


def diag_slice(y0, y1):
    pts_top = []
    pts_bot = []
    for y in [y0, y1]:
        t = (y - S[1]) / vy
        cx = S[0] + t * vx
        pts_top.append(clip_point(off((cx, y), hw)))
        pts_bot.append(clip_point(off((cx, y), -hw)))
    return pts_top, pts_bot


left_upper = "M 0,0 L 8.5,8.5 L 17,0 L 17,38 L 0,38 Z"
left_lower = "M 0,62 L 17,62 L 17,74.5 L 8.5,83 L 0,74.5 Z"
right_upper = "M 83,0 L 91.5,8.5 L 100,0 L 100,38 L 83,38 Z"
right_lower = "M 83,62 L 100,62 L 100,74.5 L 91.5,83 L 83,74.5 Z"
bottom_left = "M 0,83 L 8.5,74.5 L 17,83 L 17,100 L 0,100 Z"
bottom_right = "M 83,83 L 91.5,74.5 L 100,83 L 100,100 L 83,100 Z"
bottom_mid = "M 17,83 L 83,83 L 83,100 L 17,100 Z"

t0, b0 = diag_slice(0, 38)
t1, b1 = diag_slice(62, 100)
diag_upper = f"M {fmt(t0[0])} L {fmt(t0[1])} L {fmt(b0[1])} L {fmt(b0[0])} Z"
diag_lower = f"M {fmt(t1[0])} L {fmt(t1[1])} L {fmt(b1[1])} L {fmt(b1[0])} Z"

svg = f"""<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="white"/>
  <g fill="#C9A44A">
    <path d="{left_upper}"/>
    <path d="{left_lower}"/>
    <path d="{right_upper}"/>
    <path d="{right_lower}"/>
    <path d="{bottom_left}"/>
    <path d="{bottom_right}"/>
    <path d="{bottom_mid}"/>
    <path d="{diag_upper}"/>
    <path d="{diag_lower}"/>
  </g>
</svg>
"""

out = r"d:\Projects\portfolio\public\noirly-n.svg"
with open(out, "w", encoding="utf-8") as f:
    f.write(svg)

print(f"Wrote {out}")
print(diag_upper)
print(diag_lower)
