import axiosClient from "./axiosClient";
import type { User } from "../types/user";

export const userApi = {
  getAll: () => axiosClient.get<User[]>("/users"),
  getOne: (id: string) => axiosClient.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => axiosClient.post<User>("/users", data),
  update: (id: string, data: Partial<User>) =>
    axiosClient.patch<User>(`/users/${id}`, data),
  remove: (id: string) => axiosClient.delete(`/users/${id}`),
};