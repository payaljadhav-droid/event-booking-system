import MyEvents from "../components/MyEvent";
import Header from "../components/Header";
import { useState } from "react";

export default function MyBookingPage() {
  const [search, setSearch] = useState("");
  return (
    <>
    <Header search={search} setSearch={setSearch}/>
    < MyEvents />
    </>
  )
}