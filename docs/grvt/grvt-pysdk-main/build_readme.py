from pathlib import Path

readme = Path("README.md").read_text()
changelog = Path("CHANGELOG.md").read_text()

combined = f"{readme}\n\n## Changelog\n\n{changelog}"

Path("README_PYPI.md").write_text(combined)
print("✅ Combined README.md and CHANGELOG.md into README_PYPI.md")
