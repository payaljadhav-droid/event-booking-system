import Header from "../components/Header";
import CreateEvent from "../components/CreateEvent";
import { useState } from "react";

type Props = {
  mode?: "create" | "edit";
};

export default function CreateEventPage({ mode = "create" }: Props) {
  const [search, setSearch] = useState("");
  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <CreateEvent mode={mode} />
    </>
  )
}