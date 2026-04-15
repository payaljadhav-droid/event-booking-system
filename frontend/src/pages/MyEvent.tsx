import MyEvents from "../components/MyEvent";
import Header from "../components/Header";
import { useState } from "react";

export default function MyBookingPage() {
  const [search, setSearch] = useState("");
  return (
    <>
    <Header search={search} setSearch={setSearch}/>
    <div className="px-4 md:px-8 lg:px-16 py-6">
    <div className="max-w-6xl mx-auto">
      <MyEvents />
    </div>
  </div>
    </>
  )
}