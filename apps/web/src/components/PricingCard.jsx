
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const PricingCard = ({ tierName, price, description, features, recommended = false, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`h-full ${recommended ? 'relative z-10' : ''}`}
    >
      <Card className={`flex flex-col h-full transition-all duration-300 ${
        recommended 
          ? 'border-2 border-primary shadow-2xl scale-105 bg-card' 
          : 'border shadow-md bg-muted/30 hover:shadow-lg'
      }`}>
        {recommended && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
          </div>
        )}
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-xl font-medium text-muted-foreground mb-4">{tierName}</CardTitle>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold tracking-tight text-foreground">{price}</span>
            {price !== 'Custom' && <span className="text-muted-foreground font-medium">/mo</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-4">{description}</p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-6 pb-8">
          <Button 
            className="w-full h-12 text-base" 
            variant={recommended ? 'default' : 'outline'}
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
