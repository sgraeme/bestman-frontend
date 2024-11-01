import React, { useState, useEffect } from "react";
import { UserInterest, Interest, UpdatedUserInterest } from "../types";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { apiService } from "../services/ApiService";
import { cn } from "@/lib/utils";

interface EditInterestsProps {
  userInterests: UserInterest[];
  onSave: (updatedInterests: UserInterest[]) => void;
  onCancel: () => void;
}

const EditInterests: React.FC<EditInterestsProps> = ({
  userInterests,
  onSave,
  onCancel,
}) => {
  const [allInterests, setAllInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllInterests = async () => {
      try {
        const interests = await apiService.getAllInterests();
        setAllInterests(interests);
        setSelectedInterests(
          userInterests.map((ui) => ui.interest_id.toString())
        );
      } catch (err) {
        setError("Failed to fetch all interests");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllInterests();
  }, [userInterests]);

  const handleSave = async () => {
    const updatedInterests: UpdatedUserInterest[] = selectedInterests.map(
      (id) => ({
        interest_id: parseInt(id, 10),
      })
    );

    try {
      await apiService.bulkUpdateInterests(updatedInterests);
      const newUserInterests = allInterests
        .filter((interest) =>
          selectedInterests.includes(interest.id.toString())
        )
        .map((interest) => ({
          interest_id: interest.id,
          interest_name: interest.name,
          category_name: interest.category_name,
        }));
      onSave(newUserInterests);
    } catch (err) {
      setError("Failed to update interests");
      console.error(err);
    }
  };

  const groupedInterests = allInterests.reduce((acc, interest) => {
    if (!acc[interest.category_name]) {
      acc[interest.category_name] = [];
    }
    acc[interest.category_name].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  if (isLoading) return <div>Loading interests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {Object.entries(groupedInterests).map(([category, interests]) => (
        <div key={category}>
          <h3>{category}</h3>
          <ToggleGroup
            type="multiple"
            value={selectedInterests}
            onValueChange={setSelectedInterests}
            variant={"outline"}
            size="sm"
            className="flex-wrap justify-start"
          >
            {interests.map((interest) => (
              <ToggleGroupItem key={interest.id} value={interest.id.toString()}>
                {interest.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}
      <div className={cn("flex gap-2")}>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </>
  );
};

export default EditInterests;
