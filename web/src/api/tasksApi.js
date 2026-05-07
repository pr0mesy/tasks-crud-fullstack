import { apiRequest } from "@/api/httpClient";

const unwrapList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.tasks)) return response.tasks;
  return [];
};

const sortByCreatedDateDesc = (tasks) =>
  [...tasks].sort((a, b) => {
    const dateA = new Date(a.created_date || a.createdAt || 0).getTime();
    const dateB = new Date(b.created_date || b.createdAt || 0).getTime();
    return dateB - dateA;
  });

export const tasksApi = {
  async list() {
    const response = await apiRequest("/tasks");
    return sortByCreatedDateDesc(unwrapList(response));
  },

  create(data) {
    return apiRequest("/tasks", {
      method: "POST",
      body: data,
    });
  },

  update(id, data) {
    return apiRequest(`/tasks/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  delete(id) {
    return apiRequest(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
