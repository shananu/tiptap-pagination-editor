# Tiptap Pagination Editor

A Tiptap-based rich text editor with real-time visual pagination, designed to show how legal documents will appear when printed.

This project was built as part of an intern assignment to explore pagination challenges in rich text editors and to create a production-ready, explainable solution.

---

## 🚀 Live Demo

👉 https://tiptap-pagination-editor-eight.vercel.app/

---

## ✨ Features

- Real-time visual pagination
- US Letter page size (8.5" × 11") with 1-inch margins
- Clear visual page boundaries similar to Google Docs / Word
- Page numbers
- Supports standard formatting:
  - Headings
  - Paragraphs
  - Bold / Italic
  - Text color
- Stable single-editor architecture (no broken cursor, undo, or selection)

---

## 🧠 Approach & Design Decisions

### 1. Single Editor Instance

Tiptap (ProseMirror) editors must be mounted exactly once in the DOM to preserve:
- cursor behavior
- undo/redo history
- selection and copy/paste correctness

Because of this, the editor content is rendered as **one continuous flow**.

---

### 2. Visual Pagination (Not Structural)

Instead of splitting the document into multiple editors or page-level nodes, pagination is treated as a **visual concern**:

- The rendered height of the editor content is measured
- Fixed-size page shells (US Letter) are rendered behind the editor
- Page count updates dynamically as content changes

This approach mirrors how many production editors handle pagination during editing.

---

### 3. Margins and Page Boundaries

Top and bottom margins are represented visually on each page to match print layout expectations.

While the editor content flows continuously, users can clearly see:
- where each page starts and ends
- what content belongs to which page when printed

This avoids complex layout engines while keeping the editor stable.

---

## ⚖️ Trade-offs & Limitations

- Pagination is **visual**, not structural
- The cursor can flow across page boundaries during editing
- True page-level layout frames (like Microsoft Word) would require a custom layout engine, which is out of scope for this assignment

These trade-offs were made intentionally to balance correctness, stability, and scope.

---

## 🔮 What I Would Improve With More Time

- Print-specific styles using `@media print`
- Header and footer support
- Table pagination handling
- Optional PDF export
- Performance optimizations for very large documents

---

## 🤖 Use of AI Tools

AI tools were used as part of the development process to:
- explore possible approaches to pagination
- debug issues faster
- refine implementation details

All code was reviewed, understood, and adapted manually.

---

## 🛠 Tech Stack

- **Frontend:** Next.js + React
- **Editor:** Tiptap (ProseMirror)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## 📌 Conclusion

This project demonstrates a practical, production-minded approach to a known hard problem in rich text editors, with clear trade-offs and a stable implementation suitable for real users.
