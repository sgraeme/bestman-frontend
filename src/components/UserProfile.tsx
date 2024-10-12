import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/ApiService";
import { UserProfileData, UserInterest } from "../types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import GroupedInterests from "./GroupedInterests";
import EditInterests from "./EditInterests";

const UserProfile: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interestsError, setInterestsError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [editedBio, setEditedBio] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await apiService.getUserProfile();
        setProfileData(data);
        setEditedBio(data.bio);
      } catch (err) {
        setError("Failed to fetch profile data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserInterests = async () => {
      try {
        const interests = await apiService.getUserInterests();
        setUserInterests(interests);
      } catch (err) {
        setInterestsError("Failed to fetch interests");
        console.error(err);
      } finally {
        setIsLoadingInterests(false);
      }
    };

    if (isAuthenticated) {
      fetchProfileData();
      fetchUserInterests();
    }
  }, [isAuthenticated]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedBio(profileData?.bio || "");
  };

  const handleSave = async () => {
    if (!profileData || editedBio === profileData.bio) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedProfile = await apiService.updateUserProfile({
        bio: editedBio,
      });
      setProfileData(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  const handleEditInterests = () => {
    setIsEditingInterests(true);
  };

  const handleInterestsSave = async (updatedInterests: UserInterest[]) => {
    setUserInterests(updatedInterests);
    setIsEditingInterests(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
        Please log in to view your profile.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {profileData && (
        <div className="space-y-4">
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          {isEditing ? (
            <div className="space-y-2">
              <label htmlFor="bio" className="block font-medium">
                Bio:
              </label>
              <Textarea
                id="bio"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                rows={4}
                className="w-full"
              />
              <div className="space-x-2">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p>
                <strong>Bio:</strong> {profileData.bio}
              </p>
              <Button onClick={handleEdit} className="mt-2">
                Edit Bio
              </Button>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold mb-2">Interests</h2>
            {isEditingInterests ? (
              <EditInterests
                userInterests={userInterests}
                onSave={handleInterestsSave}
                onCancel={() => setIsEditingInterests(false)}
              />
            ) : (
              <>
                <GroupedInterests
                  userInterests={userInterests}
                  isLoading={isLoadingInterests}
                  error={interestsError}
                />
                <Button onClick={handleEditInterests} className="mt-2">
                  Edit Interests
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
