// baghaei.com/frontend/src/components/BackgroundVisualsExample.tsx
import React from 'react';

const BackgroundVisualsExample: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-gray-50 font-sans">
      {/* Global Grain Overlay (Conceptual) */}
      <div className="grain-overlay pointer-events-none absolute inset-0 z-50 opacity-10"></div>

      {/* Background with Gradient Mesh and Noise Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-blue-950 via-gray-950 to-black noise-bg">
        {/* The noise-bg class will apply a subtle noise texture */}
      </div>

      <div className="relative z-10 container mx-auto py-20 px-4">
        {/* Layered Transparency Card with Dramatic Shadow */}
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-3xl p-10 mb-16 shadow-dramatic">
          <h2 className="text-display-2 font-display text-blue-400 mb-6">Atmospheric Card</h2>
          <p className="text-lg text-gray-300 mb-4">
            This card demonstrates layered transparency, allowing the background to subtly show through.
            It also features a dramatic shadow to make it pop from the background, creating a sense of depth.
          </p>
          <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-bold transition-colors shadow-dramatic-sm cursor-custom">
            Explore More
          </button>
        </div>

        {/* Decorative Border Example */}
        <div className="border-gradient rounded-xl p-8 mb-16 text-gray-200">
          <h3 className="text-display-3 font-display mb-4">Decorative Section</h3>
          <p>
            A section with a unique, gradient border to visually define its space and add character.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackgroundVisualsExample;

/*
How to apply these background and visual detail principles in your project:

1.  **Subtle Gradient Meshes and Noise Overlays:**
    -   **Gradients:** Update your main `body` or container backgrounds in `globals.css` or component styles.
        Example in globals.css (for a dark theme base):
        ```css
        body {
          /* ... existing styles */
          background-image: radial-gradient(at 20% 80%, var(--color-blue-950), transparent),
                            radial-gradient(at 80% 20%, var(--color-gray-950), transparent),
                            linear-gradient(to bottom right, var(--color-black), var(--color-gray-900));
          background-attachment: fixed;
        }
        ```
    -   **Noise Overlay:** Create a CSS class for a subtle noise texture.
        Example in globals.css:
        ```css
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-size: cover;
        }
        ```
        Apply `noise-bg` to your main background element.

2.  **Layered Transparencies with Depth:**
    -   Use Tailwind's opacity classes (e.g., `bg-white/5`, `bg-black/50`) on components like cards or modals.
    -   Combine with `backdrop-blur-sm` for a frosted glass effect on modern browsers.
    -   Example: `<div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg">...</div>`

3.  **Dramatic Shadows for Focus:**
    -   Create custom `box-shadow` utilities in `tailwind.config.ts` or directly in `globals.css`.
    -   Example in `tailwind.config.ts`:
        ```typescript
          // ... inside extend
          boxShadow: {
            'dramatic': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 10px 20px -10px rgba(0, 0, 0, 0.5)',
            'dramatic-sm': '0 10px 20px -8px rgba(0, 0, 0, 0.6)',
          },
        ```
        Then apply: `<div className="shadow-dramatic">...</div>`

4.  **Decorative Borders:**
    -   For unique borders, you can use `border-image` CSS property or SVG backgrounds.
    -   Example in `globals.css`:
        ```css
        .border-gradient {
          border: 4px solid transparent;
          border-image: linear-gradient(to right, var(--color-blue-500), var(--color-gray-500)) 1;
        }
        ```

5.  **Custom Cursors (Strategic Use):**
    -   Define a custom cursor in `globals.css` and apply a class. Remember to use sparingly.
    -   Example in `globals.css`:
        ```css
        .cursor-custom {
          cursor: url('/path/to/your/custom-cursor.png') 16 16, auto; /* 16 16 are hotspot coordinates */
        }
        ```
        Apply: `<button className="cursor-custom">...</button>`

6.  **Global Grain Overlay:**
    -   As shown in the example component, a fixed pseudo-element or div can cover the screen with a subtle grain texture.
    -   Ensure `pointer-events-none` so it doesn't interfere with interactions.
    -   You might need to add a small SVG for noise or use a base64 encoded one.
    -   Example in `globals.css`:
        ```css
        .grain-overlay {
          background-image: url('data:image/png;base64,...'); // Your base64 grain image
          mix-blend-mode: overlay; // Or 'soft-light', 'multiply', etc.
          /* Ensure it covers everything */
          top: 0; left: 0; width: 100%; height: 100%; position: fixed;
          pointer-events: none;
          z-index: 9999; /* Adjust z-index as needed */
        }
        ```
*/
