import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, addDoc, collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const Curd = () => {
  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const db = getFirestore();
  const first = useRef("");
  const second = useRef("");

  const [storedValues, setStoredValues] = useState([]);
  const [docId, setDocId] = useState('');

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Todo"));
      const temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push({ userId: doc.id, ...doc.data() });
      });
      setStoredValues(temporaryArr);
    } catch (err) {
      console.error("Error fetching data from Firestore:", err);
    }
  };

  const saveDataToFirestore = async () => {
    try {
      await addDoc(collection(db, "Todo"), {
        description: first.current.value,
        Cost: second.current.value,
      });
      fetchDataFromFirestore();
      alert("Document written to Database");
    } catch (err) {
      console.error("Error saving document:", err);
    }
  };

  const deleteRecord = async (e) => {
    try {
      const uId = e.target.id;
      if (uId) {
        await deleteDoc(doc(db, "Todo", uId));
        alert("Document deletion successful");
        setStoredValues((prevValues) => prevValues.filter((item) => item.userId !== uId));
      } else {
        console.error("No document ID found for deletion.");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Document deletion failed");
    }
  };

  const updateDocument = async () => {
    try {
      await updateDoc(doc(db, 'Todo', docId), {
        field1: first.current.value,
        field2: second.current.value,
      });
      fetchDataFromFirestore();
      alert("Document updated");
    } catch (err) {
      console.error("Error updating document:", err);
    }
  };

  const fetchForEdit = async (e) => {
    try {
      const user_id = e.target.id;
      setDocId(user_id);
      const records = await getDoc(doc(db, 'Todo', user_id));
      if (records.exists()) {
        const record = records.data();
        first.current.value = record.field1 || '';
        second.current.value = record.field2 || '';
      } else {
        console.log('Record not found');
      }
    } catch (err) {
      console.error("Error fetching document for edit:", err);
    }
  };

  return (
    <div className="App">
      <h1>Save Data to Firebase Firestore</h1>
      <div className="container">
        <div className="inputBox">
          <label htmlFor="inp1">Title</label>
        <input type="text" ref={first}  id="inp1"/> <br /> <br />
        </div>
        <div className="inputBox">
          <label htmlFor="inp2">Cost</label>
        <input type="text" ref={second}  id="inp2"/> <br /> <br />
        </div>
      </div>
      <button onClick={saveDataToFirestore}>Save to Firestore</button> <br /><br />
      <button onClick={updateDocument} disabled={docId.trim() === ''}>Update</button>
      <div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storedValues.map((value, key) => (
              <tr key={key}>
                <td>{value.description}</td>
                <td>{value.Cost}</td>
                <td><button id={value.userId} onClick={fetchForEdit}>Edit</button></td>
                <td><button id={value.userId} onClick={deleteRecord}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Curd;
