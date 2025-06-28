import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPrinter, FiX } from "react-icons/fi";
import RoutineFormModal from "./RoutineFormModal";
import { printTimetable } from "./timetableUtils";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TimetableGrid = ({ classData, onClose }) => {
  const [routineMap, setRoutineMap] = useState({});
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    // Dummy data only for Monday
    const dummy = {
      Monday: [
        {
          id: 1,
          subject: "MATHS",
          start_time: "07:30 am",
          end_time: "08:25 am",
          room_no: "Room No. Theory",
          teacher: "Ms. Afreen",
        },
        {
          id: 2,
          subject: "ACCOUNTS",
          start_time: "08:30 am",
          end_time: "09:25 am",
          room_no: "Room No. 102",
          teacher: "Mrs. Manjula",
        },
        {
          id: 3,
          subject: "ENGLISH",
          start_time: "09:30 am",
          end_time: "10:25 am",
          room_no: "Room No. 201",
          teacher: "Ms. Sumaya",
        },
        {
          id: 4,
          subject: "C Programming",
          start_time: "10:30 am",
          end_time: "11:25 am",
          room_no: "Lab A1",
          teacher: "Mr. Upendra Kumar",
        },
        {
          id: 4,
          subject: "C Programming",
          start_time: "10:30 am",
          end_time: "11:25 am",
          room_no: "Lab A1",
          teacher: "Mr. Upendra Kumar",
        },
        {
          id: 4,
          subject: "C Programming",
          start_time: "10:30 am",
          end_time: "11:25 am",
          room_no: "Lab A1",
          teacher: "Mr. Upendra Kumar",
        },
        {
          id: 4,
          subject: "C Programming",
          start_time: "10:30 am",
          end_time: "11:25 am",
          room_no: "Lab A1",
          teacher: "Mr. Upendra Kumar",
        },
      ],
    };
    setRoutineMap(dummy);
  }, []);

  const handleDelete = (id) => {
    const updated = { ...routineMap };
    updated.Monday = updated.Monday.filter((item) => item.id !== id);
    setRoutineMap(updated);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center overflow-y-auto">
      <div
        className="bg-white max-w-7xl w-full mx-6 rounded-lg shadow-xl p-6 relative overflow-x-auto"
        id="print-timetable"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-700 mb-1">
              Class Timetable: BCA 1st Year - A
            </h2>
            <p className="text-sm text-gray-600">
              Sample Layout with Dummy Data
            </p>
          </div>
          <button
            onClick={() => printTimetable("print-timetable")}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <FiPrinter />
            Print Timetable
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-gray-800 border-collapse">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="border px-4 py-3 w-32 text-left">Day</th>
                <th className="border px-4 py-3 text-left">Time Slots</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-t align-top">
                  <td className="border px-4 py-3 font-semibold text-purple-700 whitespace-nowrap">
                    {day}
                  </td>
                  <td className="border px-2 py-3">
                    <div className="flex flex-wrap gap-3">
                      {(routineMap[day] || []).length > 0 ? (
                        routineMap[day].map((entry) => (
                          <div
                            key={entry.id}
                            className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 min-w-[220px] max-w-[240px] relative"
                          >
                            <div className="font-semibold text-[#334155] text-sm">
                              {entry.subject}
                            </div>
                            <div className="text-xs text-gray-600">
                              {entry.start_time} - {entry.end_time}
                            </div>
                            <div className="text-xs text-gray-500">
                              Room: {entry.room_no}
                            </div>
                            <div className="text-xs italic text-gray-700 mt-1">
                              – {entry.teacher}
                            </div>

                            {/* Edit/Delete Icons */}
                            <div className="absolute top-1.5 right-2 flex gap-2 text-sm text-gray-500">
                              <button
                                onClick={() => setEditData(entry)}
                                className="hover:text-purple-700"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="hover:text-red-600"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 italic">
                          No routines
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editData && (
          <RoutineFormModal
            open={true}
            onClose={() => setEditData(null)}
            initialData={editData}
            onSaved={() => setEditData(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TimetableGrid;
