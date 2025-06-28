// pages/Admin/dashboard/AddAdminPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import AddAdminForm from "./partials/AddAdminForm";

const AddAdminPage = () => {
  const { schoolId } = useParams();

  return (
    <div className="p-6">
      <AddAdminForm schoolId={schoolId} />
    </div>
  );
};

export default AddAdminPage;
