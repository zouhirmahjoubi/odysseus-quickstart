
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialCard = ({ quote, authorName, authorTitle, rating = 5, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full border-none shadow-sm bg-muted/50 hover:bg-muted transition-colors duration-300">
        <CardContent className="p-8 flex flex-col h-full">
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${i < rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`} 
              />
            ))}
          </div>
          <blockquote className="flex-1 text-lg text-foreground font-medium leading-relaxed mb-8">
            "{quote}"
          </blockquote>
          <div className="flex items-center gap-4 mt-auto">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              {authorName.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-foreground">{authorName}</div>
              <div className="text-sm text-muted-foreground">{authorTitle}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
