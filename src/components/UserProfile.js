// UserProfile.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig'; // Adjust the import path based on your project structure
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch additional user data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName || 'User'}!</h1>
          <p>Email: {user.email}</p>
          {userData && (
            <div>
              <h2>Additional Information</h2>
              <p>Some Field: {userData.someField}</p>
              {/* Add more fields as needed */}
            </div>
          )}
        </div>
      ) : (
        <p>Please sign in to see your profile information.</p>
      )}
    </div>
  );
}

export default UserProfile;
