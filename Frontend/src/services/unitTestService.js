import api from "../utils/axios";

export const getAllUnitTests = async () => {
  const res = await api.get("/unit-test");
  return res.data;
};

export const getUnitTestsBySession = async (id) => {
  const res = await api.get(`/unit-test/session/${id}`);
  return res.data;
};

export const createUnitTest = async (data) => {
  const res = await api.post("/unit-test", data);
  return res.data;
};

export const updateUnitTest = async (id, data) => {
  const res = await api.put(`/unit-test/${id}`, data);
  return res.data;
};

export const deleteUnitTest = async (id) => {
  const res = await api.delete(`/unit-test/${id}`);
  return res.data;
};
