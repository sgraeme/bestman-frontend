import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/ApiService";
import { UserProfileData, UserInterest } from "../types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import GroupedInterests from "./GroupedInterests";

const UserProfile: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interestsError, setInterestsError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {profileData && (
        <div>
          <p>Email: {profileData.email}</p>
          {isEditing ? (
            <div>
              <p>Bio:</p>
              <Textarea
                id="bio"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                rows={4}
              />
              <div>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <p>
                <strong>Bio:</strong> {profileData.bio}
              </p>
              <Button onClick={handleEdit}>Edit Bio</Button>
            </div>
          )}
          <h2>Interests</h2>
          <GroupedInterests
            userInterests={userInterests}
            isLoading={isLoadingInterests}
            error={interestsError}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
