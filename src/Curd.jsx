import React, { useEffect, useState, useRef } from 'react';
import Loader from './components/Loader';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, addDoc, collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import "./css/style.css";

const storage = getStorage();
const Curd = () => {
  const [loader, setLoader] = useState(true);
  const [storedValues, setStoredValues] = useState([]);
  const [docId, setDocId] = useState('');
  const [img, setImage] = useState(null);
  const db = getFirestore();
  const first = useRef("");
  const second = useRef("");
const[desc,setDescription]=useState("")
const[cost,setCost]=useState("")
  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const reset = () => {
    first.current.value = '';
    second.current.value = '';
    setImage(null); // Reset image input
  };

  const fetchDataFromFirestore = async () => {
    setLoader(true); // Start loader
    try {
      const querySnapshot = await getDocs(collection(db, "Todo"));
      const temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push({ todoid: doc.id, ...doc.data() });
      });
      setStoredValues(temporaryArr);
    } catch (err) {
      console.error("Error fetching data from Firestore:", err);
    } finally {
      setLoader(false); // Stop loader
    }
  };

  const saveDataToFirestore = async () => {
    setLoader(true); // Start loader
    try {
      let imageURL = null;
      if (img) {
        debugger
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${img.name}`);
        const snapshot = await uploadBytes(storageRef, img);
        imageURL = await getDownloadURL(snapshot.ref);
      }
      
      // Get values from the input fields

debugger
      const data = {
        description: desc,
        Cost: cost,
        imageUrl: imageURL,
      };

      console.log("Saving data:", data);

      await addDoc(collection(db, "Todo"), data);
      alert("Document written to Database");
      fetchDataFromFirestore();
    } catch (err) {
      console.error("Error saving document:", err);
    } finally {
      setLoader(false); // Stop loader
    }
  };

  const deleteRecord = async (e) => {
    setLoader(true); // Start loader
    try {
      const uId = e.target.id;
      if (uId) {
        await deleteDoc(doc(db, "Todo", uId));
        alert("Document deletion successful");
        setStoredValues((prevValues) => prevValues.filter((item) => item.todoid !== uId));
      } else {
        console.error("No document ID found for deletion.");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Document deletion failed");
    } finally {
      setLoader(false); // Stop loader
    }
  };

  const updateDocument = async () => {
    setLoader(true); // Start loader
    try {
      let imageURL = null;
      if (img) {
        // Upload new image to Firebase Storage if available
        const storageRef = ref(storage, `images/${img.name}`);
        const snapshot = await uploadBytes(storageRef, img);
        imageURL = await getDownloadURL(snapshot.ref);
      }

      const updateData = {
        description: first.current.value,
        Cost: second.current.value,
      };
      if (imageURL) {
        updateData.imageUrl = imageURL;
      }

      console.log("Updating document:", updateData);

      await updateDoc(doc(db, 'Todo', docId), updateData);
      fetchDataFromFirestore();
      alert("Document updated");
      setDocId('');
      reset();
    } catch (err) {
      console.error("Error updating document:", err);
    } finally {
      setLoader(false); // Stop loader
    }
  };

  const fetchForEdit = async (e) => {
    try {
      const user_id = e.target.id;
      setDocId(user_id);
      const records = await getDoc(doc(db, 'Todo', user_id));
      if (records.exists()) {
        const record = records.data();
        first.current.value = record.description || '';
        second.current.value = record.Cost || '';
        // You may also want to handle displaying the current image URL
      } else {
        console.log('Record not found');
      }
    } catch (err) {
      console.error("Error fetching document for edit:", err);
    }
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="App">
          <h1>Save Data to Firebase Firestore</h1>
          <div className="formContainer">
            <div className="inputBox">
              <label htmlFor="inp1">Title</label>
              <input type="text" className='formElement' onChange={e=>setDescription(e.target.value)} id="inp1"/> <br /> <br />
            </div>
            <div className="inputBox">
              <label htmlFor="inp2">Cost</label>
              <input type="text" className='formElement' onChange={e=>setCost(e.target.value)}  id="inp2"/> <br /> <br />
            </div>
            <div className="inputBox">
              <label htmlFor="inp3">Image</label>
              <input type="file" className='formElement' onChange={(e) => setImage(e.target.files[0])} id="inp3"/> <br /> <br />
            </div>
          </div>
          <button onClick={saveDataToFirestore} disabled={docId.trim() !== ''}>Save to Firestore</button> <br /><br />
          <button onClick={updateDocument} disabled={docId.trim() === ''}>Update</button>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Image</th> {/* New column for image */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {storedValues.map((value, key) => (
                  <tr key={key}>
                    <td>{value.description}</td>
                    <td>{value.Cost}</td>
                    <td>
                      {value.imageUrl ? (
                        <img src={value.imageUrl} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td>
                      <button id={value.todoid} onClick={fetchForEdit}>Edit</button>
                    </td>
                    <td>
                      <button id={value.todoid} onClick={deleteRecord}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Curd;
