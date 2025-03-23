import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const fakeIngredients = [
    "Apple", "Banana", "Chicken Breast", "Rice", "Salmon", "Avocado"
  ];


const MealDialog = ({ open, onClose, mode }) => {
  const [mealName, setMealName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  
  const filteredIngredients = fakeIngredients.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients([...selectedIngredients, ingredient]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Meal" : "View/Edit Ingredients"}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Meal Name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="mb-4"
        />

        <Input
          placeholder="Search ingredients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="mt-2 space-y-1">
          {filteredIngredients.map((ingredient) => (
            <Button key={ingredient} onClick={() => handleAddIngredient(ingredient)}>
              {ingredient}
            </Button>
          ))}
        </div>

        <div className="mt-4">
          <p>Selected Ingredients:</p>
          {selectedIngredients.map((item, idx) => (
            <span key={idx} className="inline-block p-1 m-1">{item}</span>
          ))}
        </div>

        <Button onClick={onClose} className="mt-4">Save Meal</Button>
      </DialogContent>
    </Dialog>
  );
}

export default MealDialog