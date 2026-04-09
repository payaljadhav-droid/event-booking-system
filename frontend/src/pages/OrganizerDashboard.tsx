import Header from "../components/Header";
import { useState } from "react";

export default function OrganizerDashboard() {
  const [search, setSearch] = useState("");
  return (
    <Header search={search} setSearch={setSearch}/>
  )
}