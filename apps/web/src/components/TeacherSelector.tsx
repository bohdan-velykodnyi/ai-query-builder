'use client';
import React from 'react';
import { TeacherSubject } from 'shared-types';

interface TeacherSelectorProps {
  selectedTeacher: string;
  setSelectedTeacher: (teacher: TeacherSubject) => void;
}

const TeacherSelector = ({
  selectedTeacher,
  setSelectedTeacher,
}: TeacherSelectorProps) => {
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeacher(e.target.value as TeacherSubject);
  };

  return (
    <div className="mt-4">
      <label htmlFor="teacher" className="block text-lg font-semibold">
        Choose a Teacher:
      </label>
      <select
        id="teacher"
        name="teacher"
        value={selectedTeacher}
        onChange={handleTeacherChange}
        className="mt-2 w-full cursor-pointer rounded-md border p-2 outline-none"
      >
        <option value="math">Math</option>
        <option value="chemistry">Chemistry</option>
        <option value="history">History</option>
        {/* Add more teacher options as needed */}
      </select>
    </div>
  );
};

export default TeacherSelector;
