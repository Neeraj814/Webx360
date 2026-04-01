import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="py-16 lg:py-20">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl rounded-2xl hero-gradient p-10 text-center lg:p-16"
      >
        <h2 className="font-heading text-3xl font-bold text-primary-foreground lg:text-4xl">
          Ready to Take the Next Step?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
          Join thousands of professionals who found their dream job through WebX. Create your profile and start applying today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" className="rounded-xl px-8">
            Get Started Free
          </Button>
          <Button size="lg" variant="ghost" className="rounded-xl px-8 text-primary-foreground hover:bg-primary-foreground/10">
            For Recruiters
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
