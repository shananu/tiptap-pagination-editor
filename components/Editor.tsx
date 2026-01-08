"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

/**
 * US Letter dimensions (8.5 x 11 inches at 96 DPI)
 */
const PAGE_WIDTH = 816;
const PAGE_HEIGHT = 1056;
const PAGE_PADDING = 96; // 1 inch
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2;
const PAGE_GAP = 32;

export default function Editor() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: `
      <h2>Sample Legal Letter</h2>
      <p>Start typing a lot of text to see pages appear.</p>
    `,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      updateCurrentPage(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateCurrentPage(editor);
    },
  });

  /**
   * Pagination logic (measure editor height)
   */
  useEffect(() => {
    if (!editor) return;

    const updatePages = () => {
      if (!contentRef.current) return;

      const height = contentRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(height / CONTENT_HEIGHT));
      setPageCount(pages);
    };

    updatePages();
    editor.on("update", updatePages);

    return () => {
      editor.off("update", updatePages);
    };
  }, [editor]);

  /**
   * Calculate current page based on cursor position
   */
  const updateCurrentPage = (editorInstance: any) => {
    if (!contentRef.current) return;

    const selection = editorInstance.state.selection;
    const resolvedPos = editorInstance.state.doc.resolve(selection.$anchor.pos);
    const node = contentRef.current.querySelector(".ProseMirror");

    if (node) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = node.getBoundingClientRect();
        const relativeTop = rect.top - editorRect.top + node.scrollTop;

        if (relativeTop >= 0) {
          const page = Math.max(
            1,
            Math.ceil((relativeTop + PAGE_PADDING) / (PAGE_HEIGHT + PAGE_GAP))
          );
          setCurrentPage(Math.min(page, pageCount));
        }
      }
    }
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12">
      <div className="flex flex-col items-center">
        {/* Document wrapper */}
        <div
          className="relative"
          style={{
            width: PAGE_WIDTH,
            height: pageCount * (PAGE_HEIGHT + PAGE_GAP),
          }}
        >
          {/* Page shells with break indicators */}
          {Array.from({ length: pageCount }).map((_, i) => (
            <div key={i}>
              {/* Page break indicator (between pages) */}
              {i > 0 && (
                <div
                  className="relative"
                  style={{
                    width: PAGE_WIDTH,
                    height: PAGE_GAP,
                  }}
                >
                  <div
                    className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2"
                    style={{
                      borderTop: "1.5px dashed rgba(107, 114, 128, 0.6)",
                    }}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 bg-gradient-to-b from-gray-100 to-gray-200">
                    <span className="text-xs text-gray-400 font-medium">
                      Page {i}
                    </span>
                  </div>
                </div>
              )}

              {/* Page shell */}
              <div
                className={`relative rounded-sm transition-all duration-200 ${
                  currentPage === i + 1
                    ? "ring-2 ring-blue-300 shadow-lg"
                    : "shadow-md hover:shadow-lg"
                }`}
                style={{
                  width: PAGE_WIDTH,
                  height: PAGE_HEIGHT,
                  boxShadow:
                    currentPage === i + 1
                      ? "0 2px 4px rgba(0,0,0,0.05), 0 12px 28px rgba(59, 130, 246, 0.15)"
                      : "0 2px 4px rgba(0,0,0,0.05), 0 12px 28px rgba(0,0,0,0.10)",
                  backgroundColor: currentPage === i + 1 ? "#fafbfc" : "white",
                }}
              >
                {/* Page number indicator */}
                <div className="absolute bottom-6 right-10 text-xs text-gray-400 font-medium">
                  Page {i + 1}
                </div>

                {/* Subtle page top border accent */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: "2px",
                    background:
                      currentPage === i + 1
                        ? "linear-gradient(to right, rgba(59, 130, 246, 0.3), transparent)"
                        : "linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent)",
                  }}
                />

                {/* Top margin indicator */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: `${PAGE_PADDING}px`,
                    height: "1px",
                    borderTop: "1px dashed rgba(209, 213, 219, 0.5)",
                  }}
                />

                {/* Bottom margin indicator */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: `${PAGE_HEIGHT - PAGE_PADDING}px`,
                    height: "1px",
                    borderTop: "1px dashed rgba(209, 213, 219, 0.5)",
                  }}
                />
              </div>
            </div>
          ))}

          {/* SINGLE editor instance */}
          <div
            ref={contentRef}
            className="absolute top-0 left-0 p-[96px] pointer-events-auto"
            style={{ width: PAGE_WIDTH }}
          >
            <EditorContent
              editor={editor}
              className="text-gray-800 leading-relaxed prose prose-sm max-w-none"
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            />
          </div>
        </div>
      </div>

      {/* Page indicator footer */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-900">{pageCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
