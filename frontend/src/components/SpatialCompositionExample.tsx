// baghaei.com/frontend/src/components/SpatialCompositionExample.tsx
import React from 'react';

const SpatialCompositionExample: React.FC = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      {/* Section 1: Asymmetrical Content Blocks & Generous Negative Space */}
      <section className="mb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-gray-900 text-gray-50 rounded-xl shadow-lg flex flex-col justify-center">
          <h2 className="text-display-1 font-display mb-4">Unconventional Layouts</h2>
          <p className="text-lg text-gray-300">
            This section demonstrates an asymmetrical division, giving prominence to the main content block.
            Generous padding provides ample negative space, allowing elements to breathe and focus to be maintained.
          </p>
        </div>
        <div className="lg:col-span-1 p-8 bg-blue-500 text-gray-50 rounded-xl shadow-lg flex items-center justify-center -mt-8 lg:mt-0 lg:-ml-8 relative z-10">
          <p className="text-xl font-bold">Key Insight or Call to Action</p>
        </div>
      </section>

      {/* Section 2: Strategic Overlap & Implied Diagonal Flow */}
      <section className="relative mb-24 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl relative z-20">
            <h3 className="text-display-2 font-display mb-4 text-blue-500">Depth and Dimension</h3>
            <p className="text-gray-200">
              Elements are carefully positioned to create a sense of depth through overlapping.
              Notice how the blue accent element below visually 'tucks under' this content.
            </p>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-700 rounded-full mix-blend-screen opacity-50 -translate-x-1/2 -translate-y-1/2 z-0"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gray-700 rounded-full mix-blend-screen opacity-50 translate-x-1/2 translate-y-1/2 z-0"></div>
      </section>

      {/* Section 3: Grid-Breaking Element (Conceptual) */}
      <section className="mb-16">
        <div className="relative w-full overflow-hidden">
          <img
            src="https://via.placeholder.com/1200x400?text=Grid-Breaking+Image"
            alt="Grid breaking example"
            className="w-full h-96 object-cover -mx-4 md:-mx-8 lg:-mx-16" // Negative margin to break grid
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-display-2 font-display text-white text-center">Breaking Boundaries</p>
          </div>
        </div>
      </section>

      {/* Section 4: Controlled Density */}
      <section className="bg-gray-950 p-16 rounded-xl shadow-2xl">
        <h3 className="text-display-2 font-display mb-8 text-gray-50 text-center">Controlled Information Density</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg text-gray-200">
              <h4 className="text-lg font-bold mb-2">Feature {i + 1}</h4>
              <p className="text-sm">
                Concise information delivered in digestible blocks, maintaining clarity despite density.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SpatialCompositionExample;

/*
How to apply these spatial composition principles in your project:

1.  **Asymmetrical Content Blocks:**
    -   Use Tailwind's grid system (e.g., `grid-cols-1 lg:grid-cols-3`) or flexbox with varying `col-span` values to create unequal divisions of space.
    -   Example: A hero section where text takes 2/3 width and an image takes 1/3.

2.  **Strategic Overlap:**
    -   Employ negative margins (`-mt-X`, `-ml-X`) on elements to pull them over their neighbors.
    -   Use absolute positioning (`absolute`, `top-X`, `left-X`, `z-index`) for more precise control over layering, ensuring text remains readable.
    -   Example: An image slightly overlapping the border of a text container.

3.  **Implied Diagonal Flow:**
    -   Arrange content in a way that guides the user's eye diagonally. This can be achieved by offsetting elements in a sequence or through visual hierarchy.
    -   Example: A series of cards where each card's top-left corner is slightly offset from the previous one, creating a subtle diagonal line.

4.  **Controlled Density & Negative Space:**
    -   Consciously vary padding and margin (`p-X`, `m-X`, `py-X`, `my-X`) to create areas of high and low information density.
    -   Use large `py-X` values for sections to introduce ample negative space, providing visual breaks.

5.  **Grid-Breaking Elements:**
    -   For impactful visuals, allow certain elements (e.g., a background image, a large heading) to extend beyond the main content container.
    -   This can be done using negative horizontal margins (`-mx-X`) on full-width elements or by positioning elements absolutely outside the conventional grid boundaries.
    -   Ensure that such elements do not hinder responsiveness or content readability on smaller screens.
*/
