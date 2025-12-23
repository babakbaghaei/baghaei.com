// baghaei.com/frontend/src/components/AnimatedBox.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBoxProps {
  children?: React.ReactNode;
  delay?: number;
}

// Define consistent transition properties
const transitionProps = {
  duration: 0.8,
  ease: [0.6, 0.05, -0.01, 0.9], // Custom easing for a more dynamic feel
};

// Variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each child animates with a 0.1s delay
      delayChildren: 0.2,   // Parent animation finishes before children start
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: transitionProps },
};

const AnimatedBox: React.FC<AnimatedBoxProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      transition={{ delay: delay, ...transitionProps }} // Apply a delay to the whole box
      className="p-4 bg-gray-700 text-gray-50 rounded-lg shadow-lg"
    >
      <motion.div // Example of a child element with hover effect
        variants={itemVariants}
        whileHover={{ scale: 1.05, backgroundColor: 'var(--color-blue-500)' }}
        transition={transitionProps}
        className="cursor-pointer"
      >
        {children || "Animated Content"}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedBox;

/*
How to use these motion principles in your project:

1.  **Orchestrated Page Load Animations:**
    -   Wrap main content sections or lists of items with a `motion.div` that uses `containerVariants`.
    -   Wrap individual items within those sections with a `motion.div` that uses `itemVariants`.
    -   Adjust `staggerChildren` and `delayChildren` in `containerVariants` for desired effect.
    -   Example:
        ```jsx
        // In a page or large component
        import { motion } from 'framer-motion';
        // ... define containerVariants and itemVariants as above or in a central config

        function MyPage() {
          return (
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <h1><motion.span variants={itemVariants}>Welcome</motion.span></h1>
              <p><motion.span variants={itemVariants}>This is some animated content.</motion.span></p>
              <motion.div variants={itemVariants} className="my-card">
                 // Card content
              </motion.div>
            </motion.div>
          );
        }
        ```

2.  **Delightful Hover & Focus States:**
    -   Apply `whileHover` to interactive elements like buttons, links, or cards.
    -   Example for a button:
        ```jsx
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'var(--color-blue-600)', color: 'var(--color-gray-50)' }}
          whileTap={{ scale: 0.95 }}
          transition={transitionProps}
          className="btn-primary"
        >
          Click Me
        </motion.button>
        ```

3.  **Meaningful Scroll-Triggered Effects:**
    -   Use `framer-motion`'s `useInView` hook (from `framer-motion/dom`) or `whileInView` prop directly on components.
    -   Example with `useInView`:
        ```jsx
        import { motion, useInView } from 'framer-motion';
        import { useRef } from 'react';

        function SectionWithScrollEffect() {
          const ref = useRef(null);
          const isInView = useInView(ref, { once: true, amount: 0.5 }); // Trigger once when 50% in view

          return (
            <motion.section
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={transitionProps}
            >
              <h2><motion.span variants={itemVariants}>Our Services</motion.span></h2>
              <p><motion.span variants={itemVariants}>Details about our services...</motion.span></p>
            </motion.section>
          );
        }
        ```

4.  **Consistency in Easing and Duration:**
    -   Define a global `transitionProps` object (as shown in `AnimatedBox`) and reuse it across all `motion` components to ensure a unified animation feel. Adjust `duration` and `ease` as needed for the overall aesthetic.
*/
