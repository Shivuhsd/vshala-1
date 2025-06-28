import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import AddRole from "./AddRole";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSchool } = useSchool();

  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch role by ID
  useEffect(() => {
    const fetchRole = async () => {
      if (!id || !selectedSchool?.id) return;

      try {
        const response = await axiosInstance.get(
          `accounts/v1/role/${id}/?school_id=${selectedSchool.id}`
        );
        setRoleData(response.data);
      } catch (err) {
        console.error("Failed to fetch role data:", err);
        setError(true);
        toast.error("Failed to fetch role data.");
        setTimeout(() => navigate("/school-admin/roles"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [id, selectedSchool?.id, navigate]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (error || !roleData) {
    return (
      <div className="text-center py-20 text-red-500">
        Unable to load role data.
      </div>
    );
  }

  return <AddRole editData={roleData} />;
};

export default EditRole;
