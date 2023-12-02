import { getTeacher } from 'api/api';
import React, { useEffect, useRef, useState } from 'react';
import { ITeacher, TeacherSubject } from 'shared-types';

interface VideoBlockProps {
  videoResponse: string;
  selectedTeacher: TeacherSubject;
  setVideoResponse: (videoResponse: string) => void;
}

const VideoBlock = ({
  videoResponse,
  selectedTeacher,
  setVideoResponse,
}: VideoBlockProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [teacher, setTeacher] = useState<ITeacher>();
  // Function to handle the video end event
  const handleVideoEnd = () => {
    // Set videoResponse to an empty string when the video ends
    setVideoResponse('');
  };

  const handleChangeTeacher = async (teach: TeacherSubject) => {
    try {
      const newTeacher = await getTeacher(teach);
      setTeacher(newTeacher);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    handleChangeTeacher(selectedTeacher).catch((error) => {
      throw error;
    });
  }, [selectedTeacher]);

  return (
    <div className="flex h-64 w-64 overflow-hidden rounded-full">
      <video
        src={teacher?.preview}
        autoPlay={true}
        ref={videoRef}
        onEnded={handleVideoEnd}
        loop={!videoResponse}
        playsInline
        preload="yes"
        muted={!videoResponse} // Mute the video if videoResponse is empty
      ></video>
    </div>
  );
};

export default VideoBlock;
