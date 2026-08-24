import os
import sys
import unittest
from bs4 import BeautifulSoup

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web", "out")
VIEWPORTS = [320, 360, 375, 390, 414, 430, 480, 768, 900]

CORE_TEST_PAGES = [
    os.path.join(OUT_DIR, "index.html"),
    os.path.join(OUT_DIR, "projects", "index.html"),
    os.path.join(OUT_DIR, "blog", "index.html"),
    os.path.join(OUT_DIR, "guides", "index.html"),
    os.path.join(OUT_DIR, "authors", "index.html"),
    os.path.join(OUT_DIR, "projects", "monad", "index.html"),
    os.path.join(OUT_DIR, "guides", "avoiding-sybil-detection", "index.html")
]

class TestMobileResponsiveHardening(unittest.TestCase):

    def test_mobile_accessibility_and_aria_attributes(self):
        """Asserts mobile drawer has ARIA attributes and focus controls across all pages."""
        for page_path in CORE_TEST_PAGES:
            if not os.path.exists(page_path):
                continue
            with open(page_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

            burger = soup.find("button", class_="burger")
            if burger:
                self.assertTrue(burger.has_attr("aria-label"), f"Burger button missing aria-label in {page_path}")
                self.assertTrue(burger.has_attr("aria-expanded"), f"Burger button missing aria-expanded in {page_path}")
                self.assertTrue(burger.has_attr("aria-controls"), f"Burger button missing aria-controls in {page_path}")
                self.assertEqual(burger["aria-controls"], "mobile-navigation")

            nav = soup.find("nav", id="mobile-navigation")
            self.assertIsNotNone(nav, f"Mobile navigation missing id='mobile-navigation' in {page_path}")
            self.assertTrue(nav.has_attr("aria-label"), f"Nav missing aria-label in {page_path}")

    def test_table_scroll_wrapping_and_overflow_protection(self):
        """Asserts all tables in content sections are wrapped in .table-scroll to prevent horizontal blowout."""
        for page_path in CORE_TEST_PAGES:
            if not os.path.exists(page_path):
                continue
            with open(page_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

            tables = soup.find_all("table")
            for table in tables:
                parent = table.parent
                is_wrapped = parent and "table-scroll" in parent.get("class", [])
                self.assertTrue(is_wrapped, f"Unwrapped <table> detected in {page_path} — must be wrapped in .table-scroll!")

    def test_css_hardening_rules_in_globals(self):
        """Asserts globals.css contains required hardening rules for pre, code, word-break, and touch targets."""
        css_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web", "src", "app", "globals.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()

        self.assertIn("overflow-wrap: anywhere", css)
        self.assertIn("word-break: break-word", css)
        self.assertIn(".table-scroll", css)
        self.assertIn("-webkit-overflow-scrolling: touch", css)
        self.assertIn("min-height: 44px", css)
        self.assertIn("min-width: 44px", css)
        self.assertIn(".back-to-top-btn", css)
        self.assertIn("env(safe-area-inset-bottom", css)

if __name__ == "__main__":
    unittest.main()
