import React from "react";
import { UserInterest } from "../types";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface GroupedInterestsProps {
  userInterests: UserInterest[];
  isLoading: boolean;
  error: string | null;
}

const GroupedInterests: React.FC<GroupedInterestsProps> = ({
  userInterests,
  isLoading,
  error,
}) => {
  const groupInterestsByCategory = () => {
    const groupedInterests: { [key: string]: UserInterest[] } = {};
    userInterests.forEach((interest) => {
      if (!groupedInterests[interest.category_name]) {
        groupedInterests[interest.category_name] = [];
      }
      groupedInterests[interest.category_name].push(interest);
    });
    return groupedInterests;
  };

  if (isLoading) {
    return <p>Loading interests...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const groupedInterests = groupInterestsByCategory();

  return (
    <>
      {Object.entries(groupedInterests).map(([category, interests]) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className={cn("flex flex-wrap gap-1")}>
            {interests.map((interest) => (
              <Badge key={interest.interest_id} variant={"secondary"}>
                {interest.interest_name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default GroupedInterests;
