
import React, { useState, useRef, useEffect } from 'react';
import './fireBaseConfig'; // Add this line prevent firebase not loading error
import { getFirestore, addDoc, collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

function App() {
  // const [inputValue1, setInputValue1] = useState('');
  // const [inputValue2, setInputValue2] = useState('');
  const first = useRef("")
  const second = useRef("")

  let [storedValues, setStoredValues] = useState([]);

  const db = getFirestore();

  const fetchDataFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, "user"));
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push({ userId: doc.id, ...doc.data() });
    });
    setStoredValues(temporaryArr);
    console.log(temporaryArr);
  }
  useEffect(() => {
    fetchDataFromFirestore();
  }, [])
  const saveDataToFirestore = async () => {
    await addDoc(collection(db, "user"), {
      field1: first.current.value,
      field2: second.current.value,
    }).then((res) => { fetchDataFromFirestore(); alert("Document written to Database") })
      .catch(err => console.log(err))

  };
  const deleteRecord = async (e) => {
    try {
      const uId = e.target.id; // Get the document ID from the event target
      if (uId) {
        await deleteDoc(doc(db, "user", uId)); // Delete the document from Firestore
        alert("Document deletion successful");
        // Update the storedValues state to remove the deleted item
        setStoredValues((prevValues) => prevValues.filter((item) => item.userId !== uId));
      } else {
        console.error("No document ID found for deletion.");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Document deletion failed");
    }
  };

  const [docId, setDocId] = useState('');
  const updateDocument = async () => {
    console.log(docId);
  try{
    await updateDoc(doc(db, 'user', docId), {
      field1: first.current.value,
      field2: second.current.value,
    }).then((res) => { fetchDataFromFirestore(); alert("Document updated") })
  }catch(err){

  }

  }
  const fetchForEdit = async (e) => {
    const user_id = e.target.id;
    setDocId(user_id)
    const records = await getDoc(doc(db, 'user', user_id));// Await the promise
    if (records.exists()) {
      const record = records.data()
      // Assuming record has properties named 'field1' and 'field2'
      first.current.value = record.field1 || ''; // Set the value of the first input
      second.current.value = record.field2 || ''; // Set the value of the second input
    } else {
      console.log('Record not found');
    }
  };

  return (
    <div className="App">
      <h1>Save Data to Firebase Firestore</h1>
      <input
        type="text"
        ref={first}
      /> <br /> <br />
      <input
        type="text"
        ref={second}
      /> <br /> <br />
      <button onClick={saveDataToFirestore} >Save to Firestore</button> <br /><br />
      <button onClick={updateDocument} disabled={docId.trim() === ''}>update</button>
      <div>
        <table >
          <tr>
            <td>Firstfield</td>
            <td>SecondField</td>

          </tr>
          {
            storedValues.map((value, key) => {
              return (
                <tr key={key}>
                  <td>{value.field1}</td>
                  <td>{value.field2}</td>
                  <td ><button id={value.userId} onClick={(e) => fetchForEdit(e)}>Edit</button></td>
                  <td><button id={value.userId} onClick={(e) => deleteRecord(e)}>Delete</button></td>
                </tr>
              )
            })
          }
        </table>
      </div>
    </div>
  );
}

export default App;
