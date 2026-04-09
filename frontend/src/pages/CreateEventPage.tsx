import Header from "../components/Header";
import CreateEvent from "../components/CreateEvent";
import { useState } from "react";

export default function CreateEventPage() {
  const [search, setSearch] = useState("");
  return (
    <>
      <Header search={search} setSearch={setSearch} />
      < CreateEvent />
    </>
  )
}