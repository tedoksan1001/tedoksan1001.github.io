## 2025-05-15 - [Accessible Educational Content]
**Learning:** In educational pages with scientific notation (like chemical formulas), raw text or LaTeX-style strings without a renderer create a poor UX. Using semantic HTML <sub> tags is a simple but highly effective micro-UX win for readability.
**Action:** Always check for and fix unrendered mathematical or chemical notation in static pages.

## 2025-05-15 - [Localization and Accessibility]
**Learning:** ARIA labels must match the document's language for a consistent screen reader experience.
**Action:** When working on non-English pages, provide localized ARIA labels (e.g., Turkish for 'Menüyü aç/kapat').

## 2025-05-15 - [Quick Summary for UX]
**Learning:** Adding a "Quick Summary" (Hızlı Özet) component at the beginning of content-heavy scientific pages significantly improves information findability and user engagement. It allows users to grasp key concepts immediately before diving into details.
**Action:** Use a high-contrast but translucent background (like Bootstrap's `bg-opacity-10`) for summary boxes to make them stand out without breaking the theme.
