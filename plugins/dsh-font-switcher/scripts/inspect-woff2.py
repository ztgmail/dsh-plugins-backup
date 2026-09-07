#!/usr/bin/env python3
"""inspect-woff2.py — print family name, weight table, fvar axes and glyph count
for one or more font files (ttf/otf/woff/woff2). Usage:
  python scripts/inspect-woff2.py <file> [<file> ...]
"""
import sys
from fontTools.ttLib import TTFont


def fmt_weight(ft: TTFont) -> str:
    try:
        os2 = ft["OS/2"]
        return str(os2.usWeightClass)
    except Exception:
        return "?"


def main() -> int:
    for path in sys.argv[1:]:
        ft = TTFont(path)
        name = ft["name"]
        fam = name.getDebugName(1) or name.getDebugName(16) or "?"
        sub = name.getDebugName(2) or ""
        fvar = ft.get("fvar")
        if fvar is not None:
            axes = "; ".join(f"{a.axisTag} {a.minValue}-{a.maxValue}" for a in fvar.axes)
        else:
            axes = "static"
        print(f"{path}")
        print(f"  family   : {fam} | {sub}")
        print(f"  weight   : {fmt_weight(ft)}")
        print(f"  axes     : {axes}")
        print(f"  glyphs   : {ft['maxp'].numGlyphs}")
        ft.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
