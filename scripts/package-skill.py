#!/usr/bin/env python3
"""Build the public Skill ZIP from an explicit list of runtime resources.

Run from any directory: python3 scripts/package-skill.py
The committed site/downloads/liebin-skill.zip works with static hosting.
Re-run whenever a bundled skill resource changes, before publishing the site.
"""

from pathlib import Path
import hashlib
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "site" / "downloads" / "liebin-skill.zip"


def build():
    resources = [
        (ROOT / "SKILL.md", "SKILL.md"),
        (ROOT / "docs/skill-install.md", "INSTALL.md"),
        (ROOT / "scripts/proof.mjs", "scripts/proof.mjs"),
        (ROOT / "scripts/verify-page.mjs", "scripts/verify-page.mjs"),
        (ROOT / "assets/preview-template.html", "assets/preview-template.html"),
    ]
    resources.extend(
        (path, path.relative_to(ROOT).as_posix())
        for path in sorted((ROOT / "references").rglob("*"))
        if path.is_file() and path.suffix.lower() in {".md", ".png", ".jpg", ".jpeg", ".webp"}
    )
    entries = []
    for path, name in resources:
        if path.is_symlink() or not path.is_file():
            raise ValueError(f"Expected a regular resource file: {path}")
        path.resolve().relative_to(ROOT)
        entries.append(("liebin/" + name, path.read_bytes()))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    # Fixed metadata makes repeated builds of the same content identical.
    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, content in sorted(entries):
            info = zipfile.ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, content)
    with zipfile.ZipFile(OUT) as archive:
        assert archive.testzip() is None
        assert archive.read("liebin/SKILL.md") == (ROOT / "SKILL.md").read_bytes()
    print(f"{OUT}\n{len(entries)} files · {OUT.stat().st_size:,} bytes")
    print("SHA-256: " + hashlib.sha256(OUT.read_bytes()).hexdigest())


if __name__ == "__main__":
    build()
