
import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const SolutionCard = ({ title, description, image, link, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden h-full border-none shadow-lg bg-card hover:shadow-2xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold tracking-tight mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6 line-clamp-3">
            {description}
          </p>
          <Link 
            to={link} 
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Learn more about {title} <ArrowUpRight className="ml-1 w-4 h-4" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SolutionCard;
