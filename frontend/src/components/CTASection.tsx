import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-16 lg:py-20">
    <div className="container mx-auto max-w-7xl px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl rounded-[2rem] hero-gradient p-10 text-center lg:p-16"
      >
        <h2 className="font-display text-3xl font-semibold text-primary-foreground lg:text-4xl text-balance">
          Your next role is one application away
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
          Create a profile, apply to roles that actually match your skills, and hear back faster.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="rounded-full px-8 font-semibold">
              Create free account
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="ghost" className="rounded-full px-8 font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              I'm hiring
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
