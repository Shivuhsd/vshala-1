import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FiPrinter } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import StudentBill from "./StudentBill";

const BillPreviewModal = ({ isOpen, onClose, student }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${student?.name || "Student"}_Bill_${
      student?.admission_no || "ID"
    }`,
  });

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center bg-black bg-opacity-30">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-3xl p-6 my-16 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-purple-800">
                  Student Bill
                </h3>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-sm"
                >
                  <FiPrinter />
                  Print
                </button>
              </div>

              <div ref={printRef}>
                <StudentBill student={student} />
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BillPreviewModal;
