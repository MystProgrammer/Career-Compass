import { db } from "../../../../firebase";
import { useState, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { collection, doc, setDoc } from "firebase/firestore";
import { storage } from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import placeholderAI from "../../../../images/placeholderAI.png";
function SeekerChallenges({ handleNextStep, handlePrevStep, name }) {
  // const name = location.state?.fullName;
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [seekerTxtChallenges, setSeekerTxtChallenges] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [mode, setMode] = useState();
  const usersCollection = collection(db, "Seekers");
  const docRef = doc(usersCollection, name);
  function selectFiles() {
    fileInputRef.current.click();
  }
  function onFileSelect(e) {
    setImageUpload(e.target.files[0]);
    const files = e.target.files;
    if (files.length === 0) return;

    const file = files[0];

    setImages((prevImages) => [
      ...prevImages,
      { name: file.name, url: URL.createObjectURL(file), type: file.type },
    ]);
    fileInputRef.current.disabled = true;
  }
  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    fileInputRef.current.disabled = false;
  }

  function onDragOver(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(true);
      e.dataTransfer.dropEffect = "copy";
    }
  }
  function onDragLeave(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(false);
      const files = e.dataTransfer.files;
      setImageUpload(files[0]);

      setImages((prevImages) => [
        ...prevImages,
        { name: files[0].name, url: URL.createObjectURL(files[0]) },
      ]);
      fileInputRef.current.disabled = true;
      setMode("video");
      console.log("value of image is " + imageUpload);
    }
  }
  function uploadImage() {
    console.log("Images: ", images);
    if (imageUpload === null) return;
    const imageRef = ref(
      storage,
      `Users/Seekers/ ${name}/${imageUpload.name + v4()}`
    );
    console.log("Image upload value is: " + imageUpload);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        //promise returns the image and we get the reference to that image
        return getDownloadURL(snapshot.ref); // we use return to get the download url
        // and by using return we can allow the second .then below to have access to the returned data
      })
      .then((downloadURL) => {
        //
        console.log("Download url:" + downloadURL);
        alert("image uploaded successfully");
        const seekerChallangeData = {
          challenges: downloadURL,
        };
        if (mode === "video") {
          setDoc(docRef, seekerChallangeData, { merge: true });
        }
      });
  }
  function handleTextClick() {
    setMode("text");
  }
  function handleVideoClick() {
    setMode("video");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const seekerChallangeData = {
        challenges: seekerTxtChallenges,
      };
      if (mode === "text") {
        await setDoc(docRef, seekerChallangeData, { merge: true });
      }
      handleNextStep();
      // navigate('/seekerEducation', { state: { fullName: name } });
    } catch (error) {
      console.log("The error is: " + error);
      console.error("ERROR: " + error);
    }
  }
  const handleChange = (e) => {
    setSeekerTxtChallenges(e.target.value);
  };

  return (
    <>
      <div className="bg-primary text-white flex items-center pl-10">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold pt-4 p-2 flex-grow">
          Challenges
        </h1>
      </div>
      <div className="maybolin-talk flex items-center mb-0 m-4 mx-auto max-w-4xl">
        <div className="flex-shrink-0 max-w-40 w-1/4 mr-0 ml-5">
          <img
            src={placeholderAI}
            alt="Maybolin AI"
            className="w-3/4 object-cover"
          />
        </div>
        <div className="bg-blue-100 px-6 py-4 mt-4 shadow-lg relative text-left mr-5 rounded-tr-lg rounded-bl-lg rounded-br-lg ">
          <p className="text-lg md:text-xl lg:text-2xl">
            Any <span className="text-secondary font-semibold">challenges</span>{" "}
            you want to share?
          </p>
          <div className="absolute top-0 -left-2 w-10 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-primary"></div>
        </div>
      </div>
      <div className="mt-0 mb-0 max-w-4xl mx-auto pl-4 pr-4 space-y-6 bg-white rounded-lg">
        <form onSubmit={handleSubmit}>
                   <div className="flex justify-between">
            <div className="hover:bg-primary mb-0 w-full p-5 mr-5 mt-5 mb-5">
              <textarea
                name="seekerIntroInput"
                onClick={handleTextClick}
                value={seekerTxtChallenges}
                onChange={handleChange}
                placeholder="Type your introduction here..."
                className="w-full h-full p-4 text-lg border rounded-md focus:ring-blue-500 focus:border-blue-500 mr-4"
              />
            </div>

            <div className="hover:bg-secondary w-full mb-0 p-5 mr-5 mt-5 mb-5">
              <div
                className="flex-1 h-48 p-10 border-2 border-dashed bg-white rounded-md cursor-pointer hover:border-primary flex items-center justify-center"
                onClick={selectFiles}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
              {isDragging ? (
                <span className="text-primary">Drop files here</span>
              ) : (
                <span className="text-primary">
                  Click or drag & drop to upload
                </span>
              )}
              <input
                className="hidden"
                ref={fileInputRef}
                onChange={onFileSelect}
                type="file"
                multiple
              />
            </div>
          </div>
</div>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-6 py-2 text-lg text-white bg-primary rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={uploadImage}
            >
              Upload
            </button>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 text-lg text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="button"
                onClick={handlePrevStep}
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-lg text-white bg-secondary rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
SeekerChallenges.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
};
export default SeekerChallenges;