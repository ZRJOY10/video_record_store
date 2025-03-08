import axios from "axios";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const VideoCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const startRecording = () => {
    if (webcamRef.current) {
      const stream = webcamRef.current.stream;
      if (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const recordedBlob = new Blob(chunks, { type: "video/webm" });
          setVideoBlob(recordedBlob);
        };

        mediaRecorder.start();
        setRecording(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadVideo = async () => {
    if (!videoBlob) return;
    const formData = new FormData();
    formData.append("video", videoBlob, "recorded-video.webm");

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <Webcam
        audio={true}
        ref={webcamRef}
        style={{ width: "100%", maxWidth: "600px" }}
      />
      <div style={{ marginTop: "20px" }}>
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
      {videoBlob && (
        <div style={{ marginTop: "20px" }}>
          <video
            controls
            src={URL.createObjectURL(videoBlob)}
            style={{ width: "100%", maxWidth: "600px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={uploadVideo}>Upload Video</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCapture;
