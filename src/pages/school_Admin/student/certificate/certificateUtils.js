// student/certificate/certificateUtils.js

export const saveTemplateToLocal = (template) => {
  const existing = JSON.parse(
    localStorage.getItem("certificate_templates") || "[]"
  );
  const id = `template-${Date.now()}`;
  const newTemplate = { ...template, id };
  localStorage.setItem(
    "certificate_templates",
    JSON.stringify([...existing, newTemplate])
  );
};

export const getAllTemplates = () => {
  return JSON.parse(localStorage.getItem("certificate_templates") || "[]");
};

export const getTemplateById = (id) => {
  const all = getAllTemplates();
  return all.find((t) => t.id === id);
};
