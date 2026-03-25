import { http as client } from "./client";

export const getItems = async (resource) => {
  return await client("GET", `/${resource}`);
};

export const createItem = async (resource, data) => {
  return await client("POST", `/${resource}`, data);
};

export const updateItem = async (resource, id, data) => {
  return await client("PATCH", `/${resource}/${id}`, data);
};

export const deleteItem = async (resource, id) => {
  return await client("DELETE", `/${resource}/${id}`);
};
