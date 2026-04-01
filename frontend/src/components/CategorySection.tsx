import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "@/utils/filterOptions";

const CategorySection = () => {
  // Container variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Smoothly delays each card
      },
    },
  };

  // Individual card variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 12 } 
    },
  };

  return (
    <section className="py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-foreground"
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-muted-foreground"
          >
            Explore opportunities across industries
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }} // Subtle lift on hover
              whileTap={{ scale: 0.98 }} // "Click" feel
            >
              <Link
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-lg hover:border-primary/40 hover:bg-accent/5"
              >
                {/* Icon Animation */}
                <motion.span 
                  whileHover={{ rotate: [0, -10, 10, 0] }} // Wiggle on hover
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl shadow-inner"
                >
                  {cat.icon}
                </motion.span>

                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {cat.count.toLocaleString()} jobs available
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;