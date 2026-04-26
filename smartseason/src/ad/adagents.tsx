import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type User = {
  id: string;
  email: string;
  role: "admin" | "agent";
};

type Field = {
  id: string;
  name: string;
  assigned_agent?: string;
};

export default function AdAgents() {
  const [users, setUsers] = useState<User[]>([]);
  const [fields, setFields] = useState<Field[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return
